const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

exports.protectAdmin = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Hindi awtorisado. Mag-login muna.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin hindi mahanap.",
      });
    }
    req.adminId = admin._id;
    req.admin = admin;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Nag-expire na ang session. Mag-login muli.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Hindi awtorisado. Invalid token.",
    });
  }
};
