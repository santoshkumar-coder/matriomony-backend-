const asyncHandler = require("../utils/asyncHandler");
const {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  getModerationStatusService,
  updateUserService,
  fetchFilteredUsersService,
  preOnboardingOptionsServie,
  loginUserService,
} = require("../services/userService");

const cleanBody = require("../utils/cleanBody");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const userController = {
  createUser: asyncHandler(async (req, res) => {
    req.body = cleanBody(req.body);

    if (req.files && req.files.length > 0) {
      req.body.photos = req.files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        isPrimary: index === 0,
      }));
    }

    const user = await createUserService(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  }),

  loginUser: asyncHandler(async (req, res) => {
    const { user, token } = await loginUserService(req.body);

    if (user.moderationStatus === "Pending") {
      return res.status(403).json({
        success: false,
        message: "Your profile is under review",
        moderationStatus: "Pending",
      });
    }

    if (user.moderationStatus === "Rejected") {
      return res.status(403).json({
        success: false,
        message: "Your profile has been rejected by the admin",
        moderationStatus: "Rejected",
      });
    }

    const userDoc = await User.findById(user._id);
    if (userDoc) {
      const device = req.body.device || "Unknown Device";
      const location = req.body.location || "Unknown Location";

      userDoc.sessions.push({
        device,
        location,
        lastActive: new Date(),
        token,
      });

      await userDoc.save();
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: user,
    });
  }),

  getAllUsers: asyncHandler(async (req, res) => {
    const result = await getAllUsersService();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      totalUsers: result.totalUsers,
      data: result.users,
    });
  }),

  getFilteredUsers: asyncHandler(async (req, res) => {
    const users = await fetchFilteredUsersService(req.query);

    res.status(200).json({
      success: true,
      message: "Profiles filtered successfully",
      count: users.length,
      data: users,
    });
  }),

  getUserById: asyncHandler(async (req, res) => {
    const user = await getUserByIdService(req.params.id);

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  }),

  getMyModerationStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const statusData = await getModerationStatusService(id);

    res.status(200).json({
      success: true,
      data: {
        moderationStatus: statusData.moderationStatus,
        reason: statusData.reportReason || "",
      },
    });
  }),

  updateUser: asyncHandler(async (req, res) => {
    req.body = cleanBody(req.body);

    if (req.files && req.files.length > 0) {
      req.body.photos = req.files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        isPrimary: index === 0,
      }));
    }

    const updatedUser = await updateUserService(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  }),

  getPreBoardingOptions: asyncHandler(async (req, res) => {
    const data = await preOnboardingOptionsServie();

    res.status(200).json({
      data,
    });
  }),

  changePassword: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      });
    }

    const user = await User.findById(id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect old password",
      });
    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  }),

  blockUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { targetUserId } = req.body;

    if (id === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot block yourself",
      });
    }

    const user = await User.findById(id);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.blockedProfiles.includes(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "Profile is already blocked",
      });
    }

    user.blockedProfiles.push(targetUserId);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile blocked successfully",
    });
  }),

  unblockUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { targetUserId } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.blockedProfiles = user.blockedProfiles.filter(
      (blockedId) => blockedId.toString() !== targetUserId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile unblocked successfully",
    });
  }),

  getBlockedUsers: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id).populate(
      "blockedProfiles",
      "fullName gender photos"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user.blockedProfiles,
    });
  }),

  deactivateAccount: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { duration } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not foundss",
      });
    }

    user.isActive = false;

    if (duration === "2_DAYS") {
      user.deactivatedUntil = new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000
      );
    } else if (duration === "7_DAYS") {
      user.deactivatedUntil = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      );
    } else {
      user.deactivatedUntil = null;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
      data: {
        isActive: user.isActive,
        deactivatedUntil: user.deactivatedUntil,
      },
    });
  }),

  activateAccount: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = true;
    user.deactivatedUntil = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Account activated successfully",
      data: {
        isActive: user.isActive,
      },
    });
  }),

  hideProfile: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { duration } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isHidden = true;

    if (duration === "2_DAYS") {
      user.hiddenUntil = new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000
      );
    } else if (duration === "7_DAYS") {
      user.hiddenUntil = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      );
    } else {
      user.hiddenUntil = null;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile hidden successfully",
      data: {
        isHidden: user.isHidden,
        hiddenUntil: user.hiddenUntil,
      },
    });
  }),

  unhideProfile: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isHidden = false;
    user.hiddenUntil = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile unhidden successfully",
      data: {
        isHidden: user.isHidden,
      },
    });
  }),

  deleteAccount: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  }),

  getActiveSessions: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select("sessions");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user.sessions,
    });
  }),

  terminateSession: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { sessionId } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.sessions = user.sessions.filter(
      (session) => session._id.toString() !== sessionId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Session terminated successfully",
    });
  }),

  searchUsersAdmin: asyncHandler(async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let query = {};
    if (q) {
      query = {
        $or: [
          { fullName: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } }
        ]
      };
    }

    const totalItems = await User.countDocuments(query);
    const users = await User.find(query)
      .select("fullName email gender photos isActive moderationStatus")
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limitNumber),
        currentPage: pageNumber,
        limit: limitNumber
      },
      data: users
    });
  }),

  searchBlockedUsers: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { q } = req.query;

    let matchCriteria = {};
    if (q) {
      matchCriteria = { fullName: { $regex: q, $options: "i" } };
    }

    const user = await User.findById(id).populate({
      path: "blockedProfiles",
      match: matchCriteria,
      select: "fullName gender photos"
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user.blockedProfiles
    });
  }),

  getDeactivatedUsersAdmin: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const query = { isActive: false };

    const totalItems = await User.countDocuments(query);
    const users = await User.find(query)
      .select("fullName email gender photos isActive deactivatedUntil moderationStatus")
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limitNumber),
        currentPage: pageNumber,
        limit: limitNumber
      },
      data: users
    });
  })
};

module.exports = userController;