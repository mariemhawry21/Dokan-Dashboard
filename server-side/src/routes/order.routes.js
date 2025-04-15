const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');
const orderController = require('../controllers/order.controller');
// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // max 100 requests per windowMs
// });

// router.use(limiter);

router.route('/').get(verifyToken, orderController.getOrders); // GET All Orders

module.exports = router;
