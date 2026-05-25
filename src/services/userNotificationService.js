const UserNotification = require("../models/UserNotification");
const AppError = require("../utils/AppError");
// const { sendNotification } = require("./notificationService");
const { getIO } = require("../socket/socket");

const sendNotification = (userId, data) => {
  const io = getIO();
  io.to(userId).emit("notification", data);
};

const createNotificationService = async ({
  userId,
  title,
  message,
  type,
}) => {
  // validation
  if (!userId || !title || !message) {
    console.log( userId, title, message)
    throw new AppError("Missing required fields", 400);
  }

  // save notification
  const notification = await UserNotification.create({
    userId,
    title,
    message,
    type,
  });

  if (!notification) {
    throw new AppError("Failed to create notification", 500);
  }

  // socket notification
  sendNotification(userId, notification);

  return notification;
};

module.exports = {
  createNotificationService,
};