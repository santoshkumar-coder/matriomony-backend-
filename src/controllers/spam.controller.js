const User = require("../models/userModel");

class SpamController {
  async reportUser(req, res) {
    try {
      const targetUserId = req.params.id;
      const reporterId = req.user.id;

      if (targetUserId === reporterId) {
        return res.status(400).json({ success: false, message: "Self-reporting not allowed" });
      }

      const user = await User.findById(targetUserId);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      if (!user.spamReports) user.spamReports = [];

      if (user.spamReports.includes(reporterId)) {
        return res.status(400).json({ success: false, message: "Already reported" });
      }

      user.spamReports.push(reporterId);
      user.isReported = true;
      await user.save();

      res.status(200).json({ success: true, message: "Reported successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getTopSpamUsers(req, res) {
    try {
      const topSpammers = await User.aggregate([
        {
          $match: { "spamReports.0": { $exists: true } }
        },
        {
          $addFields: { reportCount: { $size: "$spamReports" } }
        },
        {
          $sort: { reportCount: -1 }
        },
        {
          $limit: 10
        },
        {
          $project: {
            fullName: 1,
            email: 1,
            isBlocked: 1,
            reportCount: 1
          }
        }
      ]);

      res.status(200).json({ success: true, users: topSpammers });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  } 

  async getDashboardStats(req, res) {
    try {
      const totalSpamUsers = await User.countDocuments({ "spamReports.0": { $exists: true } });
      const blockedUsers = await User.countDocuments({ isBlocked: true });

      res.status(200).json({ 
        success: true, 
        data: { totalSpamUsers, blockedUsers } 
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async handleSearch(req, res) {
    try {
      const { q } = req.query;
      const results = await User.aggregate([
        {
          $match: {
            fullName: { $regex: q, $options: "i" },
            "spamReports.0": { $exists: true }
          }
        },
        {
          $addFields: { reportCount: { $size: "$spamReports" } }
        },
        {
          $sort: { reportCount: -1 }
        }
      ]);

      res.status(200).json({
        success: true,
        count: results.length,
        users: results.map(u => ({
          id: u._id,
          fullName: u.fullName,
          reportCount: u.reportCount,
          isBlocked: u.isBlocked
        }))
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getSpamList(req, res) {
    try {
      const users = await User.aggregate([
        {
          $match: { "spamReports.0": { $exists: true } }
        },
        {
          $addFields: { reportCount: { $size: "$spamReports" } }
        },
        {
          $sort: { reportCount: -1 }
        },
        {
          $project: {
            fullName: 1,
            email: 1,
            isBlocked: 1,
            reportCount: 1
          }
        }
      ]);

      res.status(200).json({ success: true, users });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async toggleBlock(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      user.isBlocked = !user.isBlocked;
      await user.save();

      res.status(200).json({ 
        success: true, 
        message: `User ${user.isBlocked ? 'Blocked' : 'Unblocked'}` 
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      
      res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new SpamController();