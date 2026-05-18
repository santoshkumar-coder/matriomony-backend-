const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const { publishMessage } = require('../kafka/producer');
const { TOPICS } = require('../kafka/topics');
const { sendEvent } = require('../config/kafka');


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
  console.log("User created:", user);
  // sendEvent('user-created', {
  //   _id: user._id,
  //   name: user.fullName,
  //   email: user.email,
  //   phone: user.phone,
  //   createdAt: user.createdAt,
  // })

  await publishMessage('user-created', {
    _id: user._id,
    name: user.fullName,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
  });

  return user;
};


const getAllUsersService = async () => {
  const users = await User.find();
  // await publishMessage('get-all-users', {

  //   total: users.length,
  //   users,
  // });
  // sendEvent('get-all-users', {
  //       total: users.length,
  //   users,
  // })


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

module.exports = {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService
};