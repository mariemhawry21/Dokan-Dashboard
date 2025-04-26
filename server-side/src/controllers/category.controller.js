const Category = require('../models/category.model');
const httpStatusText = require('../utils/httpStatusText');
const AppError = require('../utils/appError');
const asyncWrapper = require('../middlewares/asyncWrapper.middleware');
const cloudinary = require('../config/cloudinary.config');

// 1- Get all categories
const getAllCategories = asyncWrapper(async (req, res, next) => {
  const categories = await Category.find({ isDeleted: false }).select('-__v').lean();
  if (!categories.length) {
    return next(new AppError('No categories found.', 404, httpStatusText.FAIL));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { categories },
  });
});

// 2- Get single category
const getCategoryById = asyncWrapper(async (req, res, next) => {
  const category = await Category.findOne({ _id: req.params.id, isDeleted: false });
  if (!category) {
    return next(new AppError('Category not found.', 404, httpStatusText.FAIL));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { category },
  });
});

// 3- Create new category
const createCategory = asyncWrapper(async (req, res, next) => {
  const { catName, description } = req.body;  // Changed `name` to `catName`
  console.log("Body:", req.body);
  console.log("File:", req.file);

  let imageUrl = '';

  // Check if the catName and description are provided
  if (!catName || !description) {
    return next(new AppError('catName and description are required.', 400, httpStatusText.FAIL));
  }

  console.log('Received data:', req.body); // Logging received data

  // Handle file upload to Cloudinary if provided
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url; 
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      return next(new AppError('Error uploading image to Cloudinary', 500, httpStatusText.FAIL));
    }
  }

  const exists = await Category.findOne({ catName });  // Changed `name` to `catName`
  if (exists) {
    return next(new AppError('Category with the same name already exists.', 400, httpStatusText.FAIL));
  }

  // Create the new category
  const category = await Category.create({ catName, description, image: imageUrl });  // Changed `name` to `catName`

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { category },
  });
});

// 4- Update category
const updateCategory = asyncWrapper(async (req, res, next) => {
  const { catName, description } = req.body;  // Changed `name` to `catName`
  let imageUrl = '';

  if (!catName && !description && !req.file) {
    return next(new AppError('At least one field (catName, description, or image) is required to update.', 400, httpStatusText.FAIL));
  }

  console.log('Updating category with data:', req.body); // Logging data

  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      return next(new AppError('Error uploading image to Cloudinary', 500, httpStatusText.FAIL));
    }
  }

  const category = await Category.findById(req.params.id);
  if (!category || category.isDeleted) {
    return next(new AppError('Category not found.', 404, httpStatusText.FAIL));
  }

  // Update category fields if provided
  if (catName) category.catName = catName;  // Changed `name` to `catName`
  if (description) category.description = description;
  if (imageUrl) category.image = imageUrl;

  await category.save();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { category },
  });
});

// 5- Soft delete category
const softDeleteCategory = asyncWrapper(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category || category.isDeleted) {
    return next(new AppError('Category not found.', 404, httpStatusText.FAIL));
  }

  category.isDeleted = true;
  await category.save();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: 'Category soft deleted successfully.',
  });
});

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  softDeleteCategory,
};
