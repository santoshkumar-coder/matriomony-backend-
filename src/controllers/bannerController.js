const Banner = require("../models/Banner");
const fs = require("fs");
const path = require("path");

exports.createBanner = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);
    const { title, description, position } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    let baseUrl = process.env.BASE_URL || "http://187.127.137.216:5000";
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }
    const protocol = req.protocol; // http or https
    const host = req.get("host");
    const liveImageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    const newBanner = new Banner({
      title,
      description,
      imageUrl: liveImageUrl,
      position: position,
    });

    await newBanner.save();

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: newBanner,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

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
      banners,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchBanners = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let query = {};
    if (q) {
      query = {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
          { position: { $regex: q, $options: "i" } },
        ],
      };
    }

    const totalItems = await Banner.countDocuments(query);
    const banners = await Banner.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limitNumber),
        currentPage: pageNumber,
        limit: limitNumber,
      },
      banners,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(400).json({
        sucess: false,
        message: "Banner not Found",
      });
    }

    if (banner.imageUrl) {
      const filename = banner.imageUrl.split("/").pop();

      const filePath = path.join(__dirname, "../uploads", filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Banner.findByIdAndDelete(id);

    res.status(200).json({
      sucess: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};
