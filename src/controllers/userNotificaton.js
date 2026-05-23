const {createNotificationService} = require("../services/userNotificationService");
const asyncHandler = require("../utils/asyncHandler");


const UserNotification = {
    createNotification: asyncHandler(async (req, res) => {

        const { userId, title, message, type } = req.body;
        const notification = await createNotificationService(userId, title, message, type);
        res.status(201).json(notification);

    })
}

module.exports = UserNotification;

