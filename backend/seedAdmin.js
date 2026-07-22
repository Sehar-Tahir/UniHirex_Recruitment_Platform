// require("dotenv").config();
// const mongoose = require("mongoose");
// const User = require("./models/User");

// const createAdmin = async () => {
//   await mongoose.connect(process.env.MONGO_URI);

//   const existing = await User.findOne({ email: "admin@unihirex.com" });
//   if (existing) {
//     console.log("Admin already exists");
//     process.exit(0);
//   }

//   await User.create({
//     name: "Platform Admin",
//     email: "admin@unihirex.com",
//     password: "UniHirexAdmin@2026",
//     role: "admin",
//     status: "Active",
//     isEmailVerified: true,
//   });

//   console.log("Admin account created successfully");
//   process.exit(0);
// };

// createAdmin();

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const ADMIN_EMAIL = "admin@unihirex.com";
const NEW_PASSWORD = "UniHirexAdmin@2026"; // change this to whatever new password you want

const createOrResetAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    existing.password = "adminpass"; // will be hashed automatically by the pre-save hook
    existing.isEmailVerified = true;
    existing.status = "Active";
    await existing.save();
    console.log(`Existing admin password reset to: ${NEW_PASSWORD}`);
    process.exit(0);
  }

  await User.create({
    name: "Platform Admin",
    email: "admin@unihirex.com",
    password: "adminpass",
    role: "admin",
    status: "Active",
    isEmailVerified: true,
  });

  console.log("Admin account created successfully");
  process.exit(0);
};

createOrResetAdmin();