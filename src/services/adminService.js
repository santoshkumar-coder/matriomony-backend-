const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class AdminService {
    async registerAdmin(adminData) {
        const { email } = adminData;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            throw new Error("Admin with this email already exists");
        }

        const newAdmin = new Admin(adminData);
        await newAdmin.save();

        const adminResponse = newAdmin.toObject();
        delete adminResponse.password;

        return adminResponse;
    }

    async loginAdmin(email, password) {
        const admin = await Admin.findOne({ email }).select("+password");
        if (!admin) {
            throw new Error("Invalid email or password");
        }

        if (!admin.isActive) {
            throw new Error("Your account is deactivated. Contact Super Admin.");
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return {
            token,
            admin: {
                id: admin._id,
                fullName: admin.fullName,
                email: admin.email,
                role: admin.role,
            },
        };
    }
}

module.exports = new AdminService();