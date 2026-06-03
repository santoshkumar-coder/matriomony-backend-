const router = require("express").Router();
const { 
  getRecentlyJoined, 
  searchUsers 
} = require("../controllers/recentlyJoinedController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/recently-joined", authMiddleware, getRecentlyJoined);
router.get("/search", authMiddleware, searchUsers);

module.exports = router;