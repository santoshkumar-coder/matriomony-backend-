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


const getModerationStatusService = async (userId) => {
  const user = await User.findById(userId).select("moderationStatus reportReason");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
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
    .select("password");

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


const fetchFilteredUsersService = async (queryParams) => {
  const { gender, religion, maritalStatus, city, country } = queryParams;

  let query = {
    isActive: true,
    isBlocked: false,
  };

  if (gender) query.gender = gender;
  if (religion) query.religion = religion;
  if (maritalStatus) query.maritalStatus = maritalStatus;
  if (city) query.city = city;
  if (country) query.country = country;

  const users = await User.find(query).sort({ createdAt: -1 });

  return users;
};


const preOnboardingOptionsServie = async () => {
  const accountCreatefor = [
    "Self",
    "Son",
    "Daughter",
    "Brother",
    "Sister",
    "Friend",
    "Relative",
  ]
  let gender = [
    "Male", "Female", "Other"
  ]
  let religion = [
    "Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Parsi", "Jewish", "Other"
  ]
  let motherTongue = [
    "Hindi", "English", "Bengali", "Telugu", "Marathi", "Tamil", "Gujarati", "Urdu", "Kannada", "Odia", "Malayalam", "Punjabi", "Assamese", "Maithili", "Other"
  ]
  let highestQualification = [
    'High school', 'Bachelor', 'Master', 'PHD', 'Other'
  ]
  let annualIncome = [
    '0-2 lakhs', '2-5 lakhs', '5-10 lakhs', '10-20 lakhs', '20+ lakhs', 'other'
  ]
  let profession = [
    'Engineer', 'Doctor', 'Teacher', 'Business', 'Artist', 'Other', 'Student'
  ]
  let maritalStatus = [
    "unMarried",
    "Divorced",
    "Widowed",
    "Awaiting Divorce",
  ]
  let interest = [
    'Cooking', 'Reading', 'Traveling', 'Sports', 'Music', 'Movies', 'Other'
  ]
  return {
    accountCreatefor, gnder, religion, motherTongue, highestQualification, annualIncome, profession, maritalStatus, interest

  }
}
module.exports = {
  createUserService,
  getAllUsersService,
  loginUserService,
  getUserByIdService,
  updateUserService,
  getUserDashboardStatistics,
  getAllUsersServiceForAdmin,
  updateUserService,
  fetchFilteredUsersService,
  getModerationStatusService,
  preOnboardingOptionsServie
};