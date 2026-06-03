const User = require("../models/userModel");
const UserNotificationModel = require("../models/userNotification");
const asyncHandler = require("../utils/asyncHandler");

const createNotification = asyncHandler(async (req, res) => {
    const { userId, title, message, type } = req.body;
    const notification = await UserNotificationModel.create({ userId, title, message, type });
    res.status(201).json(notification);
});

const checkPendingProfilesAlert = asyncHandler(async (req, res) => {
    const pendingCount = await User.countDocuments({ moderationStatus: "Pending" });

    if (pendingCount >= 5) {
        const admins = await User.find({ role: "admin" }).select("_id");
        
        if (admins.length > 0) {
            const adminNotifications = admins.map(admin => ({
                userId: admin._id,
                title: "Overlimit Access",
                message: "Please approve profiles as soon as possible. 5 or more profiles are pending.",
                type: "default"
            }));

            await UserNotificationModel.insertMany(adminNotifications);
        }
    }
    
    res.status(200).json({ 
        success: true, 
        message: "Admin alert check completed", 
        pendingCount 
    });
});

const reportUserAndNotifyAdmin = asyncHandler(async (req, res) => {
    const { targetUserId, reason } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        targetUserId,
        { 
            $inc: { reportCount: 1 },
            $set: { isReported: true, reportReason: reason }
        },
        { new: true }
    );

    if (updatedUser && updatedUser.reportCount >= 10) {
        const admins = await User.find({ role: "admin" }).select("_id");
        
        if (admins.length > 0) {
            const spamAlerts = admins.map(admin => ({
                userId: admin._id,
                title: "Spam Threshold Reached",
                message: `User ${updatedUser.fullName} has been reported ${updatedUser.reportCount} times.`,
                type: "spam_alert"
            }));

            await UserNotificationModel.insertMany(spamAlerts);
        }
    }

    res.status(200).json({ 
        success: true, 
        message: "Report registered successfully",
        reportCount: updatedUser ? updatedUser.reportCount : 0 
    });
});

const getSpamAccountAlerts = asyncHandler(async (req, res) => {
    const spamCount = await User.countDocuments({ reportCount: { $gte: 10 } });

    res.status(200).json({
        success: true,
        hasAlert: spamCount > 0,
        spamCount,
        message: spamCount > 0 
            ? `${spamCount} profiles have exceeded 10 reports. Action required.` 
            : "No high-risk spam accounts found."
    });
});

const checkRecentRegistrationsAlert = asyncHandler(async (req, res) => {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentJoinCount = await User.countDocuments({ 
        createdAt: { $gte: last24Hours },
        role: "user" 
    });

    if (recentJoinCount > 0) {
        const admins = await User.find({ role: "admin" }).select("_id");

        if (admins.length > 0) {
            const registrationAlerts = admins.map(admin => ({
                userId: admin._id,
                title: "New Registrations",
                message: `${recentJoinCount} new users have joined in the last 24 hours.`,
                type: "default"
            }));

            await UserNotificationModel.insertMany(registrationAlerts);
        }
    }

    res.status(200).json({
        success: true,
        recentJoinCount,
        message: "Recent registration check completed"
    });
});

module.exports = {
    createNotification,
    checkPendingProfilesAlert,
    reportUserAndNotifyAdmin,
    getSpamAccountAlerts,
    checkRecentRegistrationsAlert
};