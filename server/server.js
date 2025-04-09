require("dotenv").config(); // Load environment variables
const authRoutes = require('./routes/auth/auth-routes');

const postRoutes = require('./routes/post/post-routes');
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser()); // Add cookie-parser middleware

// Configure CORS to allow credentials
app.use(
  cors({
    origin: ["http://localhost:5173"], // Allow both frontend URLs
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true, // This is important for cookies
    exposedHeaders: ["set-cookie"]
  })
);

// Connect to MongoDB (Ensure MONGO_URI is in .env file)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.error(" MongoDB Connection Error:", err.message));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// **Start Server**
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
