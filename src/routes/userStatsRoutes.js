const express = require("express");
const router = express.Router();
const { getUserRegistrationStats } = require("../controllers/userStatsController");

router.get("/registration-stats", getUserRegistrationStats);

module.exports = router;