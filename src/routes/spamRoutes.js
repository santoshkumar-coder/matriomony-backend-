const express = require("express");
const router = express.Router();
const spamCtrl = require("../controllers/spam.controller");
const { authMiddleware, verifyAdmin } = require("../middlewares/authMiddleware");

router.post("/report/:id", authMiddleware, spamCtrl.reportUser);

router.get("/top-ten", authMiddleware, verifyAdmin, spamCtrl.getTopSpamUsers);
router.get("/stats", authMiddleware, verifyAdmin, spamCtrl.getDashboardStats);
router.get("/list", authMiddleware, verifyAdmin, spamCtrl.getSpamList);
router.get("/search", authMiddleware, verifyAdmin, spamCtrl.handleSearch);
router.patch("/block/:id", authMiddleware, verifyAdmin, spamCtrl.toggleBlock);
router.delete("/delete/:id", authMiddleware, verifyAdmin, spamCtrl.deleteUser);

module.exports = router;