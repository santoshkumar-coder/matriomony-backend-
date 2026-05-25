const User = require("../models/userModel");

class SpamService {
  async getStats() {
    const [detected, review, banned, clean] = await Promise.all([
      User.countDocuments({ isReported: true }),
      User.countDocuments({ isReported: true, isBlocked: false }),
      User.countDocuments({ isBlocked: true }),
      User.countDocuments({ isReported: false, isBlocked: false }),
    ]);

    return {
      spamDetected: detected,
      underReview: review,
      bannedAccounts: banned,
      cleanUsers: clean,
    };
  }

  async searchSpamUsers(searchTerm) {
    if (!searchTerm) return [];
    const filter = {
        $and: [
            { $or: [{ isReported: true }, { isBlocked: true }] }, 
            {
                $or: [
                    { fullName: { $regex: searchTerm, $options: "i" } },
                    { email: { $regex: searchTerm, $options: "i" } }   
                ]
            }
        ]
    };

    const users = await User.find(filter)
        .select("fullName email photos isReported isBlocked createdAt reportReason")
        .limit(20); 

    return users.map(u => ({
        id: u._id,
        name: u.fullName,
        email: u.email,
        avatar: u.photos?.find(p => p.isPrimary)?.url || u.photos[0]?.url || "",
        reason: u.reportReason || "Multiple Reports",
        status: u.isBlocked ? "Banned" : (u.isReported ? "Detected" : "Pending"),
        joined: u.createdAt
    }));
}


  async getSpamUsers(query) {
    const { page = 1, limit = 10, search = "" } = query;
    const skip = (page - 1) * limit;

    let filter = { $or: [{ isReported: true }, { isBlocked: true }] };

    if (search) {
      filter.$and = [
        { $or: [{ isReported: true }, { isBlocked: true }] },
        {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
          ]
        }
      ];
    }

    const users = await User.find(filter)
      .select("fullName email photos isReported isBlocked createdAt reportReason") 
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    console.log("Raw Users from DB:", JSON.stringify(users, null, 2));

    const total = await User.countDocuments(filter);

    const formattedData = users.map(u => ({
      id: u._id,
      name: u.fullName,
      email: u.email,
      avatar: u.photos?.find(p => p.isPrimary)?.url || u.photos[0]?.url || "",
      
      // Logic: Agar reportReason empty string hai toh fallback dikhao
      reason: (u.reportReason && u.reportReason.trim() !== "") ? u.reportReason : "Multiple Reports", 
      
      status: u.isBlocked ? "Banned" : (u.isReported ? "Detected" : "Pending"),
      joined: u.createdAt
    }));

    return { users: formattedData, total, totalPages: Math.ceil(total / limit) };
  }

  async blockToggle(id) {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    user.isBlocked = !user.isBlocked;
    return await user.save();
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }
}



module.exports = new SpamService();