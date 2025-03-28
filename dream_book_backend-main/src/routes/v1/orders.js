const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");

router.get("/", async (req, res) => {
  try {
    const { source } = req.query;
    let filter = source ? { source } : {};

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    console.log("✅ Orders fetched:", orders.length);

    // ✅ Always return orders array, even if empty
    res.json({ status: true, data: orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ status: false, message: "Error fetching orders" });
  }
});

module.exports = router;
