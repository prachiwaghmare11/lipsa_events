const mongoose = require("mongoose");

/**
 * Portfolio Schema
 * Defines the structure for a portfolio item in MongoDB.
 * The data is primarily used by the frontend's PortfolioSection.
 */
const PortfolioSchema = new mongoose.Schema({
  // Unique identifier for the portfolio item
  // Note: MongoDB automatically adds an '_id' field, but defining a main ID can be helpful if you want custom logic.
  // We will keep it simple and rely on Mongoose's default _id.

  // The category used for filtering on the frontend (e.g., 'wedding', 'birthday')
  category: {
    type: String,
    required: true,
    enum: [
      "wedding",
      "birthday",
      "babyshower",
      "garba",
      "kitty",
      "corporate",
      "all",
    ], // Restrict to known categories
    trim: true,
  },

  // The main title of the event
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },

  // A brief description or caption for the event
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },

  // Optional: URL to the image for this portfolio item (if you upgrade the frontend)
  imageUrl: {
    type: String,
    trim: true,
    default: "placeholder_image_url.jpg",
  },

  // Date when the event was added to the portfolio
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);
