const mongoose = require("mongoose");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");
const StoreSettings = require("../models/setting.model");

// Helper function for pagination
const paginateArray = (array, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  return array.slice(startIndex, endIndex);
};

const getStoreSettings = async (req, res, next) => {
  try {
    const settings = await StoreSettings.findOne();
    if (!settings) {
      return next(
        new AppError("Store settings not found", 404, httpStatusText.FAIL)
      );
    }
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { settings },
    });
  } catch (error) {
    next(
      new AppError(
        "Failed to retrieve store settings",
        500,
        httpStatusText.ERROR
      )
    );
  }
};

const updateStoreSettings = async (req, res, next) => {
  try {
    const { storeName, currency, defaultLanguage, shippingMethods } = req.body;

    const updatedSettings = await StoreSettings.findOneAndUpdate(
      {},
      {
        storeName,
        currency,
        defaultLanguage,
        shippingMethods,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { settings: updatedSettings },
    });
  } catch (error) {
    next(
      new AppError("Failed to update store settings", 500, httpStatusText.ERROR)
    );
  }
};

const getShippingMethods = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const settings = await StoreSettings.findOne();
    if (!settings) {
      return next(
        new AppError("Store settings not found", 404, httpStatusText.FAIL)
      );
    }

    // Filter out inactive methods if using soft delete
    const shippingMethods = settings.shippingMethods.filter(
      (method) => method.isActive !== false
    );

    const paginatedMethods = paginateArray(shippingMethods, page, limit);

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        shippingMethods: paginatedMethods,
        pagination: {
          total: shippingMethods.length,
          page: +page,
          limit: +limit,
          totalPages: Math.ceil(shippingMethods.length / limit),
        },
      },
    });
  } catch (error) {
    next(
      new AppError(
        "Failed to retrieve shipping methods",
        500,
        httpStatusText.ERROR
      )
    );
  }
};
const addShippingMethod = async (req, res, next) => {
  try {
    const { name, cost } = req.body;

    // Find or create settings
    let settings = (await StoreSettings.findOne()) || new StoreSettings();

    // Add new method
    settings.shippingMethods.push({
      name,
      cost,
      isActive: true,
    });

    await settings.save();

    const newMethod = settings.shippingMethods.slice(-1)[0];
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { shippingMethod: newMethod },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(new AppError(error.message, 400, httpStatusText.FAIL));
    }
    next(new AppError("Server error", 500, httpStatusText.ERROR));
  }
};
const updateShippingMethod = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, cost } = req.body;

    if (!name || typeof cost !== "number") {
      return next(
        new AppError(
          "Invalid data for shipping method",
          400,
          httpStatusText.FAIL
        )
      );
    }

    const updatedSettings = await StoreSettings.findOneAndUpdate(
      { "shippingMethods._id": new mongoose.Types.ObjectId(id) },
      {
        $set: {
          "shippingMethods.$.name": name,
          "shippingMethods.$.cost": cost,
        },
      },
      { new: true }
    );

    if (!updatedSettings) {
      return next(
        new AppError("Shipping method not found", 404, httpStatusText.FAIL)
      );
    }

    const updatedMethod = updatedSettings.shippingMethods.find(
      (m) => m._id.toString() === id
    );

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        shippingMethod: updatedMethod,
      },
    });
  } catch (error) {
    next(
      new AppError(
        "Failed to update shipping method",
        500,
        httpStatusText.ERROR
      )
    );
  }
};

const deleteShippingMethod = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await StoreSettings.updateOne(
      {},
      { $pull: { shippingMethods: { _id: new mongoose.Types.ObjectId(id) } } }
    );

    if (result.nModified === 0) {
      return next(new AppError("Shipping method not found", 404));
    }

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: "Shipping method deleted successfully",
    });
  } catch (error) {
    next(new AppError("Server error", 500));
  }
};
module.exports = {
  getStoreSettings,
  updateStoreSettings,
  getShippingMethods,
  addShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
};
