const mongoose = require("mongoose");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");
const StoreSettings = require("../models/setting.model");

const getStoreSettings = async (req, res, next) => {
  try {
    const settings = await StoreSettings.findOne();
    if (!settings) {
      return next(
        new AppError("Store settings not found", 404, httpStatusText.FAIL)
      );
    }
    res.status(200).json({ status: httpStatusText.SUCCESS, settings });
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

    res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, settings: updatedSettings });
  } catch (error) {
    next(
      new AppError("Failed to update store settings", 500, httpStatusText.ERROR)
    );
  }
};
const addShippingMethod = async (req, res, next) => {
  try {
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
      {},
      {
        $push: { shippingMethods: { name, cost } },
      },
      { new: true }
    );

    res
      .status(201)
      .json({ status: httpStatusText.SUCCESS, settings: updatedSettings });
  } catch (error) {
    next(
      new AppError("Failed to add shipping method", 500, httpStatusText.ERROR)
    );
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
      { "shippingMethods._id": mongoose.Types.ObjectId(id) },
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

    res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, settings: updatedSettings });
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

    const updatedSettings = await StoreSettings.findOneAndUpdate(
      {},
      {
        $pull: { shippingMethods: { _id: mongoose.Types.ObjectId(id) } },
      },
      { new: true }
    );

    if (!updatedSettings) {
      return next(
        new AppError("Shipping method not found", 404, httpStatusText.FAIL)
      );
    }

    res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, settings: updatedSettings });
  } catch (error) {
    next(
      new AppError(
        "Failed to delete shipping method",
        500,
        httpStatusText.ERROR
      )
    );
  }
};
module.exports = {
  getStoreSettings,
  updateStoreSettings,
  addShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
};
