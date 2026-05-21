const matchService = require("../services/match.service");

exports.getAdvancedMatches = async (req, res) => {
  try {
    const currentUser = req.user;

    const { data, total } = await matchService.getAdvancedMatches(req.body, currentUser);

    res.status(200).json({
      success: true,
      count: data.length,
      totalMatches: total,
      currentPage: req.body.page || 1,
      totalPages: Math.ceil(total / (req.body.limit || 10)),
      data: data
    });

  } catch (error) {
    console.error("Match Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};


exports.getPersonalizedMatches = async (req, res) => {
  try {
    const currentUser = req.user;

    // Check if preferences exist
    if (!currentUser.partnerPreference) {
      return res.status(400).json({ success: false, message: "Please set your partner preferences first" });
    }

    const matches = await matchService.getMyMatches(currentUser);

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};