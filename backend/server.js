const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// --- Middleware ---
app.use(cors()); // Enable CORS for the frontend
app.use(express.json()); // Body parser for JSON requests

// --- MongoDB Connection ---
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process with failure
  });

// --- Models (Imported for use in routes) ---
const Booking = require("./models/Booking");
const Portfolio = require("./models/Portfolio");
const Testimonial = require("./models/Testimonial");

// --- API Routes ---

// 1. Portfolio & Testimonials (GET)
// Note: In a real app, this data would be fetched from the DB, but we'll use a placeholder array for simplicity.
const placeholderPortfolio = [
  {
    _id: "p1",
    category: "wedding",
    title: "Royal Wedding",
    description: "A grand celebration in Ahmedabad",
  },
  {
    _id: "p2",
    category: "birthday",
    title: "50th Birthday Bash",
    description: "Memorable celebration with family",
  },
  {
    _id: "p3",
    category: "garba",
    title: "Navratri Special",
    description: "Traditional garba night",
  },
  {
    _id: "p4",
    category: "babyshower",
    title: "Baby Shower Bliss",
    description: "Welcoming the little prince",
  },
  {
    _id: "p5",
    category: "wedding",
    title: "Destination Wedding",
    description: "Beautiful outdoor celebration",
  },
  {
    _id: "p6",
    category: "kitty",
    title: "Ladies Kitty Party",
    description: "Fun-filled afternoon gathering",
  },
];

const placeholderTestimonials = [
  {
    _id: "t1",
    name: "Priya & Raj Patel",
    event: "Wedding",
    rating: 5,
    message:
      "Dhara made our wedding absolutely magical! Her energy was contagious and she kept all our guests entertained throughout. Highly recommended!",
  },
  {
    _id: "t2",
    name: "Sneha Shah",
    event: "Baby Shower",
    rating: 5,
    message:
      "The baby shower was perfect! Dhara created such a warm and loving atmosphere.",
  },
  {
    _id: "t3",
    name: "Amit Desai",
    event: "Corporate Event",
    rating: 5,
    message:
      "Professional, punctual, and engaging! Dhara hosted our annual corporate event flawlessly.",
  },
];

app.get("/api/portfolio", (req, res) => {
  // In a production app, you would fetch from MongoDB: Portfolio.find({})
  res.status(200).json(placeholderPortfolio);
});

app.get("/api/testimonials", (req, res) => {
  // In a production app, you would fetch from MongoDB: Testimonial.find({})
  res.status(200).json(placeholderTestimonials);
});

// 2. Bookings (POST)
app.post("/api/bookings", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      eventType,
      eventDate,
      guestCount,
      budget,
      venue,
      message,
    } = req.body;

    // Validate essential fields
    if (!name || !email || !phone || !eventType || !eventDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBooking = new Booking({
      name,
      email,
      phone,
      eventType,
      eventDate,
      guestCount,
      budget,
      venue,
      message,
    });

    await newBooking.save();
    res
      .status(201)
      .json({ message: "Booking submitted successfully", booking: newBooking });
  } catch (error) {
    console.error("Booking submission error:", error);
    res.status(500).json({ message: "Server error during booking submission" });
  }
});

// --- Server Listener ---
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}. API available at http://localhost:${PORT}/api`
  );
});
