const adminService = require("../services/adminService");
const { getUserDashboardStatistics , getAllUsersServiceForAdmin} = require("../services/userService");
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
    // Error handling
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
