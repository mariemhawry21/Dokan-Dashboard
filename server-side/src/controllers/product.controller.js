const mongoose = require("mongoose");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");
const Product = require("../models/product.model");
const asyncWrapper = require("../middlewares/asyncWrapper.middleware");
const cloudinary = require('../config/cloudinary.config');

//  Get all products
const getAllProducts = asyncWrapper(async (req, res, next) => {
  let {
    limit = 16,
    page = 1,
    categories = "",
    order = "desc",
    sortBy = "date",
    minPrice,
    maxPrice,
  } = req.query;

  limit = Number(limit);
  page = Number(page);

  if (isNaN(limit) || isNaN(page) || limit < 1 || page < 1) {
    return next(
      new AppError("Invalid pagination parameters.", 400, httpStatusText.FAIL)
    );
  }

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const sortFields = {
    name: "name",
    date: "date",
    price: "effectivePrice",
  };

  const sortField = sortFields[sortBy] || "date";

  let categoryFilter = {};
  if (categories) {
    const categoryIds = categories.split(",").map((id) => id.trim());

    if (!categoryIds.every((id) => mongoose.isValidObjectId(id))) {
      return next(
        new AppError("Invalid Category ID format.", 400, httpStatusText.FAIL)
      );
    }

    categoryFilter = {
      categories: {
        $in: categoryIds.map((id) => new mongoose.Types.ObjectId(id)),
      },
    };
  }

  if (!minPrice || !maxPrice) {
    const { minPrice: min, maxPrice: max } = await getPriceRange();
    minPrice = minPrice ?? min;
    maxPrice = maxPrice ?? max;
  }

  minPrice = Number(minPrice);
  maxPrice = Number(maxPrice);

  const priceFilter =
    !isNaN(minPrice) && !isNaN(maxPrice)
      ? { effectivePrice: { $gte: minPrice, $lte: maxPrice } }
      : {};

  const [totalProducts, products] = await Promise.all([
    getTotalProducts(categoryFilter, priceFilter),
    getFilteredProducts(
      categoryFilter,
      priceFilter,
      sortField,
      sortOrder,
      skip,
      limit
    ),
  ]);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { totalProducts, products },
  });
});

//  Create new product
const createProduct = asyncWrapper(async (req, res, next) => {
  console.log('Received data:', req.body);  

  const {
    name,
    subtitle = '', 
    price,
    description = '', 
    categories,
    brand = '',
    colors,
    additionalInformation = {},
  } = req.body;

  let imageUrl = "";

  if (!name && !price && !categories) {
    return next(
      new AppError(
        "At least one of the fields: name, price, or categories must be provided.",
        400,
        httpStatusText.FAIL
      )
    );
  }

  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return next(
        new AppError(
          "Error uploading image to Cloudinary",
          500,
          httpStatusText.FAIL
        )
      );
    }
  }

  const product = await Product.create({
    name,
    subtitle,
    price,
    description,
    categories,
    brand,
    colors,
    additionalInformation,
    image: imageUrl,
  });

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { product },
  });
});


//  Get product by ID
const getProductById = asyncWrapper(async (req, res, next) => {
  const { product_id } = req.params;
  if (!product_id) {
    return next(
      new AppError("Product ID is required", 400, httpStatusText.FAIL)
    );
  }
  if (!mongoose.isValidObjectId(product_id)) {
    return next(
      new AppError("Invalid Product ID format", 400, httpStatusText.FAIL)
    );
  }

  const product = await Product.findById(product_id)
    .select(
      "_id name subtitle price date sale categories description brand colors additionalInformation"
    )
    .populate("categories", "name")
    .lean();

  if (!product) {
    return next(new AppError("Product not found", 404, httpStatusText.FAIL));
  }
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { product },
  });
});

// Update product
const updateProduct = asyncWrapper(async (req, res, next) => {
  const {
    name,
    subtitle,
    price,
    description,
    categories,
    brand,
    colors,
    additionalInformation,
  } = req.body;
  let imageUrl = "";

  if (!name && !price && !categories && !req.file) {
    return next(
      new AppError(
        "At least one field (name, price, or categories) is required to update.",
        400,
        httpStatusText.FAIL
      )
    );
  }

  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return next(
        new AppError(
          "Error uploading image to Cloudinary",
          500,
          httpStatusText.FAIL
        )
      );
    }
  }

  const product = await Product.findById(req.params.product_id);
  if (!product) {
    return next(new AppError("Product not found.", 404, httpStatusText.FAIL));
  }

  if (name) product.name = name;
  if (subtitle) product.subtitle = subtitle;
  if (price) product.price = price;
  if (description) product.description = description;
  if (categories) product.categories = categories;
  if (brand) product.brand = brand;
  if (colors) product.colors = colors;
  if (additionalInformation)
    product.additionalInformation = additionalInformation;
  if (imageUrl) product.image = imageUrl;

  await product.save();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { product },
  });
});

// Soft delete product
const softDeleteProduct = asyncWrapper(async (req, res, next) => {
  const product = await Product.findById(req.params.product_id);
  if (!product) {
    return next(new AppError("Product not found.", 404, httpStatusText.FAIL));
  }

  product.isDeleted = true;
  await product.save();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Product soft deleted successfully.",
  });
});

// Function to get price range
const getPriceRange = async () => {
  const result = await Product.aggregate([
    { $addFields: { effectivePrice: calculateEffectivePrice() } },
    {
      $group: {
        _id: null,
        minPrice: { $min: "$effectivePrice" },
        maxPrice: { $max: "$effectivePrice" },
      },
    },
  ]);

  return result[0] || { minPrice: 0, maxPrice: 0 };
};

// Function to get total products count
const getTotalProducts = async (categoryFilter, priceFilter) => {
  const result = await Product.aggregate([
    { $match: categoryFilter },
    { $addFields: { effectivePrice: calculateEffectivePrice() } },
    { $match: priceFilter },
    { $count: "total" },
  ]);

  return result.length > 0 ? result[0].total : 0;
};

// Function to get filtered products
const getFilteredProducts = async (
  categoryFilter,
  priceFilter,
  sortField,
  sortOrder,
  skip,
  limit
) => {
  return await Product.aggregate([
    { $match: categoryFilter },
    { $addFields: { effectivePrice: calculateEffectivePrice() } },
    { $match: priceFilter },
    { $sort: { [sortField]: sortOrder } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "categories",
        localField: "categories",
        foreignField: "_id",
        as: "categories",
      },
    },
    {
      $addFields: {
        firstColor: { $arrayElemAt: ["$colors", 0] },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        subtitle: 1,
        image: {
          $arrayElemAt: ["$firstColor.images.url", 0],
        },
        price: 1,
        date: 1,
        sale: 1,
        quantity: "$firstColor.quantity",
        effectivePrice: 1,
        mainColor: "$firstColor.name",
        categories: {
          $map: {
            input: "$categories",
            as: "category",
            in: { _id: "$$category._id", name: "$$category.name" },
          },
        },
      },
    },
  ]);
};

// Function to calculate effective price
const calculateEffectivePrice = () => ({
  $cond: {
    if: { $gt: ["$sale", 0] },
    then: {
      $multiply: ["$price", { $subtract: [1, { $divide: ["$sale", 100] }] }],
    },
    else: "$price",
  },
});

// Function to project required fields
const projectFields = () => ({
  _id: 1,
  name: 1,
  subtitle: 1,
  productImages: 1,
  price: 1,
  date: 1,
  sale: 1,
  quantity: 1,
  effectivePrice: 1,
});

// Function to lookup categories
const lookupCategories = () => ({
  from: "categories",
  localField: "categories",
  foreignField: "_id",
  as: "categories",
});

// Function to project category names
const projectCategoryNames = () => ({
  _id: 1,
  name: 1,
  subtitle: 1,
  productImages: 1,
  price: 1,
  date: 1,
  sale: 1,
  quantity: 1,
  effectivePrice: 1,
  categories: {
    $map: {
      input: "$categories",
      as: "category",
      in: { _id: "$$category._id", name: "$$category.name" },
    },
  },
});

const getMinEffectivePrice = asyncWrapper(async (req, res, next) => {
  const minPrice = await Product.aggregate([
    {
      $addFields: {
        effectivePrice: {
          $cond: {
            if: { $gt: ["$sale", 0] }, // If there's a discount
            then: {
              $multiply: [
                "$price",
                { $subtract: [1, { $divide: ["$sale", 100] }] },
              ],
            },
            else: "$price", // Otherwise, use original price
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        minEffectivePrice: { $min: "$effectivePrice" },
      },
    },
  ]);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      minEffectivePrice: minPrice.length ? minPrice[0].minEffectivePrice : 0,
    },
  });
});

const getMaxEffectivePrice = asyncWrapper(async (req, res, next) => {
  const maxPrice = await Product.aggregate([
    {
      $addFields: {
        effectivePrice: {
          $cond: {
            if: { $gt: ["$sale", 0] },
            then: {
              $multiply: [
                "$price",
                { $subtract: [1, { $divide: ["$sale", 100] }] },
              ],
            },
            else: "$price",
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        maxEffectivePrice: { $max: "$effectivePrice" },
      },
    },
  ]);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      maxEffectivePrice: maxPrice.length ? maxPrice[0].maxEffectivePrice : 0,
    },
  });
});

const getProductForComparison = asyncWrapper(async (req, res, next) => {
  const { product_id } = req.params;
  if (!product_id) {
    return next(
      new AppError("Product ID is required", 400, httpStatusText.FAIL)
    );
  }

  if (!mongoose.isValidObjectId(product_id)) {
    return next(
      new AppError("Invalid Product ID format", 400, httpStatusText.FAIL)
    );
  }

  const product = await Product.findById(product_id)
    .select(
      "_id name subtitle productImages price quantity date sale categories description colors sizes brand additionalInformation"
    )
    .populate("categories", "name")
    .lean();

  if (!product) {
    return next(new AppError("Product not found", 404, httpStatusText.FAIL));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      product,
    },
  });
});

const getSearchProducts = asyncWrapper(async (req, res, next) => {
  const { query } = req.query;
  if (!query) {
    return next(
      new AppError("Please enter a search keyword!", 400, httpStatusText.FAIL)
    );
  }

  const categoryIds = await getCategoryIds(query);

  const products = await Product.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { categories: { $in: categoryIds } },
    ],
  })
    .populate("categories", "name")
    .lean();

  if (!products.length) {
    return next(new AppError("No products found.", 404, httpStatusText.FAIL));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: products,
  });
});


const updateProductColors = asyncWrapper(async (req, res, next) => {
  const { product_id } = req.params;
  const { colors } = req.body;

  if (!product_id || !mongoose.isValidObjectId(product_id)) {
    return next(new AppError("Invalid Product ID format", 400, httpStatusText.FAIL));
  }

  if (!Array.isArray(colors) || colors.length === 0) {
    return next(new AppError("Colors must be a non-empty array", 400, httpStatusText.FAIL));
  }

  const product = await Product.findById(product_id);
  if (!product) {
    return next(new AppError("Product not found", 404, httpStatusText.FAIL));
  }

  product.colors = colors;
  await product.save();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Product colors updated successfully",
    data: { product },
  });
});

//  Get product stock quantity
const getProductStock = asyncWrapper(async (req, res, next) => {
  const { product_id } = req.params;

  if (!product_id) {
    return next(
      new AppError("Product ID is required", 400, httpStatusText.FAIL)
    );
  }

  if (!mongoose.isValidObjectId(product_id)) {
    return next(
      new AppError("Invalid Product ID format", 400, httpStatusText.FAIL)
    );
  }

  const product = await Product.findById(product_id)
    .select("name colors")
    .lean();

  if (!product) {
    return next(new AppError("Product not found", 404, httpStatusText.FAIL));
  }

  const stockData = product.colors.map((color) => ({
    color: color.name,
    quantity: color.quantity,
  }));

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { productName: product.name, stock: stockData },
  });
});

async function getCategoryIds(query) {
  const categories = await require("../models/category.model")
    .find({ name: { $regex: query, $options: "i" } })
    .select("_id")
    .lean();
  return categories.map((cat) => cat._id);
}

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  softDeleteProduct,
  getPriceRange,
  getTotalProducts,
  getFilteredProducts,
  calculateEffectivePrice,
  projectFields,
  lookupCategories,
  projectCategoryNames,
  getMinEffectivePrice,
  getMaxEffectivePrice,
  getProductForComparison,
  getSearchProducts,
  updateProductColors,
  getProductStock,

};
