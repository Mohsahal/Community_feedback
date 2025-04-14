// PostCard.jsx
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MapPin, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const PostCard = ({ post, onLike, onComment, isLiked, commentText, setCommentText }) => {
  const [showComments, setShowComments] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);

  const handleCommentClick = () => {
    setShowComments(!showComments);
    setShowCommentInput(true);
  };

  const handleCommentSubmit = (text) => {
    onComment(text);
    setShowCommentInput(false);
  };

  return (
    <Card className="overflow-hidden border-slate-200 hover:shadow-md transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 group">
            <Avatar className="group-hover:scale-110 transition-transform duration-300 border-2 border-slate-200">
              <AvatarImage src={post.author.avatar || "https://github.com/shadcn.png"} />
              <AvatarFallback className="bg-farm-green-100 text-farm-green-600">
                {post.author.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-farm-green-600 group-hover:text-farm-green-700 transition-colors">
                {post.author.name}
              </p>
              <div className="flex items-center gap-1 text-xs text-farm-green-700/80">
                {post.location && (
                  <>
                    <MapPin className="h-3 w-3" /> {post.location} •
                  </>
                )}
                {new Date(post.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="mb-3 text-farm-green-700">{post.content}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="border-slate-200 text-farm-green-600 hover:bg-farm-green-50 cursor-pointer transition-colors"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        {post.imageUrl && (
          <div className="mt-3 mb-3 rounded-md overflow-hidden border border-slate-200">
            <img
              src={post.imageUrl}
              alt="Post content"
              className="w-full h-auto object-cover max-h-96 hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-slate-200 pt-3 flex flex-col gap-3">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "text-farm-green-700/80"} hover:text-red-500 transition-colors`}
            onClick={onLike}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500" : ""} transition-transform hover:scale-125`} />
            {post.likes.length}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-farm-green-700/80 hover:text-farm-green-600 transition-colors"
            onClick={handleCommentClick}
          >
            <MessageCircle className="h-4 w-4 transition-transform hover:scale-125" /> 
            {post.comments.length}
            {post.comments.length > 0 && (
              <span className="ml-1">
                {showComments ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </span>
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-farm-green-700/80 hover:text-farm-green-600 transition-colors"
          >
            <Share2 className="h-4 w-4 transition-transform hover:scale-125" /> 
            Share
          </Button>
        </div>
        {showComments && post.comments.length > 0 && (
          <div className="mt-2 space-y-2">
            <h4 className="text-sm font-medium text-farm-green-600">Comments</h4>
            {post.comments.map((comment, index) => (
              <div key={index} className="flex gap-2 items-start">
                <Avatar className="h-6 w-6 border border-slate-200">
                  <AvatarImage src={comment.user?.avatar || "https://github.com/shadcn.png"} />
                  <AvatarFallback className="bg-farm-green-100 text-farm-green-600 text-xs">
                    {comment.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-farm-green-50 p-2 rounded-md flex-1">
                  <p className="text-sm font-medium text-farm-green-600">
                    {comment.user?.name || "Unknown User"}
                  </p>
                  <p className="text-sm text-farm-green-700">{comment.text}</p>
                  <p className="text-xs text-farm-green-700/80">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {showCommentInput && (
          <div className="flex gap-2 mt-2">
            <Textarea
              placeholder="Write a comment..."
              className="resize-none border-slate-200 focus:border-slate-300 focus:ring-slate-200"
              value={commentText}
              onChange={(e) => setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))}
            />
            <Button
              variant="outline"
              size="sm"
              className="self-end border-slate-200 text-farm-green-600 hover:bg-farm-green-50 hover:text-farm-green-700"
              onClick={() => handleCommentSubmit(commentText)}
              disabled={!commentText || !commentText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;