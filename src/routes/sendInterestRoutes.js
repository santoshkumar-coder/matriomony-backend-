// routes/interestRoutes.js

const express = require("express");
const router = express.Router();

const {authMiddleware} = require("../middlewares/authMiddleware");

const { sendInterest } = require("../controllers/interestController");
// const {
//    sendInterest,
//     // acceptInterest,
//     // rejectInterest,
//     // getReceivedInterests,
//     // getSentInterests,
//     // getMatches,
// } = require("../controllers/interestController");

/* =========================
   Send Interest
========================= */
// router.post(
//     "/send-interest/:receiverId",
//     authMiddleware,
//     sendInterest
// );


router.post("/send-interest/:receiverId",authMiddleware, sendInterest)

/* =========================
   Accept Interest
========================= */
// router.post(
//     "/accept-interest/:senderId",
//     authMiddleware,
//     acceptInterest
// );

/* =========================
   Reject Interest
========================= */
// router.post(
//     "/reject-interest/:senderId",
//     authMiddleware,
//     rejectInterest
// );

/* =========================
   Received Interests
========================= */
// router.get(
//     "/received-interests",
//     authMiddleware,
//     getReceivedInterests
// );

/* =========================
   Sent Interests
========================= */
// router.get(
//     "/sent-interests",
//     authMiddleware,
//     getSentInterests
// );

/* =========================
   Matches
========================= */
// router.get(
//     "/matches",
//     authMiddleware,
//     getMatches
// );

module.exports = router;
