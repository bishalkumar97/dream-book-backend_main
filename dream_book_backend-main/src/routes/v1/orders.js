// const express = require("express");
// const router = express.Router();
// const Order = require("../../models/Order");

// router.get("/", async (req, res) => {
//   try {
//     const { source } = req.query;
//     let filter = source ? { source } : {};

//     const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

//     if (orders.length === 0) {
//       return res.status(404).json({ status: false, message: "No orders found" });
//     }

//     res.json({ status: true, data: orders });
//   } catch (error) {
//     console.error("❌ Error fetching orders:", error);
//     res.status(500).json({ status: false, message: "Error fetching orders" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");

// Utility function to authenticate and extract token
const authenticate = (req) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  return token; // Placeholder, you can use your specific authentication method
};

router.get("/", async (req, res) => {
  try {
    const { bookId } = req.query; // Query bookId
    let filter = {};
    
    // Check for bookId and apply filter on line_items.bookId for both WooCommerce and Amazon
    if (bookId) {
      filter["line_items.bookId"] = bookId;
    }

    // Query orders for the specific bookId
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

    if (orders.length === 0) {
      return res.status(404).json({ status: false, message: "No orders found" });
    }

    res.json({ status: true, data: orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ status: false, message: "Error fetching orders" });
  }
});

module.exports = router;
