require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const staffVisitRoutes = require("./routes/staffVisitRoutes");
const customerProfileRoutes = require("./routes/customerProfileRoutes");
const customerFeedbackRoutes = require("./routes/customerFeedbackRoutes");
const libraryUserFeedbackRoutes = require("./routes/libraryUserFeedbackRoutes");
const reviewSummaryRoutes = require("./routes/reviewSummaryRoutes");
const mongoose = require('mongoose');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/staff-visits", staffVisitRoutes);
app.use("/api/customer-profiles", customerProfileRoutes);
app.use("/api/customer-feedback", customerFeedbackRoutes);
app.use("/api/library-feedback", libraryUserFeedbackRoutes);
app.use("/api/review-summary", reviewSummaryRoutes);

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error("Database connection error:", err));