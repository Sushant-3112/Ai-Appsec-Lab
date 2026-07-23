import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Music } from 'lucide-react'; 
import templatesData from '../data/templateData';

const categories = [
  "Fashion", "Health and Fitness", "Influencer and Creator", 
  "Marketing", "Music", "Small Business", 
  "Social Media", "Sports", "Telegram", "Whatsapp"
];

// ── Beach-card wide template (Image 2 style) ──
const BeachCardTemplate = ({ template, onClick }) => (
  <div
    onClick={onClick}
    className="relative w-full rounded-3xl overflow-hidden shadow-lg hover:-translate-y-2 transition-transform duration-300 cursor-pointer group"
    style={{ minHeight: '340px' }}
  >
    {template.bgImage && (
      <img src={template.bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
    )}
    <div className={`absolute inset-0 ${template.bgOverlay}`} />

    <div className="relative z-10 flex flex-col items-center px-8 py-10 text-center">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/40 shadow-lg mb-4 bg-white/20 flex items-center justify-center">
        {template.avatar ? (
          <img src={template.avatar} alt={template.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-bold text-2xl">{template.avatarInitials || template.name?.charAt(0)}</span>
        )}
      </div>

      {/* Name */}
      <h3 className="text-white font-extrabold text-xl mb-2 drop-shadow">
        {template.name}
        <span className="ml-1 text-blue-300 text-base">✔</span>
      </h3>

      {/* Bio */}
      <p className="text-white/90 text-sm leading-relaxed max-w-xs mb-3">{template.description}</p>

      {/* Location & Email */}
      {template.location && (
        <p className="text-white/80 text-xs mb-1">📍 {template.location}</p>
      )}
      {template.email && (
        <p className="text-white/80 text-xs mb-5">✉ {template.email}</p>
      )}

      {/* Wide card buttons (2-column grid) */}
      <div className="w-full grid grid-cols-2 gap-3 mb-6">
        {template.buttons.map((btn, i) => (
          <button
            key={i}
            className="flex flex-col items-center justify-center gap-1 bg-white/90 text-teal-900 font-semibold py-4 px-3 rounded-2xl shadow-sm hover:scale-[1.02] transition-transform text-sm"
          >
            <Youtube size={18} className="text-teal-700" />
            {btn}
          </button>
        ))}
      </div>

      {/* Social icons */}
      <div className="flex gap-5 text-white">
        <Youtube size={22} className="opacity-80 hover:opacity-100 transition" />
        <Instagram size={22} className="opacity-80 hover:opacity-100 transition" />
        <Twitter size={22} className="opacity-80 hover:opacity-100 transition" />
        <Music size={22} className="opacity-80 hover:opacity-100 transition" />
      </div>
    </div>

    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex justify-center items-center">
      <span className="bg-white text-black font-extrabold text-sm px-7 py-3.5 rounded-[100px] shadow-2xl">
        Use this template
      </span>
    </div>
  </div>
);

// ── Linktree-style phone template (Image 1 style) ──
const LinktreeCard = ({ template, onClick }) => (
  <div
    onClick={onClick}
    className="relative w-full aspect-[9/18.5] rounded-[40px] overflow-hidden shadow-lg hover:-translate-y-2 transition-transform duration-300 cursor-pointer group"
    style={{ background: template.bgStyle || '#111' }}
  >
    {/* Decorative abstract blobs */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-60"
        style={{ background: template.id === 12 ? '#ff6f00' : template.id === 13 ? '#f9a825' : '#e91e63' }} />
      <div className="absolute top-1/3 -left-10 w-32 h-32 rounded-full opacity-50"
        style={{ background: template.id === 12 ? '#e91e8c' : template.id === 13 ? '#000' : '#ff6f00' }} />
      <div className="absolute bottom-1/4 right-0 w-28 h-28 rounded-full opacity-40"
        style={{ background: template.id === 12 ? '#00bcd4' : template.id === 13 ? '#1565c0' : '#c6f135' }} />
    </div>

    <div className="relative z-10 w-full h-full px-5 py-8 flex flex-col items-center">
      {/* Avatar circle with initials */}
      <div className="mt-2 mb-3 w-[68px] h-[68px] rounded-full bg-white/20 border-2 border-white/30 shadow-md flex items-center justify-center">
        <span className="text-white font-extrabold text-xl">{template.avatarInitials}</span>
      </div>

      <h3 className="font-bold text-base mb-0.5 text-center text-white">{template.name}</h3>
      <p className="text-[10px] text-center text-white/80 mb-5 max-w-[85%]">{template.description}</p>

      {/* Subscribe button row */}
      <div className="flex items-center gap-2 mb-4">
        <button className="flex items-center gap-1.5 bg-white text-gray-900 text-[11px] font-bold px-4 py-1.5 rounded-full shadow">
          🔔 Subscribe
        </button>
      </div>

      {/* Section label */}
      <p className="text-white font-bold text-[11px] mb-3 self-start ml-1">Product Design</p>

      {/* Link buttons */}
      <div className="w-full flex flex-col gap-2.5 flex-grow">
        {template.buttons.map((btn, i) => (
          <button
            key={i}
            className={`w-full py-3 px-4 rounded-[40px] text-[12px] shadow-sm transition-all hover:scale-[1.02] ${template.btnClass}`}
          >
            {btn}
          </button>
        ))}
      </div>

      {/* Social icons */}
      <div className="flex gap-4 mt-4 text-white">
        <Twitter size={18} className="opacity-80" />
        <Youtube size={18} className="opacity-80" />
        <Instagram size={18} className="opacity-80" />
        <Music size={18} className="opacity-80" />
      </div>
    </div>

    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex justify-center items-center">
      <span className="bg-white text-black font-extrabold text-sm px-7 py-3.5 rounded-[100px] shadow-2xl">
        Use this template
      </span>
    </div>
  </div>
);

const TemplateCard = ({ template, onClick }) => {
  if (template.variant === 'beach-card') {
    return <BeachCardTemplate template={template} onClick={onClick} />;
  }
  if (template.variant?.startsWith('linktree')) {
    return <LinktreeCard template={template} onClick={onClick} />;
  }

  return (
    <div 
      onClick={onClick}
      className={`relative w-full aspect-[9/18.5] rounded-[40px] overflow-hidden shadow-lg hover:-translate-y-2 transition-transform duration-300 cursor-pointer group bg-black`}
    >
      {template.bgImage && (
        <img src={template.bgImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
      )}
      <div className={`absolute inset-0 ${template.bgOverlay}`}></div>
      
      <div className="relative z-10 w-full h-full px-6 py-10 flex flex-col items-center">
        <div className="mt-2 mb-3 w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-white/20 shadow-md">
           <img src={template.avatar} alt={template.name} className="w-full h-full object-cover" />
        </div>
        <h3 className={`font-bold text-lg mb-1 text-center tracking-tight ${template.textClass}`}>{template.name}</h3>
        <p className={`text-[11px] text-center font-bold opacity-90 mb-6 max-w-[90%] ${template.textClass}`}>{template.description}</p>
        
        <div className="w-full flex-grow flex flex-col gap-3.5">
          {template.buttons.map((btn, i) => (
             <button key={i} className={`w-full py-4 px-4 rounded-[40px] font-bold text-[13px] shadow-sm transition-all hover:scale-[1.02] ${template.btnClass}`}>
               {btn}
             </button>
          ))}
        </div>

        <div className={`flex gap-5 mb-2 mt-4 ${template.socialClass}`}>
          <Music size={22} className="opacity-90 hover:opacity-100 transition" />
          <Youtube size={22} className="opacity-90 hover:opacity-100 transition" />
          <Twitter size={22} className="opacity-90 hover:opacity-100 transition" />
          <Instagram size={22} className="opacity-90 hover:opacity-100 transition" />
        </div>
      </div>

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex justify-center items-center">
         <span className="bg-white text-black font-extrabold text-sm px-7 py-3.5 rounded-[100px] shadow-2xl hover:scale-105 transition-transform">
           Use this template
         </span>
      </div>
    </div>
  );
};

const Templates = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const handleTemplateClick = (template) => {
    navigate(`/templates/editor/${template.id}`);
  };

  return (
    <div className="min-h-screen bg-[#f3f3f1] pt-48 pb-24 font-sans text-[#111827]">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-12 w-full">
        
        {/* Hero Section */}
        <div className="pt-10 pb-16">
          <h1 className="text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[0.95] font-[900] tracking-[-0.04em] text-[#1e2330] mb-6 max-w-[900px]">
            A Ai Appsec lab template to suit every brand and creator
          </h1>
          <p className="text-[1.125rem] font-medium text-gray-800 leading-[1.6] max-w-[800px]">
            Different Link Apps, integrations and visual styles can help you create a Ai Appsec lab that looks and feels like you and your brand. Explore our library of custom templates to grow and connect with your audience even more easily!
          </p>
        </div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row gap-16 mt-4">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-[280px] flex-shrink-0">
             <div className="flex flex-wrap gap-2 lg:sticky lg:top-32">
                <button 
                  onClick={() => setActiveCategory("All")}
                  className={`px-5 py-2.5 rounded-[100px] font-semibold text-[15px] border transition-colors ${activeCategory === "All" ? 'bg-gray-900 text-white border-gray-900' : 'bg-transparent text-gray-900 border-gray-300 hover:border-gray-400'}`}
                >
                  All Templates
                </button>
               {categories.map((cat) => (
                 <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-[100px] font-semibold text-[15px] border border-gray-300 transition-colors ${activeCategory === cat ? 'bg-gray-900 text-white border-gray-900' : 'bg-transparent text-gray-900 hover:bg-white hover:border-gray-400'}`}
                 >
                   {cat}
                 </button>
               ))}
             </div>
          </div>

          {/* Grid Templates */}
          <div className="flex-1">
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
               {templatesData.map(template => (
                 <div
                   key={template.id}
                   className={template.variant === 'beach-card' ? 'sm:col-span-2 xl:col-span-3' : ''}
                 >
                   <TemplateCard 
                     template={template} 
                     onClick={() => handleTemplateClick(template)}
                   />
                 </div>
               ))}
             </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default Templates;
