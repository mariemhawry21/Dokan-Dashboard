const asyncWrapper = require("../middlewares/asyncWrapper.middleware");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");
const Order = require("../models/order.model");
const orderModel = require("../models/order.model");

const createOrder = asyncWrapper(async (req, res, next) => {
  const { userId, orderItems, totalAmount, paymentMethod } = req.body;

  if (!userId || !orderItems || !totalAmount || !paymentMethod) {
    return next(new AppError("Missing required order fields", 400));
  }

  const newOrder = await Order.create({
    ...req.body
  });

  res.status(201).json({
    status: "success",
    data: newOrder,
  });
});

const getOrders = asyncWrapper(async (req, res, next) => {
  console.log('[DEBUG] Incoming Order Body:', req.body);

  let { limit = 10, page = 1, search = "", status } = req.query;

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

  const query = {};
  // Search By OrderNumber
  if (search) {
    query.orderNumber = { $regex: search, $options: 'i' };
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  const orders = await Order.find({ isDeleted: false, ...query })
    .populate("userId", "firstName lastName")
    // .select(
    //   "orderNumber status orderItems totalAmount shippingMethod createdAt"
    // )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalOrders = await Order.countDocuments({ isDeleted: false });

  const formattedOrders = orders.map((order) => ({
    id: order._id,
    orderNumber: order.orderNumber,
    status: order.status,
    total: `${order.totalAmount.toFixed(2)}`,
    shippingMethod: {
      name: order.shippingMethod?.name || "",
      cost: order.shippingMethod?.cost?.toFixed(2) || "0.00",
    },
    user: {
      firstName: order.userId?.firstName || "",
      lastName: order.userId?.lastName || "",
    },
    orderItems: order.orderItems?.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || 'http://localhost:5000/images/default-featured-image.png'
    })) || [],
    shippingAddress: {
      firstName: order.shippingAddress?.firstName || "",
      lastName: order.shippingAddress?.lastName || "",
      address: order.shippingAddress?.address || "",
      city: order.shippingAddress?.city || "",
      country: order.shippingAddress?.country || "",
      zipCode: order.shippingAddress?.zipCode || "",
    },
    paymentMethod: order.paymentMethod || "",
    transactionId: order.transactionId || "",
    previousStatus: order.previousStatus || "",
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


const updateOrderStatus = asyncWrapper(async (req, res, next) => {
  const orderId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return next(
      new AppError('Status is required', 400, httpStatusText.FAIL)
    )
  }

  const order = await orderModel.findById(orderId);
  if (!order) {
    return next(
      new AppError('Order not found', 404, httpStatusText.FAIL)
    )
  }

  order.status = status;
  const updatedOrder = await order.save();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: 'Order status updated successfully',
    data: updatedOrder
  });
});


const softDeleteOrder = asyncWrapper(async (req, res, next) => {
  const orderId = req.params.id;
  const order = await orderModel.findById(orderId);

  if (!order) {
    return next(
      new AppError("Order not found", 404)
    )
  }

  await orderModel.findByIdAndUpdate(
    orderId,
    {
      isDeleted: true,
      previousStatus: order.status,
      status: "Cancelled",
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Order soft deleted successfully"
  })
})

const restoreOrder = asyncWrapper(async (req, res, next) => {
  const orderId = req.params.id;
  const order = await orderModel.findById(orderId);

  if (!order) {
    return next(
      new AppError('Order not found', 404)
    )
  }

  await orderModel.findByIdAndUpdate(
    orderId,
    {
      isDeleted: false,
      status: order.previousStatus || 'Pending',
      previousStatus: ''
    }
  );

  res.status(200).json({
    status: 'Success',
    message: 'Order restored successfully'
  })
})

module.exports = { createOrder, getOrders, updateOrderStatus, softDeleteOrder, restoreOrder };




/*

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
    .populate("userId", "firstName lastName")
    .select(
      "orderNumber status orderItems totalAmount shippingMethod createdAt"
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

*/