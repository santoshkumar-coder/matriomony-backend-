const express = require("express");
const router = express.Router();
const { getUserRegistrationStats, getMatchStats } = require("../controllers/userStatsController");

router.get("/registration-stats", getUserRegistrationStats);
router.get("/match-stats", getMatchStats);

module.exports = router;