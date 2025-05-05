const express = require("express");
const router = express.Router();
const {
  getTotalRevenue,
  getOrderCount,
  getAvgOrderValue,
  getWeeklyStats,
} = require("../controllers/stats.controller");

router.get("/stats/revenue", getTotalRevenue);
router.get("/stats/orders", getOrderCount);
router.get("/stats/avg-order-value", getAvgOrderValue);
router.get("/stats/weekly-stats", getWeeklyStats);
router.get("/ping", (req, res) => {
  console.log("Ping route hit");
  res.send("pong");
});
module.exports = router;


