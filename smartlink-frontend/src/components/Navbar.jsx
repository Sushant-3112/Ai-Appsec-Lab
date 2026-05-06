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

  const path = location.pathname;
  const isPublicProfile = path !== '/' && 
    !path.startsWith('/dashboard') && 
    !path.startsWith('/login') && 
    !path.startsWith('/register') && 
    !path.startsWith('/templates') && 
    !path.startsWith('/products') && 
    !path.startsWith('/marketplace') && 
    !path.startsWith('/discover') && 
    !path.startsWith('/pricing') && 
    !path.startsWith('/learn');

  if (isPublicProfile) return null;

  return (
    <nav className="absolute top-8 left-0 right-0 z-50 flex justify-center px-4 w-full">
      <div className="bg-white rounded-[100px] w-full max-w-[1300px] px-6 py-4 flex justify-between items-center transition-all bg-opacity-100 shadow-[0_2px_20px_rgba(0,0,0,0.05)] border border-gray-100 relative">
        <div className="flex items-center space-x-10">
          <Link to="/" className="flex items-center text-slate-900 ml-2 group">
            <span className="font-[900] text-[28px] tracking-[-0.05em] leading-none group-hover:scale-105 transition-transform duration-300">Ai Appsec lab</span>
            <span className="font-[900] text-[34px] ml-[1px] leading-none mt-1 group-hover:scale-105 transition-transform duration-300">*</span>
          </Link>
          <div className="hidden lg:flex items-center space-x-8">
            <div 
              onMouseEnter={() => setIsProductsHovered(true)}
              onMouseLeave={() => setIsProductsHovered(false)}
            >
              <Link to="/products" className="text-gray-500 hover:text-gray-900 font-semibold text-[16px] transition-colors py-[30px] inline-block">Products</Link>
              {isProductsHovered && (
                <div className="absolute left-0 top-[85px] pt-1">
                  <ProductsMenu />
                </div>
              )}
            </div>
            <Link to="/templates" className="text-gray-500 hover:text-gray-900 font-semibold text-[16px] transition-colors">Templates</Link>
            <Link to="/marketplace" className="text-gray-500 hover:text-gray-900 font-semibold text-[16px] transition-colors">Marketplace</Link>
            <Link to="/discover" className="text-gray-500 hover:text-gray-900 font-semibold text-[16px] transition-colors">Discover</Link>
            <Link to="/pricing" className="text-gray-500 hover:text-gray-900 font-semibold text-[16px] transition-colors">Pricing</Link>
            <div 
              onMouseEnter={() => setIsLearnHovered(true)}
              onMouseLeave={() => setIsLearnHovered(false)}
              className="relative"
            >
              <Link to="/learn" className="text-gray-500 hover:text-gray-900 font-semibold text-[16px] transition-colors py-[30px] inline-block">Learn</Link>
              {isLearnHovered && (
                <div className="absolute right-[-100px] xl:right-[-250px] top-[85px] pt-1">
                  <LearnMenu />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-[#111827] bg-[#f3f4f6] hover:bg-[#e5e7eb] px-6 py-[20px] rounded-[12px] font-bold text-[16px] transition-colors leading-none tracking-[-0.01em]">Dashboard</Link>
              <button onClick={logout} className="bg-[#111827] hover:bg-black text-white px-7 py-[20px] rounded-[100px] font-bold text-[16px] transition-colors leading-none tracking-[-0.01em]">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[#111827] bg-[#f3f4f6] hover:bg-[#e5e7eb] px-6 py-[20px] rounded-[12px] font-bold text-[16px] transition-colors leading-none tracking-[-0.01em]">Log in</Link>
              <Link to="/register" className="bg-[#111827] hover:bg-black text-white px-7 py-[20px] rounded-[100px] font-bold text-[16px] transition-colors leading-none tracking-[-0.01em] shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]">
                Sign up free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
