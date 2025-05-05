// routes/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {
  avatarUpload,
  authenticateUser,
  adminAccess,
  superAdminAccess,
  supportAccess,
  accountantAccess,
  adminRole,
  superAdminRole,
} = require("../middlewares/user.middleware");

// ===== Public Routes =====
router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);

// ===== Protected Routes (Require Authentication) =====
router.use(authenticateUser);

// ===== User Profile =====
router.get("/profile", userController.getUserProfile);
router.patch("/profile", userController.updateUserProfile);
router.patch("/profile/avatar", avatarUpload, userController.updateAvatar);
router.patch("/profile/password", userController.changePassword);

// ===== User Management (Admin Access) =====
router.get("/:id",userController.getUserById);
router.patch("/:id", userController.updateUser);
router.delete("/:id",userController.deleteUser);
router.post("/:id/restore", userController.restoreUser);

// ===== Activities =====
router.post("/:id/activities", userController.addActivity);
router.get("/:id/activities",  userController.getActivities);

// ===== Support Tickets =====
router.post("/:id/tickets", userController.createTicket);
router.get("/:id/tickets",  userController.getTickets);
router.patch("/:id/tickets/:ticketId",  userController.updateTicket);

// ===== Credit Management =====
router.post("/:id/credit", userController.addCredit);
router.get("/:id/credit",userController.getCreditHistory);

// ===== Special Cases =====
router.post("/:id/special-cases",  userController.addSpecialCase);
router.get("/:id/special-cases",  userController.getSpecialCases);

// ===== Reviews =====
router.post("/:id/reviews", userController.addReview);
router.get("/:id/reviews", userController.getReviews);

// ===== Incentives =====
router.post("/:id/incentives", adminAccess, userController.addIncentive);
router.get("/:id/incentives", adminAccess, userController.getIncentives);

// ===== Tags Management =====
router.post("/:id/tags", userController.assignUserTags);
router.delete("/:id/tags", userController.removeUserTags);

// ===== Segments Management =====
router.post("/:id/segments",  userController.assignSegment);
router.delete("/:id/segments/:segmentName", userController.removeSegment);

// ===== User Queries (Filter) =====
router.get("/by-tag/:tag", userController.getUsersByTag);
router.get("/by-segment/:segment",  userController.getUsersBySegment);

// ===== Tier Management =====
router.patch("/:id/tier", userController.updateCustomerTier);

// ===== User Status Management =====
router.get("/pending", adminRole, userController.getPendingUsers);
router.get("/approved", adminRole, userController.getApprovedUsers);
router.get("/denied", adminRole, userController.getDeniedUsers);
router.patch("/:id/approve", adminRole, userController.approveUser);
router.patch("/:id/deny", adminRole, userController.denyUser);

// ===== Admin Request Management =====
router.patch("/:id/request-admin", adminRole, userController.handleAdminRequest);
router.get("/admin-requests", adminRole, userController.getAdminRequests);

module.exports = router;
