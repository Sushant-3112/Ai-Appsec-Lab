import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, Copy, BarChart3, Shield, Zap, CheckCircle } from 'lucide-react';

const LinkShortener = () => {
  const navigate = useNavigate();
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShorten = () => {
    if (longUrl) {
      const randomSlug = Math.random().toString(36).substring(2, 8);
      setShortUrl(`linktr.ee/${randomSlug}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Link2 size={16} />
            Link Shortener
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Create Trackable,
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Shareable Short Links
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform long, complex URLs into clean, branded short links. Track clicks, analyze performance, and share with confidence.
          </p>

          {/* Link Shortener Tool */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="space-y-4">
              <div>
                <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                  Paste your long URL here
                </label>
                <input
                  type="url"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url/that/needs/shortening"
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-gray-900 text-lg"
                />
              </div>

              <button
                onClick={handleShorten}
                disabled={!longUrl}
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Zap size={20} />
                Shorten Link
              </button>

              {shortUrl && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your shortened link
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={shortUrl}
                      readOnly
                      className="flex-1 px-4 py-3 rounded-lg bg-white border border-emerald-300 text-emerald-700 font-mono text-lg"
                    />
                    <button
                      onClick={handleCopy}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2"
                    >
                      {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <BarChart3 size={24} className="text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Track Performance</h3>
            <p className="text-gray-600">
              See how many clicks your links get, where they come from, and when they're most active.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
              <Shield size={24} className="text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Reliable</h3>
            <p className="text-gray-600">
              Your links are protected with enterprise-grade security and 99.9% uptime guarantee.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Link2 size={24} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Slugs</h3>
            <p className="text-gray-600">
              Create memorable, branded short links with custom slugs that match your brand.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white text-center shadow-2xl">
          <h2 className="text-4xl font-black mb-8">Trusted by Millions</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-black mb-2">10B+</div>
              <div className="text-emerald-100 text-lg">Links Created</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">99.9%</div>
              <div className="text-emerald-100 text-lg">Uptime</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">150+</div>
              <div className="text-emerald-100 text-lg">Countries</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-6">Start Shortening Links Today</h2>
          <button 
            onClick={() => navigate('/register')}
            className="bg-emerald-600 text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-emerald-700 transition-all shadow-xl hover:shadow-2xl"
          >
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkShortener;
