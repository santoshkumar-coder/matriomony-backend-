// src/models/matchModel.js

const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    candidateId: { type: String, required: true },
    score: {
      type: Number,
    },
    matchTimestamp: {
      type: Date,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
    _class: {
      type: String,   // Java Spring Data adds this field automatically
    },
  },
  {
    timestamps: false,          // Java is managing timestamps via matchTimestamp
    collection: 'matches',      // ✅ must match exact MongoDB collection name
  }
);

module.exports = mongoose.model('Match', matchSchema);