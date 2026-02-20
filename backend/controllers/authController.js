const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const createToken = (adminId) => {
  return jwt.sign({ id: adminId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username at password ay kailangan.",
      });
    }

    const admin = await Admin.findOne({ username: username.trim().toLowerCase() }).select("+password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Maling username o password.",
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Maling username o password.",
      });
    }

    const token = createToken(admin._id);
    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({
      success: false,
      message: "May error sa server. Subukan muli mamaya.",
    });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");
    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin hindi mahanap." });
    }
    res.status(200).json({
      success: true,
      admin: { id: admin._id, username: admin.username, role: admin.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error sa pag-verify." });
  }
};
