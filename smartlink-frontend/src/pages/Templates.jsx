import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Music } from 'lucide-react'; 
import templatesData from '../data/templateData';

const categories = [
  "Fashion", "Health and Fitness", "Influencer and Creator", 
  "Marketing", "Music", "Small Business", 
  "Social Media", "Sports", "Telegram", "Whatsapp"
];

const TemplateCard = ({ template, onClick }) => {
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
    <div className="min-h-screen bg-[#f3f3f1] pt-32 pb-24 font-sans text-[#111827]">
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
                 <TemplateCard 
                   key={template.id} 
                   template={template} 
                   onClick={() => handleTemplateClick(template)}
                 />
               ))}
             </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default Templates;
