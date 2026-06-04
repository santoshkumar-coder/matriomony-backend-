const Interest = require("../models/interestModel");
const User = require('../models/userModel');
const UserNotification = require('../models/userNotification')

const sendInterestService = async (fromUserId, toUserId) => {
  if (fromUserId === toUserId) {
    throw new Error("You cannot send interest to yourself");
  }

  const existing = await Interest.findOne({
    fromUser: fromUserId,
    toUser: toUserId,
  });

  if (existing) {
    throw new Error("Interest already sent already");
  }

  const interest = await Interest.create({
    fromUser: fromUserId,
    toUser: toUserId,
    status: "pending",
  });

  // Fire and forget — runs in background, doesn't block the response
  (async () => {
    try {
      const profile = await User.findById(fromUserId).select("fullName photos");

      await UserNotification.create({
        userId: toUserId, // notify the RECEIVER, not the sender
        title: "New Interest Received",
        message: `${profile?.fullName} sent you an interest request.`,
        type: "receive_interest",
        // profileImage: profile?.photos,
        profileImage:
          profile?.photos && profile.photos.length > 0
            ? profile.photos
            : 'https://www.svgrepo.com/show/335455/profile-default.svg'
      });
    } catch (err) {
      console.error("Background notification error:", err.message);
    }
  })();

  return interest;
};

const getReceivedInterestsService = async (userId) => {
  return await Interest.find({
    toUser: userId,
    status: "pending",
  }).populate("fromUser", "fullName photos profession");
};

const getSentInterestsService = async (userId) => {
  const interest = await Interest.find({
    fromUser: userId,
  }).populate("toUser", "fullName photos profession");
  const notification = aw

};

const acceptInterestService = async (interestId, userId) => {
  const interest = await Interest.findById(interestId);

  if (!interest) throw new Error("Interest not found");
  console.log(interest.toUser.toString(), userId.toString())

  if (interest.toUser.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }

  interest.status = "accepted";
  await interest.save();

  (async () => {
    try {
      const profile = await await User.findById(userId).select("fullName photos");

      await UserNotification.create({
        userId: interest?.fromUser, // notify the RECEIVER, not the sender
        title: "Interest Request Accepted",
        message: `${profile?.fullName} has accepted your interest request.`,
        type: "profile_accepted",
        profileImage:
          profile?.photos && profile.photos.length > 0
            ? profile.photos
            : 'https://www.svgrepo.com/show/335455/profile-default.svg'
      });
    } catch (err) {
      console.error("Background notification error:", err.message);
    }
  })();


  return interest;
};

const rejectInterestService = async (interestId, userId) => {
  const interest = await Interest.findById(interestId);

  if (!interest) throw new Error("Interest not found");

  if (interest.toUser.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }

  interest.status = "rejected";
  await interest.save();

  return interest;
};

module.exports = {
  sendInterestService,
  getReceivedInterestsService,
  getSentInterestsService,
  acceptInterestService,
  rejectInterestService,
};
