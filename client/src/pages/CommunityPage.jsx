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
import { formatPost, handleImageChange, handlePostSubmit, handleLikePost, handleAddComment, api } from "@/controllers";
import Footer from "@/components/layout/Footer";

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


  // Fetch posts and check auth
  useEffect(() => {
    const checkAuthAndFetchPosts = async () => {
      try {
        const authResponse = await api.get("/auth/check-auth");
        if (!authResponse.data.isAuthenticated) {
          toast.error("You must be logged in to access the community page.");
          navigate("/login");
          return;
        }

        setUserId(authResponse.data.user.id);

        const postsResponse = await api.get("/posts/posts");
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
  const handleImageSelection = (e) => {
    handleImageChange(e, setImageFile);
  };

  // Handle post submission
  const handlePostSubmission = async () => {
    await handlePostSubmit(
      { content: newPost, language, imageFile },
      setLoading,
      setNewPost,
      setImageFile,
      setPosts,
      setLiked,
      userId
    );
  };

  // Handle like/unlike post
  const handlePostLike = async (postId) => {
    await handleLikePost(postId, setLiked, setPosts);
  };

  // Handle adding a comment
  const handleCommentAdd = async (postId) => {
    await handleAddComment(postId, commentText[postId], setPosts, setCommentText);
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-farm-green-500 text-start">{t.title || "Community"}</h1>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full sm:w-[180px] border border-black/20 hover:border-black/40 focus:border-black/60 focus:ring-black/20 rounded-md transition-all duration-200">
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
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Posts and Success Stories */}
          <div className="lg:col-span-2 space-y-8">
            {/* New Post Card */}
            <Card className="border border-black/10 hover:border-black/30 transition-all duration-200 shadow-sm rounded-lg">
              <CardContent className="pt-6">
                <Textarea
                  placeholder={t.writePost || "What's on your mind?"}
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="mb-4 min-h-[100px] resize-none border border-black/10 hover:border-black/30 focus:border-black/50 focus:ring-black/10 rounded-md transition-all duration-200 placeholder:text-black/30"
                />
                {imageFile && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-black/80">{imageFile.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setImageFile(null)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current.click()}
                    className="border border-black/10 hover:border-black/30 hover:bg-black/5 text-black/70 rounded-md transition-all duration-200"
                  >
                    <Image className="h-4 w-4 mr-2" />
                    {t.photo || "Add Photo"}
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelection}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <Button 
                    onClick={handlePostSubmission}
                    disabled={loading || (!newPost.trim() && !imageFile)}
                    className="w-full sm:w-auto   bg-farm-green-500 hover:bg-farm-green-600 text-white shadow-sm "
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {loading ? "Posting..." : t.postButton || "Post"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-3 w-full bg-farm-green-50 rounded-lg p-1 border border-black/10">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white rounded-md transition-all duration-200 hover:bg-black/5"
                >
                  {t.allPosts || "All"}
                </TabsTrigger>
                <TabsTrigger 
                  value="following" 
                  className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white rounded-md transition-all duration-200 hover:bg-black/5"
                >
                  {t.following || "Following"}
                </TabsTrigger>
                <TabsTrigger 
                  value="trending" 
                  className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white rounded-md transition-all duration-200 hover:bg-black/5"
                >
                  {t.popular || "Trending"}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-farm-green-500"></div>
                  </div>
                ) : posts.length > 0 ? (
                  <div className="space-y-6">
                    {posts.map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        onLike={() => handlePostLike(post._id)}
                        onComment={(text) => handleCommentAdd(post._id)}
                        isLiked={liked[post._id]}
                        commentText={commentText[post._id] || ""}
                        setCommentText={setCommentText}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="border border-black/10 hover:border-black/30 transition-all duration-200 shadow-sm rounded-lg">
                    <CardContent className="text-center py-10">
                      <p className="text-black/80">
                        {t.noPosts || "No posts yet. Be the first to share!"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="following">
                <Card className="border border-black/10 hover:border-black/30 transition-all duration-200 shadow-sm rounded-lg">
                  <CardContent className="text-center py-10">
                    <p className="text-black/60 mb-4">
                      {t.followingPrompt || "Follow farmers to see their posts here."}
                    </p>
                    <Button className="bg-farm-green-500 hover:bg-farm-green-600 text-white">
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
                          onLike={() => handlePostLike(post._id)}
                          onComment={(text) => handleCommentAdd(post._id)}
                          isLiked={liked[post._id]}
                          commentText={commentText[post._id] || ""}
                          setCommentText={setCommentText}
                        />
                      ))}
                  </div>
                ) : (
                  <Card className="border border-black/10 hover:border-black/30 transition-all duration-200 shadow-sm rounded-lg">
                    <CardContent className="text-center py-10">
                      <p className="text-black/60">
                        {t.noPosts || "No trending posts yet."}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Success Stories */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-farm-green-500">{t.successStories || "Success Stories"}</h2>
              {successStories.map((story, idx) => (
                <Card key={idx} className="border border-black/10 hover:border-black/30 transition-all duration-200 shadow-sm rounded-lg">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/3">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="w-full h-48 sm:h-full object-cover rounded-t-lg sm:rounded-t-none sm:rounded-l-lg"
                      />
                    </div>
                    <div className="sm:w-2/3 p-6">
                      <h3 className="text-xl font-semibold text-black/90">{story.name}</h3>
                      <p className="text-sm text-black/70 mb-2">{story.location}</p>
                      <Badge className="bg-black/5 text-black/80 hover:bg-black/10">
                        {story.achievement}
                      </Badge>
                      <p className="mt-4 text-black/70">{story.story}</p>
                      <Button 
                        variant="link" 
                        className="p-0 mt-4 h-auto text-black/80 hover:text-black hover:no-underline"
                      >
                        {t.readMore || "Read More"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8 lg:sticky lg:top-20">
            {/* Trending Topics */}
            <Card className="border border-black/10 hover:border-black/30 transition-all duration-200 shadow-sm rounded-lg">
              <CardHeader className="border-b border-black/10">
                <h3 className="text-lg font-semibold text-black/90">{t.trending || "Trending Topics"}</h3>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 hover:bg-black/5 rounded-md cursor-pointer transition-colors"
                    >
                      <p className="text-black/80 font-medium">#{topic.name}</p>
                      <Badge variant="secondary" className="bg-black/5 text-black/80">
                        {topic.posts} posts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-black/10">
                <Button 
                  variant="link" 
                  className="w-full text-black/80 hover:text-black hover:no-underline"
                >
                  {t.seeAll || "See All"}
                </Button>
              </CardFooter>
            </Card>

            {/* Upcoming Events */}
            <Card className="border border-black/10 hover:border-black/30 transition-all duration-200 shadow-sm rounded-lg">
              <CardHeader className="border-b border-black/10">
                <h3 className="text-lg font-semibold text-black/90">{t.events || "Upcoming Events"}</h3>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {upcomingEvents.map((event, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 border border-black/10 rounded-md hover:bg-black/5 transition-colors"
                    >
                      <p className="font-medium text-black/80">{event.title}</p>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
                        <p className="text-sm text-black/70">
                          {event.date} • {event.location}
                        </p>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <Badge variant="secondary" className="bg-black/5 text-black/80">
                            {event.type}
                          </Badge>
                          <Badge variant="outline" className="border border-black/10 text-black/80">
                            {event.isFree ? "Free" : "Paid"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-black/10">
                <Button 
                  variant="link" 
                  className="w-full text-black/80 hover:text-black hover:no-underline"
                >
                  {t.browseAll || "Browse All"}
                </Button>
              </CardFooter>
            </Card>

            {/* Weather */}
            <Card className="border border-black/10 hover:border-black/30 transition-all duration-200 shadow-sm rounded-lg">
              <CardHeader className="bg-farm-green-500 text-white">
                <h3 className="text-lg font-semibold">Local Weather</h3>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-3xl font-bold text-black/90">28°C</p>
                    <p className="text-sm text-black/70">Partly Cloudy</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-black/90">Delhi</p>
                    <p className="text-sm text-black/70">Humidity: 65%</p>
                  </div>
                </div>
                <h4 className="text-sm font-medium mb-3 text-black/90">5-Day Forecast</h4>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, idx) => (
                    <div 
                      key={idx} 
                      className="p-2 rounded-md hover:bg-black/5 transition-colors"
                    >
                      <p className="text-xs text-black/70">{day}</p>
                      <p className="font-medium text-black/90">{[28, 30, 27, 26, 29][idx]}°</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Footer />
      </div>
    </Layout>
  );
};

export default CommunityPage;