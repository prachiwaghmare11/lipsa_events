const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },

  // MODIFICATION: Set required to false for both image and video URLs.
  imageUrl: {
    type: String,
    required: false, // <-- FIX: This path is now optional
  },
  videoUrl: {
    type: String,
    required: false, // <-- Also optional, as the item could be an image
  },

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const PortfolioItem = mongoose.model("PortfolioItem", portfolioSchema);
module.exports = PortfolioItem;
