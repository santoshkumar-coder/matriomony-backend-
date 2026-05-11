const asyncHandler = require("../utils/asyncHandler");
const { createUserService, getAllUsersService } = require("../services/userService");



const userController = {
    createUser: asyncHandler(async (req, res) => {
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

    })
}

module.exports = userController;