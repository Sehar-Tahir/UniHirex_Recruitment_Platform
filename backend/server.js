require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route — confirms the server is alive
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "UniHirex API is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

// Catches any error thrown/passed to next() anywhere in the app and logs the real detail
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Something went wrong" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});