const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middlewares/authMiddleware');

router.post('/register', adminController.register);
router.post('/login', adminController.login);

router.get('/stats', verifyAdmin, adminController.getStats);
router.get('/all-users', verifyAdmin, adminController.getAllUsersForAdmin);
router.get('/profiles', verifyAdmin, adminController.getProfiles);
router.get('/pending-profiles', verifyAdmin, adminController.getPendingProfiles);
router.put('/moderate/:userId', verifyAdmin, adminController.moderateProfile);
router.get('/block-relations', verifyAdmin, adminController.getBlockedRelations);
router.get("/user-matches/:userId", verifyAdmin, adminController.getUserMatchDetails);

module.exports = router;