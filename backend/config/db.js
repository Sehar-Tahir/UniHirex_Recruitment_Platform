// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB connected successfully");
//   } catch (err) {
//     console.error("MongoDB connection failed:", err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;


// This version of connectDB is designed to work with serverless environments like Vercel.
const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    if (process.env.VERCEL !== "1") process.exit(1);
    throw err;
  }
};

module.exports = connectDB;