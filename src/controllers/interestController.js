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
        const [sender, receiver] = await Promise.all([
            User.findById(senderId),
            User.findById(receiverId),
        ]);

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
           Already Sent / Matched Check
        ========================= */
        if (sender.interestsSent.includes(receiverId)) {
            return res.status(400).json({
                success: false,
                message: "Interest already sent",
            });
        }

        if (sender.matches.includes(receiverId)) {
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

        await Promise.all([sender.save(), receiver.save()]);

        return res.status(200).json({
            success: true,
            message: "Interest sent successfully",
        });
    } catch (error) {
        console.error("Send Interest Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    sendInterest,
};