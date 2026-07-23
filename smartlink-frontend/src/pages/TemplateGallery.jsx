import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Star, Zap, Palette, ArrowRight } from 'lucide-react';
import templatesData from '../data/templateData';

/**
 * Template Gallery - Display multiple templates side-by-side
 * Similar to Linktree's template showcase
 */
const TemplateGallery = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);

  // Featured template groups to showcase
  const featuredGroups = [
    {
      title: "Vibrant Gradients",
      subtitle: "Bold colors that pop",
      templates: [12, 13, 14] // The 3 Vivi Shin variants
    },
    {
      title: "Professional Layouts",
      subtitle: "Clean and elegant",
      templates: [15, 1, 4] // Beach, Katy Delma, Brew & Bite
    },
    {
      title: "Creative Styles",
      subtitle: "Stand out from the crowd",
      templates: [2, 3, 5] // Matthew Hugh, Richie Cohen, Lindsey Dennis
    },
    {
      title: "Media & Content",
      subtitle: "Perfect for creators",
      templates: [7, 8, 9] // Voice Messages, Library, Interludes
    }
  ];

  const handleTemplateClick = (templateId) => {
    navigate(`/templates/editor/${templateId}`);
  };

  const TemplatePhone = ({ template, index, groupIndex }) => {
    const isHovered = hoveredId === template.id;
    
    return (
      <div 
        className="relative group"
        onMouseEnter={() => setHoveredId(template.id)}
        onMouseLeave={() => setHoveredId(null)}
        style={{
          animation: `fadeInUp 0.6s ease-out ${(groupIndex * 0.3) + (index * 0.15)}s both`
        }}
      >
        {/* Phone Frame */}
        <div 
          className={`relative w-full max-w-[280px] mx-auto aspect-[9/19] rounded-[40px] border-[12px] border-gray-900 overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer
            ${isHovered ? 'scale-105 shadow-3xl border-indigo-600' : 'scale-100'}`}
          onClick={() => handleTemplateClick(template.id)}
          style={template.bgStyle ? { background: template.bgStyle } : {}}
        >
          {/* Background Image */}
          {template.bgImage && (
            <img 
              src={template.bgImage} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover opacity-80" 
            />
          )}
          
          {/* Background Overlay */}
          {template.bgOverlay && (
            <div className={`absolute inset-0 ${template.bgOverlay}`} />
          )}

          {/* Decorative blobs for linktree variants */}
          {template.variant?.startsWith('linktree') && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div 
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-60 blur-xl"
                style={{ background: template.id === 12 ? '#ff6f00' : template.id === 13 ? '#f9a825' : '#e91e63' }} 
              />
              <div 
                className="absolute top-1/3 -left-10 w-28 h-28 rounded-full opacity-50 blur-xl"
                style={{ background: template.id === 12 ? '#e91e8c' : template.id === 13 ? '#000' : '#ff6f00' }} 
              />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 w-full h-full px-4 py-8 flex flex-col items-center">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold mb-2 shadow-lg border-2 border-white/30">
              {template.avatarInitials || 'VS'}
            </div>
            
            {/* Name */}
            <h3 className={`font-bold text-sm mb-1 text-center ${template.textClass}`}>
              {template.name}
            </h3>
            
            {/* Bio */}
            <p className={`text-[9px] text-center opacity-80 mb-4 max-w-[85%] line-clamp-2 ${template.textClass}`}>
              {template.description}
            </p>

            {/* Buttons */}
            <div className="w-full flex flex-col gap-2 px-2">
              {template.buttons.slice(0, 3).map((btn, i) => (
                <div 
                  key={i} 
                  className={`w-full py-2.5 px-3 rounded-[20px] font-bold text-[9px] text-center shadow-sm ${template.btnClass}`}
                >
                  {btn}
                </div>
              ))}
            </div>

            {/* Social Icons */}
            <div className={`flex gap-3 mt-auto ${template.socialClass}`}>
              <div className="w-4 h-4 rounded-full bg-white/20" />
              <div className="w-4 h-4 rounded-full bg-white/20" />
              <div className="w-4 h-4 rounded-full bg-white/20" />
            </div>
          </div>

          {/* Hover Overlay */}
          <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 transition-opacity duration-300 z-30 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-transform">
              Use Template
            </button>
            <p className="text-white text-xs font-medium">{template.name}</p>
          </div>
        </div>

        {/* Template Label */}
        <div className="mt-4 text-center">
          <p className="font-bold text-gray-900 text-sm">{template.name}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{template.description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 pt-48 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Palette size={16} />
            Template Gallery
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Choose Your Perfect
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Template Style
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Browse our collection of professionally designed templates. Each one is fully customizable and mobile-optimized.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-center gap-12 mb-20 flex-wrap">
          <div className="text-center">
            <div className="text-4xl font-black text-indigo-600 mb-1">15+</div>
            <div className="text-sm text-gray-600 font-medium">Templates</div>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div className="text-center">
            <div className="text-4xl font-black text-purple-600 mb-1">∞</div>
            <div className="text-sm text-gray-600 font-medium">Customizations</div>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div className="text-center">
            <div className="text-4xl font-black text-pink-600 mb-1">1-Click</div>
            <div className="text-sm text-gray-600 font-medium">Setup</div>
          </div>
        </div>

        {/* Featured Template Groups */}
        {featuredGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-24">
            {/* Group Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                {group.title}
              </h2>
              <p className="text-gray-600 text-lg">{group.subtitle}</p>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {group.templates.map((templateId, index) => {
                const template = templatesData.find(t => t.id === templateId);
                return template ? (
                  <TemplatePhone 
                    key={template.id} 
                    template={template} 
                    index={index}
                    groupIndex={groupIndex}
                  />
                ) : null;
              })}
            </div>
          </div>
        ))}

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <Zap size={48} className="mx-auto mb-6" />
          <h2 className="text-4xl font-black mb-4">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Choose any template and customize it to match your brand in minutes
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button 
              onClick={() => navigate('/templates')}
              className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
            >
              Browse All Templates
              <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/dashboard?tab=templates')}
              className="bg-white/20 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <Smartphone size={24} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile First</h3>
            <p className="text-gray-600">All templates are optimized for mobile devices and look perfect on any screen size.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Star size={24} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Save Favorites</h3>
            <p className="text-gray-600">Star your favorite templates and build your personal collection for quick access.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
              <Zap size={24} className="text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Switch</h3>
            <p className="text-gray-600">Change your active template anytime with one click. No coding required.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TemplateGallery;
