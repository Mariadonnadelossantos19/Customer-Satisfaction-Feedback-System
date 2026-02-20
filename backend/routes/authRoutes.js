const express = require("express");
const router = express.Router();
const { adminLogin, verifyToken } = require("../controllers/authController");
const { protectAdmin } = require("../middleware/authMiddleware");

router.post("/admin/login", adminLogin);
router.get("/admin/me", protectAdmin, verifyToken);

module.exports = router;
