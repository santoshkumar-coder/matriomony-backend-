const Admin = require("../models/Admin");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  getUserDashboardStatistics,
  getAllUsersServiceForAdmin,
} = require("../services/userService");

const cookieOptions = {
  httpOnly: true,
  secure: true,      // HTTPS (Ngrok) ke liye hamesha true
  sameSite: "none",  // Cross-domain (localhost to ngrok) ke liye zaruri hai
};
exports.register = async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      email,
      password: hashedPassword,
      fullName,
      role,
    });
    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password || "");
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const accessToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const refreshToken = jwt.sign({ id: admin._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    res.cookie("token", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({
      success: true,
      message: "Login successful",
      admin: { id: admin._id, email: admin.email, role: admin.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const rToken = req.cookies.refreshToken;
    if (!rToken) return res.status(401).json({ success: false, message: "Session expired" });
    jwt.verify(rToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ success: false, message: "Invalid refresh token" });
      const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      res.cookie("token", newAccessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });
      res.status(200).json({ success: true, message: "Token refreshed" });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await getUserDashboardStatistics();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllUsersForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await getAllUsersServiceForAdmin(page, limit);
    res.status(200).json({ success: true, data: result.users, pagination: result.pagination });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getProfiles = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const query = search ? { fullName: { $regex: search, $options: "i" } } : {};
    const users = await User.find(query).limit(limit * 1).skip((page - 1) * limit);
    const count = await User.countDocuments(query);
    res.status(200).json({ success: true, data: users, totalPages: Math.ceil(count / limit) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPendingProfiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const pendingUsers = await User.find({ moderationStatus: "Pending" }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await User.countDocuments({ moderationStatus: "Pending" });
    res.status(200).json({ success: true, data: pendingUsers, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.moderateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, { moderationStatus: req.body.status }, { new: true });
    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBlockedRelations = async (req, res) => {
  try {
    const data = await User.find({ blockedProfiles: { $exists: true, $not: { $size: 0 } } }).populate("blockedProfiles", "fullName gender photos");
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserMatchDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("matches");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, matches: user.matches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};