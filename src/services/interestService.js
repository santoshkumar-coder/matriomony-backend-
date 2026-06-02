const Interest = require("../models/interestModel");

const sendInterestService = async (fromUserId, toUserId) => {
  if (fromUserId === toUserId) {
    throw new Error("You cannot send interest to yourself");
  }

  const existing = await Interest.findOne({
    fromUser: fromUserId,
    toUser: toUserId,
  });

  if (existing) {
    throw new Error("Interest already exists");
  }

  return await Interest.create({
    fromUser: fromUserId,
    toUser: toUserId,
    status: "pending",
  });
};

const getReceivedInterestsService = async (userId) => {
  return await Interest.find({
    toUser: userId,
    status: "pending",
  }).populate("fromUser", "fullName photos profession");
};

const getSentInterestsService = async (userId) => {
  return await Interest.find({
    fromUser: userId,
  }).populate("toUser", "fullName photos profession");
};

const acceptInterestService = async (interestId, userId) => {
  const interest = await Interest.findById(interestId);

  if (!interest) throw new Error("Interest not found");

  if (interest.toUser.toString() !== userId.toString()) {
    throw new Error("Not authorized");
  }

  interest.status = "accepted";
  await interest.save();

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
