const asyncHandler = require("../utils/asyncHandler");
const { createUserService, getAllUsersService, getUserByIdService, updateUserService,getUserDashboardStatistics,fetchFilteredUsersService  } = require("../services/userService");
const cleanBody = require("../utils/cleanBody");
const userService = require("../services/userService");

const userController = {
    createUser: asyncHandler(async (req, res) => {
        req.body = cleanBody(req.body)

        if (req.files && req.files.length > 0) {

            req.body.photos = req.files.map((file, index) => ({
                url: `/uploads/${file.filename}`,
                isPrimary: index === 0,
            }));
        }

        const
            { user, totaluser } = await createUserService(req.body);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            totaluser,
            data: user,
        });
    }),

    getAllUsers: asyncHandler(async (req, res) => {
        const result = await getAllUsersService();

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            totalUsers: result.totalUsers,
            data: result.users,

        })

    }),
 getFilteredUsers: asyncHandler(async (req, res) => {
        const users = await fetchFilteredUsersService(req.query);

        res.status(200).json({
            success: true,
            message: "Profiles filtered successfully",
            count: users.length,
            data: users,
        });
    }),

    getUserById: asyncHandler(async (req, res) => {
        const user = await getUserByIdService(req.params.id);

        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: user,
        });
    }),


    updateUser: asyncHandler(async (req, res) => {
        req.body = cleanBody(req.body);

        if (req.files && req.files.length > 0) {
            req.body.photos = req.files.map((file, index) => ({
                url: `/uploads/${file.filename}`,
                isPrimary: index === 0,
            }));
        }

        const updatedUser = await updateUserService(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    })

}




module.exports = userController;
