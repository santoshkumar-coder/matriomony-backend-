const asyncHandler = require("../utils/asyncHandler");
const cleanBody = require("../utils/cleanBody");
const Ticket = require("../models/Ticket");

const ticketController = {
  raiseTicket: asyncHandler(async (req, res) => {
    req.body = cleanBody(req.body);

    if (req.files && req.files.length > 0) {
      req.body.photo = `/uploads/${req.files[0].filename}`;
    }

    const ticket = await Ticket.create({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
      photo: req.body.photo || "",
    });

    res.status(201).json({
      success: true,
      message: "Ticket raised successfully",
      data: ticket,
    });
  }),

  getMyTickets: asyncHandler(async (req, res) => {
    const tickets = await Ticket.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      data: tickets,
    });
  }),

  getAllTickets: asyncHandler(async (req, res) => {
    const { status } = req.query;
    const query = status ? { status } : {};
    const tickets = await Ticket.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  }),

  resolveTicket: asyncHandler(async (req, res) => {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        status: "Resolved",
        resolvedBy: req.admin._id,
        resolvedAt: Date.now(),
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Ticket status updated to Resolved",
      data: updatedTicket,
    });
  }),

  searchTickets: asyncHandler(async (req, res) => {
    const { keyword } = req.query;
    const tickets = await Ticket.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).populate("user", "name email");

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  }),

  getResolvedTickets: asyncHandler(async (req, res) => {
    const tickets = await Ticket.find({ status: "Resolved" })
      .populate("user", "name email")
      .populate("resolvedBy", "name");

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  }),

  getTopFiveTickets: asyncHandler(async (req, res) => {
    const tickets = await Ticket.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      data: tickets,
    });
  }),

  getUnresolvedTickets: asyncHandler(async (req, res) => {
    const tickets = await Ticket.find({ status: "Pending" })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  }),
};

module.exports = ticketController;
