const Post = require("../../models/post");
const { authMiddleware } = require("../auth/auth-controller");
const cloudinary = require('../../config/cloudinary');
const fs = require('fs');
const path = require('path');
// Create a new post
// const createPost = async (req, res) => {
//   try {
//     const { content, language, imageUrl, location, feeling } = req.body;
    
//     // Create new post
//     const newPost = new Post({
//       content,
//       author: req.user.userId, // From auth middleware
//       language,
//       imageUrl,
//       location,
//       feeling,
//     });


//     // Save post
//     await newPost.save();

//     // Populate author details
//     await newPost.populate("author", "name email");

//     res.status(201).json({
//       success: true,
//       message: "Post created successfully",
//       post: newPost,
//     });
//   } catch (error) {
//     console.error("Error creating post:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error creating post",
//       error: error.message,
//     });
//   }
// };

// Get all posts
// const getAllPosts = async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate("author", "name email")
//       .populate("comments.user", "name email")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       posts,
//     });
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching posts",
//       error: error.message,
//     });
//   }
// };


const createPost = async (req, res) => {
  try {
    const { content, language } = req.body;
    let imageUrl = '';
    let imagePublicId = '';
    let uploadedFilePath = null;

    // Handle image upload if file is present
    if (req.file) {
      uploadedFilePath = req.file.path;
      try {
        console.log('Uploading file to Cloudinary:', req.file.path);
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'community_posts',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        });
        console.log('Cloudinary upload result:', result);
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;

        // Clean up the uploaded file after successful Cloudinary upload
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
          console.log('Local file deleted after Cloudinary upload');
        }
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        // Clean up the uploaded file if Cloudinary upload fails
        if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
          fs.unlinkSync(uploadedFilePath);
          console.log('Local file deleted after Cloudinary upload error');
        }
        throw uploadError;
      }
    }

    // Get the user ID from the request object
    const userId = req.user.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    console.log('Creating post with data:', { content, userId, language, imageUrl });
    
    const post = new Post({
      content,
      author: userId, // Use the correct user ID field
      language,
      imageUrl,
      imagePublicId
    });

    const savedPost = await post.save();
    console.log('Post saved successfully:', savedPost);
    
    await savedPost.populate('author', 'name avatar');
    
    res.status(201).json({
      success: true,
      post: savedPost
    });
  } catch (error) {
    console.error('Error creating post:', error);
    
    // Clean up any uploaded file if there was an error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('Local file deleted after post creation error');
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: error.message
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts'
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

    const userId = req.user.userId;
    const likeIndex = post.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      // Like the post
      post.likes.push(userId);
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

    const userId = req.user.userId;
    
    post.comments.push({
      user: userId,
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



