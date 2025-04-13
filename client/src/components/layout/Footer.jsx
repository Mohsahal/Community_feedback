import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Footer = () => {
  return (
    <footer className="bg-white text-farm-green-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <Card className="bg-white border border-farm-green-100 hover:border-farm-green-200 transition-all duration-200 shadow-sm rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-farm-green-600">AgroVerse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-farm-green-700 mb-4">
                Empowering farmers with technology for sustainable and profitable agriculture.
              </p>
              <div className="flex space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-farm-green-700 hover:text-farm-green-600 hover:bg-farm-green-50 rounded-full transition-all duration-200"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-farm-green-700 hover:text-farm-green-600 hover:bg-farm-green-50 rounded-full transition-all duration-200"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-farm-green-700 hover:text-farm-green-600 hover:bg-farm-green-50 rounded-full transition-all duration-200"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="bg-white border border-farm-green-100 hover:border-farm-green-200 transition-all duration-200 shadow-sm rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-farm-green-600">Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-farm-green-700 hover:text-farm-green-600 hover:bg-farm-green-50 p-2 rounded-md transition-all duration-200 flex items-center">
                    <span className="w-2 h-2 bg-farm-green-600 rounded-full mr-2"></span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/chatbot" className="text-farm-green-700 hover:text-farm-green-600 hover:bg-farm-green-50 p-2 rounded-md transition-all duration-200 flex items-center">
                    <span className="w-2 h-2 bg-farm-green-600 rounded-full mr-2"></span>
                    Chatbot
                  </Link>
                </li>
                <li>
                  <Link to="/crop-recommendation" className="text-farm-green-700 hover:text-farm-green-600 hover:bg-farm-green-50 p-2 rounded-md transition-all duration-200 flex items-center">
                    <span className="w-2 h-2 bg-farm-green-600 rounded-full mr-2"></span>
                    Crop Recommendation
                  </Link>
                </li>
                <li>
                  <Link to="/price-forecasting" className="text-farm-green-700 hover:text-farm-green-600 hover:bg-farm-green-50 p-2 rounded-md transition-all duration-200 flex items-center">
                    <span className="w-2 h-2 bg-farm-green-600 rounded-full mr-2"></span>
                    Price Forecasting
                  </Link>
                </li>
                <li>
                  <Link to="/disease-detection" className="text-farm-green-700 hover:text-farm-green-600 hover:bg-farm-green-50 p-2 rounded-md transition-all duration-200 flex items-center">
                    <span className="w-2 h-2 bg-farm-green-600 rounded-full mr-2"></span>
                    Disease Detection
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="bg-white border border-farm-green-100 hover:border-farm-green-200 transition-all duration-200 shadow-sm rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-farm-green-600">Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-farm-green-700 hover:text-farm-green-600 hover:bg-farm-green-50 p-2 rounded-md transition-all duration-200">
                  <MapPin className="h-5 w-5 mr-2 text-farm-green-600" />
                  <span>123 Farm Avenue, Agricultural District</span>
                </div>
                <div className="flex items-center text-farm-green-700 hover:text-farm-green-600 hover:bg-farm-green-50 p-2 rounded-md transition-all duration-200">
                  <Mail className="h-5 w-5 mr-2 text-farm-green-600" />
                  <span>info@agroverse.com</span>
                </div>
                <div className="flex items-center text-farm-green-700 hover:text-farm-green-600 hover:bg-farm-green-50 p-2 rounded-md transition-all duration-200">
                  <Phone className="h-5 w-5 mr-2 text-farm-green-600" />
                  <span>(123) 456-7890</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Newsletter */}
          <Card className="bg-white border border-farm-green-100 hover:border-farm-green-200 transition-all duration-200 shadow-sm rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-farm-green-600">Newsletter</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-farm-green-700 mb-4">Subscribe to our newsletter for updates</p>
              <div className="flex space-x-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white border border-farm-green-100 hover:border-farm-green-200 focus:border-farm-green-300 focus:ring-farm-green-100 rounded-md transition-all duration-200 placeholder:text-farm-green-400"
                />
                <Button 
                  variant="default" 
                  className="bg-farm-green-600 text-white hover:bg-farm-green-700 rounded-md transition-all duration-200"
                >
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="border-t border-farm-green-100 mt-8 pt-8 text-center">
          <p className="text-farm-green-700">© {new Date().getFullYear()} AgroVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;







