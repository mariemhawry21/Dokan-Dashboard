const express = require("express");
const router = express.Router();
const storeSettingsController = require("../controllers/settings.controller");
const verifyToken = require("../middlewares/auth.middleware");
const allowedTo = require("../middlewares/allowTo.middleware");
// Get store settings
router.get(
  "/store",
  verifyToken,
  allowedTo("super_admin"),
  storeSettingsController.getStoreSettings
);

// Update store settings
router.put(
  "/store",
  verifyToken,
  allowedTo("super_admin"),
  storeSettingsController.updateStoreSettings
);

//get
router.get(
  "/shipping-methods",
  verifyToken,
  allowedTo("super_admin"),
  storeSettingsController.getShippingMethods
);

// Add shipping method
router.post(
  "/shipping-methods",
  verifyToken,
  allowedTo("super_admin"),
  storeSettingsController.addShippingMethod
);

// Update shipping method
router.put(
  "/shipping-methods/:id",
  verifyToken,
  allowedTo("super_admin"),
  storeSettingsController.updateShippingMethod
);

// Delete shipping method
router.delete(
  "/shipping-methods/:id",
  verifyToken,
  allowedTo("super_admin"),
  storeSettingsController.deleteShippingMethod
);

module.exports = router;
