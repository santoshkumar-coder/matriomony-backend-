const express = require("express");
const { register, login, getStats, getAllUsersForAdmin, getProfiles, moderateProfile } = require("../controllers/adminController");
const { verifyAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);

router.post("/login", login)

router.get("/user-stats", verifyAdmin,getStats);


router.get("/profiles", verifyAdmin, getProfiles);

router.patch("/profiles-update/:userId/status", verifyAdmin, moderateProfile)

router.get("/get-all-users", verifyAdmin, getAllUsersForAdmin);
module.exports = router;