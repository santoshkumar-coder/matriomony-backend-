const User = require("../models/userModel");


const getUserStatsFromDB = async () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // Parallel queries to fetch Data
  const [allUsers, newUsersList, activeUsersList, reportedUsersList] = await Promise.all([
    // 1. All Users
    User.find({}),

    // 2. New Users (Last 30 days)
    User.find({ createdAt: { $gte: oneMonthAgo } }),

    // 3. Active Users
    User.find({ isActive: true }),

    // 4. Reported Users
    User.find({ isReported: true }),
  ]);

  return {
    total: {
      count: allUsers.length,
      users: allUsers,
    },
    newUsers: {
      count: newUsersList.length,
      users: newUsersList,
    },
    active: {
      count: activeUsersList.length,
      users: activeUsersList,
    },
    reported: {
      count: reportedUsersList.length,
      users: reportedUsersList,
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