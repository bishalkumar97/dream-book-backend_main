// // Dashboard/backend/services/woocommerce.js
// const axios = require("axios");
// const Order = require("../models/Order");
// require("dotenv").config();

// // const wooCommerceBaseURL = process.env.WOOCOMMERCE_API_URL;
// // const wooCommerceConsumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
// // const wooCommerceConsumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// // // Function to fetch WooCommerce orders
// // const fetchOrders = async () => {
// //   try {
// //     console.log("🔍 Fetching WooCommerce orders...");
// //     const response = await axios.get(`${wooCommerceBaseURL}/wp-json/wc/v3/orders`, {
// //       headers: {
// //         Authorization: "Basic " + Buffer.from(`${wooCommerceConsumerKey}:${wooCommerceConsumerSecret}`).toString("base64")
// //       }
// //     });
// //     const orders = response.data;
// //     for (let order of orders) {
// //       await Order.findOneAndUpdate(
// //         { id: order.id.toString() },
// //         {
// //           id: order.id.toString(),
// //           total: order.total,
// //           date_created: order.date_created,
// //           source: "woocommerce"
// //         },
// //         { upsert: true }
// //       );
// //     }
// //     console.log("✅ WooCommerce Orders saved.");
// //   } catch (error) {
// //     console.error("❌ Error fetching WooCommerce orders:", error);
// //   }
// // };

// // module.exports = { fetchOrders };

// // services/wooCommerce.js
// // const axios = require("axios");
// // const Product = require("../models/Product");
// // const Order = require("../models/Order");
// // const Analytics = require("../models/Analytics");

// const wooCommerceBaseURL = process.env.WOOCOMMERCE_API_URL;
// const wooCommerceConsumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
// const wooCommerceConsumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// // Make a WooCommerce API request
// const wooCommerceRequest = async (endpoint, params = {}) => {
//   console.log(`🔍 Making WooCommerce API request to ${endpoint}...`);
//   try {
//     const response = await axios.get(`${wooCommerceBaseURL}/wp-json/wc/v3/${endpoint}`, {
//       headers: {
//         'Authorization': 'Basic ' + Buffer.from(`${wooCommerceConsumerKey}:${wooCommerceConsumerSecret}`).toString('base64')
//       },
//       params,
//       timeout: 10000 // 10 seconds timeout
//     });
//     console.log(`✅ WooCommerce API request to ${endpoint} successful.`);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Error fetching ${endpoint}:`, error.response ? error.response.data : error.message);
//     return [];
//   }
// };

// // Fetch WooCommerce products and update MongoDB
// const fetchProducts = async () => {
//   console.log("🔍 Starting to fetch WooCommerce products...");
//   try {
//     let page = 1;
//     let totalFetched = 0;
//     let hasMore = true;

//     while (hasMore) {
//       console.log(`🔄 Fetching products (Page ${page})...`);
//       const products = await wooCommerceRequest("products", { per_page: 100, page });

//       if (products.length === 0) {
//         console.log("🔍 No more products found.");
//         hasMore = false;
//         break;
//       }

//       console.log(`🛠 Fetched ${products.length} products from page ${page}.`);

//       for (let product of products) {
//         const description = product.description || "No description available";
//         const shortDescription = product.short_description || "No short description available";

//         await Product.findOneAndUpdate(
//           { id: product.id.toString() },
//           {
//             id: product.id.toString(),
//             name: product.name,
//             price: product.price,
//             description: description,
//             short_description: shortDescription,
//             sku: product.sku,
//             stock_quantity: product.stock_quantity,
//             images: product.images.map(img => ({ src: img.src })),
//             categories: product.categories.map(cat => ({ id: cat.id, name: cat.name })),
//             date_modified: product.date_modified,
//             source: "woocommerce"
//           },
//           { upsert: true }
//         );

//         console.log(`✅ Product ID ${product.id} saved/updated in MongoDB.`);
//       }

//       totalFetched += products.length;
//       page++;
//     }

//     console.log(`✅ All WooCommerce products fetched! Total: ${totalFetched}`);
//   } catch (error) {
//     console.error("❌ Error fetching WooCommerce products:", error.message);
//   }
// };

// // Fetch WooCommerce orders and update MongoDB
// const fetchOrders = async () => {
//   console.log("🔍 Starting to fetch WooCommerce orders...");
//   // try {
//   //   let page = 1;
//   //   let totalFetched = 0;
//   //   let hasMore = true;

//   //   while (hasMore) {
//   //     console.log(`🔄 Fetching orders (Page ${page})...`);
//   //     const orders = await wooCommerceRequest("orders", { per_page: 100, page });

//   //     if (orders.length === 0) {
//   //       console.log("🔍 No more orders found.");
//   //       hasMore = false;
//   //       break;
//   //     }

//   //     console.log(`✅ Fetched ${orders.length} orders from page ${page}.`);

//   //     for (let order of orders) {
//   //       if (!order.id) {
//   //         console.error("❌ Skipping order with missing or null ID:", order);
//   //         continue;
//   //       }

//   //       console.log(`🛠 Processing WooCommerce order ID ${order.id}`);

//   //       try {
//   //         await Order.findOneAndUpdate(
//   //           { id: order.id.toString() },
//   //           { ...order, id: order.id.toString(), source: "woocommerce" },
//   //           { upsert: true }
//   //         );
//   //         console.log(`✅ Order ID ${order.id} saved/updated in MongoDB.`);
//   //       } catch (error) {
//   //         console.error("❌ Error saving WooCommerce order to DB:", error.message);
//   //       }
//   //     }

//   //     totalFetched += orders.length;
//   //     page++;
//   //   }

//   //   console.log(`✅ All WooCommerce orders fetched! Total: ${totalFetched}`);
//   // } catch (error) {
//   //   console.error("❌ Error fetching WooCommerce orders:", error.message);
//   // }

//   try {
//     console.log("🔍 Fetching WooCommerce orders...");
//     const response = await axios.get(`${wooCommerceBaseURL}/wp-json/wc/v3/orders`, {
//       headers: {
//         Authorization:
//           "Basic " +
//           Buffer.from(`${wooCommerceConsumerKey}:${wooCommerceConsumerSecret}`).toString("base64")
//       }
//     });
//     const orders = response.data;

//     for (let order of orders) {
//       // UPDATED LINE: Convert WooCommerce line_items to the same shape
//       const mappedLineItems = (order.line_items || []).map((item) => ({
//         name: item.name,
//         quantity: item.quantity,
//         price: item.price
//       }));

//       await Order.findOneAndUpdate(
//         { id: order.id.toString() },
//         {
//           id: order.id.toString(),
//           total: order.total,
//           date_created: order.date_created,
//           source: "woocommerce",
//           line_items: mappedLineItems // UPDATED LINE
//         },
//         { upsert: true }
//       );
//     }
//     console.log("✅ WooCommerce Orders saved.");
//   } catch (error) {
//     console.error("❌ Error fetching WooCommerce orders:", error);
//   }
// };

// // Calculate monthly sales from WooCommerce orders and update Analytics in MongoDB
// const calculateMonthlySales = async () => {
//   try {
//     const orders = await Order.find({ source: "woocommerce" });
//     const monthlySales = {};

//     orders.forEach(order => {
//       const date = new Date(order.date_created);
//       const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

//       if (monthlySales[monthYear]) {
//         monthlySales[monthYear] += parseFloat(order.total);
//       } else {
//         monthlySales[monthYear] = parseFloat(order.total);
//       }
//     });

//     console.log("📅 Monthly Sales:");
//     for (const [month, total] of Object.entries(monthlySales)) {
//       console.log(`- ${month}: ${total.toFixed(2)}`);
//       await Analytics.findOneAndUpdate(
//         { month },
//         { month, totalSales: total },
//         { upsert: true }
//       );
//     }

//     return monthlySales;
//   } catch (error) {
//     console.error("❌ Error calculating monthly sales:", error);
//   }
// };

// // Calculate royalties based on monthly sales and update Analytics in MongoDB
// const calculateRoyalties = async (monthlySales) => {
//   try {
//     const royaltyRate = 0.1; // 10% royalty rate
//     const royalties = {};

//     for (const [month, total] of Object.entries(monthlySales)) {
//       const royaltyAmount = total * royaltyRate;
//       royalties[month] = royaltyAmount;

//       await Analytics.findOneAndUpdate(
//         { month },
//         { month, royalties: royaltyAmount },
//         { upsert: true }
//       );
//     }

//     console.log("💰 Royalties for Authors:");
//     Object.entries(royalties).forEach(([month, amount]) => {
//       console.log(`- ${month}: ${amount.toFixed(2)}`);
//     });

//     return royalties;
//   } catch (error) {
//     console.error("❌ Error calculating royalties:", error);
//   }
// };

// module.exports = {
//   fetchProducts,
//   fetchOrders,
//   calculateMonthlySales,
//   calculateRoyalties
// };
const axios = require("axios");
const Order = require("../models/Order");

// Load environment variables
// require("dotenv").config(); // NEW LINE ADDED
require("dotenv").config({ path: "../.env" }); // NEW LINE


const wooCommerceBaseURL = process.env.WOOCOMMERCE_API_URL;
const wooCommerceConsumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
const wooCommerceConsumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// Function to make WooCommerce API request
const wooCommerceRequest = async (endpoint, params = {}) => {
  console.log(`🔍 Making WooCommerce API request to ${endpoint}...`);
  try {
    const response = await axios.get(`${wooCommerceBaseURL}/wp-json/wc/v3/${endpoint}`, {
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${wooCommerceConsumerKey}:${wooCommerceConsumerSecret}`).toString("base64")
      },
      params,
      timeout: 10000 // 10 seconds timeout
    });
    console.log(`✅ WooCommerce API request to ${endpoint} successful.`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching ${endpoint}:`, error.response ? error.response.data : error.message);
    return [];
  }
};

// Function to fetch WooCommerce products
const fetchProducts = async () => {
  console.log("🔍 Starting to fetch WooCommerce products...");
  try {
    let page = 1;
    let totalFetched = 0;
    let hasMore = true;

    while (hasMore) {
      console.log(`🔄 Fetching products (Page ${page})...`);
      const products = await wooCommerceRequest("products", { per_page: 100, page });

      if (products.length === 0) {
        console.log("🔍 No more products found.");
        hasMore = false;
        break;
      }

      console.log(`🛠 Fetched ${products.length} products from page ${page}.`);

      for (let product of products) {
        const description = product.description || "No description available";
        const shortDescription = product.short_description || "No short description available";

        await Order.findOneAndUpdate(
          { id: product.id.toString() },
          {
            id: product.id.toString(),
            name: product.name,
            price: product.price,
            description: description,
            short_description: shortDescription,
            sku: product.sku,
            stock_quantity: product.stock_quantity,
            images: product.images.map(img => ({ src: img.src })),
            categories: product.categories.map(cat => ({ id: cat.id, name: cat.name })),
            date_modified: product.date_modified,
            source: "woocommerce"
          },
          { upsert: true }
        );

        console.log(`✅ Product ID ${product.id} saved/updated in MongoDB.`);
      }

      totalFetched += products.length;
      page++;
    }

    console.log(`✅ All WooCommerce products fetched! Total: ${totalFetched}`);
  } catch (error) {
    console.error("❌ Error fetching WooCommerce products:", error.message);
  }
};

// Function to fetch WooCommerce orders (UPDATED PAGINATION LOGIC)
const fetchOrders = async () => {
  console.log("🔍 Starting to fetch WooCommerce orders...");
  try {
    let page = 1;
    let totalFetched = 0;
    let hasMore = true;

    while (hasMore) {
      console.log(`🔄 Fetching orders (Page ${page})...`); // NEW LINE ADDED

      // NEW LINE ADDED: Added pagination with `per_page` to fetch 100 orders at a time
      const response = await axios.get(`${wooCommerceBaseURL}/wp-json/wc/v3/orders`, {
        headers: {
          Authorization:
            "Basic " + Buffer.from(`${wooCommerceConsumerKey}:${wooCommerceConsumerSecret}`).toString("base64")
        },
        params: {
          per_page: 100, // NEW LINE ADDED: Fetch 100 orders per request
          page: page // NEW LINE ADDED: Fetch multiple pages
        }
      });

      const orders = response.data;
      console.log("📦 WooCommerce API Response:", JSON.stringify(orders, null, 2));

      if (orders.length === 0) {
        console.log("🔍 No more orders found."); // NEW LINE ADDED
        hasMore = false; // NEW LINE ADDED
        break;
      }

      console.log(`✅ Fetched ${orders.length} orders from page ${page}.`); // NEW LINE ADDED

      for (let order of orders) {
        const mappedLineItems = (order.line_items || []).map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }));

         // ✅ ADD THIS LOG
        console.log(`🛠 Saving Order ID ${order.id} to MongoDB`);

        await Order.findOneAndUpdate(
          { id: order.id.toString() },
          {
            id: order.id.toString(),
            total: order.total,
            date_created: order.date_created,
            source: "woocommerce",
            line_items: mappedLineItems
          },
          { upsert: true }
        );

        console.log(`✅ Order ID ${order.id} saved/updated in MongoDB.`); // NEW LINE ADDED
      }

      totalFetched += orders.length; // NEW LINE ADDED
      page++; // NEW LINE ADDED
    }

    console.log(`✅ All WooCommerce orders fetched! Total: ${totalFetched}`); // NEW LINE ADDED
  } catch (error) {
    console.error("❌ Error fetching WooCommerce orders:", error);
  }
};

// const orderCount = await Order.countDocuments({ source: "woocommerce" });
// console.log(`✅ Total WooCommerce Orders in DB: ${orderCount}`);


// Function to calculate monthly sales
const calculateMonthlySales = async () => {
  try {
    const orders = await Order.find({ source: "woocommerce" });
    const monthlySales = {};

    orders.forEach(order => {
      const date = new Date(order.date_created);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (monthlySales[monthYear]) {
        monthlySales[monthYear] += parseFloat(order.total);
      } else {
        monthlySales[monthYear] = parseFloat(order.total);
      }
    });

    console.log("📅 Monthly Sales:");
    for (const [month, total] of Object.entries(monthlySales)) {
      console.log(`- ${month}: ${total.toFixed(2)}`);
      await Order.findOneAndUpdate(
        { month },
        { month, totalSales: total },
        { upsert: true }
      );
    }

    return monthlySales;
  } catch (error) {
    console.error("❌ Error calculating monthly sales:", error);
  }
};

// Function to calculate royalties based on monthly sales
const calculateRoyalties = async (monthlySales) => {
  try {
    const royaltyRate = 0.1; // 10% royalty rate
    const royalties = {};

    for (const [month, total] of Object.entries(monthlySales)) {
      const royaltyAmount = total * royaltyRate;
      royalties[month] = royaltyAmount;

      await Order.findOneAndUpdate(
        { month },
        { month, royalties: royaltyAmount },
        { upsert: true }
      );
    }

    console.log("💰 Royalties for Authors:");
    Object.entries(royalties).forEach(([month, amount]) => {
      console.log(`- ${month}: ${amount.toFixed(2)}`);
    });

    return royalties;
  } catch (error) {
    console.error("❌ Error calculating royalties:", error);
  }
};

// Export functions
module.exports = {
  fetchProducts,
  fetchOrders,
  calculateMonthlySales,
  calculateRoyalties
};
