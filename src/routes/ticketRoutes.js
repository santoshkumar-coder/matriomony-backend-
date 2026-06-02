const express = require("express");
const ticketControllers = require("../controllers/ticketControllers");


const { isAuthenticated, verifyAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", isAuthenticated, ticketControllers.createTicket);
router.get("/my", isAuthenticated, ticketControllers.myTickets);

router.get("/admin/all", verifyAdmin, ticketControllers.getAllTickets);
router.put("/admin/update/:id", verifyAdmin, ticketControllers.updateTicket);
router.get("/admin/stats", verifyAdmin, ticketControllers.ticketStats);

module.exports = router;
// this is router for ticket related operations, it includes routes for creating a ticket, getting user's tickets, admin routes for getting all tickets, updating a ticket and getting ticket statistics.