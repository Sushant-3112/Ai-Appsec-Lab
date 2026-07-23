import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as LinkIcon, Sparkles, CheckCircle, ArrowRight, Instagram, Twitter, Youtube, Music } from 'lucide-react';

const LinkInBio = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <LinkIcon size={16} />
              Link in Bio + Tools
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Customize Your
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Appsec Lab
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              One link to share everything you create, curate, and sell across all your socials. 
              Join 70M+ creators using AI Appsec Lab as their link in bio.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button 
                onClick={() => navigate('/register')}
                className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => navigate('/templates/gallery')}
                className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-lg border-2 border-gray-200"
              >
                View Templates
              </button>
            </div>
          </div>

          {/* Featured Phone Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-3xl blur-3xl opacity-30"></div>
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"></div>
                  <div>
                    <div className="font-bold text-gray-900">linktr.ee/aibaana</div>
                    <div className="text-sm text-gray-500">Alba</div>
                  </div>
                </div>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">Welcome to my space</p>
                </div>
                <div className="flex justify-center gap-4 mb-4">
                  <Instagram size={20} className="text-gray-600" />
                  <Twitter size={20} className="text-gray-600" />
                  <Youtube size={20} className="text-gray-600" />
                </div>
                <div className="space-y-2">
                  <div className="bg-gray-100 rounded-lg py-3 text-center text-sm font-semibold">My Portfolio</div>
                  <div className="bg-gray-100 rounded-lg py-3 text-center text-sm font-semibold">Shop My Store</div>
                  <div className="bg-gray-100 rounded-lg py-3 text-center text-sm font-semibold">Latest Video</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Everything You Need in One Link</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Sparkles size={24} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">15+ Templates</h3>
              <p className="text-gray-600">Choose from professionally designed templates that match your brand and style.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <CheckCircle size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Unlimited Links</h3>
              <p className="text-gray-600">Add as many links as you want. No restrictions on your creativity.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                <LinkIcon size={24} className="text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Domain</h3>
              <p className="text-gray-600">Use your own domain or get a free linktr.ee/yourname URL.</p>
            </div>
          </div>
        </div>

        {/* Social Platforms */}
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-4">
            AI Appsec Lab for Every Social Platform
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Grow and engage your audience everywhere
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                <Instagram size={32} />
              </div>
              <span className="text-sm font-semibold text-gray-700">Instagram</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <Twitter size={32} />
              </div>
              <span className="text-sm font-semibold text-gray-700">Twitter</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-lg">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">LinkedIn</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white shadow-lg">
                <Youtube size={32} />
              </div>
              <span className="text-sm font-semibold text-gray-700">YouTube</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-black to-gray-800 flex items-center justify-center text-white shadow-lg">
                <Music size={32} />
              </div>
              <span className="text-sm font-semibold text-gray-700">TikTok</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join millions of creators who trust AI Appsec Lab to connect with their audience
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="bg-indigo-600 text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-indigo-700 transition-all shadow-xl hover:shadow-2xl inline-flex items-center gap-3"
          >
            Create Your Link in Bio
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkInBio;
