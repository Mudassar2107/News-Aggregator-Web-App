import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import logo from "../images/news-logo.jpg";
import lens from "../images/search.svg";

function Navbar({setMenu, setSearch}) {
  const { logout, isAuthenticated, user } = useAuth0();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout({ 
      logoutParams: {
        returnTo: window.location.origin + '/News-Aggregator-Web-App/#/signin'
      }
     });
     toast.success("Logged out successfully!");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 text-white ${
      scrolled ? 'bg-black shadow-lg' : 'bg-black/95'
    }`}>
      <div className="container mx-auto px-4">
        {/* Main Navbar */}
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={logo} 
              alt="News Logo" 
              className="h-8 w-8 md:h-10 md:w-10 object-contain"
            />
          </div>

          {/* Search Bar - Hidden on Mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search news..."
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 text-white placeholder-gray-400 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/20"
              />
              <img 
                src={lens} 
                alt="Search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
              />
            </div>
          </div>

          {/* User Profile & Menu Button */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-3">
                <img
                  src={user?.picture}
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm font-medium">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search - Visible only on Mobile */}
        <div className="md:hidden py-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search news..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-gray-400 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/20"
            />
            <img 
              src={lens} 
              alt="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
            />
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="hidden md:block border-t border-white/10 -mt-2">
          <div className="flex justify-center space-x-1 -my-1">
            {['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'].map((category) => (
              <button
                key={category}
                onClick={() => setMenu(category)}
                className="px-4 py-1.5 text-sm font-medium rounded-full hover:bg-white/10 transition-colors duration-200 capitalize"
              >
                {category === 'general' ? 'Home' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="py-2 space-y-1 border-t border-white/10">
            {['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'].map((category) => (
              <button
                key={category}
                onClick={() => {
                  setMenu(category);
                  setIsMenuOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm font-medium hover:bg-white/10 transition-colors duration-200 capitalize"
              >
                {category === 'general' ? 'Home' : category}
              </button>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm font-medium hover:bg-white/10 transition-colors duration-200"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;