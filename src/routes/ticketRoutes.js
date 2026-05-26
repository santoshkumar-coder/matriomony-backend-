const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { authMiddleware, verifyAdmin } = require("../middlewares/authMiddleware");
const upload = require("../config/multer"); 

router.post(
  "/raise", 
  authMiddleware, 
  upload.any(), 
  ticketController.raiseTicket
);

router.get(
  "/my-tickets", 
  authMiddleware, 
  ticketController.getMyTickets
);

router.get(
  "/admin/all", 
  verifyAdmin, 
  ticketController.getAllTickets
);

router.patch(
  "/admin/resolve/:id", 
  verifyAdmin, 
  ticketController.resolveTicket
);

module.exports = router;