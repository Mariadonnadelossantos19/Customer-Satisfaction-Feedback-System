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

// Middleware - allow frontend origin in production
const corsOptions = {
  origin: process.env.FRONTEND_URL || true, // true = allow all (dev); set FRONTEND_URL in production
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/staff-visits", staffVisitRoutes);
app.use("/api/customer-profiles", customerProfileRoutes);
app.use("/api/customer-feedback", customerFeedbackRoutes);
app.use("/api/library-feedback", libraryUserFeedbackRoutes);
app.use("/api/review-summary", reviewSummaryRoutes);

// Connect to database, seed default admin, then start server
const PORT = process.env.PORT || 5000;
const start = async () => {
  await connectDB();
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      await Admin.create({ username: "superadmin", password: "admin123", role: "superadmin" });
      console.log("Super Admin created (username: superadmin, password: admin123).");
      const pstoLogins = [
        { username: "orientalmindoro", province: "Oriental Mindoro" },
        { username: "occidentalmindoro", province: "Occidental Mindoro" },
        { username: "palawan", province: "Palawan" },
        { username: "romblon", province: "Romblon" },
        { username: "marinduque", province: "Marinduque" },
      ];
      for (const { username, province } of pstoLogins) {
        await Admin.create({ username, password: "admin123", role: "psto_admin", province });
      }
      console.log("PSTO admins created (orientalmindoro, occidentalmindoro, palawan, romblon, marinduque). Password: admin123");
    } else {
      // Ensure superadmin exists even if other admins were created first
      const superadmin = await Admin.findOne({ username: "superadmin" });
      if (!superadmin) {
        await Admin.create({ username: "superadmin", password: "admin123", role: "superadmin" });
        console.log("Super Admin created (username: superadmin, password: admin123).");
      }
    }
  } catch (err) {
    console.error("Seed admin error:", err);
  }
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
start().catch((err) => {
  console.error("Startup error:", err);
  process.exit(1);
});