import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/utils";
import { toast } from "react-toastify";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 1500,
    });
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Chatbot", path: "/chatbot" },
    { name: "Crop Recommendation", path: "/crop-recommendation" },
    { name: "Price Forecasting", path: "/price-forecasting" },
    { name: "Disease Detection", path: "/disease-detection" },
    { name: "Community", path: "/community" },
    { name: "Fertilizers", path: "/fertilizer-recommendation" },
  ];

  return (
    <header className={cn(
      "border-b border-border sticky top-0 z-50 transition-all duration-300",
      scrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-background"
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-farm-green-600 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
              <span className="text-white font-bold text-lg">AV</span>
            </div>
            <span className="text-xl font-bold text-farm-green-600 transition-colors group-hover:text-farm-green-500">AgroVerse</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative",
                  "before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5 before:bg-farm-green-500 before:scale-x-0 before:origin-right before:transition-transform before:duration-300",
                  "hover:before:scale-x-100 hover:before:origin-left",
                  location.pathname === link.path
                    ? "text-farm-green-600 font-semibold"
                    : "hover:bg-farm-green-50"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Logout Button */}
            <Button 
              variant="outline" 
              size="sm"
              className="hidden md:flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                className="transition-all hover:bg-farm-green-100 hover:text-farm-green-600"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-3 pb-3 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-md transition-all duration-300",
                    "hover:bg-farm-green-100",
                    location.pathname === link.path
                      ? "bg-farm-green-50 text-farm-green-600 font-semibold"
                      : ""
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 mt-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;


