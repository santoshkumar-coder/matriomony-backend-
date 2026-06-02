const mongoose = require("mongoose");

const savedSearchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    minAge: {
      type: Number,
    },
    maxAge: {
      type: Number,
    },
    professions: {
      type: [String],
      default: [],
    },
    locations: {
      type: [String],
      default: [],
    },
    religions: {
      type: [String],
      default: [],
    },
    motherTongues: {
      type: [String],
      default: [],
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isVerifiedOnly: {
      type: Boolean,
      default: false,
    },
    specialTags: {
      type: [String],
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SavedSearch", savedSearchSchema);