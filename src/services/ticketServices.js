const Ticket = require("../models/ticketModel.js");


// CREATE TICKET
const createTicketService = async ({
  userId,
  subject,
  message,
  priority,
}) => {
  const ticket = await Ticket.create({
    user: userId,
    subject,
    message,
    priority,
  });

  return ticket;
};


// USER TICKETS
const getMyTicketsService = async (userId) => {
  return await Ticket.find({
    user: userId,
  }).sort({ createdAt: -1 });
};


// ADMIN ALL TICKETS
const getAllTicketsService = async () => {
  return await Ticket.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};


// UPDATE TICKET
const updateTicketService = async ({
  ticketId,
  status,
  adminReply,
}) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  ticket.status = status || ticket.status;
  ticket.adminReply = adminReply || ticket.adminReply;

  await ticket.save();

  return ticket;
};


// STATS
const ticketStatsService = async () => {
  const open = await Ticket.countDocuments({
    status: "OPEN",
  });

  const pending = await Ticket.countDocuments({
    status: "PENDING",
  });

  const resolved = await Ticket.countDocuments({
    status: "RESOLVED",
  });

  const urgent = await Ticket.countDocuments({
    priority: "HIGH",
  });

  return {
    open,
    pending,
    resolved,
    urgent,
  };
};


// EXPORTS
module.exports = {
  createTicketService,
  getMyTicketsService,
  getAllTicketsService,
  updateTicketService,
  ticketStatsService,
};