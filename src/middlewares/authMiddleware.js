const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {

    /* =========================
       Get Token
    ========================= */

    let token = null;

    // From Cookies
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // From Headers
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    /* =========================
       Token Missing
    ========================= */

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Token missing",
      });
    }

    /* =========================
       Verify Token
    ========================= */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /* =========================
       Attach User
    ========================= */

    req.user = decoded;

    next();

  } catch (error) {

    console.log("Auth Middleware Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;