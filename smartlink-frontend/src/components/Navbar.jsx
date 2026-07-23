import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProductsMenu from './ProductsMenu';
import LearnMenu from './LearnMenu';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const [isLearnHovered, setIsLearnHovered] = useState(false);

  // Hide global navbar on dedicated full-screen auth pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex justify-between items-center">
        
        {/* Left Logo & Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center text-slate-900 group">
            <span className="font-black text-2xl tracking-tight group-hover:text-blue-600 transition-colors">Ai Appsec lab</span>
            <span className="font-black text-2xl text-blue-600 ml-0.5">*</span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-6">
            <div 
              onMouseEnter={() => setIsProductsHovered(true)}
              onMouseLeave={() => setIsProductsHovered(false)}
              className="relative py-4"
            >
              <Link to="/products" className="text-gray-600 hover:text-gray-900 font-semibold text-sm transition-colors">Products</Link>
              {isProductsHovered && (
                <div className="absolute left-0 top-full pt-1">
                  <ProductsMenu />
                </div>
              )}
            </div>
            <Link to="/templates" className="text-gray-600 hover:text-gray-900 font-semibold text-sm transition-colors">Templates</Link>
            <Link to="/marketplace" className="text-gray-600 hover:text-gray-900 font-semibold text-sm transition-colors">Marketplace</Link>
            <Link to="/discover" className="text-gray-600 hover:text-gray-900 font-semibold text-sm transition-colors">Discover</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900 font-semibold text-sm transition-colors">Pricing</Link>
            <div 
              onMouseEnter={() => setIsLearnHovered(true)}
              onMouseLeave={() => setIsLearnHovered(false)}
              className="relative py-4"
            >
              <Link to="/learn" className="text-gray-600 hover:text-gray-900 font-semibold text-sm transition-colors">Learn</Link>
              {isLearnHovered && (
                <div className="absolute right-[-100px] xl:right-[-250px] top-full pt-1">
                  <LearnMenu />
                </div>
              )}
            </div>
          </nav>
        </div>
        
        {/* Right User Auth Actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-900 bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-full font-bold text-sm transition-all">Dashboard</Link>
              <button onClick={logout} className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-900 bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-full font-bold text-sm transition-all">Log in</Link>
              <Link to="/register" className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-xs">
                Sign up free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
