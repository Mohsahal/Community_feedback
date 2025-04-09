const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  createPost,
  getAllPosts,
  toggleLike,
  addComment,
} = require("../../controllers/post/post-controller");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(file.originalname.toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png) are allowed'));
  }
});

// Create a new post with image upload (protected route)
router.post("/posts", authMiddleware, upload.single('image'), createPost);

// Get all posts
router.get("/posts", getAllPosts);

// Like/Unlike a post (protected route)
router.post("/posts/:postId/like", authMiddleware, toggleLike);

// Add a comment to a post (protected route)
router.post("/posts/:postId/comment", authMiddleware, addComment);

module.exports = router; 