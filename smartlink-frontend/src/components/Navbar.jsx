import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProductsMenu from './ProductsMenu';
import LearnMenu from './LearnMenu';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const [isLearnHovered, setIsLearnHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide global navbar on dedicated full-screen auth pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const navLinks = [
    { name: 'Templates', path: '/templates' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Discover', path: '/discover' },
    { name: 'Pricing', path: '/pricing' },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        
        {/* Left Logo & Navigation Links */}
        <div className="flex items-center space-x-8 h-full">
          <Link to="/" className="flex items-center text-slate-900 group shrink-0">
            <span className="font-black text-2xl tracking-tight group-hover:text-blue-600 transition-colors">Ai Appsec lab</span>
            <span className="font-black text-2xl text-blue-600 ml-0.5">*</span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-7 h-full">
            {/* Products Dropdown */}
            <div 
              onMouseEnter={() => setIsProductsHovered(true)}
              onMouseLeave={() => setIsProductsHovered(false)}
              className="relative flex items-center h-full"
            >
              <Link 
                to="/products" 
                className="text-gray-600 hover:text-gray-900 font-semibold text-sm transition-colors flex items-center gap-1 py-2"
              >
                <span>Products</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isProductsHovered ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />
              </Link>
              {isProductsHovered && (
                <div className="absolute left-0 top-full pt-1 z-50">
                  <ProductsMenu />
                </div>
              )}
            </div>

            {/* Standard Nav Links */}
            {navLinks.map((link) => (
              <div key={link.name} className="flex items-center h-full">
                <Link 
                  to={link.path} 
                  className="text-gray-600 hover:text-gray-900 font-semibold text-sm transition-colors py-2"
                >
                  {link.name}
                </Link>
              </div>
            ))}

            {/* Learn Dropdown */}
            <div 
              onMouseEnter={() => setIsLearnHovered(true)}
              onMouseLeave={() => setIsLearnHovered(false)}
              className="relative flex items-center h-full"
            >
              <Link 
                to="/learn" 
                className="text-gray-600 hover:text-gray-900 font-semibold text-sm transition-colors flex items-center gap-1 py-2"
              >
                <span>Learn</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isLearnHovered ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />
              </Link>
              {isLearnHovered && (
                <div className="absolute right-0 top-full pt-1 z-50">
                  <LearnMenu />
                </div>
              )}
            </div>
          </nav>
        </div>
        
        {/* Right User Auth */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-900 bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-full font-bold text-sm transition-all border border-gray-200/80">Dashboard</Link>
              <button onClick={logout} className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer shadow-xs">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-900 bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-full font-bold text-sm transition-all border border-gray-200/80">Log in</Link>
              <Link to="/register" className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-xs">
                Sign up free
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 px-6 py-5 space-y-4 animate-fadeIn">
          <Link 
            to="/products" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 font-bold text-base hover:text-blue-600"
          >
            Products
          </Link>
          <Link 
            to="/templates" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 font-bold text-base hover:text-blue-600"
          >
            Templates
          </Link>
          <Link 
            to="/marketplace" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 font-bold text-base hover:text-blue-600"
          >
            Marketplace
          </Link>
          <Link 
            to="/discover" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 font-bold text-base hover:text-blue-600"
          >
            Discover
          </Link>
          <Link 
            to="/pricing" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 font-bold text-base hover:text-blue-600"
          >
            Pricing
          </Link>
          <Link 
            to="/learn" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 font-bold text-base hover:text-blue-600"
          >
            Learn
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
