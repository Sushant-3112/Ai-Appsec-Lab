import React, { useState } from 'react';
import { CheckCircle, MapPin, Mail, Youtube, Instagram, Twitter, Music, Globe, Zap } from 'lucide-react';
import templatesData from '../data/templateData';

/**
 * Multi-Template Preview Component
 * Shows 3 template variants side-by-side like in the reference image
 */
const MultiTemplatePreview = ({ user, profileData, links, onTemplateSelect }) => {
  const [hoveredId, setHoveredId] = useState(null);
  
  // Get 3 templates to showcase (current + 2 alternatives)
  const currentTemplateId = parseInt(profileData.theme_config) || 1;
  const currentTemplate = templatesData.find(t => t.id === currentTemplateId);
  
  // Get 2 alternative templates (prefer same category or style)
  const alternativeTemplates = templatesData
    .filter(t => t.id !== currentTemplateId)
    .slice(0, 2);
  
  const templatesToShow = [currentTemplate, ...alternativeTemplates].filter(Boolean);

  const TemplatePhone = ({ template, isActive }) => {
    const textColor = template.textClass;
    const btnClass = template.btnClass;
    const socialClass = template.socialClass || textColor;
    const isHovered = hoveredId === template.id;

    return (
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setHoveredId(template.id)}
        onMouseLeave={() => setHoveredId(null)}
        onClick={() => !isActive && onTemplateSelect(template.id)}
      >
        {/* Phone Frame */}
        <div 
          className={`relative w-full max-w-[200px] mx-auto aspect-[9/19] rounded-[32px] border-[8px] overflow-hidden shadow-xl transition-all duration-300
            ${isActive ? 'border-indigo-600 scale-105' : 'border-gray-900'}
            ${isHovered && !isActive ? 'scale-105 border-indigo-400' : ''}`}
          style={template.bgStyle ? { background: template.bgStyle } : { backgroundColor: '#000' }}
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
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-60 blur-lg"
                style={{ background: template.id === 12 ? '#ff6f00' : template.id === 13 ? '#f9a825' : '#e91e63' }} 
              />
              <div 
                className="absolute top-1/3 -left-8 w-20 h-20 rounded-full opacity-50 blur-lg"
                style={{ background: template.id === 12 ? '#e91e8c' : template.id === 13 ? '#000' : '#ff6f00' }} 
              />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 w-full h-full px-3 py-6 flex flex-col items-center">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-md mb-2 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-pink-500">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-lg font-bold">
                  {(user?.username || 'U').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            {/* Name */}
            <div className="flex items-center gap-0.5 mb-1">
              <h3 className={`font-bold text-[11px] text-center ${textColor}`}>
                {profileData.full_name || `@${user?.username}`}
              </h3>
              <CheckCircle size={8} className="text-blue-500 fill-blue-500/10" />
            </div>
            
            {/* Bio */}
            <p className={`text-[7px] text-center opacity-80 mb-2 max-w-[85%] line-clamp-2 ${textColor}`}>
              {profileData.bio || template.description}
            </p>

            {/* Location/Email (if available) */}
            {(profileData.location || profileData.contact_email) && (
              <div className={`flex flex-col items-center gap-0.5 mb-3 text-[6px] ${textColor} opacity-80`}>
                {profileData.location && (
                  <div className="flex items-center gap-0.5">
                    <MapPin size={6} />
                    <span>{profileData.location}</span>
                  </div>
                )}
                {profileData.contact_email && (
                  <div className="flex items-center gap-0.5">
                    <Mail size={6} />
                    <span className="truncate max-w-[120px]">{profileData.contact_email}</span>
                  </div>
                )}
              </div>
            )}

            {/* Links */}
            <div className="w-full flex flex-col gap-1.5 px-1 mb-2">
              {links.slice(0, 3).map((link, i) => {
                let Icon = Globe;
                if (link.type === 'youtube') Icon = Youtube;
                else if (link.type === 'instagram') Icon = Instagram;
                else if (link.type === 'twitter') Icon = Twitter;
                else if (link.type === 'tiktok') Icon = Music;

                return (
                  <div 
                    key={link.id} 
                    className={`w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-[12px] font-bold text-[7px] shadow-sm ${btnClass}`}
                  >
                    <Icon size={8} />
                    <span className="truncate">{link.title}</span>
                  </div>
                );
              })}
            </div>

            {/* Social Icons */}
            <div className={`flex gap-2 mt-auto ${socialClass}`}>
              <Youtube size={10} className="opacity-80" />
              <Instagram size={10} className="opacity-80" />
              <Twitter size={10} className="opacity-80" />
              <Music size={10} className="opacity-80" />
            </div>
          </div>

          {/* Active Badge */}
          {isActive && (
            <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full z-20 flex items-center gap-1">
              <CheckCircle size={8} /> Active
            </div>
          )}

          {/* Hover Overlay */}
          {!isActive && (
            <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 transition-opacity duration-300 z-30 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <Zap size={20} className="text-white" />
              <span className="text-white text-[10px] font-bold">Switch Template</span>
            </div>
          )}
        </div>

        {/* Template Name */}
        <div className="mt-2 text-center">
          <p className="font-bold text-gray-900 text-[10px] truncate">{template.name}</p>
          {isActive && (
            <p className="text-indigo-600 text-[8px] font-semibold">Currently Active</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-700 text-sm">Template Variants</h3>
        <span className="text-xs text-gray-500">Click to switch</span>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {templatesToShow.map(template => (
          <TemplatePhone 
            key={template.id} 
            template={template}
            isActive={template.id === currentTemplateId}
          />
        ))}
      </div>

      <div className="mt-4 text-center">
        <a 
          href={`/${user?.username}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-800 transition-colors"
        >
          View Full Live Profile →
        </a>
      </div>
    </div>
  );
};

export default MultiTemplatePreview;
