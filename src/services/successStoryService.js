const SuccessStory = require("../models/SuccessStory");

class SuccessStoryService {
  async create(data) {
    return await SuccessStory.create(data);
  }

  async getAll() {
    return await SuccessStory.find({ isActive: true })
      .populate("partner1", "fullName gender photos")
      .populate("partner2", "fullName gender photos")
      .sort({ createdAt: -1 });
  }

  async getById(id) {
    const story = await SuccessStory.findById(id)
      .populate("partner1", "fullName gender photos")
      .populate("partner2", "fullName gender photos");
    
    if (!story) throw new Error("Success Story not found");
    return story;
  }

  async update(id, data) {
    const story = await SuccessStory.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!story) throw new Error("Success Story not found");
    return story;
  }

  async delete(id) {
    const story = await SuccessStory.findByIdAndDelete(id);
    if (!story) throw new Error("Success Story not found");
    return story;
  }
}

module.exports = new SuccessStoryService();