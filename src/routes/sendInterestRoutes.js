const express = require("express");
const router = express.Router();
const { authMiddleware,verifyAdmin  } = require("../middlewares/authMiddleware");
const {
    sendInterest,
    acceptInterest,
    declineInterest,
    getSentInterests,
    getAcceptedInterests,
    getReceivedInterests,
    getUserInterestsForAdmin,
    getReceivedInterestsForAdmin
} = require("../controllers/interestController");

router.post("/send-interest/:receiverId", authMiddleware, sendInterest);
router.put("/accept-interest/:senderId", authMiddleware, acceptInterest);
router.put("/decline-interest/:senderId", authMiddleware, declineInterest);
router.get("/sent-interests", authMiddleware, getSentInterests);
router.get("/accepted-interests", authMiddleware, getAcceptedInterests);
router.get("/received-interests", authMiddleware, getReceivedInterests);

router.get("/admin/user-interests/:userId", verifyAdmin, getUserInterestsForAdmin);
router.get("/admin/received-interests/:userId", verifyAdmin, getReceivedInterestsForAdmin);

module.exports = router;