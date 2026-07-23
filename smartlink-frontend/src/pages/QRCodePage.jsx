import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Download, Palette, Smartphone, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodePage = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('https://linktr.ee/yourname');
  const [color, setColor] = useState('#000000');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <QrCode size={16} />
              QR Code Generator
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Turn Links Into
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Scannable QR Codes
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Create custom QR codes for your links, posters, business cards, and more. 
              Make it easy for anyone to access your content with a quick scan.
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="bg-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Create QR Code
              <ArrowRight size={20} />
            </button>
          </div>

          {/* QR Code Generator */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Generate Your QR Code</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Choose Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-16 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none font-mono"
                  />
                </div>
              </div>

              {/* QR Code Preview */}
              <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center">
                <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
                  <QRCodeSVG 
                    value={url} 
                    size={200}
                    fgColor={color}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <button className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-all">
                  <Download size={18} />
                  Download QR Code
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Palette size={24} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Customizable Design</h3>
            <p className="text-gray-600">
              Choose colors, add logos, and customize your QR code to match your brand identity.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
              <Smartphone size={24} className="text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile Optimized</h3>
            <p className="text-gray-600">
              QR codes work perfectly on all devices and can be scanned from any smartphone camera.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
              <Download size={24} className="text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">High Resolution</h3>
            <p className="text-gray-600">
              Download in multiple formats (PNG, SVG) perfect for print and digital use.
            </p>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Perfect For</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Social Media</h4>
              <p className="text-sm text-gray-600">Share on posts & stories</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💼</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Business Cards</h4>
              <p className="text-sm text-gray-600">Easy contact sharing</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📄</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Posters & Flyers</h4>
              <p className="text-sm text-gray-600">Print marketing materials</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎫</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Events</h4>
              <p className="text-sm text-gray-600">Tickets & registrations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
