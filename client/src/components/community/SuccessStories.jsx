import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SuccessStories = ({ t }) => {
  const successStories = [
    {
      name: "Raman Singh",
      location: "Madhya Pradesh",
      achievement: "Increased crop yield by 40% using AgroVerse recommendations",
      image: "https://images.unsplash.com/photo-1610824352934-c10d87b700cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      story: "After soil testing and following AgroVerse's personalized crop recommendations, my wheat yield increased dramatically.",
    },
  ];

  return (
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
  );
};

export default SuccessStories; 