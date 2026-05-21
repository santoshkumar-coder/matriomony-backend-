const express = require("express");
const { register, login, getStats } = require("../controllers/adminController");
const { verifyAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);

router.post("/login", login)

router.get("/user-stats", verifyAdmin,getStats);
module.exports = router;