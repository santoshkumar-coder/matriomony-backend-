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
module.exports = {
  createUserService,
  getAllUsersService
};