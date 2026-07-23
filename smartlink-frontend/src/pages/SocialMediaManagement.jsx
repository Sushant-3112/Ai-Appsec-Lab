import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Instagram, Twitter, Youtube, Music, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

const SocialMediaManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Share2 size={16} />
            Manage Your Social Media
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Grow and Engage
            <br />
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Your Audience
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect all your social media accounts in one place. Schedule posts, track engagement, 
            and grow your audience across every platform.
          </p>
        </div>

        {/* Social Platforms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl p-8 text-white shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <Instagram size={48} className="mb-4" />
            <h3 className="text-2xl font-bold mb-2">Instagram</h3>
            <p className="text-white/80 text-sm">Connect your Instagram profile and stories</p>
          </div>

          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-8 text-white shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <Twitter size={48} className="mb-4" />
            <h3 className="text-2xl font-bold mb-2">Twitter</h3>
            <p className="text-white/80 text-sm">Share your tweets and threads</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-8 text-white shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <Youtube size={48} className="mb-4" />
            <h3 className="text-2xl font-bold mb-2">YouTube</h3>
            <p className="text-white/80 text-sm">Showcase your latest videos</p>
          </div>

          <div className="bg-gradient-to-br from-black to-gray-800 rounded-2xl p-8 text-white shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <Music size={48} className="mb-4" />
            <h3 className="text-2xl font-bold mb-2">TikTok</h3>
            <p className="text-white/80 text-sm">Link your viral TikTok content</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <Calendar size={24} className="text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Schedule Posts</h3>
            <p className="text-gray-600">
              Plan and schedule your content across all platforms. Post at the perfect time automatically.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <BarChart3 size={24} className="text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Track Analytics</h3>
            <p className="text-gray-600">
              Monitor engagement, reach, and growth across all your social media accounts in one dashboard.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
              <TrendingUp size={24} className="text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Grow Faster</h3>
            <p className="text-gray-600">
              Get insights and recommendations to optimize your content and grow your audience faster.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-12 text-white mb-20 shadow-2xl">
          <h2 className="text-4xl font-black text-center mb-12">Trusted by Creators Worldwide</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-black mb-2">70M+</div>
              <div className="text-orange-100">Active Users</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">5B+</div>
              <div className="text-orange-100">Monthly Clicks</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">200+</div>
              <div className="text-orange-100">Countries</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">99.9%</div>
              <div className="text-orange-100">Uptime</div>
            </div>
          </div>
        </div>

        {/* Integration Showcase */}
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 mb-20">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-8">
            All Your Platforms, One Dashboard
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Manage Instagram, Twitter, YouTube, TikTok, LinkedIn, Facebook, and more from a single, unified interface.
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[Instagram, Twitter, Youtube, Music, Share2].map((Icon, i) => (
              <div key={i} className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Icon size={32} className="text-gray-600" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-6">Ready to Grow Your Audience?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join millions of creators who use AI Appsec Lab to manage and grow their social media presence
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="bg-orange-600 text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-orange-700 transition-all shadow-xl hover:shadow-2xl"
          >
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaManagement;
