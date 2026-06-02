const UserNotification = require("../models/userNotification");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { sendNotification } = require("../services/notificationService");

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