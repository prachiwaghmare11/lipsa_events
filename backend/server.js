const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer"); // ⬅️ For handling file uploads (multipart/form-data)
const cloudinary = require("cloudinary").v2; // ⬅️ For cloud storage

const Booking = require("./models/Booking");
const Portfolio = require("./models/Portfolio");
const Testimonial = require("./models/Testimonial");
const PortfolioItem = require("./models/PortfolioItem");
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

// --- Multer Configuration ---
// We use memory storage for temporary file handling before uploading to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Cloudinary Configuration ---
// Make sure these variables are set in your server/.env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(cors()); // Allows cross-origin requests from the React client
app.use(express.json()); // To parse JSON bodies

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ===========================================
//           UPDATED API ROUTE (Portfolio)
// ===========================================

/**
 * Handles media upload (Image or Video) to Cloudinary
 * and saves the resulting URL to MongoDB.
 * The form field for the file must be named 'media'.
 */
app.post("/api/portfolio", upload.single("media"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No media file provided." });
    }

    // 1. Upload file buffer to Cloudinary
    // Use auto detection for resource type (image or video)
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "lipsa-events-portfolio", // Folder in your Cloudinary account
        resource_type: "auto", // Auto-detects if it's an image or video
        chunk_size: 6000000, // Recommended for large files like videos
      }
    );

    const mediaType = result.resource_type;
    let updateFields = {
      title: req.body.title || "Untitled Event",
      description: req.body.description || "",
      category: req.body.category || "other",
    };

    // 2. Determine and save the correct URL field (imageUrl or videoUrl)
    if (mediaType === "image") {
      updateFields.imageUrl = result.secure_url;
    } else if (mediaType === "video") {
      updateFields.videoUrl = result.secure_url;
    } else {
      return res
        .status(400)
        .json({ message: "Unsupported media type uploaded." });
    }

    // 3. Save the new portfolio item to MongoDB
    const newPortfolioItem = new PortfolioItem(updateFields);
    await newPortfolioItem.save();

    res.status(201).json({
      message: "Portfolio item created successfully!",
      item: newPortfolioItem,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res
      .status(500)
      .json({
        message: "Failed to upload and save portfolio item.",
        error: error.message,
      });
  }
});

/**
 * Route to fetch all portfolio items
 */
app.get("/api/portfolio", async (req, res) => {
  try {
    const items = await PortfolioItem.find({});
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch portfolio items." });
  }
});

// ===========================================
//           Other API ROUTES (Bookings)
// ===========================================

app.post("/api/bookings", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res
      .status(201)
      .json({ message: "Booking request received!", booking: newBooking });
  } catch (error) {
    console.error("Error saving booking:", error);
    res
      .status(500)
      .json({ message: "Failed to submit booking.", error: error.message });
  }
});

app.get("/api/", async (req, res) => {
  try {
    res.status(201).json({ message: "API request received!" });
  } catch (error) {
    console.error("Error saving booking:", error);
    res
      .status(500)
      .json({ message: "Failed to request API.", error: error.message });
  }
});

// Serve the static React build files in production (Keep this for deployment)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
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
