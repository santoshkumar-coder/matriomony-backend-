const dashBoardService = require("../services/dashboardStatsService");

const getUserStats = async (req, res) => {
  try {
    const stats = await dashBoardService.getUserStatsFromDB();

    return res.status(200).json({
      success: true,
      message: "Stats and User data fetched successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error in getUserStats Controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const searchUsers = async (req, res) => {
  try {
    // req.query se saare search params service ko pass karein
    const users = await dashBoardService.searchUsersInDB(req.query);

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Search Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while searching users",
      error: error.message,
    });
  }
};

module.exports = {
  getUserStats,
  searchUsers
};