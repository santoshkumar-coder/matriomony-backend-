const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");

const getUserRegistrationStats = asyncHandler(async (req, res) => {
  const { filter = "daily" } = req.query;
  let groupBy = "";
  let dateLimit = new Date();

  switch (filter) {
    case "today":
      dateLimit.setHours(0, 0, 0, 0);
      groupBy = { $hour: "$createdAt" };
      break;
    case "weekly":
      dateLimit.setDate(dateLimit.getDate() - 7);
      groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
      break;
    case "monthly":
      dateLimit.setMonth(dateLimit.getMonth() - 1);
      groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
      break;
    case "yearly":
      dateLimit.setFullYear(dateLimit.getFullYear() - 1);
      groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
      break;
    default:
      dateLimit.setDate(dateLimit.getDate() - 30);
      groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
  }

  const stats = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: dateLimit },
      },
    },
    {
      $group: {
        _id: groupBy,
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        label: "$_id",
        users: "$count",
      },
    },
  ]);

  const totalToday = await User.countDocuments({
    createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
  });

  res.status(200).json({
    success: true,
    totalToday,
    data: stats,
  });
});

module.exports = { getUserRegistrationStats };