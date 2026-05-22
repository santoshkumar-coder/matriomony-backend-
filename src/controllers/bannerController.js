const Banner = require('../models/Banner');



exports.createBanner = async (req, res) => {
    try {
        const { title, description, position } = req.body; 

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const baseUrl = process.env.BASE_URL ;
        const liveImageUrl = `${baseUrl}/uploads/${req.file.filename}`;

        const newBanner = new Banner({
            title,
            description,
            imageUrl: liveImageUrl,
            position: position 
        });

        await newBanner.save();

        res.status(201).json({
            success: true,
            message: "Banner created successfully",
            data: newBanner
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        const total = await Banner.countDocuments();
        const active = await Banner.countDocuments({ isActive: true });

        res.status(200).json({
            stats: { totalBanners: total, activeBanners: active },
            banners
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};