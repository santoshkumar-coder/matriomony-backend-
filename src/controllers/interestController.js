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



const getUserInterestsForAdmin = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const { userId } = req.params;
        const user = await User.findById(userId).populate(
            "interestsSent",
            "fullName photos gender dob city country religion motherTongue profession"
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            totalSent: user.interestsSent.length,
            interestsSent: user.interestsSent
        });
    } catch (error) {s
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    sendInterest,
    acceptInterest,
    // declineInterest,
    getSentInterests,
    // getAcceptedInterests,
    getReceivedInterests,
    getUserInterestsForAdmin
};