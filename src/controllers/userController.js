const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");
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
// const Matche = require("../models/matchModel") ;
const Match = require('../models/matchModel');

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
    console.log('req bdy : ', req.body);
    const { user, token } = await loginUserService(req.body);

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

  // getUserMatches: asyncHandler(async (req, res) => {
  //   const userId = req.user.id;
  //   const user = await User.findById(userId);
  //   if (!user) {
  //     return res.status(404).json({
  //       success: false,
  //       message: "User not found",
  //     });
  //   }
  //   const userIdStr = userId.toString().trim();  // ✅ convert to plain string
  //   console.log('user id:', userIdStr);
  //   console.log('type:', typeof userIdStr); // should log "string"

  //   const userMatches = await Match.find({
  //     userId: { $regex: userIdStr, $options: 'i' }
  //   }); // ✅ string match
  //   console.log('DB name:', mongoose.connection.db.databaseName); // 👈 add this
  //   console.log('matches found:', userMatches.length);

  //   // also sanity check total docs in collection
  //   const total = await Match.countDocuments();
  //   console.log('total docs in matches collection:', total);
  //   res.status(200).json({
  //     success: true,
  //     message: "User matches retrieved successfully",
  //     count: userMatches.length,
  //     data: userMatches,
  //   });


  // }),
  // getUserMatches: asyncHandler(async (req, res) => {
  //   const userId = req.user.id;
  //   const user = await User.findById(userId);
  //   if (!user) {
  //     return res.status(404).json({
  //       success: false,
  //       message: "User not found",
  //     });
  //   }



  //   // 🔍 DEBUG BLOCK
  //   const allMatches = await Match.find({
  //     userId: new mongoose.Types.ObjectId(userId) 
  //   });
  //   const Matches = await Match.find();
  //   // const first = allMatches[0];
  //   // console.log('--- DEBUG ---');
  //   // console.log('req.user.id:  ', JSON.stringify(userIdStr));
  //   // console.log('db userId:    ', JSON.stringify(first.userId));
  //   // console.log('req length:   ', userIdStr.length);
  //   // console.log('db length:    ', first.userId?.length);
  //   // console.log('equal?        ', first.userId === userIdStr);
  //   // console.log('--- END ---');
  //   console.log(`Matches found for userId ${userId}:`, allMatches);


  //   res.status(200).json({
  //     success: true,
  //     data: {
  //       // reqUserId: JSON.stringify(userIdStr),
  //       // dbUserId: JSON.stringify(first.userId),
  //       // reqLength: userIdStr.length,
  //       // dbLength: first.userId?.length,
  //       // equal: first.userId === userIdStr
  //       matches: allMatches,
  //     }
  //   });
  // }),


  getUserMatches: asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log('user id:', userId);
    console.log('type:', typeof userId); // should log "string"
    const profileMatch = (await Match.find()) // get one match to inspect
    console.log('sample match userId:', profileMatch);
    console.log('sample match userId:', profileMatch?.userId);


    // ✅ query with ObjectId
    const userMatches = await Match.find({
      userId: new mongoose.Types.ObjectId(userId)
    });

    res.status(200).json({
      success: true,
      message: "User matches retrieved successfully",
      count: userMatches.length,
      data: userMatches,
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
    const user = await getUserByIdService(req.user.id);

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

    const updatedUser = await updateUserService(
      req.user.id,
      req.body
    );

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

    const isMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );

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
      (blockedId) =>
        blockedId.toString() !== targetUserId
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
};

module.exports = userController;