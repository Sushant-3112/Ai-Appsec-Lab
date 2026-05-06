import React, { useState } from 'react';
import { Search, ChevronRight, User } from 'lucide-react';

const categories = ["All", "Comedy", "Music", "Gaming", "Sports", "Business", "Tech", "Beauty", "Art"];

const creatorsData = [
  { id: 1, name: "Riley Harper", handle: "rileyharper", category: "Comedy", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150", coverBg: "bg-[#e9c0e9]" },
  { id: 2, name: "DJ Tech", handle: "djtech", category: "Music", avatar: "https://images.unsplash.com/photo-1520409364224-63400afe26e5?auto=format&fit=crop&q=80&w=150", coverBg: "bg-[#2a5bd7]" },
  { id: 3, name: "Sarah Gaming", handle: "sarahg", category: "Gaming", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150", coverBg: "bg-[#d2e823]" },
  { id: 4, name: "Chris Fit", handle: "chrisf", category: "Sports", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150", coverBg: "bg-[#ff5500]" },
  { id: 5, name: "Emma Corp", handle: "emmacorp", category: "Business", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&q=80&w=150", coverBg: "bg-[#05118c]" },
  { id: 6, name: "Tech Weekly", handle: "techweekly", category: "Tech", avatar: "https://images.unsplash.com/photo-1542361002-23c316f73775?auto=format&fit=crop&q=80&w=150", coverBg: "bg-gray-900" },
  { id: 7, name: "Lola Beauty", handle: "lolab", category: "Beauty", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150", coverBg: "bg-[#fdecd5]" },
  { id: 8, name: "Artist Collective", handle: "artco", category: "Art", avatar: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=150", coverBg: "bg-[#780016]" },
];

const CreatorCard = ({ creator }) => {
  return (
    <div className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer flex flex-col h-full transform hover:-translate-y-1">
      <div className={`w-full h-[120px] ${creator.coverBg}`}></div>
      <div className="relative px-6 pb-6 pt-12 flex-1 flex flex-col items-center">
        <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-[80px] h-[80px] rounded-full overflow-hidden border-4 border-white bg-white shadow-md">
           {creator.avatar ? (
             <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full bg-gray-100 flex items-center justify-center"><User className="text-gray-400" size={32} /></div>
           )}
        </div>
        <h3 className="font-bold text-[18px] text-gray-900 tracking-tight text-center">{creator.name}</h3>
        <p className="text-[#2a5bd7] font-semibold text-[14px] mb-4 text-center">@smartlink.hub/{creator.handle}</p>
        
        <div className="mt-auto">
           <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-700 font-bold text-[12px] rounded-full tracking-tight">
             {creator.category}
           </span>
        </div>
      </div>
    </div>
  );
};

const Discover = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCreators = activeCategory === "All" 
    ? creatorsData 
    : creatorsData.filter(c => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#f3f3f1] font-sans pb-24">
       
       {/* Hero Search Section */}
       <div className="w-full bg-[#111827] pt-40 pb-20 px-6 lg:px-12 flex flex-col items-center text-center">
          <h1 className="text-white text-[3.5rem] md:text-[5rem] font-black tracking-[-0.04em] leading-[1] mb-6">
            Discover <span className="text-[#d2e823]">Creators</span>
          </h1>
          <p className="text-gray-300 text-[1.1rem] md:text-[1.3rem] font-medium max-w-2xl mb-12 leading-relaxed">
            Find and get inspired by the top creators on Ai Appsec lab. Explore categories, distinct styles, and audience growth strategies.
          </p>
          
          <div className="relative w-full max-w-[600px] shadow-2xl">
             <Search size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
                type="text" 
                placeholder="Search by name, handle, or category..." 
                className="w-full pl-14 pr-6 py-5 rounded-full text-[16px] font-medium outline-none focus:ring-4 focus:ring-[#d2e823]/50 text-gray-900 border-none placeholder-gray-500"
             />
             <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#d2e823] hover:bg-[#b8cc1c] text-[#111827] px-6 py-3 rounded-full font-bold transition">
                Search
             </button>
          </div>
       </div>

       {/* Category and Grid Section */}
       <div className="max-w-[1300px] mx-auto px-6 lg:px-12 pt-16">
          
          {/* Categories Pill Layout */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
             {categories.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`px-6 py-3 rounded-full font-bold text-[14px] transition-all transform hover:-translate-y-0.5 shadow-sm border ${
                   activeCategory === cat 
                   ? 'bg-gray-900 text-white border-gray-900' 
                   : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>

          <div className="flex items-center justify-between mb-8">
             <h2 className="text-[24px] font-[900] text-gray-900 tracking-tight">Trending in {activeCategory}</h2>
             <button className="flex items-center font-bold text-[14px] text-gray-500 hover:text-gray-900 transition">
               View Top 100 <ChevronRight size={18} className="ml-1" />
             </button>
          </div>

          {/* Creators Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {filteredCreators.map(creator => (
                <CreatorCard key={creator.id} creator={creator} />
             ))}
          </div>

       </div>

    </div>
  );
};

export default Discover;
