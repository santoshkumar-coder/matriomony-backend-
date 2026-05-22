const User = require("../models/userModel");


const getUserStatsFromDB = async () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // Parallel queries: Counts aur Data ek saath fetch karne ke liye
  const [
    totalCount,
    newCount,
    activeCount,
    reportedCount,
    premiumCount,
    allUsers,
    newUsersList,
    activeUsersList,
    reportedUsersList,
    premiumUsersList
  ] = await Promise.all([
    // Counts (Fast Queries)
    User.countDocuments({}),
    User.countDocuments({ createdAt: { $gte: oneMonthAgo } }),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ isReported: true }),
    User.countDocuments({ subscriptionTier: { $in: ["GOLD", "PREMIUM", "ELITE"] } }),

    // Full Data (Heavier Queries)
    User.find({}),
    User.find({ createdAt: { $gte: oneMonthAgo } }),
    User.find({ isActive: true }),
    User.find({ isReported: true }),
    User.find({ subscriptionTier: { $in: ["GOLD", "PREMIUM", "ELITE"] } }),
  ]);

  return {
    // 1. Saare counts sabse upar
    summary: {
      totalUsers: totalCount,
      newUsers: newCount,
      activeUsers: activeCount,
      reportedUsers: reportedCount,
      premiumUsers: premiumCount,
    },
    // 2. Uske baad detailed list data
    details: {
      allUsersList: allUsers,
      newUsersList: newUsersList,
      activeUsersList: activeUsersList,
      reportedUsersList: reportedUsersList,
      premiumUsersList: premiumUsersList,
    },
  };
};


const searchUsersInDB = async (queryParams) => {
  const { q, gender, religion, city, maritalStatus } = queryParams;
  let query = {};

  if (q) {
    query.$or = [
      { fullName: { $regex: q, $options: "i" } }, 
      { email: { $regex: q, $options: "i" } },
      { city: { $regex: q, $options: "i" } },
      { profession: { $regex: q, $options: "i" } }
    ];

    if (!isNaN(q)) {
      query.$or.push({ phone: Number(q) });
    }
  }

  if (gender) query.gender = gender;
  if (religion) query.religion = religion;
  if (city) query.city = city;
  if (maritalStatus) query.maritalStatus = maritalStatus;

  const users = await User.find(query).sort({ createdAt: -1 });
  return users;
};


module.exports = {
  getUserStatsFromDB,
  searchUsersInDB
};