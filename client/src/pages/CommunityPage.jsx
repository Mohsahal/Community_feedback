import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/community/PostCard";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Send, Video, Smile, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import translations from "@/assets/languages/index";
import { formatPost, handleImageChange, handlePostSubmit, handleLikePost, handleAddComment, api } from "@/controllers";
import Footer from "@/components/layout/Footer";
import Weather from "@/components/community/Weather";
import UpcomingTopics from "@/components/community/UpcomingTopics";
import UpcomingEvents from "@/components/community/UpcomingEvents";
import SuccessStories from "@/components/community/SuccessStories";



const CommunityPage = () => {
  const [newPost, setNewPost] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [language, setLanguage] = useState("english");
  const [liked, setLiked] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [userId, setUserId] = useState(null);
  const [showPostCard, setShowPostCard] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
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
            {/* Posts Tabs */}
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full bg-farm-green-50 rounded-lg p-1 border border-black/10">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white rounded-md transition-all duration-200 hover:bg-black/5"
                >
                  <div className="flex items-center gap-2">
                    <span>{t.allPosts || "All"}</span>
                    <Badge variant="secondary" className="bg-black/5 text-black/80">
                      {posts.length}
                    </Badge>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="following" 
                  className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white rounded-md transition-all duration-200 hover:bg-black/5"
                >
                  <div className="flex items-center gap-2">
                    <span>{t.following || "Following"}</span>
                    <Badge variant="secondary" className="bg-black/5 text-black/80">
                      {posts.filter(post => post.author._id === userId).length}
                    </Badge>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="trending" 
                  className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white rounded-md transition-all duration-200 hover:bg-black/5"
                >
                  <div className="flex items-center gap-2">
                    <span>{t.popular || "Trending"}</span>
                    <Badge variant="secondary" className="bg-black/5 text-black/80">
                      {posts.filter(post => post.likes.length > 5).length}
                    </Badge>
                  </div>
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
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-farm-green-500"></div>
                  </div>
                ) : posts.filter(post => post.author._id === userId).length > 0 ? (
                  <div className="space-y-6">
                    {posts
                      .filter(post => post.author._id === userId)
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
                      <p className="text-black/60 mb-4">
                        {t.followingPrompt || "Follow farmers to see their posts here."}
                      </p>
                      <Button className="bg-farm-green-500 hover:bg-farm-green-600 text-white">
                        {t.discoverFarmers || "Discover Farmers"}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="trending">
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-farm-green-500"></div>
                  </div>
                ) : posts.filter(post => post.likes.length > 5).length > 0 ? (
                  <div className="space-y-6">
                    {posts
                      .filter(post => post.likes.length > 5)
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
                        {t.noTrendingPosts || "No trending posts yet."}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Success Stories */}
            <SuccessStories t={t} />
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8 lg:sticky lg:top-20">
            {/* Trending Topics */}
            <UpcomingTopics t={t} />

            {/* Upcoming Events */}
            <UpcomingEvents t={t} />

            {/* Weather */}
            <Weather />
          </div>
        </div>
      </div>

      {/* Floating Create Post Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowPostCard(true)}
          className="h-14 w-14 rounded-full bg-farm-green-500 hover:bg-farm-green-600 text-white shadow-lg flex items-center justify-center"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Post Creation Modal */}
      {showPostCard && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <Card className="border-0">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-farm-green-600">{t.createPost || "Create Post"}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPostCard(false)}
                    className="text-black/60 hover:text-black/80"
                  >
                    ✕
                  </Button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-farm-green-100 flex items-center justify-center">
                    <span className="text-farm-green-600 font-medium">
                      {userId ? userId.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                  <Textarea
                    placeholder={t.writePost || "What's on your mind?"}
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="flex-1 min-h-[100px] resize-none border border-black/10 hover:border-black/30 focus:border-black/50 focus:ring-black/10 rounded-md transition-all duration-200 placeholder:text-black/30"
                  />
                </div>
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
                    className="w-full sm:w-auto bg-farm-green-500 hover:bg-farm-green-600 text-white shadow-sm"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {loading ? "Posting..." : t.postButton || "Post"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Footer />
      </div>
    </Layout>
  );
};

export default CommunityPage;