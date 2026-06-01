const router = require('express').Router();
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const validate = require('../middlewares/validate');
const { createUserSchema } = require('../validators/user.validator');
const upload = require('../config/multer');
const { authMiddleware, verifyAdmin } = require('../middlewares/authMiddleware');

const parseJsonFields = (req, res, next) => {
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      const value = req.body[key].trim();
      if ((value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']'))) {
        try {
          req.body[key] = JSON.parse(value);
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: `Invalid JSON format in field: ${key}`
          });
        }
      }
    }
  }
  next();
};

router.post('/create', upload.array('photos', 5), parseJsonFields, validate(createUserSchema), userController.createUser);
router.post('/login', userController.loginUser);
router.get('/pre-boarding-options', userController.getPreBoardingOptions);
router.get('/user-matches', authMiddleware, userController.getUserMatches);

router.get('/get-all-users', authMiddleware, userController.getAllUsers);
router.get('/get-user', authMiddleware, userController.getUserById);
router.get('/filtered-users', authMiddleware, userController.getFilteredUsers);
router.get('/getModerateStatus/:id', authMiddleware, userController.getMyModerationStatus);
router.put('/update-user', authMiddleware, upload.array('photos', 5), parseJsonFields, userController.updateUser);

router.put('/change-password/:id', authMiddleware, userController.changePassword);
router.post('/block/:id', authMiddleware, userController.blockUser);
router.post('/unblock/:id', authMiddleware, userController.unblockUser);
router.get('/blocked-users/:id', authMiddleware, userController.getBlockedUsers);

router.put('/deactivate/:id', authMiddleware, verifyAdmin, userController.deactivateAccount);
router.put('/activate/:id', authMiddleware, verifyAdmin, userController.activateAccount);
router.put('/hide/:id', authMiddleware, userController.hideProfile);
router.put('/unhide/:id', authMiddleware, userController.unhideProfile);
router.delete('/delete/:id', authMiddleware, verifyAdmin, userController.deleteAccount);

router.get('/sessions/:id', authMiddleware, userController.getActiveSessions);
router.post('/sessions/terminate/:id', authMiddleware, userController.terminateSession);

module.exports = router;