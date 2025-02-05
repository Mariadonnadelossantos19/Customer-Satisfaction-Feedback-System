require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const staffVisitRoutes = require("./routes/staffVisitRoutes");
const customerProfileRoutes = require("./routes/customerProfileRoutes");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/staff-visits", staffVisitRoutes);
app.use("/api/customer-profiles", customerProfileRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
