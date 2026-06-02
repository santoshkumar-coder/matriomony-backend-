const {
  sendInterestService,
  getReceivedInterestsService,
  getSentInterestsService,
  acceptInterestService,
  rejectInterestService,
} = require("../services/interestService");



// SEND INTEREST hai ye 
const sendInterest = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { toUserId } = req.body;

    const interest = await sendInterestService(
      fromUserId,
      toUserId
    );

    res.status(201).json({
      success: true,
      message: "Interest sent successfully",
      data: interest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



// GET RECEIVED INTERESTS
const getReceivedInterests = async (req, res) => {
  try {
    const userId = req.user.id;

    const interests =
      await getReceivedInterestsService(userId);

    res.status(200).json({
      success: true,
      data: interests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET SENT INTERESTS
const getSentInterests = async (req, res) => {
  try {
    const userId = req.user.id;

    const interests =
      await getSentInterestsService(userId);

    res.status(200).json({
      success: true,
      data: interests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ACCEPT INTEREST
const acceptInterest = async (req, res) => {
  try {
    const { interestId } = req.params;
    const userId = req.user.id;

    const interest = await acceptInterestService(
      interestId,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Interest accepted successfully",
      data: interest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



// REJECT INTEREST
const rejectInterest = async (req, res) => {
  try {
    const { interestId } = req.params;
    const userId = req.user.id;

    const interest = await rejectInterestService(
      interestId,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Interest rejected successfully",
      data: interest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
  sendInterest,
  getReceivedInterests,
  getSentInterests,
  acceptInterest,
  rejectInterest,
};