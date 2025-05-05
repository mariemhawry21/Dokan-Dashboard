const Order = require("../models/order.model");

const getTotalRevenue = async (req, res) => {
  const result = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);
  res.json({ totalRevenue: result[0]?.total || 0 });
};

const getOrderCount = async (req, res) => {
  console.log("GET /dashboard/stats/orders hit");

  const count = await Order.countDocuments();
  res.json({ orderCount: count });
};

const getAvgOrderValue = async (req, res) => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
  ]);
  const avg = result[0] ? result[0].total / result[0].count : 0;
  res.json({ avgOrderValue: avg });
};

const getWeeklyStats = async (req, res) => {
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 6);

  const data = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: lastWeek, $lte: today },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%w", date: "$createdAt" },
        },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
  ]);

  const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const filledData = allDays.map((day) => {
    const dayData = data.find((d) => d._id === day);
    return {
      day,
      revenue: dayData?.revenue || 0,
      orders: dayData?.orders || 0,
      avgOrderValue:
        dayData?.revenue && dayData?.orders
          ? dayData.revenue / dayData.orders
          : 0,
    };
  });

  res.json(filledData);
};

module.exports = {
  getTotalRevenue,
  getOrderCount,
  getAvgOrderValue,
  getWeeklyStats,
};


