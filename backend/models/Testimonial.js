const mongoose = require("mongoose");

/**
 * Testimonial Schema
 * Defines the structure for client feedback/testimonials in MongoDB.
 */
const TestimonialSchema = new mongoose.Schema({
  // The client's name
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },

  // The type of event the testimonial relates to (e.g., 'Wedding', 'Baby Shower')
  event: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },

  // The rating given, typically 1 to 5 stars
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  // The main message or quote from the client
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },

  // Date when the testimonial was added
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Testimonial", TestimonialSchema);
