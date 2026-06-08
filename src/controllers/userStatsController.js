const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");

const getUserRegistrationStats = asyncHandler(async (req, res) => {
  const { filter = "daily" } = req.query;
  let groupBy = "";
  let dateLimit = new Date();

  if (filter === "daily") {
    dateLimit.setDate(dateLimit.getDate() - 30);
    groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
  } else if (filter === "monthly") {
    dateLimit.setFullYear(dateLimit.getFullYear() - 1);
    groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
  } else if (filter === "yearly") {
    dateLimit = new Date(0);
    groupBy = { $dateToString: { format: "%Y", date: "$createdAt" } };
  }

  const stats = await User.aggregate([
    { $match: { createdAt: { $gte: dateLimit } } },
    { $group: { _id: groupBy, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, label: "$_id", value: "$count" } }
  ]);

  const totalUsers = await User.countDocuments();

  res.status(200).json({ success: true, totalUsers, data: stats });
});

const getMatchStats = asyncHandler(async (req, res) => {
  const { filter = "daily" } = req.query;
  let groupBy = "";
  let dateLimit = new Date();

  if (filter === "daily") {
    dateLimit.setDate(dateLimit.getDate() - 30);
    groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } };
  } else if (filter === "monthly") {
    dateLimit.setFullYear(dateLimit.getFullYear() - 1);
    groupBy = { $dateToString: { format: "%Y-%m", date: "$updatedAt" } };
  } else if (filter === "yearly") {
    dateLimit = new Date(0);
    groupBy = { $dateToString: { format: "%Y", date: "$updatedAt" } };
  }

  const stats = await User.aggregate([
    {
      $match: {
        updatedAt: { $gte: dateLimit },
        "matches.0": { $exists: true }
      }
    },
    {
      $group: {
        _id: groupBy,
        count: { $sum: { $size: "$matches" } }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        label: "$_id",
        value: { $divide: ["$count", 2] } 
      }
    }
  ]);

  const allUsersWithMatches = await User.find({ "matches.0": { $exists: true } }).select("matches");
  const totalMatches = allUsersWithMatches.reduce((acc, user) => acc + user.matches.length, 0) / 2;

  res.status(200).json({ success: true, totalMatches, data: stats });
});

module.exports = { getUserRegistrationStats, getMatchStats };