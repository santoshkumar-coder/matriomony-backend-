const asyncHandler = require("../utils/asyncHandler");

const {
  createTicketService,
  getMyTicketsService,
  getAllTicketsService,
  updateTicketService,
  ticketStatsService,
} = require("../services/ticketServices.js");


const ticketController = {

  // CREATE ticket controller
  createTicket: asyncHandler(async (req, res) => {
    const { subject, message, priority } = req.body;

    const ticket = await createTicketService({
      userId: req.user.id,
      subject,
      message,
      priority,
    });

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: ticket,
    });
  }),


  // USER TICKETS controller
  myTickets: asyncHandler(async (req, res) => {
    const tickets = await getMyTicketsService(req.user.id);

    res.status(200).json({
      success: true,
      message: "User tickets fetched successfully",
      data: tickets,
    });
  }),


  // ADMIN ALL
  getAllTickets: asyncHandler(async (req, res) => {
    const tickets = await getAllTicketsService();

    res.status(200).json({
      success: true,
      message: "All tickets fetched successfully",
      total: tickets.length,
      data: tickets,
    });
  }),


  // UPDATE
  updateTicket: asyncHandler(async (req, res) => {
    const { status, adminReply } = req.body;

    const ticket = await updateTicketService({
      ticketId: req.params.id,
      status,
      adminReply,
    });

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: ticket,
    });
  }),


  // STATS
  ticketStats: asyncHandler(async (req, res) => {
    const stats = await ticketStatsService();

    res.status(200).json({
      success: true,
      message: "Ticket stats fetched successfully",
      data: stats,
    });
  }),
};


module.exports = ticketController;