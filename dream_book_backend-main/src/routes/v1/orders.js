const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../../models/Order");

router.get("/", async (req, res) => {
  try {
    const { source, bookId } = req.query;
    const filter = {};

    if (source) {
      filter.source = source;
    }

    if (bookId) {
      // Support both string and ObjectId types
      filter["line_items.bookId"] = {
        $in: [
          bookId, // as string
          mongoose.Types.ObjectId.isValid(bookId) ? new mongoose.Types.ObjectId(bookId) : null
        ].filter(Boolean)
      };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

    if (!orders.length) {
      return res.status(404).json({ status: false, message: "No orders found" });
    }

    res.json({ status: true, data: orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ status: false, message: "Error fetching orders" });
  }
});

module.exports = router;
