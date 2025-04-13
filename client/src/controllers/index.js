import axios from 'axios';
import { toast } from 'react-toastify';

// Configure Axios
axios.defaults.withCredentials = true;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Export configured axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// Format post data
export const formatPost = (post) => {
  if (!post) return null;
  return {
    _id: post._id,
    content: post.content || "",
    imageUrl: post.imageUrl || "",
    createdAt: post.createdAt || new Date().toISOString(),
    author: {
      name: post.author?.name || "Unknown User",
      avatar: post.author?.avatar || "https://github.com/shadcn.png",
    },
    likes: Array.isArray(post.likes) ? post.likes : [],
    comments: Array.isArray(post.comments) ? post.comments : [],
    tags: Array.isArray(post.tags) ? post.tags : [],
    location: post.location || "",
  };
};

// Handle image selection
export const handleImageChange = (e, setImageFile) => {
  const file = e.target.files[0];
  if (file) {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG)");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    toast.info("Image selected! It will be uploaded when you post.");
  }
};

// Handle post submission
export const handlePostSubmit = async (postData, setLoading, setNewPost, setImageFile, setPosts, setLiked, userId) => {
  const { content, language, imageFile } = postData;
  
  if (!content.trim() && !imageFile) {
    toast.error("Please add text or an image to post.");
    return;
  }

  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("content", content);
    formData.append("language", language);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await axios.post(`${API_BASE_URL}/posts/posts`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data && response.data.success) {
      toast.success("Post shared successfully!");
      setNewPost("");
      setImageFile(null);

      const postsResponse = await axios.get(`${API_BASE_URL}/posts/posts`);
      if (postsResponse.data && postsResponse.data.success) {
        const formattedPosts = postsResponse.data.posts
          .map(formatPost)
          .filter((post) => post !== null);
        setPosts(formattedPosts);

        const likedState = {};
        formattedPosts.forEach((post) => {
          likedState[post._id] = Array.isArray(post.likes) && post.likes.includes(userId);
        });
        setLiked(likedState);
      }
    }
  } catch (error) {
    console.error("Error posting:", error);
    toast.error("Failed to share post. Please try again.");
  } finally {
    setLoading(false);
  }
};

// Handle like/unlike post
export const handleLikePost = async (postId, setLiked, setPosts) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/posts/posts/${postId}/like`);
    if (response.data && response.data.success) {
      setLiked((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    toast.error("Failed to like/unlike post.");
  }
};

// Handle adding a comment
export const handleAddComment = async (postId, commentText, setPosts, setCommentText) => {
  if (!commentText || !commentText.trim()) return;

  try {
    const response = await axios.post(`${API_BASE_URL}/posts/posts/${postId}/comment`, {
      text: commentText,
    });

    if (response.data && response.data.success) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments: response.data.comments } : post
        )
      );
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
      toast.success("Comment added successfully!");
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    toast.error("Failed to add comment.");
  }
};


