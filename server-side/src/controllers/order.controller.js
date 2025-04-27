const asyncWrapper = require("../middlewares/asyncWrapper.middleware");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");
const Order = require("../models/order.model");

const getOrders = asyncWrapper(async (req, res, next) => {
  const userId = req.user._id;

  let { limit = 10, page = 1 } = req.query;

  limit = Math.max(1, limit);
  page = Math.max(1, page);

  if (isNaN(limit) || isNaN(page)) {
    return next(
      new AppError(
        "Invalid pagination parameters. 'limit' and 'page' must be positive numbers.",
        400,
        httpStatusText.FAIL
      )
    );
  }
  const skip = (page - 1) * limit;

  const orders = await Order.find({ userId })
    .select(
      "orderNumber status orderItems totalAmount shippingMethod  createdAt"
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalOrders = await Order.countDocuments({ userId });

  if (orders.length === 0) {
    return next(
      new AppError("No orders found for this user", 404, httpStatusText.FAIL)
    );
  }

  const formattedOrders = orders.map((order) => ({
    orderNumber: order.orderNumber,
    status: order.status,
    total: `${order.totalAmount.toFixed(2)}`,
    shippingMethod: {
      name: order.shippingMethod?.name || "",
      cost: order.shippingMethod?.cost?.toFixed(2) || "0.00",
    },
    createdAt: order.createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }));

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { orders: formattedOrders, totalOrders },
  });
});

module.exports = { getOrders };
