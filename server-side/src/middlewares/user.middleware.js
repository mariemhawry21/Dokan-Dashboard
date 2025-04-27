const verifyToken = require("./auth.middleware");
const allowedTo = require("./allowTo.middleware");
const roleMiddleware = require("./role.middleware");
const upload = require("./upload.middleware"); 

// Middleware for avatar upload
const avatarUpload = (req, res, next) => {
  req.folderName = 'avatars'; 
  upload.single('avatar')(req, res, next);
};

// Middleware for authentication
const authenticateUser = verifyToken;

// Middleware for role-based access control
const adminAccess = allowedTo("admin", "super_admin");
const superAdminAccess = allowedTo("super_admin");
const supportAccess = allowedTo("admin", "super_admin", "support");
const accountantAccess = allowedTo("super_admin", "accountant");

// Middleware for specific role-only access
const adminRole = roleMiddleware(["admin", "super_admin"]);
const superAdminRole = roleMiddleware(["super_admin"]);

module.exports = {
  avatarUpload,
  authenticateUser,
  adminAccess,
  superAdminAccess,
  supportAccess,
  accountantAccess,
  adminRole,
  superAdminRole,
};
