const Post = require("../../models/post");
const { authMiddleware } = require("../auth/auth-controller");

// Create a new post
const createPost = async (req, res) => {
  try {
    const { content, language, imageUrl, location, feeling } = req.body;
    
    // Create new post
    const newPost = new Post({
      content,
      author: req.user.userId, // From auth middleware
      language,
      imageUrl,
      location,
      feeling,
    });

    // Save post
    await newPost.save();

    // Populate author details
    await newPost.populate("author", "name email");

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: "Error creating post",
      error: error.message,
    });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: error.message,
    });
  }
};

// Like/Unlike a post
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const likeIndex = post.likes.indexOf(req.user.userId);
    
    if (likeIndex === -1) {
      // Like the post
      post.likes.push(req.user.userId);
    } else {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: likeIndex === -1 ? "Post liked" : "Post unliked",
      likes: post.likes,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({
      success: false,
      message: "Error toggling like",
      error: error.message,
    });
  }
};

// Add a comment to a post
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.comments.push({
      user: req.user.userId,
      text,
    });

    await post.save();
    await post.populate("comments.user", "name email");

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comments: post.comments,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: "Error adding comment",
      error: error.message,
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  toggleLike,
  addComment,
}; 



