// // Dashboard/backend/models/Order.js
// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   id: { type: String, unique: true },
//   total: String,
//   date_created: String,
//   source: { type: String, enum: ["woocommerce", "amazon"], required: true }
// }, { timestamps: true });

// module.exports = mongoose.model("Order", orderSchema);

// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // WooCommerce order ID or Amazon Order ID
  status: String,
  total: String,
  currency: String,
  date_created: String,
  date_modified: String,
  customer_id: Number,
  billing: Object,
  shipping: Object,
  message: {
    type: String,
    default: ""
  },
    source: { type: String, enum: ["woocommerce", "amazon"], required: true },
  // billing_source: { type: String, default: "" }, // Add this line
  line_items: [
    {
      name: String,
      quantity: Number,
      price: String
    }
  ]
},
  // source: { type: String, enum: ["woocommerce", "amazon"], required: true }
{ timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
