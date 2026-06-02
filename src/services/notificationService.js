const { getIO } = require("../socket/socket");


const sendNotification = (userId, data) => {
  const io = getIO();
  io.to(userId).emit("notification", data);
};

module.exports = { sendNotification };