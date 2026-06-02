const express = require("express");
const router = express.Router();
const matchController = require("../controllers/match.controller");

router.post("/advanced-filters",  matchController.getAdvancedMatches);

module.exports = router;