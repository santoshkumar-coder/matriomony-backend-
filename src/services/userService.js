const User = require("../models/userModel");
const AppError = require("../utils/AppError");

const createUserService = async (data) => {
  const existingUser = await User.findOne({
    $or: [
      { phone: data.phone },
      { email: data.email },
    ],
  });

  if (existingUser) {

    throw new AppError("User already exists wih this phone or email", 400);
  }

  const user = await User.create(data);

  return user;
};


const getAllUsersService = async () => {
  const users = await User.find();
  

  return {
    users,
    totalUsers: users.length,
  };
};


const getUserByIdService = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError("User not found with this ID", 404);
  }

  return user;
}; 


const updateUserService = async (id, updateData) => {

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError("User not found to update", 404);
  }

  return updatedUser;
};

const getUserDashboardStatistics = async () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [
    totalUsers,
    newUsersLastWeek,
    activeUsers,
    reportedUsers
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ isReported: true }),
  ]);

  return {
    totalUsers,
    newUsersLastWeek,
    activeUsers,
    reportedUsers,
  };
};


const getAllUsersServiceForAdmin = async (page, limit) => {
  const skip = (page - 1) * limit;

  const [users, totalUsersCount] = await Promise.all([
    User.find()
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit)
      .select("-password"), 
    User.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalUsersCount / limit);

  return {
    users,
    pagination: {
      totalUsersCount,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};


module.exports = {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService ,
  getUserDashboardStatistics,
  getAllUsersServiceForAdmin
};