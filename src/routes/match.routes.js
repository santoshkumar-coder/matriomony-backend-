const express = require("express");
const router = express.Router();
const matchController = require("../controllers/match.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/advanced-filters", authMiddleware, matchController.getAdvancedMatches);
router.get("/compatibility/:targetUserId", authMiddleware, matchController.getCompatibilityDetails);

module.exports = router;