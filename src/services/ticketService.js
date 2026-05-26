const Ticket = require("../models/Ticket");

const createTicketService = async (ticketData) => {
  const ticket = new Ticket(ticketData);
  return await ticket.save();
};

const getUserTicketsService = async (userId) => {
  return await Ticket.find({ user: userId }).sort({ createdAt: -1 });
};

const getAllTicketsService = async (query = {}) => {
  return await Ticket.find(query)
    .populate("user", "fullName email phone")
    .populate("resolvedBy", "fullName email")
    .sort({ createdAt: -1 });
};

const resolveTicketService = async (ticketId, adminId) => {
  return await Ticket.findByIdAndUpdate(
    ticketId,
    {
      status: "Resolved",
      resolvedBy: adminId,
      resolvedAt: new Date(),
    },
    { new: true }
  ).populate("resolvedBy", "fullName email");
};

module.exports = {
  createTicketService,
  getUserTicketsService,
  getAllTicketsService,
  resolveTicketService,
};