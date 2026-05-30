const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
    sendInterest,
    acceptInterest,
    declineInterest,
    getSentInterests,
    getAcceptedInterests,
    getReceivedInterests
} = require("../controllers/interestController");

router.post("/send-interest/:receiverId", authMiddleware, sendInterest);
router.put("/accept-interest/:senderId", authMiddleware, acceptInterest);
router.put("/decline-interest/:senderId", authMiddleware, declineInterest);
router.get("/sent-interests", authMiddleware, getSentInterests);
router.get("/accepted-interests", authMiddleware, getAcceptedInterests);
router.get("/received-interests", authMiddleware, getReceivedInterests);

module.exports = router;