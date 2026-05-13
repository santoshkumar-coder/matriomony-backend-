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

module.exports = {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService 
};