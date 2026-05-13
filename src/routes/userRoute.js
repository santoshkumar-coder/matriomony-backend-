const userController = require('../controllers/userController');
const router = require('express').Router();
const validate = require("../middlewares/validate");
const { createUserSchema } = require("../validators/user.validator");
const upload = require('../config/multer'); 

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */


/**
 * @swagger
 * /api/v1/user/create:
 *   post:
 *     summary: create new user
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/create', validate(createUserSchema), upload.array('images', 5), userController.createUser);
/**
 * @swagger
 * /api/v1/user/get-all-users:
 *   get:
 *     summary: get all users
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/get-all-users', userController.getAllUsers);


module.exports = router;

