const mongoose = require("mongoose");

const successStorySchema = new mongoose.Schema(
  {
    partner1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    partner2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    story: {
      type: String,
      required: true,
    },
    marriageYear: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String, 
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SuccessStory", successStorySchema);