const express = require("express");

const {
  sendInterest,
  getReceivedInterests,
  getSentInterests,
  acceptInterest,
  rejectInterest,
} = require("../controllers/interestController");

const {isAuthenticated} = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/send", isAuthenticated, sendInterest);

router.get("/received", isAuthenticated, getReceivedInterests);

router.get("/sent", isAuthenticated, getSentInterests);

router.put("/accept/:interestId", isAuthenticated, acceptInterest);

router.put("/reject/:interestId", isAuthenticated, rejectInterest);

module.exports = router;