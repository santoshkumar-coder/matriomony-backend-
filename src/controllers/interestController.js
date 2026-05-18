

const User = require("../models/userModel");

const sendInterest = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId } = req.params;

        /* =========================
           Basic Checks
        ========================= */

        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver id is required",
            });
        }

        if (senderId === receiverId) {
            return res.status(400).json({
                success: false,
                message: "You cannot send interest to yourself",
            });
        }

        /* =========================
           Find Both Users
        ========================= */

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        /* =========================
           Blocked / Inactive Checks
        ========================= */

        if (!receiver.isActive || receiver.isBlocked) {
            return res.status(400).json({
                success: false,
                message: "Profile not available",
            });
        }

        /* =========================
           Already Sent Check
        ========================= */

        const alreadySent = sender.interestsSent.includes(receiverId);

        if (alreadySent) {
            return res.status(400).json({
                success: false,
                message: "Interest already sent",
            });
        }

        /* =========================
           Already Match Check
        ========================= */

        const alreadyMatched = sender.matches.includes(receiverId);

        if (alreadyMatched) {
            return res.status(400).json({
                success: false,
                message: "Already matched",
            });
        }

        /* =========================
           Save Data
        ========================= */

        sender.interestsSent.push(receiverId);
        receiver.interestsReceived.push(senderId);

        await sender.save();
        await receiver.save();

        return res.status(200).json({
            success: true,
            message: "Interest sent successfully",
        });

    } catch (error) {
        console.log("Send Interest Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    sendInterest,
};