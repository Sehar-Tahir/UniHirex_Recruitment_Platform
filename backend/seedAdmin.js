require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: "admin@unihirex.com" });
  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }

  await User.create({
    name: "Platform Admin",
    email: "admin@unihirex.com",
    password: "UniHirexAdmin@2026",
    role: "admin",
    status: "Active",
    isEmailVerified: true,
  });

  console.log("Admin account created successfully");
  process.exit(0);
};

createAdmin();