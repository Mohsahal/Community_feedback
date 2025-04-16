import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/utils";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
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

  const handleAddAccount = () => {
    navigate('/');
  };

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Chatbot", path: "/chatbot" },
    { name: "Crop Recommendation", path: "/crop-recommendation" },
    { name: "Price Forecasting", path: "/price-forecasting" },
    { name: "Disease Detection", path: "/disease-detection" },
    { name: "Community", path: "/community" },
    { name: "Fertilizers", path: "/fertilizer-recommendation" },
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-farm-green-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60",
      scrolled && "shadow-sm"
    )}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <div className="flex items-center gap-6 md:gap-10">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl text-farm-green-600">AgroVerse</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-farm-green-600",
                    location.pathname === link.path
                      ? "text-farm-green-600"
                      : "text-farm-green-700/80"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-1" />

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-farm-green-50">
                  <Avatar className="h-9 w-9 border border-farm-green-100">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-farm-green-100 text-farm-green-600 text-lg font-bold">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 rounded-md border border-farm-green-100 bg-white shadow-lg" 
                align="end" 
                forceMount
              >
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-farm-green-600">{user?.name}</p>
                    <p className="text-xs leading-none text-farm-green-700/80">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="h-px bg-farm-green-100" />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="p-2 text-red-600 hover:bg-red-50 cursor-pointer focus:bg-red-50 focus:text-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  className="p-2 text-farm-green-600 hover:bg-farm-green-50 cursor-pointer focus:bg-farm-green-50 focus:text-farm-green-700" 
                  onClick={handleAddAccount}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Add an Account</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                className="hover:bg-farm-green-50"
              >
                {isOpen ? <X size={24} className="text-farm-green-600" /> : <Menu size={24} className="text-farm-green-600" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden border-t border-farm-green-100">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-2 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-md transition-colors",
                    location.pathname === link.path
                      ? "bg-farm-green-50 text-farm-green-600"
                      : "text-farm-green-700 hover:bg-farm-green-50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;


