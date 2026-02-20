require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const staffVisitRoutes = require("./routes/staffVisitRoutes");
const customerProfileRoutes = require("./routes/customerProfileRoutes");
const customerFeedbackRoutes = require("./routes/customerFeedbackRoutes");
const libraryUserFeedbackRoutes = require("./routes/libraryUserFeedbackRoutes");
const reviewSummaryRoutes = require("./routes/reviewSummaryRoutes");
const authRoutes = require("./routes/authRoutes");
const Admin = require("./models/Admin");

const app = express();

// Connect to database
connectDB();

// Seed default admin if no admins exist
const seedDefaultAdmin = async () => {
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      await Admin.create({ username: "admin", password: "admin123", role: "admin" });
      console.log("Default admin created (username: admin, password: admin123). Change password in production.");
    }
  } catch (err) {
    console.error("Seed admin error:", err);
  }
};
seedDefaultAdmin();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/staff-visits", staffVisitRoutes);
app.use("/api/customer-profiles", customerProfileRoutes);
app.use("/api/customer-feedback", customerFeedbackRoutes);
app.use("/api/library-feedback", libraryUserFeedbackRoutes);
app.use("/api/review-summary", reviewSummaryRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});