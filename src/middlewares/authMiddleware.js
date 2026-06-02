const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin")



const isAuthenticated = (req, res, next) => {
  try {

    let token = null;

    // cookie token
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // header token
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }


    // no token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Token missing",
      });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // attach user
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    console.log("USER SET:", req.user);

    return next();

  } catch (error) {
    console.log("Auth Middleware Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = { isAuthenticated };

const verifyAdmin = async (req, res, next) => {
  try {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "Unauthorized: Admin access only" });
    }

    const allowedRoles = ["admin", "superadmin"];
    if (!allowedRoles.includes(admin.role)) {
      return res.status(403).json({ message: "Forbidden: You don't have permission" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.log("Auth Error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { verifyAdmin, isAuthenticated };