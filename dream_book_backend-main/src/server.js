require("dotenv").config({ path: "../.env" }); // Force load from root
const mongoose = require("mongoose");
const cron = require("node-cron");
const logger = require("./config/logger");
const config = require("./config/config");
const amazonService = require("./services/amazon");
const wooCommerceService = require("./services/woocommerce");
const app = require("./app"); // Import the existing app
const Order = require("./models/Order");
const routes = require("./routes/v1"); // ✅ Ensure this is correctly imported
const { computeTopRatedAuthors } = require("./helpers/computeAuthors");

let server;

// Connect to MongoDB
mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    logger.info("✅ Connected to MongoDB");
  })
  .catch((err) => {
    logger.error("❌ MongoDB Connection Error:", err);
  });

// Define the API route for the dashboard
app.get("/api/dashboard", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    let platformEarnings = orders.reduce((sum, o) => sum + parseFloat(o.total || "0"), 0);
    const totalRoyalty = platformEarnings * 0.1;
    const totalBooks = 300; // Placeholder
    const totalSale = orders.reduce(
      (sum, o) => sum + (o.line_items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0),
      0
    );
    const totalAuthors = 100; // Placeholder

    const salesReport = orders.map((o) => ({
      platformName: o.source === "amazon" ? "Amazon" : "WooCommerce",
      quantity: (o.line_items || []).reduce((acc, item) => acc + (item.quantity || 0), 0),
      profitsEarned: `₹${o.total}`,
      date: new Date(o.date_created).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    const topRatedAuthors = await computeTopRatedAuthors();

    return res.json({
      status: true,
      data: {
        platformEarnings: `₹${platformEarnings.toFixed(2)}`,
        totalRoyalty: `₹${totalRoyalty.toFixed(2)}`,
        totalBooks,
        totalSale,
        totalAuthors,
        salesReport,
        topRatedAuthors,
      },
      // message: "Your custom message here", // new field added
      message: {
        type: String,
        default: ""
      }
    });
  } catch (error) {
    logger.error("❌ Error building dashboard data:", error);
    res.status(500).json({ status: false, message: "Error building dashboard data" });
  }
});

// API endpoint to fetch orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date_created: -1 });
    res.json({ status: true, data: orders });
  } catch (error) {
    logger.error("❌ Error fetching orders:", error);
    res.status(500).json({ status: false, message: "Error fetching orders" });
  }
});

// Cron job to sync orders every hour
cron.schedule("0 * * * *", async () => {
  logger.info("🕒 Running order sync...");
  const amazonOrders = await amazonService.fetchAmazonOrders();
  await amazonService.saveAmazonOrders(amazonOrders);
  await wooCommerceService.fetchOrders();
  logger.info("✅ Orders synced.");
});

// Start the server
server = app.listen(config.port, async () => {
  logger.info(`🚀 Server running on port ${config.port}`);
  const amazonOrders = await amazonService.fetchAmazonOrders();
  await amazonService.saveAmazonOrders(amazonOrders);
  await wooCommerceService.fetchOrders();
});

// Graceful exit handlers
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
