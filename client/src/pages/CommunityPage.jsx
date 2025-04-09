


// import React, { useState, useEffect } from "react";
// import Layout from "@/components/layout/Layout";
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
// import translations from "@/assets/common";
// import axios from "axios";

// // Configure Axios to include credentials (cookies) by default
// axios.defaults.withCredentials = true;

// // Base URL for your API (adjust if needed)
// const API_BASE_URL = "http://localhost:5000/api";

// // Sample static data (for fallback or initial testing)
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
//   const [language, setLanguage] = useState("english");
//   const [liked, setLiked] = useState({});
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [commentText, setCommentText] = useState({});
//   const navigate = useNavigate();

//   const t = translations[language] || translations.english;

//   // Check authentication and fetch posts
//   useEffect(() => {
//     const checkAuthAndFetchPosts = async () => {
//       try {
//         // Check if user is authenticated
//         const authResponse = await axios.get(`${API_BASE_URL}/auth/check-auth`);
        
//         if (!authResponse.data.isAuthenticated) {
//           toast.error("You must be logged in to access the community page.");
//           navigate("/login");
//           return;
//         }

//         // If authenticated, fetch posts
//         const postsResponse = await axios.get(`${API_BASE_URL}/posts/posts`);
//         if (postsResponse.data && postsResponse.data.success) {
//           setPosts(postsResponse.data.posts);
//           const likedState = {};
//           postsResponse.data.posts.forEach(post => {
//             likedState[post._id] = post.likes.includes(authResponse.data.user.id);
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

//   // Handle post submission
//   const handlePostSubmit = async () => {
//     if (!newPost.trim()) return;

//     try {
//       const response = await axios.post(`${API_BASE_URL}/posts/posts`, {
//         content: newPost,
//         language,
//       });

//       if (response.data && response.data.success) {
//         toast.success("Post shared successfully!");
//         setNewPost("");
//         // Refresh posts
//         const postsResponse = await axios.get(`${API_BASE_URL}/posts/posts`);
//         setPosts(postsResponse.data.posts);
//       }
//     } catch (error) {
//       console.error("Error posting:", error);
//       toast.error("Failed to share post. Please try again.");
//     }
//   };

//   // Handle like/unlike post
//   const handleLikePost = async (postId) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/posts/posts/${postId}/like`);
//       if (response.data && response.data.success) {
//         setLiked(prev => ({
//           ...prev,
//           [postId]: !prev[postId]
//         }));
//         setPosts(prevPosts =>
//           prevPosts.map(post =>
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
//         text: commentText[postId]
//       });

//       if (response.data && response.data.success) {
//         setPosts(prevPosts =>
//           prevPosts.map(post =>
//             post._id === postId ? { ...post, comments: response.data.comments } : post
//           )
//         );
//         setCommentText(prev => ({ ...prev, [postId]: "" }));
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
//         <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
//             <p className="text-muted-foreground">{t.subtitle}</p>
//           </div>
//           <Select value={language} onValueChange={setLanguage}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select Language" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="english">English</SelectItem>
//               <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
//               <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main content area */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* New post creation */}
//             <Card className="hover:shadow-md transition-all duration-300">
//               <CardHeader className="pb-3">
//                 <div className="flex items-center gap-3">
//                   <Avatar className="hover:scale-110 transition-transform duration-300">
//                     <AvatarImage src="https://github.com/shadcn.png" />
//                     <AvatarFallback>JD</AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-medium">{t.writePost}</p>
//                     <p className="text-xs text-muted-foreground">{t.shareTip}</p>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <Textarea
//                   placeholder={t.writePost}
//                   className="resize-none mb-4 focus-visible:ring-farm-green-500"
//                   value={newPost}
//                   onChange={(e) => setNewPost(e.target.value)}
//                 />
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="flex items-center gap-1 hover:bg-farm-green-50 hover:text-farm-green-600 hover:border-farm-green-300 transition-all duration-300 group"
//                   >
//                     <Image className="h-4 w-4 group-hover:scale-110 transition-transform" /> {t.photo}
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="flex items-center gap-1 hover:bg-farm-green-50 hover:text-farm-green-600 hover:border-farm-green-300 transition-all duration-300 group"
//                   >
//                     <MapPin className="h-4 w-4 group-hover:scale-110 transition-transform" /> {t.location}
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="flex items-center gap-1 hover:bg-farm-green-50 hover:text-farm-green-600 hover:border-farm-green-300 transition-all duration-300 group"
//                   >
//                     <Smile className="h-4 w-4 group-hover:scale-110 transition-transform" /> {t.feeling}
//                   </Button>
//                 </div>
//               </CardContent>
//               <CardFooter className="border-t pt-3 flex justify-between">
//                 <p className="text-xs text-muted-foreground">Your post will be shared with the community</p>
//                 <Button
//                   className="bg-emerald-950 hover:bg-amber-950 flex items-center gap-1 hover:scale-105 transition-all duration-300"
//                   disabled={!newPost.trim()}
//                   onClick={handlePostSubmit}
//                 >
//                   <Send className="h-4 w-4" /> {t.postButton}
//                 </Button>
//               </CardFooter>
//             </Card>

//             {/* Posts feed */}
//             <Tabs defaultValue="all" className="mb-6">
//               <TabsList className="mb-6">
//                 <TabsTrigger value="all">{t.allPosts}</TabsTrigger>
//                 <TabsTrigger value="following">{t.following}</TabsTrigger>
//                 <TabsTrigger value="popular">{t.popular}</TabsTrigger>
//                 <TabsTrigger value="questions">{t.questions}</TabsTrigger>
//               </TabsList>
//               <TabsContent value="all">
//                 {loading ? (
//                   <div className="flex justify-center items-center py-10">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-farm-green-600"></div>
//                   </div>
//                 ) : posts.length > 0 ? (
//                   <div className="space-y-6">
//                     {posts.map(post => (
//                       <Card key={post._id} className="overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in">
//                         <CardHeader className="pb-3">
//                           <div className="flex justify-between">
//                             <div className="flex items-center gap-3 group">
//                               <Avatar className="group-hover:scale-110 transition-transform duration-300">
//                                 <AvatarImage src={post.author.avatar || "https://github.com/shadcn.png"} />
//                                 <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
//                               </Avatar>
//                               <div>
//                                 <p className="font-medium group-hover:text-farm-green-600 transition-colors">{post.author.name}</p>
//                                 <div className="flex items-center gap-1 text-xs text-muted-foreground">
//                                   {post.location && (
//                                     <>
//                                       <MapPin className="h-3 w-3" /> {post.location} •
//                                     </>
//                                   )}
//                                   {new Date(post.createdAt).toLocaleString()}
//                                 </div>
//                               </div>
//                             </div>
//                             <Button variant="ghost" size="icon" className="hover:bg-farm-green-50 hover:text-farm-green-600 transition-all">
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
//                               </svg>
//                             </Button>
//                           </div>
//                         </CardHeader>
//                         <CardContent className="pb-3">
//                           <p className="mb-3">{post.content}</p>
//                           {post.tags && post.tags.length > 0 && (
//                             <div className="flex flex-wrap gap-2 mb-3">
//                               {post.tags.map(tag => (
//                                 <Badge key={tag} variant="outline" className="hover:bg-farm-green-50 cursor-pointer transition-colors">
//                                   #{tag}
//                                 </Badge>
//                               ))}
//                             </div>
//                           )}
//                           {post.imageUrl && (
//                             <div className="mt-3 mb-3 rounded-md overflow-hidden">
//                               <img
//                                 src={post.imageUrl}
//                                 alt="Post content"
//                                 className="w-full h-auto object-cover max-h-96 hover:scale-105 transition-transform duration-500"
//                               />
//                             </div>
//                           )}
//                         </CardContent>
//                         <CardFooter className="border-t pt-3 flex flex-col gap-3">
//                           <div className="flex gap-4">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className={`flex items-center gap-1 ${liked[post._id] ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500 transition-colors`}
//                               onClick={() => handleLikePost(post._id)}
//                             >
//                               <Heart className={`h-4 w-4 ${liked[post._id] ? 'fill-red-500' : ''} transition-transform hover:scale-125`} />
//                               {post.likes.length}
//                             </Button>
//                             <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground hover:text-farm-green-600 transition-colors">
//                               <MessageCircle className="h-4 w-4 transition-transform hover:scale-125" /> {post.comments.length}
//                             </Button>
//                             <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground hover:text-farm-green-600 transition-colors">
//                               <Share2 className="h-4 w-4 transition-transform hover:scale-125" /> Share
//                             </Button>
//                           </div>
//                           {post.comments.length > 0 && (
//                             <div className="mt-2 space-y-2">
//                               <h4 className="text-sm font-medium">Comments</h4>
//                               {post.comments.map((comment, index) => (
//                                 <div key={index} className="flex gap-2 items-start">
//                                   <Avatar className="h-6 w-6">
//                                     <AvatarImage src={comment.user.avatar || "https://github.com/shadcn.png"} />
//                                     <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
//                                   </Avatar>
//                                   <div className="bg-gray-50 p-2 rounded-md flex-1">
//                                     <p className="text-sm font-medium">{comment.user.name}</p>
//                                     <p className="text-sm">{comment.text}</p>
//                                     <p className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</p>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                           <div className="flex gap-2 mt-2">
//                             <Textarea
//                               placeholder="Write a comment..."
//                               className="resize-none"
//                               value={commentText[post._id] || ""}
//                               onChange={(e) => setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))}
//                             />
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className="self-end"
//                               onClick={() => handleAddComment(post._id)}
//                               disabled={!commentText[post._id] || !commentText[post._id].trim()}
//                             >
//                               <Send className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </CardFooter>
//                       </Card>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-10">
//                     <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
//                   </div>
//                 )}
//               </TabsContent>
//               {/* Other TabsContent sections remain unchanged */}
//             </Tabs>

//             {/* Success Stories Section */}
//             <div className="pt-4">
//               <h2 className="text-2xl font-bold mb-6">{t.successStories}</h2>
//               <div className="space-y-6">
//                 {successStories.map((story, idx) => (
//                   <Card key={idx} className="overflow-hidden hover:shadow-md transition-all duration-300 group">
//                     <div className="md:flex">
//                       <div className="md:w-1/3 relative overflow-hidden">
//                         <img
//                           src={story.image}
//                           alt={story.name}
//                           className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
//                         />
//                       </div>
//                       <div className="md:w-2/3 p-6">
//                         <h3 className="text-xl font-bold mb-1 group-hover:text-farm-green-600 transition-colors">{story.name}</h3>
//                         <p className="text-sm text-muted-foreground mb-2">{story.location}</p>
//                         <Badge className="mb-4 bg-farm-green-600">{story.achievement}</Badge>
//                         <p className="text-muted-foreground">{story.story}</p>
//                         <Button
//                           variant="link"
//                           className="px-0 mt-2 text-farm-green-600 hover:text-farm-green-700"
//                         >
//                           {t.readMore}
//                         </Button>
//                       </div>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="lg:sticky lg:top-24 self-start space-y-6">
//             {/* Trending Topics */}
//             <Card className="hover:shadow-md transition-all duration-300">
//               <CardHeader>
//                 <h3 className="font-semibold">{t.trending}</h3>
//               </CardHeader>
//               <CardContent className="pb-3">
//                 <div className="space-y-3">
//                   {trendingTopics.map((topic, index) => (
//                     <div key={index} className="flex justify-between items-center hover:bg-farm-green-50 p-2 rounded-md transition-colors cursor-pointer group">
//                       <p className="text-farm-green-600 hover:underline group-hover:translate-x-1 transition-transform">
//                         #{topic.name}
//                       </p>
//                       <span className="text-xs bg-secondary px-2 py-1 rounded-full">
//                         {topic.posts} posts
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//               <CardFooter className="border-t pt-3">
//                 <Button variant="link" className="text-farm-green-600 w-full hover:underline">
//                   {t.seeAll}
//                 </Button>
//               </CardFooter>
//             </Card>

//             {/* Upcoming Events */}
//             <Card className="hover:shadow-md transition-all duration-300">
//               <CardHeader>
//                 <h3 className="font-semibold">{t.events}</h3>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {upcomingEvents.map((event, idx) => (
//                     <div key={idx} className="border rounded-md p-3 hover:border-farm-green-300 hover:bg-farm-green-50 transition-all cursor-pointer group">
//                       <p className="font-medium group-hover:text-farm-green-600 transition-colors">{event.title}</p>
//                       <div className="flex justify-between items-center">
//                         <p className="text-xs text-muted-foreground">{event.date} • {event.location}</p>
//                         <div className="flex gap-2 mt-1">
//                           <Badge variant="secondary">{event.type}</Badge>
//                           <Badge variant="outline">{event.isFree ? "Free" : "Paid"}</Badge>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//               <CardFooter className="border-t pt-3">
//                 <Button variant="link" className="text-farm-green-600 w-full hover:underline">
//                   {t.browseAll}
//                 </Button>
//               </CardFooter>
//             </Card>

//             {/* Local Weather Card */}
//             <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
//               <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4">
//                 <h3 className="font-semibold mb-2">Local Weather</h3>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-3xl font-bold">28°C</p>
//                     <p className="text-sm">Partly Cloudy</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-medium">Delhi</p>
//                     <p className="text-xs">Humidity: 65%</p>
//                   </div>
//                 </div>
//               </div>
//               <CardContent className="pt-4">
//                 <h4 className="font-medium mb-2">5-day Forecast</h4>
//                 <div className="flex justify-between text-sm">
//                   <div className="text-center">
//                     <p className="text-xs text-muted-foreground">Mon</p>
//                     <p className="font-medium">28°</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-xs text-muted-foreground">Tue</p>
//                     <p className="font-medium">30°</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-xs text-muted-foreground">Wed</p>
//                     <p className="font-medium">27°</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-xs text-muted-foreground">Thu</p>
//                     <p className="font-medium">26°</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-xs text-muted-foreground">Fri</p>
//                     <p className="font-medium">29°</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CommunityPage;




import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
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

// Configure Axios to include credentials by default
axios.defaults.withCredentials = true;

const API_BASE_URL = "http://localhost:5000/api";

// Static data (unchanged)
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
  const [language, setLanguage] = useState("english");
  const [liked, setLiked] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  const fileInputRef = useRef(null); // Ref for hidden file input
  const navigate = useNavigate();

  const t = translations[language] || translations.english;

  // Check authentication and fetch posts
  useEffect(() => {
    const checkAuthAndFetchPosts = async () => {
      try {
        const authResponse = await axios.get(`${API_BASE_URL}/auth/check-auth`);
        if (!authResponse.data.isAuthenticated) {
          toast.error("You must be logged in to access the community page.");
          navigate("/login");
          return;
        }

        const postsResponse = await axios.get(`${API_BASE_URL}/posts/posts`);
        if (postsResponse.data && postsResponse.data.success) {
          setPosts(postsResponse.data.posts);
          const likedState = {};
          postsResponse.data.posts.forEach(post => {
            likedState[post._id] = post.likes.includes(authResponse.data.user.id);
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

  // Handle clicking the Photo button
  const handlePhotoClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); // Store the selected file in state
      toast.info("Image selected! It will be uploaded when you post.");
    }
  };

  // Handle post submission with image
  const handlePostSubmit = async () => {
    if (!newPost.trim() && !selectedImage) {
      toast.error("Please add text or an image to post.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", newPost);
      formData.append("language", language);
      if (selectedImage) {
        formData.append("image", selectedImage); // Append image file
      }

      const response = await axios.post(`${API_BASE_URL}/posts/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });

      if (response.data && response.data.success) {
        toast.success("Post shared successfully!");
        setNewPost("");
        setSelectedImage(null); // Clear the image after posting
        const postsResponse = await axios.get(`${API_BASE_URL}/posts/posts`);
        setPosts(postsResponse.data.posts);
      }
    } catch (error) {
      console.error("Error posting:", error);
      toast.error("Failed to share post. Please try again.");
    }
  };

  // Handle like/unlike post (unchanged)
  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts/posts/${postId}/like`);
      if (response.data && response.data.success) {
        setLiked(prev => ({
          ...prev,
          [postId]: !prev[postId]
        }));
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === postId ? { ...post, likes: response.data.likes } : post
          )
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to like/unlike post.");
    }
  };

  // Handle adding a comment (unchanged)
  const handleAddComment = async (postId) => {
    if (!commentText[postId] || !commentText[postId].trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/posts/posts/${postId}/comment`, {
        text: commentText[postId]
      });

      if (response.data && response.data.success) {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === postId ? { ...post, comments: response.data.comments } : post
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
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
              <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            {/* New post creation */}
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="hover:scale-110 transition-transform duration-300">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{t.writePost}</p>
                    <p className="text-xs text-muted-foreground">{t.shareTip}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={t.writePost}
                  className="resize-none mb-4 focus-visible:ring-farm-green-500"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
                {selectedImage && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">Selected Image: {selectedImage.name}</p>
                    <Button
                      variant="link"
                      className="text-red-500 p-0"
                      onClick={() => setSelectedImage(null)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 hover:bg-farm-green-50 hover:text-farm-green-600 hover:border-farm-green-300 transition-all duration-300 group"
                    onClick={handlePhotoClick}
                  >
                    <Image className="h-4 w-4 group-hover:scale-110 transition-transform" /> {t.photo}
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 hover:bg-farm-green-50 hover:text-farm-green-600 hover:border-farm-green-300 transition-all duration-300 group"
                  >
                    <MapPin className="h-4 w-4 group-hover:scale-110 transition-transform" /> {t.location}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 hover:bg-farm-green-50 hover:text-farm-green-600 hover:border-farm-green-300 transition-all duration-300 group"
                  >
                    <Smile className="h-4 w-4 group-hover:scale-110 transition-transform" /> {t.feeling}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-between">
                <p className="text-xs text-muted-foreground">Your post will be shared with the community</p>
                <Button
                  className="bg-emerald-950 hover:bg-amber-950 flex items-center gap-1 hover:scale-105 transition-all duration-300"
                  disabled={!newPost.trim() && !selectedImage} // Enable if text or image is present
                  onClick={handlePostSubmit}
                >
                  <Send className="h-4 w-4" /> {t.postButton}
                </Button>
              </CardFooter>
            </Card>

            {/* Posts feed */}
            <Tabs defaultValue="all" className="mb-6">
              <TabsList className="mb-6">
                <TabsTrigger value="all">{t.allPosts}</TabsTrigger>
                <TabsTrigger value="following">{t.following}</TabsTrigger>
                <TabsTrigger value="popular">{t.popular}</TabsTrigger>
                <TabsTrigger value="questions">{t.questions}</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-farm-green-600"></div>
                  </div>
                ) : posts.length > 0 ? (
                  <div className="space-y-6">
                    {posts.map(post => (
                      <Card key={post._id} className="overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-3 group">
                              <Avatar className="group-hover:scale-110 transition-transform duration-300">
                                <AvatarImage src={post.author.avatar || "https://github.com/shadcn.png"} />
                                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium group-hover:text-farm-green-600 transition-colors">{post.author.name}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  {post.location && (
                                    <>
                                      <MapPin className="h-3 w-3" /> {post.location} •
                                    </>
                                  )}
                                  {new Date(post.createdAt).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="hover:bg-farm-green-50 hover:text-farm-green-600 transition-all">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <p className="mb-3">{post.content}</p>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="hover:bg-farm-green-50 cursor-pointer transition-colors">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {post.imageUrl && (
                            <div className="mt-3 mb-3 rounded-md overflow-hidden">
                              <img
                                src={post.imageUrl}
                                alt="Post content"
                                className="w-full h-auto object-cover max-h-96 hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="border-t pt-3 flex flex-col gap-3">
                          <div className="flex gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`flex items-center gap-1 ${liked[post._id] ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500 transition-colors`}
                              onClick={() => handleLikePost(post._id)}
                            >
                              <Heart className={`h-4 w-4 ${liked[post._id] ? 'fill-red-500' : ''} transition-transform hover:scale-125`} />
                              {post.likes.length}
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground hover:text-farm-green-600 transition-colors">
                              <MessageCircle className="h-4 w-4 transition-transform hover:scale-125" /> {post.comments.length}
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground hover:text-farm-green-600 transition-colors">
                              <Share2 className="h-4 w-4 transition-transform hover:scale-125" /> Share
                            </Button>
                          </div>
                          {post.comments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              <h4 className="text-sm font-medium">Comments</h4>
                              {post.comments.map((comment, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={comment.user.avatar || "https://github.com/shadcn.png"} />
                                    <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="bg-gray-50 p-2 rounded-md flex-1">
                                    <p className="text-sm font-medium">{comment.user.name}</p>
                                    <p className="text-sm">{comment.text}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Textarea
                              placeholder="Write a comment..."
                              className="resize-none"
                              value={commentText[post._id] || ""}
                              onChange={(e) => setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="self-end"
                              onClick={() => handleAddComment(post._id)}
                              disabled={!commentText[post._id] || !commentText[post._id].trim()}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
                  </div>
                )}
              </TabsContent>
              {/* Other TabsContent sections omitted for brevity */}
            </Tabs>

            {/* Success Stories Section */}
            <div className="pt-4">
              <h2 className="text-2xl font-bold mb-6">{t.successStories}</h2>
              <div className="space-y-6">
                {successStories.map((story, idx) => (
                  <Card key={idx} className="overflow-hidden hover:shadow-md transition-all duration-300 group">
                    <div className="md:flex">
                      <div className="md:w-1/3 relative overflow-hidden">
                        <img
                          src={story.image}
                          alt={story.name}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <h3 className="text-xl font-bold mb-1 group-hover:text-farm-green-600 transition-colors">{story.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{story.location}</p>
                        <Badge className="mb-4 bg-farm-green-600">{story.achievement}</Badge>
                        <p className="text-muted-foreground">{story.story}</p>
                        <Button
                          variant="link"
                          className="px-0 mt-2 text-farm-green-600 hover:text-farm-green-700"
                        >
                          {t.readMore}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar (unchanged) */}
          <div className="lg:sticky lg:top-24 self-start space-y-6">
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <h3 className="font-semibold">{t.trending}</h3>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex justify-between items-center hover:bg-farm-green-50 p-2 rounded-md transition-colors cursor-pointer group">
                      <p className="text-farm-green-600 hover:underline group-hover:translate-x-1 transition-transform">
                        #{topic.name}
                      </p>
                      <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                        {topic.posts} posts
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3">
                <Button variant="link" className="text-farm-green-600 w-full hover:underline">
                  {t.seeAll}
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <h3 className="font-semibold">{t.events}</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, idx) => (
                    <div key={idx} className="border rounded-md p-3 hover:border-farm-green-300 hover:bg-farm-green-50 transition-all cursor-pointer group">
                      <p className="font-medium group-hover:text-farm-green-600 transition-colors">{event.title}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">{event.date} • {event.location}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary">{event.type}</Badge>
                          <Badge variant="outline">{event.isFree ? "Free" : "Paid"}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3">
                <Button variant="link" className="text-farm-green-600 w-full hover:underline">
                  {t.browseAll}
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4">
                <h3 className="font-semibold mb-2">Local Weather</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">28°C</p>
                    <p className="text-sm">Partly Cloudy</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Delhi</p>
                    <p className="text-xs">Humidity: 65%</p>
                  </div>
                </div>
              </div>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-2">5-day Forecast</h4>
                <div className="flex justify-between text-sm">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Mon</p>
                    <p className="font-medium">28°</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Tue</p>
                    <p className="font-medium">30°</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Wed</p>
                    <p className="font-medium">27°</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Thu</p>
                    <p className="font-medium">26°</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Fri</p>
                    <p className="font-medium">29°</p>
                  </div>
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