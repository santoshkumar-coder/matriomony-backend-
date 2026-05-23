const express = require("express");
const router = express.Router();
const UserNotification = require("../controllers/userNotificaton");

router.post('/register-new-notificarion',  UserNotification.createNotification);    



module.exports = router;
