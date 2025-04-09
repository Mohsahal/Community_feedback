import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/PostCard";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Heart, Share2, Image, Send, Smile, MapPin, ThumbsUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import translations from "@/assets/common";
import axios from "axios";

// Configure Axios to include credentials (cookies) by default
axios.defaults.withCredentials = true;

// Base URL for your API
const API_BASE_URL = "http://localhost:5000/api";

// Sample static data (for fallback or initial testing)
const trendingTopics = [
  { name: "Monsoon2023", posts: 342 },
  { name: "OrganicFarming", posts: 215 },
  { name: "DroughtResistant", posts: 189 },
  { name: "MarketPrices", posts: 167 },
  { name: "SoilHealth", posts: 134 }
];

const upcomingEvents = [
  {
    title: "Organic Farming Workshop",
    date: "June 15, 2023",
    location: "Virtual",
    type: "Workshop",
    isFree: true
  },
];

const successStories = [
  {
    name: "Raman Singh",
    location: "Madhya Pradesh",
    achievement: "Increased crop yield by 40% using AgroVerse recommendations",
    image: "https://images.unsplash.com/photo-1610824352934-c10d87b700cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    story: "After soil testing and following AgroVerse's personalized crop recommendations, my wheat yield increased dramatically."
  },
];

const CommunityPage = () => {
  const [newPost, setNewPost] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [language, setLanguage] = useState("english");
  const [liked, setLiked] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [userId, setUserId] = useState(null);
  
  const navigate = useNavigate();
  const t = translations[language] || translations.english;

  // Format post data consistently
  const formatPost = (post) => {
    if (!post) return null;
    
    return {
      _id: post._id,
      content: post.content || '',
      imageUrl: post.imageUrl || '',
      createdAt: post.createdAt || new Date().toISOString(),
      author: {
        name: post.author?.name || 'Unknown User',
        avatar: post.author?.avatar || "https://github.com/shadcn.png"
      },
      likes: Array.isArray(post.likes) ? post.likes : [],
      comments: Array.isArray(post.comments) ? post.comments : []
    };
  };

  // Check authentication and fetch posts
  useEffect(() => {
    const checkAuthAndFetchPosts = async () => {
      try {
        // Check if user is authenticated
        const authResponse = await axios.get(`${API_BASE_URL}/auth/check-auth`, {
          withCredentials: true
        });
        console.log('Auth response:', authResponse.data);
        
        if (!authResponse.data.isAuthenticated) {
          toast.error("You must be logged in to access the community page.");
          navigate("/login");
          return;
        }

        // Store user ID
        setUserId(authResponse.data.user.id);

        // If authenticated, fetch posts
        const postsResponse = await axios.get(`${API_BASE_URL}/posts/posts`, {
          withCredentials: true
        });
        console.log('Initial posts response:', postsResponse.data);

        if (postsResponse.data && Array.isArray(postsResponse.data.posts)) {
          const formattedPosts = postsResponse.data.posts
            .map(formatPost)
            .filter(post => post !== null);

          console.log('Formatted initial posts:', formattedPosts);
          setPosts(formattedPosts);
          
          // Initialize liked state
          const likedState = {};
          formattedPosts.forEach(post => {
            likedState[post._id] = Array.isArray(post.likes) && post.likes.includes(authResponse.data.user.id);
          });
          setLiked(likedState);
        } else {
          console.error('Invalid initial posts data structure:', postsResponse.data);
          toast.error("Failed to load posts");
        }
      } catch (error) {
        console.error("Error during auth check or fetching posts:", error);
        console.error("Error response:", error.response?.data);
        if (error.response?.status === 401) {
          toast.error("Session expired or unauthorized. Please log in.");
          navigate("/login");
        } else {
          toast.error("Failed to load community data. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchPosts();
  }, [navigate]);

  // Handle post submission
  const handlePostSubmit = async () => {
    if (!newPost.trim() && !imageFile) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('content', newPost);
      formData.append('language', language);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      console.log('Submitting post...', { content: newPost, language, imageFile });
      
      // First, create the post
      const createResponse = await axios.post(`${API_BASE_URL}/posts/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true // Important for handling cookies
      });

      console.log('Post creation response:', createResponse.data);

      if (createResponse.data) {
        toast.success("Post shared successfully!");
        setNewPost('');
        setImageFile(null);
        
        // Fetch updated posts
        const postsResponse = await axios.get(`${API_BASE_URL}/posts/posts`, {
          withCredentials: true
        });
        console.log('Posts fetch response:', postsResponse.data);

        if (postsResponse.data && Array.isArray(postsResponse.data.posts)) {
          const formattedPosts = postsResponse.data.posts.map(post => ({
            _id: post._id,
            content: post.content || '',
            imageUrl: post.imageUrl || '',
            createdAt: post.createdAt || new Date().toISOString(),
            author: {
              name: post.author?.name || 'Unknown User',
              avatar: post.author?.avatar || "https://github.com/shadcn.png"
            },
            likes: Array.isArray(post.likes) ? post.likes : [],
            comments: Array.isArray(post.comments) ? post.comments : []
          }));

          console.log('Formatted posts:', formattedPosts);
          setPosts(formattedPosts);
          
          // Update liked state
          const likedState = {};
          formattedPosts.forEach(post => {
            likedState[post._id] = Array.isArray(post.likes) && post.likes.includes(userId);
          });
          setLiked(likedState);
        } else {
          console.error('Invalid posts data structure:', postsResponse.data);
          toast.error("Failed to load updated posts");
        }
      }
    } catch (error) {
      console.error("Error posting:", error);
      console.error("Error response:", error.response?.data);
      if (error.response?.status === 401) {
        toast.error("Please log in to create a post");
        navigate("/login");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to share post. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG)");
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
    }
  };

  // Handle like/unlike post
  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts/posts/${postId}/like`, {}, {
        withCredentials: true
      });
      if (response.data) {
        setLiked(prev => ({
          ...prev,
          [postId]: !prev[postId]
        }));
        
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === postId 
              ? { ...post, likes: response.data.likes || [] }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to like/unlike post.");
    }
  };

  // Handle adding a comment
  const handleAddComment = async (postId) => {
    if (!commentText[postId] || !commentText[postId].trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/posts/posts/${postId}/comment`, {
        text: commentText[postId]
      }, {
        withCredentials: true
      });

      if (response.data) {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === postId 
              ? { ...post, comments: response.data.comments || [] }
              : post
          )
        );
        setCommentText(prev => ({ ...prev, [postId]: "" }));
        toast.success("Comment added successfully!");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment.");
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Community</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <textarea
                className="w-full p-4 border rounded-lg mb-4"
                placeholder="Share your thoughts..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex items-center gap-2 text-blue-500 hover:text-blue-600"
                  >
                    <Image className="h-5 w-5" />
                    <span>Add Image</span>
                  </label>
                  {imageFile && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {imageFile.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageFile(null)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
                <Button
                  onClick={handlePostSubmit}
                  disabled={loading || (!newPost.trim() && !imageFile)}
                  className={`${
                    loading || (!newPost.trim() && !imageFile)
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {loading ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onLike={() => handleLikePost(post._id)}
                    onComment={(text) => {
                      setCommentText(prev => ({
                        ...prev,
                        [post._id]: text
                      }));
                      handleAddComment(post._id);
                    }}
                    isLiked={liked[post._id]}
                    commentText={commentText[post._id] || ""}
                    setCommentText={setCommentText}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPage;