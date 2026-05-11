const UserNotification = require("../model/userNotification");
const asyncHandler = require("../util/asyncHandler");
const AppError = require("../util/AppError");
const { sendNotification } = require("../service/notificationService");

const userController = {
  createNotification: asyncHandler(async (req, res) => {
    const notification = await createNotificationService(req.body);

    res.status(201).json({
      success: true,
      data: notification,
    });
  }),
};

module.exports = userController;