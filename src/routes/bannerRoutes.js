const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const bannerController = require('../controllers/bannerController');
const { verifyAdmin } = require("../middlewares/authMiddleware");




router.post('/create', verifyAdmin, upload.single('image'), bannerController.createBanner);

router.get('/search', verifyAdmin, bannerController.searchBanners);

router.get('/all',verifyAdmin, bannerController.getBanners);

router.delete('/delete/:id', verifyAdmin, bannerController.deleteBanner);

module.exports = router;