const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ticketId: {
      type: String,
      unique: true,
    },

    subject: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },

    status: {
      type: String,
      enum: ["OPEN", "PENDING", "RESOLVED"],
      default: "OPEN",
    },

    adminReply: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// auto ticketId generator
ticketSchema.pre("save", function () {
  if (!this.ticketId) {
    const random = Math.floor(1000 + Math.random() * 9000);
    this.ticketId = `TK-${random}`;
  }
});

module.exports = mongoose.model("Ticket", ticketSchema);