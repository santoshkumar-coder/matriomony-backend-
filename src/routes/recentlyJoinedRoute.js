const router = require("express").Router();
const { getRecentlyJoined } = require("../controllers/recentlyJoinedController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/recently-joined", authMiddleware, getRecentlyJoined);

module.exports = router;