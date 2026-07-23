import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProductsMenu from './ProductsMenu';
import LearnMenu from './LearnMenu';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, QrCode, Copy, Check, X, ExternalLink, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const [isLearnHovered, setIsLearnHovered] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Hide global navbar on dedicated full-screen auth pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const shareUrl = window.location.origin;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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
        
        {/* Right User Auth & Quick Share Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Quick Share & QR Button (Enhanced UX) */}
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-full font-bold text-xs transition-all cursor-pointer border border-gray-200"
            title="Generate QR Code & Share Profile"
          >
            <QrCode size={15} className="text-blue-600" />
            <span className="hidden sm:inline">QR Code</span>
          </button>

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

      {/* Share & Live QR Code Modal Popup (Fixed Top Clipping) */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto font-sans animate-fadeIn flex flex-col justify-center items-center">
          <div className="bg-white rounded-3xl max-w-sm w-full my-auto shadow-2xl border border-gray-200 text-gray-900 relative overflow-hidden flex flex-col max-h-[85vh] animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-5 py-3.5 border-b border-gray-100 bg-gray-50/90 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <QrCode size={16} />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-extrabold text-gray-900 leading-tight">Share Bio Profile & QR</h3>
                  <p className="text-[10px] text-gray-500 font-medium">Scan code or copy instant link</p>
                </div>
              </div>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-200 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* QR Code Graphic Display */}
            <div className="p-5 flex flex-col items-center text-center space-y-3.5 overflow-y-auto">
              
              {/* Main White QR Container */}
              <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-md flex flex-col items-center justify-center w-full max-w-[210px]">
                <div id="qr-code-svg-container" className="p-1 bg-white rounded-lg">
                  <QRCodeSVG 
                    id="qr-code-svg"
                    value={shareUrl}
                    size={140}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <span className="mt-2.5 text-[9px] font-black text-blue-600 tracking-widest uppercase flex items-center gap-1 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  <ShieldCheck size={11} /> Ai Appsec Verified
                </span>
              </div>

              {/* Download QR Button */}
              <button
                onClick={() => {
                  const svg = document.getElementById('qr-code-svg');
                  if (svg) {
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    const img = new Image();
                    img.onload = () => {
                      canvas.width = img.width + 40;
                      canvas.height = img.height + 40;
                      if (ctx) {
                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 20, 20);
                        const pngFile = canvas.toDataURL("image/png");
                        const downloadLink = document.createElement("a");
                        downloadLink.download = "ai-appsec-lab-qrcode.png";
                        downloadLink.href = pngFile;
                        downloadLink.click();
                      }
                    };
                    img.src = "data:image/svg+xml;base64," + btoa(svgData);
                  }
                }}
                className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-[11px] rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 border border-gray-200"
              >
                <span>📥 Download QR Image</span>
              </button>

              {/* URL Input Box + Copy Button */}
              <div className="w-full relative flex items-center">
                <input 
                  type="text" 
                  readOnly 
                  value={shareUrl}
                  className="w-full pl-3 pr-20 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[11px] font-mono font-semibold text-gray-700 outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="absolute right-1 px-2.5 py-1.5 bg-gray-900 hover:bg-black text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                >
                  {copied ? (
                    <span className="text-emerald-400 flex items-center gap-1"><Check size={11} /> Copied!</span>
                  ) : (
                    <span className="flex items-center gap-1"><Copy size={11} /> Copy</span>
                  )}
                </button>
              </div>

              {/* Social Share Buttons */}
              <div className="w-full pt-2.5 border-t border-gray-100">
                <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Share directly to</p>
                <div className="grid grid-cols-3 gap-2">
                  <a 
                    href={`https://twitter.com/intent/tweet?text=Check%20out%20my%20Ai%20Appsec%20lab%20profile!&url=${encodeURIComponent(shareUrl)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="py-2 px-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold hover:bg-black transition text-center"
                  >
                    Twitter / X
                  </a>
                  <a 
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="py-2 px-2 bg-emerald-600 text-white rounded-xl text-[10px] font-bold hover:bg-emerald-700 transition text-center"
                  >
                    WhatsApp
                  </a>
                  <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="py-2 px-2 bg-blue-600 text-white rounded-xl text-[10px] font-bold hover:bg-blue-700 transition text-center"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;
