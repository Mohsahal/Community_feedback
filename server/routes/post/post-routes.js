const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const {
  createPost,
  getAllPosts,
  toggleLike,
  addComment,
} = require("../../controllers/post/post-controller");

// Create a new post (protected route)
router.post("/posts", authMiddleware, createPost);

// Get all posts
router.get("/posts", getAllPosts);

// Like/Unlike a post (protected route)
router.post("/posts/:postId/like", authMiddleware, toggleLike);

// Add a comment to a post (protected route)
router.post("/posts/:postId/comment", authMiddleware, addComment);

module.exports = router; 