// models/StoreSettings.js
const mongoose = require("mongoose");

const shippingMethodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., Standard, Express
    cost: { type: Number, required: true }, // e.g., 5.99
  },
  { _id: true }
);

const storeSettingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true },
    currency: { type: String, default: "$" }, // symbol or code
    defaultLanguage: { type: String, default: "en" },
    shippingMethods: [shippingMethodSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("StoreSettings", storeSettingsSchema);
