const userController = require('../controllers/userController');
const router = require('express').Router();
const validate = require("../middlewares/validate");
const { createUserSchema } = require("../validators/user.validator");
const upload = require('../config/multer'); 

router.post('/create', validate(createUserSchema),upload.array('images', 5), userController.createUser);
router.get('/get-all-users', userController.getAllUsers);
router.post('/login',userController.loginUser)


module.exports = router;
