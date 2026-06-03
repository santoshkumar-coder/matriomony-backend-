const adminService = require("../services/adminService");
const {
  getUserDashboardStatistics,
  getAllUsersServiceForAdmin,
} = require("../services/userService");
const User = require("../models/userModel");

exports.register = async (req, res) => {
  try {
    const admin = await adminService.registerAdmin(req.body);
    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: admin,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const result = await adminService.loginAdmin(email, password);
    res.status(200).json({
      success: true,
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await getUserDashboardStatistics();
    return res.status(200).json({
      success: true,
      message: "Admin statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getAllUsersForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await getAllUsersServiceForAdmin(page, limit);
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      totalUsers: result.totalUsersCount,
      showingCount: result.users.length,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

exports.getProfiles = async (req, res) => {
  try {
    const result = await adminService.fetchAllUsers(req.query);
    res.status(200).json({
      success: true,
      message: "Profiles fetched successfully",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profiles",
      error: error.message,
    });
  }
};

exports.getPendingProfiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const pendingUsers = await User.find({ moderationStatus: "Pending" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("fullName email phone gender photos createdAt");
    const total = await User.countDocuments({ moderationStatus: "Pending" });
    return res.status(200).json({
      success: true,
      message: "Pending profiles retrieved successfully",
      total,
      data: pendingUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching pending profiles",
      error: error.message,
    });
  }
};

exports.moderateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use Approved, Rejected or Pending.",
      });
    }
    const updatedUser = await adminService.updateModerationStatus(userId, status);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: `Profile status updated to ${status}`,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile status",
      error: error.message,
    });
  }
};

exports.getBlockedRelations = async (req, res) => {
  try {
    const userwithBlocks = await User.find({
      blockedProfiles: { $exists: true, $not: { $size: 0 } },
    })
      .select("fullName gender photos blockedProfiles")
      .populate("blockedProfiles", "fullName gender photos");
    return res.status(200).json({
      success: true,
      message: "Blocked relations retrieved successfully",
      data: userwithBlocks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving blocked relations",
      error: error.message,
    });
  }
};

exports.getUserMatchDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select("fullName phone email matches")
      .populate({
        path: "matches",
        select: "fullName phone email gender country state city photos religion motherTongue maritalStatus profileCompletionPercentage",
      });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      totalMatches: user.matches ? user.matches.length : 0,
      targetUser: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
      },
      matches: user.matches || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};