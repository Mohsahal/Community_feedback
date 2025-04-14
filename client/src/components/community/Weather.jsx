import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import axios from 'axios'

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const search = async (city) => {
    try {
      const url = `/api/weather/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_API_ID}&units=metric`;
      const response = await axios.get(url);
      setWeather(response.data);
      console.log(response.data)
      setError(null);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setError("Failed to fetch weather data");
    }
  }
    
  useEffect(() => {
    search("delhi");
  },[]);

  if (error) {
    return (
      <Card className="border border-black/10 hover:border-black/30 transition-all duration-200 shadow-sm rounded-lg">
        <CardHeader className="bg-farm-green-500 text-white p-2">
          <h3 className="text-lg font-semibold">Local Weather</h3>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-black/10 hover:border-black/30 transition-all duration-200 shadow-sm rounded-lg">
      <CardHeader className="bg-farm-green-500 text-white p-2">
        <h3 className="text-lg font-semibold">Local Weather</h3>
      </CardHeader>
      <CardContent className="pt-6">
        {weather ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-3xl font-bold text-black/90">{Math.round(weather.main.temp)}°C</p>
                <p className="text-sm text-black/70">{weather.weather[0].description}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-black/90">{weather.name}</p>
                <p className="text-sm text-black/70">Humidity: {weather.main.humidity}%</p>
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
          </>
        ) : (
          <p>Loading weather data...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Weather; 