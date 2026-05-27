const router = require('express').Router();
const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const { createUserSchema } = require('../validators/user.validator');
const upload = require('../config/multer');

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

router.post('/create', upload.array('images', 5), parseJsonFields, validate(createUserSchema), userController.createUser);
router.get('/get-all-users', userController.getAllUsers);
router.get('/get-user/:id', userController.getUserById);
router.get('/filtered-users', userController.getFilteredUsers);
router.get('/getModerateStatus/:id', userController.getMyModerationStatus);
router.put('/update-user/:id', upload.array('images', 5), parseJsonFields, userController.updateUser);
router.post('/login', userController.loginUser);
router.get('/pre-boarding-options', userController.getPreBoardingOptions);

module.exports = router;