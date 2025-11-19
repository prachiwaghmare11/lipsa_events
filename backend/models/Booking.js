const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  eventType: { type: String, required: true },
  eventDate: { type: Date, required: true },
  guestCount: { type: String },
  budget: { type: String },
  venue: { type: String },
  message: { type: String },
  bookedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", BookingSchema);
