const mongoose = require("mongoose");

const userNotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  read: {
    type: Boolean,
    default: false,
  },
  profileImage :{

    type:[String],
    default:'https://www.svgrepo.com/show/335455/profile-default.svg'
  },

  type: {
    type: String,
    enum: ["profile_accepted", "profile_rejected", "default", 'receive_interest'],
    default: "default",
  },

},
  {
    timestamps: true, // replaces createdAt automatically
  });

userNotificationSchema.index({
  userId: 1,
  createdAt: -1,
  expireAfterSeconds: 60 * 60 * 24 * 30
});

module.exports = mongoose.model("userNotification", userNotificationSchema);