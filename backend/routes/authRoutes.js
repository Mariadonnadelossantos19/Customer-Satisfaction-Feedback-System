const express = require("express");
const router = express.Router();
const { adminLogin, verifyToken, createPstoAdmin, listPstoAdmins } = require("../controllers/authController");
const { protectAdmin } = require("../middleware/authMiddleware");

router.post("/admin/login", adminLogin);
router.get("/admin/me", protectAdmin, verifyToken);
router.post("/admin/create-psto", protectAdmin, createPstoAdmin);
router.get("/admin/psto", protectAdmin, listPstoAdmins);

module.exports = router;
