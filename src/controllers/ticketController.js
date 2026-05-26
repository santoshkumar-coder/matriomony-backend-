const asyncHandler = require("../utils/asyncHandler");
const cleanBody = require("../utils/cleanBody");
const {
  createTicketService,
  getUserTicketsService,
  getAllTicketsService,
  resolveTicketService,
} = require("../services/ticketService");

const ticketController = {
  raiseTicket: asyncHandler(async (req, res) => {
    req.body = cleanBody(req.body);

    if (req.files && req.files.length > 0) {
      req.body.photo = `/uploads/${req.files[0].filename}`;
    }

    const ticketData = {
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
      photo: req.body.photo || "",
    };

    const ticket = await createTicketService(ticketData);

    res.status(201).json({
      success: true,
      message: "Ticket raised successfully",
      data: ticket,
    });
  }),

  getMyTickets: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const tickets = await getUserTicketsService(userId);

    res.status(200).json({
      success: true,
      data: tickets,
    });
  }),

  getAllTickets: asyncHandler(async (req, res) => {
    const { status } = req.query;
    const query = status ? { status } : {};
    const tickets = await getAllTicketsService(query);

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  }),

  resolveTicket: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const adminId = req.admin._id;

    const updatedTicket = await resolveTicketService(id, adminId);

    res.status(200).json({
      success: true,
      message: "Ticket status updated to Resolved",
      data: updatedTicket,
    });
  }),
};

module.exports = ticketController;