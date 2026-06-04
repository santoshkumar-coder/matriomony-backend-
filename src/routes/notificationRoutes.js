const express = require("express");
const router = express.Router();
const { 
    createNotification, 
    checkPendingProfilesAlert, 
    reportUserAndNotifyAdmin,
    getSpamAccountAlerts,
    checkRecentRegistrationsAlert
} = require("../controllers/notificationController");

router.post('/register-new-notification', createNotification);
router.get('/check-pending-approvals', checkPendingProfilesAlert);
router.post('/report-user', reportUserAndNotifyAdmin);
router.get('/spam-account-alerts', getSpamAccountAlerts);
router.get('/check-recent-registrations', checkRecentRegistrationsAlert);

module.exports = router;