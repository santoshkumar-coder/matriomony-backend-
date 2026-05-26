const userController = require('../controllers/userController');
const router = require('express').Router();
const validate = require("../middlewares/validate");
const { createUserSchema } = require("../validators/user.validator");
const upload = require('../config/multer');
const { loginUserService } = require('../services/userService');
const getUsers = require('../controllers/userController');


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
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "9876667787842"
 *               email:
 *                 type: string
 *                 example: "santoshkumadsr8@void.com"
 *               password:
 *                 type: string
 *                 example: "126"
 *               role:
 *                 type: string
 *                 example: "user"
 *               profileFor:
 *                 type: string
 *                 example: "Self"
 *               fullName:
 *                 type: string
 *                 example: "Rahul Sharma"
 *               gender:
 *                 type: string
 *                 example: "Male"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1998-05-15"
 *               religion:
 *                 type: string
 *                 example: "Hindu"
 *               motherTongue:
 *                 type: string
 *                 example: "Hindi"
 *               maritalStatus:
 *                 type: string
 *                 example: "unMarried"
 *               highestQualification:
 *                 type: string
 *                 example: "B.Tech"
 *               college:
 *                 type: string
 *                 example: "IIT Delhi"
 *               workingWith:
 *                 type: string
 *                 example: "Private"
 *               profession:
 *                 type: string
 *                 example: "Software Engineer"
 *               annualIncome:
 *                 type: string
 *                 example: "10-15 LPA"
 *               familyStatus:
 *                 type: string
 *                 example: "Middle Class"
 *               familyType:
 *                 type: string
 *                 example: "Nuclear"
 *               familyValues:
 *                 type: string
 *                 example: "Moderate"
 *               fatherOccupation:
 *                 type: string
 *                 example: "Business"
 *               motherOccupation:
 *                 type: string
 *                 example: "Homemaker"
 *               aboutFamily:
 *                 type: string
 *                 example: "Simple and supportive family"
 *               partnerPreference:
 *                 type: object
 *                 properties:
 *                   ageRange:
 *                     type: object
 *                     properties:
 *                       min:
 *                         type: integer
 *                         example: 24
 *                       max:
 *                         type: integer
 *                         example: 30
 *                   heightRange:
 *                     type: object
 *                     properties:
 *                       min:
 *                         type: string
 *                         example: "5ft 2in"
 *                       max:
 *                         type: string
 *                         example: "6ft"
 *                   maritalStatus:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "Never Married"
 *                   religion:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "Hindu"
 *                   motherTongue:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: ["Hindi","Gujarati"]
 *               lifestyle:
 *                 type: object
 *                 properties:
 *                   diet:
 *                     type: string
 *                     example: "Veg"
 *                   smoking:
 *                     type: string
 *                     example: "No"
 *                   drinking:
 *                     type: string
 *                     example: "No"
 *                   interests:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: ["Travel","Music","Cricket"]
 *               aboutMe:
 *                 type: string
 *                 example: "I am a software engineer looking for a life partner."
 *               values:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: ["Honesty","Respect","Family"]
 *               lifeGoals:
 *                 type: string
 *                 example: "Build a happy family and successful career"
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: ["Coding","Traveling","Music"]
 *               horoscope:
 *                 type: object
 *                 properties:
 *                   dateOfBirth:
 *                     type: string
 *                     format: date
 *                     example: "1998-05-15"
 *                   timeOfBirth:
 *                     type: string
 *                     example: "10:30 AM"
 *                   cityOfBirth:
 *                     type: string
 *                     example: "Delhi"
 *                   gotra:
 *                     type: string
 *                     example: "Kashyap"
 *                   manglik:
 *                     type: string
 *                     example: "No"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: User created successfully
 */
router.post('/create', validate(createUserSchema), upload.array('images', 5), userController.createUser);
/**
 * @swagger
 * /api/v1/user/get-all-users:
 *   get:
 *     tags:
 *       - Users
 *     summary: get all users
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/get-all-users', userController.getAllUsers);
/**
 * @swagger
 * /api/v1/user/get-user/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get particular user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the user
 *         example: "12345"
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/get-user/:id", userController.getUserById);
/**
 * @swagger
 * /api/v1/user//update-user/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: update user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the user
 *         example: "12345"
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/filtered-users", userController.getFilteredUsers)
router.get("/getModerateStatus/:id", userController.getMyModerationStatus);
router.put("/update-user/:id", upload.array('images', 5), userController.updateUser);
router.post('/login', loginUserService);

router.get('/pre-boarding-options', userController.getPreBoardingOptions);
module.exports = router;

