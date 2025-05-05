// // models/StoreSettings.js
// const mongoose = require("mongoose");

// const shippingMethodSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true }, // e.g., Standard, Express
//     cost: { type: Number, required: true }, // e.g., 5.99
//   },
//   { _id: true }
// );

// const storeSettingsSchema = new mongoose.Schema(
//   {
//     storeName: { type: String, default: "Dokan" }, // Changed to default
//     currency: { type: String, default: "$" }, // symbol or code
//     defaultLanguage: { type: String, default: "en" },
//     shippingMethods: [shippingMethodSchema],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("StoreSettings", storeSettingsSchema);

const mongoose = require("mongoose");

const shippingMethodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Shipping method name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
      unique: true, // Prevent duplicate method names
    },
    cost: {
      type: Number,
      required: [true, "Shipping cost is required"],
      min: [0, "Cost cannot be negative"],
    },
    isActive: { type: Boolean, default: true }, // Added for soft deletion
  },
  {
    _id: true,
    timestamps: true, // Track creation/modification of each method
  }
);

const storeSettingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: "My Store",
      trim: true,
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
      length: 3, // ISO currency codes are 3 chars
    },
    defaultLanguage: {
      type: String,
      default: "en",
      lowercase: true,
      length: 2, // ISO language codes are 2 chars
    },
    shippingMethods: {
      type: [shippingMethodSchema],
      validate: {
        validator: function (v) {
          // Ensure no duplicate names in array
          const names = v.map((m) => m.name);
          return new Set(names).size === names.length;
        },
        message: "Duplicate shipping method names not allowed",
      },
    },
  },
  {
    timestamps: true,
    minimize: false, // Ensure empty objects are stored
  }
);

// Add text index for searchable shipping methods
storeSettingsSchema.index({ "shippingMethods.name": "text" });

module.exports = mongoose.model("StoreSettings", storeSettingsSchema);
