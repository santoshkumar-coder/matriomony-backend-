const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const AppError = require("../utils/AppError");

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

  return user;
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

module.exports = {
  createUserService,
  loginUserService,
};