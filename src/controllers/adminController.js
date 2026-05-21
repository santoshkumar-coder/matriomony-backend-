const adminService = require("../services/adminService");

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