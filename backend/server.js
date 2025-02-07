require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const staffVisitRoutes = require("./routes/staffVisitRoutes");
const customerProfileRoutes = require("./routes/customerProfileRoutes");
const customerFeedbackRoutes = require("./routes/customerFeedbackRoutes");
const libraryUserFeedbackRoutes = require("./routes/libraryUserFeedbackRoutes");
const reviewSummaryRoutes = require("./routes/reviewSummaryRoutes");

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

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
