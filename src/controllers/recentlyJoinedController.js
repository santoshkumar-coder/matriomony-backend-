const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/userModel");

const getRecentlyJoined = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user.id || req.user._id;

  const currentUser = await User.findById(loggedInUserId);
  if (!currentUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const oppositeGender = currentUser.gender === "Male" ? "Female" : "Male";
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  const query = {
    _id: { $ne: currentUser._id, $nin: currentUser.blockedProfiles || [] },
    gender: oppositeGender,
    createdAt: { $gte: twoDaysAgo },
    isActive: true,
    isHidden: { $ne: true },
    moderationStatus: "Approved",
  };

  const users = await User.find(query)
    .select("fullName gender photos age height location createdAt")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

module.exports = {
  getRecentlyJoined,
};