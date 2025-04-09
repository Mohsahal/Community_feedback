


// import React, { useState, useEffect, useRef } from "react";
// import Layout from "@/components/layout/Layout";
// import PostCard from "@/components/PostCard";
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { MessageCircle, Heart, Share2, Image, Send, Smile, MapPin, ThumbsUp } from "lucide-react";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import translations from "@/assets/languages/index"; // Assuming this is your translations file
// import axios from "axios";

// // Configure Axios to include credentials by default
// axios.defaults.withCredentials = true;

// const API_BASE_URL = "http://localhost:5000/api";

// // Static data
// const trendingTopics = [
//   { name: "Monsoon2023", posts: 342 },
//   { name: "OrganicFarming", posts: 215 },
//   { name: "DroughtResistant", posts: 189 },
//   { name: "MarketPrices", posts: 167 },
//   { name: "SoilHealth", posts: 134 }
// ];

// const upcomingEvents = [
//   {
//     title: "Organic Farming Workshop",
//     date: "June 15, 2023",
//     location: "Virtual",
//     type: "Workshop",
//     isFree: true
//   },
// ];

// const successStories = [
//   {
//     name: "Raman Singh",
//     location: "Madhya Pradesh",
//     achievement: "Increased crop yield by 40% using AgroVerse recommendations",
//     image: "https://images.unsplash.com/photo-1610824352934-c10d87b700cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
//     story: "After soil testing and following AgroVerse's personalized crop recommendations, my wheat yield increased dramatically."
//   },
// ];

// const CommunityPage = () => {
//   const [newPost, setNewPost] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [language, setLanguage] = useState("english");
//   const [liked, setLiked] = useState({});
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [commentText, setCommentText] = useState({});
//   const [userId, setUserId] = useState(null);
//   const fileInputRef = useRef(null);

//   const navigate = useNavigate();
//   const t = translations[language] || translations.english;

//   // Format post data consistently
//   const formatPost = (post) => {
//     if (!post) return null;
//     return {
//       _id: post._id,
//       content: post.content || "",
//       imageUrl: post.imageUrl || "",
//       createdAt: post.createdAt || new Date().toISOString(),
//       author: {
//         name: post.author?.name || "Unknown User",
//         avatar: post.author?.avatar || "https://github.com/shadcn.png",
//       },
//       likes: Array.isArray(post.likes) ? post.likes : [],
//       comments: Array.isArray(post.comments) ? post.comments : [],
//       tags: Array.isArray(post.tags) ? post.tags : [],
//       location: post.location || "",
//     };
//   };

//   // Check authentication and fetch posts
//   useEffect(() => {
//     const checkAuthAndFetchPosts = async () => {
//       try {
//         const authResponse = await axios.get(`${API_BASE_URL}/auth/check-auth`);
//         if (!authResponse.data.isAuthenticated) {
//           toast.error("You must be logged in to access the community page.");
//           navigate("/login");
//           return;
//         }

//         setUserId(authResponse.data.user.id);

//         const postsResponse = await axios.get(`${API_BASE_URL}/posts/posts`);
//         if (postsResponse.data && postsResponse.data.success) {
//           const formattedPosts = postsResponse.data.posts
//             .map(formatPost)
//             .filter((post) => post !== null);
//           setPosts(formattedPosts);

//           const likedState = {};
//           formattedPosts.forEach((post) => {
//             likedState[post._id] =
//               Array.isArray(post.likes) && post.likes.includes(authResponse.data.user.id);
//           });
//           setLiked(likedState);
//         }
//       } catch (error) {
//         console.error("Error during auth check or fetching posts:", error);
//         if (error.response?.status === 401) {
//           toast.error("Session expired or unauthorized. Please log in.");
//           navigate("/login");
//         } else {
//           toast.error("Failed to load community data. Please try again later.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuthAndFetchPosts();
//   }, [navigate]);

//   // Handle image selection
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ["image/jpeg", "image/png", "image/jpg"];
//       if (!validTypes.includes(file.type)) {
//         toast.error("Please upload a valid image file (JPEG, PNG)");
//         return;
//       }

//       const maxSize = 5 * 1024 * 1024; // 5MB
//       if (file.size > maxSize) {
//         toast.error("Image size should be less than 5MB");
//         return;
//       }

//       setImageFile(file);
//       toast.info("Image selected! It will be uploaded when you post.");
//     }
//   };

//   // Handle post submission
//   const handlePostSubmit = async () => {
//     if (!newPost.trim() && !imageFile) {
//       toast.error("Please add text or an image to post.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const formData = new FormData();
//       formData.append("content", newPost);
//       formData.append("language", language);
//       if (imageFile) {
//         formData.append("image", imageFile);
//       }

//       const response = await axios.post(`${API_BASE_URL}/posts/posts`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (response.data && response.data.success) {
//         toast.success("Post shared successfully!");
//         setNewPost("");
//         setImageFile(null);

//         const postsResponse = await axios.get(`${API_BASE_URL}/posts/posts`);
//         if (postsResponse.data && postsResponse.data.success) {
//           const formattedPosts = postsResponse.data.posts
//             .map(formatPost)
//             .filter((post) => post !== null);
//           setPosts(formattedPosts);

//           const likedState = {};
//           formattedPosts.forEach((post) => {
//             likedState[post._id] = Array.isArray(post.likes) && post.likes.includes(userId);
//           });
//           setLiked(likedState);
//         }
//       }
//     } catch (error) {
//       console.error("Error posting:", error);
//       toast.error("Failed to share post. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle like/unlike post
//   const handleLikePost = async (postId) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/posts/posts/${postId}/like`);
//       if (response.data && response.data.success) {
//         setLiked((prev) => ({
//           ...prev,
//           [postId]: !prev[postId],
//         }));
//         setPosts((prevPosts) =>
//           prevPosts.map((post) =>
//             post._id === postId ? { ...post, likes: response.data.likes } : post
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Error toggling like:", error);
//       toast.error("Failed to like/unlike post.");
//     }
//   };

//   // Handle adding a comment
//   const handleAddComment = async (postId) => {
//     if (!commentText[postId] || !commentText[postId].trim()) return;

//     try {
//       const response = await axios.post(`${API_BASE_URL}/posts/posts/${postId}/comment`, {
//         text: commentText[postId],
//       });

//       if (response.data && response.data.success) {
//         setPosts((prevPosts) =>
//           prevPosts.map((post) =>
//             post._id === postId ? { ...post, comments: response.data.comments } : post
//           )
//         );
//         setCommentText((prev) => ({ ...prev, [postId]: "" }));
//         toast.success("Comment added successfully!");
//       }
//     } catch (error) {
//       console.error("Error adding comment:", error);
//       toast.error("Failed to add comment.");
//     }
//   };

//   return (
//     <Layout>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Header and Language Selector */}
//           <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
//             <Select value={language} onValueChange={setLanguage}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Select Language" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="english">English</SelectItem>
//                 <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
//                 <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* New Post Section */}
//           <div className="bg-white rounded-lg shadow p-6 mb-6">
//             <Textarea
//               className="w-full p-4 border rounded-lg mb-4"
//               placeholder={t.writePost}
//               value={newPost}
//               onChange={(e) => setNewPost(e.target.value)}
//             />
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden"
//                   id="image-upload"
//                   ref={fileInputRef}
//                 />
//                 <label
//                   htmlFor="image-upload"
//                   className="cursor-pointer flex items-center gap-2 text-blue-500 hover:text-blue-600"
//                 >
//                   <Image className="h-5 w-5" />
//                   <span>{t.photo}</span>
//                 </label>
//                 {imageFile && (
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm text-gray-500">{imageFile.name}</span>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => setImageFile(null)}
//                       className="text-red-500 hover:text-red-600"
//                     >
//                       Remove
//                     </Button>
//                   </div>
//                 )}
//               </div>
//               <Button
//                 onClick={handlePostSubmit}
//                 disabled={loading || (!newPost.trim() && !imageFile)}
//                 className={`${
//                   loading || (!newPost.trim() && !imageFile)
//                     ? "bg-gray-300 cursor-not-allowed"
//                     : "bg-blue-500 hover:bg-blue-600 text-white"
//                 }`}
//               >
//                 {loading ? "Posting..." : t.postButton}
//               </Button>
//             </div>
//           </div>

//           {/* Posts and Sidebar Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Main Posts Area */}
//             <div className="lg:col-span-2">
//               <Tabs defaultValue="all" className="w-full">
//                 <TabsList className="grid w-full grid-cols-3 mb-6">
//                   <TabsTrigger value="all">{t.allPosts}</TabsTrigger>
//                   <TabsTrigger value="following">{t.following}</TabsTrigger>
//                   <TabsTrigger value="trending">{t.popular}</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="all">
//                   {loading ? (
//                     <div className="flex justify-center items-center py-10">
//                       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                     </div>
//                   ) : posts.length > 0 ? (
//                     <div className="space-y-6">
//                       {posts.map((post) => (
//                         <PostCard
//                           key={post._id}
//                           post={post}
//                           onLike={() => handleLikePost(post._id)}
//                           onComment={(text) => handleAddComment(post._id)}
//                           isLiked={liked[post._id]}
//                           commentText={commentText[post._id] || ""}
//                           setCommentText={setCommentText}
//                         />
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-10">
//                       <p className="text-muted-foreground">{t.noPosts}</p>
//                     </div>
//                   )}
//                 </TabsContent>
//                 <TabsContent value="following">
//                   <div className="py-10 text-center border rounded-lg">
//                     <p className="text-muted-foreground mb-2">{t.followingPrompt}</p>
//                     <Button className="bg-blue-500 hover:bg-blue-600 text-white">
//                       {t.discoverFarmers}
//                     </Button>
//                   </div>
//                 </TabsContent>
//                 <TabsContent value="trending">
//                   <div className="space-y-6">
//                     {posts
//                       .slice()
//                       .sort((a, b) => b.likes.length - a.likes.length)
//                       .map((post) => (
//                         <PostCard
//                           key={post._id}
//                           post={post}
//                           onLike={() => handleLikePost(post._id)}
//                           onComment={(text) => handleAddComment(post._id)}
//                           isLiked={liked[post._id]}
//                           commentText={commentText[post._id] || ""}
//                           setCommentText={setCommentText}
//                         />
//                       ))}
//                   </div>
//                 </TabsContent>
//               </Tabs>

//               {/* Success Stories */}
//               <div className="pt-4">
//                 <h2 className="text-2xl font-bold mb-6">{t.successStories}</h2>
//                 <div className="space-y-6">
//                   {successStories.map((story, idx) => (
//                     <Card key={idx} className="overflow-hidden hover:shadow-md transition-all duration-300 group">
//                       <div className="md:flex">
//                         <div className="md:w-1/3 relative overflow-hidden">
//                           <img
//                             src={story.image}
//                             alt={story.name}
//                             className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
//                           />
//                         </div>
//                         <div className="md:w-2/3 p-6">
//                           <h3 className="text-xl font-bold mb-1 group-hover:text-blue-600 transition-colors">
//                             {story.name}
//                           </h3>
//                           <p className="text-sm text-muted-foreground mb-2">{story.location}</p>
//                           <Badge className="mb-4 bg-blue-500">{story.achievement}</Badge>
//                           <p className="text-muted-foreground">{story.story}</p>
//                           <Button variant="link" className="px-0 mt-2 text-blue-500 hover:text-blue-600">
//                             {t.readMore}
//                           </Button>
//                         </div>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Sidebar */}
//             <div className="lg:sticky lg:top-24 self-start space-y-6">
//               {/* Trending Topics */}
//               <Card className="hover:shadow-md transition-all duration-300">
//                 <CardHeader>
//                   <h3 className="font-semibold">{t.trending}</h3>
//                 </CardHeader>
//                 <CardContent className="pb-3">
//                   <div className="space-y-3">
//                     {trendingTopics.map((topic, index) => (
//                       <div
//                         key={index}
//                         className="flex justify-between items-center hover:bg-blue-50 p-2 rounded-md transition-colors cursor-pointer group"
//                       >
//                         <p className="text-blue-500 hover:underline group-hover:translate-x-1 transition-transform">
//                           #{topic.name}
//                         </p>
//                         <span className="text-xs bg-secondary px-2 py-1 rounded-full">
//                           {topic.posts} posts
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//                 <CardFooter className="border-t pt-3">
//                   <Button variant="link" className="text-blue-500 w-full hover:underline">
//                     {t.seeAll}
//                   </Button>
//                 </CardFooter>
//               </Card>

//               {/* Upcoming Events */}
//               <Card className="hover:shadow-md transition-all duration-300">
//                 <CardHeader>
//                   <h3 className="font-semibold">{t.events}</h3>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {upcomingEvents.map((event, idx) => (
//                       <div
//                         key={idx}
//                         className="border rounded-md p-3 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group"
//                       >
//                         <p className="font-medium group-hover:text-blue-600 transition-colors">{event.title}</p>
//                         <div className="flex justify-between items-center">
//                           <p className="text-xs text-muted-foreground">
//                             {event.date} • {event.location}
//                           </p>
//                           <div className="flex gap-2 mt-1">
//                             <Badge variant="secondary">{event.type}</Badge>
//                             <Badge variant="outline">{event.isFree ? "Free" : "Paid"}</Badge>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//                 <CardFooter className="border-t pt-3">
//                   <Button variant="link" className="text-blue-500 w-full hover:underline">
//                     {t.browseAll}
//                   </Button>
//                 </CardFooter>
//               </Card>

//               {/* Weather */}
//               <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
//                 <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4">
//                   <h3 className="font-semibold mb-2">Local Weather</h3>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-3xl font-bold">28°C</p>
//                       <p className="text-sm">Partly Cloudy</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-medium">Delhi</p>
//                       <p className="text-xs">Humidity: 65%</p>
//                     </div>
//                   </div>
//                 </div>
//                 <CardContent className="pt-4">
//                   <h4 className="font-medium mb-2">5-day Forecast</h4>
//                   <div className="flex justify-between text-sm">
//                     <div className="text-center">
//                       <p className="text-xs text-muted-foreground">Mon</p>
//                       <p className="font-medium">28°</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-xs text-muted-foreground">Tue</p>
//                       <p className="font-medium">30°</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-xs text-muted-foreground">Wed</p>
//                       <p className="font-medium">27°</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-xs text-muted-foreground">Thu</p>
//                       <p className="font-medium">26°</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-xs text-muted-foreground">Fri</p>
//                       <p className="font-medium">29°</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CommunityPage;


import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/PostCard";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import translations from "@/assets/languages/index";
import axios from "axios";

// Configure Axios
axios.defaults.withCredentials = true;

const API_BASE_URL = "http://localhost:5000/api";

// Static Data
const trendingTopics = [
  { name: "Monsoon2023", posts: 342 },
  { name: "OrganicFarming", posts: 215 },
  { name: "DroughtResistant", posts: 189 },
  { name: "MarketPrices", posts: 167 },
  { name: "SoilHealth", posts: 134 },
];

const upcomingEvents = [
  {
    title: "Organic Farming Workshop",
    date: "June 15, 2023",
    location: "Virtual",
    type: "Workshop",
    isFree: true,
  },
];

const successStories = [
  {
    name: "Raman Singh",
    location: "Madhya Pradesh",
    achievement: "Increased crop yield by 40% using AgroVerse recommendations",
    image: "https://images.unsplash.com/photo-1610824352934-c10d87b700cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    story: "After soil testing and following AgroVerse's personalized crop recommendations, my wheat yield increased dramatically.",
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
  const fileInputRef = useRef(null);
  
  const navigate = useNavigate();
  const t = translations[language] || translations.english;

  // Format post data
  const formatPost = (post) => {
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

  // Fetch posts and check auth
  useEffect(() => {
    const checkAuthAndFetchPosts = async () => {
      try {
        const authResponse = await axios.get(`${API_BASE_URL}/auth/check-auth`);
        if (!authResponse.data.isAuthenticated) {
          toast.error("You must be logged in to access the community page.");
          navigate("/login");
          return;
        }

        setUserId(authResponse.data.user.id);

        const postsResponse = await axios.get(`${API_BASE_URL}/posts/posts`);
        if (postsResponse.data && postsResponse.data.success) {
          const formattedPosts = postsResponse.data.posts
            .map(formatPost)
            .filter((post) => post !== null);
          setPosts(formattedPosts);

          const likedState = {};
          formattedPosts.forEach((post) => {
            likedState[post._id] =
              Array.isArray(post.likes) && post.likes.includes(authResponse.data.user.id);
          });
          setLiked(likedState);
        }
      } catch (error) {
        console.error("Error during auth check or fetching posts:", error);
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

  // Handle image selection
  const handleImageChange = (e) => {
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
  const handlePostSubmit = async () => {
    if (!newPost.trim() && !imageFile) {
      toast.error("Please add text or an image to post.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("content", newPost);
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
  const handleLikePost = async (postId) => {
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
  const handleAddComment = async (postId) => {
    if (!commentText[postId] || !commentText[postId].trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/posts/posts/${postId}/comment`, {
        text: commentText[postId],
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

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">{t.title || "Community"}</h1>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
              <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Posts and Success Stories */}
          <div className="lg:col-span-2 space-y-6">
            {/* New Post Card */}
            <Card>
              <CardContent className="pt-6">
                <Textarea
                  placeholder={t.writePost || "What's on your mind?"}
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="mb-4"
                />
                {imageFile && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-muted-foreground">{imageFile.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setImageFile(null)}
                      className="text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row  items-start sm:items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    {t.photo || "Add Photo"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    {t.location || "Add location"}
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                    <Button 
                    onClick={handlePostSubmit}
                    disabled={loading || (!newPost.trim() && !imageFile)}
                    className="w-full sm:w-auto flex-1"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {loading ? "Posting..." : t.postButton || "Post"}
                    </Button>
                  </div>
              </CardContent>
            </Card>

            {/* Posts Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all">{t.allPosts || "All"}</TabsTrigger>
                <TabsTrigger value="following">{t.following || "Following"}</TabsTrigger>
                <TabsTrigger value="trending">{t.popular || "Trending"}</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : posts.length > 0 ? (
                  <div className="space-y-6">
                    {posts.map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        onLike={() => handleLikePost(post._id)}
                        onComment={(text) => handleAddComment(post._id)}
                        isLiked={liked[post._id]}
                        commentText={commentText[post._id] || ""}
                        setCommentText={setCommentText}
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-10">
                      <p className="text-muted-foreground">
                        {t.noPosts || "No posts yet. Be the first to share!"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="following">
                <Card>
                  <CardContent className="text-center py-10">
                    <p className="text-muted-foreground mb-4">
                      {t.followingPrompt || "Follow farmers to see their posts here."}
                    </p>
                    <Button>
                      {t.discoverFarmers || "Discover Farmers"}
                  </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="trending">
                {posts.length > 0 ? (
                <div className="space-y-6">
                    {posts
                      .slice()
                      .sort((a, b) => b.likes.length - a.likes.length)
                      .map((post) => (
                        <PostCard
                          key={post._id}
                          post={post}
                          onLike={() => handleLikePost(post._id)}
                          onComment={(text) => handleAddComment(post._id)}
                          isLiked={liked[post._id]}
                          commentText={commentText[post._id] || ""}
                          setCommentText={setCommentText}
                        />
                      ))}
                              </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-10">
                      <p className="text-muted-foreground">
                        {t.noPosts || "No trending posts yet."}
                      </p>
                          </CardContent>
                        </Card>
                  )}
              </TabsContent>
            </Tabs>

            {/* Success Stories */}
              <div className="space-y-6">
              <h2 className="text-2xl font-bold">{t.successStories || "Success Stories"}</h2>
                {successStories.map((story, idx) => (
                <Card key={idx}>
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/3">
                        <img
                          src={story.image}
                          alt={story.name}
                        className="w-full h-48 sm:h-full object-cover rounded-t-lg sm:rounded-t-none sm:rounded-l-lg"
                        />
                      </div>
                    <div className="sm:w-2/3 p-4">
                      <h3 className="text-xl font-semibold">{story.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{story.location}</p>
                      <Badge>{story.achievement}</Badge>
                      <p className="mt-2 text-muted-foreground">{story.story}</p>
                      <Button variant="link" className="p-0 mt-2 h-auto">
                        {t.readMore || "Read More"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-20">
            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">{t.trending || "Trending Topics"}</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {trendingTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                    >
                      <p className="text-primary">#{topic.name}</p>
                      <Badge variant="secondary">{topic.posts} posts</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="w-full">
                  {t.seeAll || "See All"}
                </Button>
              </CardFooter>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">{t.events || "Upcoming Events"}</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, idx) => (
                    <div key={idx} className="p-3 border rounded-md hover:bg-muted">
                      <p className="font-medium">{event.title}</p>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1">
                        <p className="text-sm text-muted-foreground">
                          {event.date} • {event.location}
                        </p>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <Badge variant="secondary">{event.type}</Badge>
                          <Badge variant="outline">{event.isFree ? "Free" : "Paid"}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="w-full">
                  {t.browseAll || "Browse All"}
                </Button>
              </CardFooter>
            </Card>

            {/* Weather */}
            <Card>
              <CardHeader className="bg-primary text-primary-foreground">
                <h3 className="text-lg font-semibold">Local Weather</h3>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-2xl font-bold">28°C</p>
                    <p className="text-sm text-muted-foreground">Partly Cloudy</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Delhi</p>
                    <p className="text-sm text-muted-foreground">Humidity: 65%</p>
                  </div>
                </div>
                <h4 className="text-sm font-medium mb-2">5-Day Forecast</h4>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, idx) => (
                    <div key={idx}>
                      <p className="text-xs text-muted-foreground">{day}</p>
                      <p className="font-medium">{[28, 30, 27, 26, 29][idx]}°</p>
              </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPage;