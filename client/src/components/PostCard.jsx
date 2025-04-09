import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Share2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const PostCard = ({ post, onLike, onComment, isLiked, commentText, setCommentText }) => {
  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      onComment(commentText);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={post.author.avatar} alt={post.author.name} />
          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{post.author.name}</h3>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="mb-4">{post.content}</p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full rounded-lg mb-4"
          />
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
        <div className="flex items-center gap-4 w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : ''}`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes?.length || 0}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments?.length || 0}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="w-full">
          <Textarea
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(prev => ({
              ...prev,
              [post._id]: e.target.value
            }))}
            className="mb-2"
          />
          <Button
            onClick={handleCommentSubmit}
            disabled={!commentText.trim()}
            className="w-full"
          >
            Comment
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;