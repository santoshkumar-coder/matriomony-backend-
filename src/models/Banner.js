const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true }, // Redirect link ki jagah description
    imageUrl: { type: String, required: true },    // Live image URL store hoga
    position: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);