// routes/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {
  avatarUpload,
  authenticateUser,
  superAdminAccess,
  adminAccess,
  supportAccess,
  accountantAccess,
  adminRole,
  superAdminRole,
} = require("../middlewares/user.middleware");

// const authenticateUser = verifyToken;
// ===== Public Routes =====
router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);

// ===== Protected Routes (Require Authentication) =====
router.use(authenticateUser);
// ===== User Status Management =====
router.get("/pending", superAdminAccess, userController.getPendingUsers);
router.get("/approved", superAdminAccess, userController.getApprovedUsers);
router.get("/denied", superAdminAccess, userController.getDeniedUsers);
router.patch("/:id/approve", superAdminAccess, userController.approveUser);
router.patch("/:id/deny", superAdminAccess, userController.denyUser);

// ===== User Profile =====
router.get("/profile", userController.getUserProfile);
router.patch("/profile", userController.updateUserProfile);
router.patch("/profile/avatar", avatarUpload, userController.updateAvatar);
router.patch("/profile/password", userController.changePassword);

// ===== Activities =====
router.post("/:id/activities", adminAccess, userController.addActivity);
router.get("/:id/activities", adminAccess, userController.getActivities);

// ===== Support Tickets =====
router.post("/:id/tickets", supportAccess, userController.createTicket);
router.get("/:id/tickets", supportAccess, userController.getTickets);
router.patch(
  "/:id/tickets/:ticketId",
  supportAccess,
  userController.updateTicket
);

// ===== Credit Management =====
router.post("/:id/credit", accountantAccess, userController.addCredit);
router.get("/:id/credit", adminAccess, userController.getCreditHistory);

// ===== Special Cases =====
router.post("/:id/special-cases", adminAccess, userController.addSpecialCase);
router.get("/:id/special-cases", adminAccess, userController.getSpecialCases);

// ===== Reviews =====
router.post("/:id/reviews", userController.addReview);
router.get("/:id/reviews", userController.getReviews);

// ===== Incentives =====
router.post("/:id/incentives", adminAccess, userController.addIncentive);
router.get("/:id/incentives", adminAccess, userController.getIncentives);

// ===== Tags Management =====
router.post("/:id/tags", adminRole, userController.assignUserTags);
router.delete("/:id/tags", adminRole, userController.removeUserTags);

// ===== Segments Management =====
router.post("/:id/segments", adminRole, userController.assignSegment);
router.delete(
  "/:id/segments/:segmentName",
  adminRole,
  userController.removeSegment
);

// ===== User Queries (Filter) =====
router.get("/by-tag/:tag", adminRole, userController.getUsersByTag);
router.get("/by-segment/:segment", adminRole, userController.getUsersBySegment);

// ===== Tier Management =====
router.patch("/:id/tier", adminRole, userController.updateCustomerTier);

// ===== Admin Request Management =====
router.patch(
  "/:id/request-admin",
  adminRole,
  userController.handleAdminRequest
);
router.get("/admin-requests", adminRole, userController.getAdminRequests);
// ===== User Management (Admin Access) =====
router.get("/:id", adminAccess, userController.getUserById);
router.patch("/:id", adminAccess, userController.updateUser);
router.delete("/:id", superAdminAccess, userController.deleteUser);
router.post("/:id/restore", superAdminAccess, userController.restoreUser);



// في ملف routes/user.routes.js
router.post('/bulk-delete', adminRole, userController.bulkDeleteUsers);
router.patch('/bulk-update-status', adminRole, userController.bulkUpdateUserStatus);


module.exports = router;