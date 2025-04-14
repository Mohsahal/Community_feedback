import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const UpcomingEvents = ({ t }) => {
  const upcomingEvents = [
    {
      title: "Organic Farming Workshop",
      date: "June 15, 2023",
      location: "Virtual",
      type: "Workshop",
      isFree: true,
    },
  ];

  return (
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
  );
};

export default UpcomingEvents; 