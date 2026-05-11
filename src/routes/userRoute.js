const userController = require('../controllers/userController');
const router = require('express').Router();
const validate = require("../middlewares/validate");
const { createUserSchema } = require("../validators/user.validator");

router.post('/create', validate(createUserSchema), userController.createUser);
router.get('/get-all-users', userController.getAllUsers);


module.exports = router;

