// middlewares/role.middleware.js
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "error" });
      }
  
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "error" });
      }
  
      next();
    };
  };
  
  module.exports = roleMiddleware;