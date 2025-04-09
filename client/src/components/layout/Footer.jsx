import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-farm-green-700 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">FarmTech Connect</h3>
            <p className="mb-4">
              Empowering farmers with technology for sustainable and profitable agriculture.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-farm-green-300 transition-colors">
                Facebook
              </a>
              <a href="#" className="hover:text-farm-green-300 transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-farm-green-300 transition-colors">
                Instagram
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-farm-green-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="hover:text-farm-green-300 transition-colors">
                  Chatbot
                </Link>
              </li>
              <li>
                <Link to="/crop-recommendation" className="hover:text-farm-green-300 transition-colors">
                  Crop Recommendation
                </Link>
              </li>
              <li>
                <Link to="/price-forecasting" className="hover:text-farm-green-300 transition-colors">
                  Price Forecasting
                </Link>
              </li>
              <li>
                <Link to="/disease-detection" className="hover:text-farm-green-300 transition-colors">
                  Disease Detection
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <address className="not-italic">
              <p className="mb-2">123 Farm Avenue</p>
              <p className="mb-2">Agricultural District</p>
              <p className="mb-4">Rural County, 12345</p>
              <p className="mb-2">Email: info@farmtechconnect.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-farm-green mt-8 pt-8 text-center">
          <p>© {new Date().getFullYear()} FarmTech Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;





