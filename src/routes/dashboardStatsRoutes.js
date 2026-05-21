const express = require("express");
const router = express.Router();

const dashBoardStatsController = require("../controllers/dashboardstatsController");


router.get("/admin/stats", dashBoardStatsController.getUserStats);
router.get("/search", dashBoardStatsController.searchUsers)

module.exports = router;