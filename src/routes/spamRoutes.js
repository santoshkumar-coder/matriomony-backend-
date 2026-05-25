const express = require("express");
const router = express.Router();
const spamCtrl = require("../controllers/spam.controller");
const { verifyAdmin } = require("../middlewares/authMiddleware");

router.get("/stats", verifyAdmin,spamCtrl.getDashboardStats);

router.get("/list",verifyAdmin, spamCtrl.getSpamList);

router.patch("/block/:id", verifyAdmin,spamCtrl.toggleBlock);
router.delete("/delete/:id", verifyAdmin,spamCtrl.deleteUser);
router.get("/search", verifyAdmin, spamCtrl.handleSearch);

module.exports = router;