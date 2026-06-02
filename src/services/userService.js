const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const { publishMessage } = require('../kafka/producer');
const { TOPICS } = require('../kafka/topics');
const { sendEvent } = require('../config/kafka');


/* =========================
   Create User
========================= */

const createUserService = async (data) => {

  const existingUser = await User.findOne({
    $or: [
      { phone: data.phone },
      { email: data.email },
    ],
  });

  if (existingUser) {
    throw new AppError(
      "User already exists with this phone or email",
      400
    );
  }

  /* =========================
     Hash Password
  ========================= */

  const hashedPassword = await bcrypt.hash(
    data.password,
    10
  );

  data.password = hashedPassword;

  const user = await User.create(data);
 
  // sendEvent('user-created', {
  //   _id: user._id,
  //   name: user.fullName,
  //   email: user.email,
  //   phone: user.phone,
  //   createdAt: user.createdAt,
  // })

  // await publishMessage('user-created', {
  //   _id: user._id,
  //   name: user.fullName,
  //   email: user.email,
  //   phone: user.phone,
  //   createdAt: user.createdAt,
  // });

  return user;
};


const getAllUsersService = async () => {
  const users = await User.find();
  

  return {
    users,
    // token,
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


/* =========================
   Login User
========================= */

const loginUserService = async (data) => {

  const { email, password } = data;

  /* =========================
     Find User
  ========================= */

  const user = await User.findOne({ email })
    .select("password role");

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      400
    );
  }

  /* =========================
     Compare Password
  ========================= */

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError(
      "Invalid email or password",
      400
    );
  }

  /* =========================
     Generate Token
  ========================= */

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    user,
    token,
  };
};

module.exports = {
  createUserService,
  getAllUsersService,
  loginUserService,
  getUserByIdService,
  updateUserService ,
  getUserDashboardStatistics,
  getAllUsersServiceForAdmin,
  updateUserService
};