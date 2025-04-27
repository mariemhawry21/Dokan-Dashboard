const express = require("express");
const router = express.Router();
const storeSettingsController = require("../controllers/settings.controller");
const verifyToken = require("../middlewares/auth.middleware");
const allowedTo = require("../middlewares/allowTo.middleware");
// Get store settings
router.get(
  "/store",
  verifyToken,
  allowedTo("SUPERADMIN"),
  storeSettingsController.getStoreSettings
);

// Update store settings
router.put(
  "/store",
  verifyToken,
  allowedTo("SUPERADMIN"),
  storeSettingsController.updateStoreSettings
);

// Add shipping method
router.post(
  "/shipping-methods",
  verifyToken,
  allowedTo("SUPERADMIN"),
  storeSettingsController.addShippingMethod
);

// Update shipping method
router.put(
  "/shipping-methods/:id",
  verifyToken,
  allowedTo("SUPERADMIN"),
  storeSettingsController.updateShippingMethod
);

// Delete shipping method
router.delete(
  "/shipping-methods/:id",
  verifyToken,
  allowedTo("SUPERADMIN"),
  storeSettingsController.deleteShippingMethod
);

module.exports = router;
