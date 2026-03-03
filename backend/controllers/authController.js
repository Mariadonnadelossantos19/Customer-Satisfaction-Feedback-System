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
        province: admin.province || null,
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
      admin: { id: admin._id, username: admin.username, role: admin.role, province: admin.province || null },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error sa pag-verify." });
  }
};

const PROVINCES = ["Oriental Mindoro", "Occidental Mindoro", "Palawan", "Romblon", "Marinduque"];

exports.createPstoAdmin = async (req, res) => {
  try {
    if (req.admin.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Super Admin lang ang maaaring lumikha ng PSTO admin." });
    }
    const { username, password, province } = req.body;
    if (!username || !password || !province) {
      return res.status(400).json({
        success: false,
        message: "Username, password, at province ay kailangan.",
      });
    }
    if (!PROVINCES.includes(province)) {
      return res.status(400).json({
        success: false,
        message: "Invalid na province. Piliin: Oriental Mindoro, Occidental Mindoro, Palawan, Romblon, Marinduque.",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Ang password ay dapat hindi bababa sa 6 character.",
      });
    }
    const existing = await Admin.findOne({ username: username.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "May existing na admin na may username na ito.",
      });
    }
    const admin = await Admin.create({
      username: username.trim().toLowerCase(),
      password,
      role: "psto_admin",
      province,
    });
    res.status(201).json({
      success: true,
      message: "PSTO admin na-create na.",
      admin: { id: admin._id, username: admin.username, role: admin.role, province: admin.province },
    });
  } catch (err) {
    console.error("Create PSTO admin error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "May error sa server.",
    });
  }
};

exports.listPstoAdmins = async (req, res) => {
  try {
    if (req.admin.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Super Admin lang ang maaaring tumingin ng listahan." });
    }
    const list = await Admin.find({ role: "psto_admin" }).select("-password").sort({ province: 1, username: 1 });
    res.status(200).json({ success: true, admins: list });
  } catch (err) {
    console.error("List PSTO admins error:", err);
    res.status(500).json({ success: false, message: "May error sa server." });
  }
};
