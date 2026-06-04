const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/userModel");
const Admin = require("../models/Admin");

const getRecentlyJoined = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user.id || req.user._id;
  const currentUser = await User.findById(loggedInUserId);
  const adminAccount = !currentUser ? await Admin.findById(loggedInUserId) : null;

  if (!currentUser && !adminAccount) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  let query = {
    createdAt: { $gte: twoDaysAgo },
    isActive: true,
    isHidden: { $ne: true },
    moderationStatus: "Approved",
  };

  if (currentUser) {
    const oppositeGender = currentUser.gender === "Male" ? "Female" : "Male";
    query._id = { $ne: currentUser._id, $nin: currentUser.blockedProfiles || [] };
    query.gender = oppositeGender;
  }

  const users = await User.find(query)
    .select("fullName gender photos age height location createdAt")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

const searchUsers = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user.id || req.user._id;
  const { name, minAge, maxAge, gender, location } = req.query;

  const currentUser = await User.findById(loggedInUserId);
  const adminAccount = !currentUser ? await Admin.findById(loggedInUserId) : null;

  if (!currentUser && !adminAccount) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  let query = {
    isActive: true,
    isHidden: { $ne: true },
    moderationStatus: "Approved",
  };

  if (currentUser) {
    query._id = { $ne: currentUser._id, $nin: currentUser.blockedProfiles || [] };
    query.gender = currentUser.gender === "Male" ? "Female" : "Male";
  } else if (gender) {
    query.gender = gender;
  }

  if (name) {
    query.fullName = { $regex: name, $options: "i" };
  }

  if (minAge || maxAge) {
    query.age = {};
    if (minAge) query.age.$gte = Number(minAge);
    if (maxAge) query.age.$lte = Number(maxAge);
  }

  if (location) {
    query["location.city"] = { $regex: location, $options: "i" };
  }

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
  searchUsers,
};