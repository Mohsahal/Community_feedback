import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const UpcomingTopics = ({ t }) => {
  const trendingTopics = [
    { name: "Monsoon2023", posts: 342 },
    { name: "OrganicFarming", posts: 215 },
    { name: "DroughtResistant", posts: 189 },
    { name: "MarketPrices", posts: 167 },
    { name: "SoilHealth", posts: 134 },
  ];

  return (
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
  );
};

export default UpcomingTopics; 