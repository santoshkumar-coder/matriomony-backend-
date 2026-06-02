const mongoose = require("mongoose");

const successStorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    coupleName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    weddingDate: {
      type: Date,
      required: true,
    },
    yearsTogether: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      }
    ],
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SuccessStory", successStorySchema);