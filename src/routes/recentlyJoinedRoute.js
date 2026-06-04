const router = require("express").Router();
const { 
  getRecentlyJoined, 
  searchUsers 
} = require("../controllers/recentlyJoinedController");
const { authMiddleware ,verifyAdmin} = require("../middlewares/authMiddleware");

router.get("/recently-joined", authMiddleware, verifyAdmin, getRecentlyJoined);
router.get("/search", authMiddleware, searchUsers);

module.exports = router;