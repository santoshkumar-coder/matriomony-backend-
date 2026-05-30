const User = require("../models/userModel");

const sendInterest = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId } = req.params;

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

        if (!receiver.isActive || receiver.isBlocked) {
            return res.status(400).json({
                success: false,
                message: "Profile not available",
            });
        }

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

const acceptInterest = async (req, res) => {
    try {
        const receiverId = req.user.id;
        const { senderId } = req.params;

        if (!senderId) {
            return res.status(400).json({
                success: false,
                message: "Sender id is required",
            });
        }

        const [receiver, sender] = await Promise.all([
            User.findById(receiverId),
            User.findById(senderId),
        ]);

        if (!receiver || !sender) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!receiver.interestsReceived.includes(senderId)) {
            return res.status(400).json({
                success: false,
                message: "No interest request found from this user",
            });
        }

        receiver.interestsReceived = receiver.interestsReceived.filter(
            (id) => id.toString() !== senderId
        );
        sender.interestsSent = sender.interestsSent.filter(
            (id) => id.toString() !== receiverId
        );

        if (!receiver.matches.includes(senderId)) {
            receiver.matches.push(senderId);
        }
        if (!sender.matches.includes(receiverId)) {
            sender.matches.push(receiverId);
        }

        await Promise.all([receiver.save(), sender.save()]);

        return res.status(200).json({
            success: true,
            message: "Interest accepted successfully",
        });
    } catch (error) {
        console.error("Accept Interest Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const declineInterest = async (req, res) => {
    try {
        const receiverId = req.user.id;
        const { senderId } = req.params;

        if (!senderId) {
            return res.status(400).json({
                success: false,
                message: "Sender id is required",
            });
        }

        const [receiver, sender] = await Promise.all([
            User.findById(receiverId),
            User.findById(senderId),
        ]);

        if (!receiver || !sender) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!receiver.interestsReceived.includes(senderId)) {
            return res.status(400).json({
                success: false,
                message: "No interest request found from this user",
            });
        }

        receiver.interestsReceived = receiver.interestsReceived.filter(
            (id) => id.toString() !== senderId
        );
        sender.interestsSent = sender.interestsSent.filter(
            (id) => id.toString() !== receiverId
        );

        if (!receiver.rejectedProfiles.includes(senderId)) {
            receiver.rejectedProfiles.push(senderId);
        }

        await Promise.all([receiver.save(), sender.save()]);

        return res.status(200).json({
            success: true,
            message: "Interest declined successfully",
        });
    } catch (error) {
        console.error("Decline Interest Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getSentInterests = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate(
            "interestsSent",
            "fullName photos gender dob city country religion motherTongue profession"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user.interestsSent,
        });
    } catch (error) {
        console.error("Get Sent Interests Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getAcceptedInterests = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate(
            "matches",
            "fullName photos gender dob city country religion motherTongue profession"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user.matches,
        });
    } catch (error) {
        console.error("Get Accepted Interests Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getReceivedInterests = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate(
            "interestsReceived",
            "fullName photos gender dob city country religion motherTongue profession"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user.interestsReceived,
        });
    } catch (error) {
        console.error("Get Received Interests Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};


module.exports = {
    sendInterest,
    acceptInterest,
    declineInterest,
    getSentInterests,
    getAcceptedInterests,
    getReceivedInterests
};