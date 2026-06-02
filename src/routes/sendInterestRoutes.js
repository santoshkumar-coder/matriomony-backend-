const express = require("express");

const {
  sendInterest,
  getReceivedInterests,
  getSentInterests,
  acceptInterest,
  rejectInterest,
} = require("../controllers/interestController.js");

const {authMiddleware} = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/send", authMiddleware, sendInterest);

router.get("/received", authMiddleware, getReceivedInterests);

router.get("/sent", authMiddleware, getSentInterests);

router.put("/accept/:interestId", authMiddleware, acceptInterest);

router.put("/reject/:interestId", authMiddleware, rejectInterest);

module.exports = router;