const spamService = require("../services/spam.service");

class SpamController {
  async getDashboardStats(req, res) {
    try {
      const stats = await spamService.getStats();
      res.status(200).json({ success: true, data: stats });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async handleSearch(req, res) {
    try {
        const { q } = req.query; 
        const results = await spamService.searchSpamUsers(q);
        
        res.status(200).json({
            success: true,
            count: results.length,
            users: results
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}



  async getSpamList(req, res) {
    try {
      const data = await spamService.getSpamUsers(req.query);
      res.status(200).json({ success: true, ...data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async toggleBlock(req, res) {
    try {
      const user = await spamService.blockToggle(req.params.id);
      res.status(200).json({ success: true, message: `User ${user.isBlocked ? 'Blocked' : 'Unblocked'}` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async deleteUser(req, res) {
    try {
      await spamService.deleteUser(req.params.id);
      res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}



module.exports = new SpamController();