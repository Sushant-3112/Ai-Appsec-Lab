import React, { useState } from 'react';
import { Search, ChevronRight, User, CheckCircle, Flame, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = ["All", "🇮🇳 Indian Creators", "Comedy", "Tech", "Gaming", "Business", "Music", "Sports", "Beauty", "Art"];

const creatorsData = [
  // 🇮🇳 Top Indian Creators
  { 
    id: 1, 
    name: "Samay Raina", 
    handle: "samayraina", 
    category: "Comedy", 
    bio: "Standup Comedian & Creator of India's Got Latent",
    followers: "5.2M",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", 
    coverBg: "bg-gradient-to-r from-amber-500 via-orange-600 to-red-600" 
  },
  { 
    id: 2, 
    name: "Ajey Nagar (CarryMinati)", 
    handle: "carryminati", 
    category: "Comedy", 
    bio: "India's #1 Roaster, Rapper & Gaming Streamer",
    followers: "42M",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", 
    coverBg: "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700" 
  },
  { 
    id: 3, 
    name: "Gaurav Chaudhary (Technical Guruji)", 
    handle: "technicalguruji", 
    category: "Tech", 
    bio: "Chaliye Shuru Karte Hain! World's Largest Tech Channel",
    followers: "23M",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200", 
    coverBg: "bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500" 
  },
  { 
    id: 4, 
    name: "Bhuvan Bam (BB Ki Vines)", 
    handle: "bhuvan.bam", 
    category: "Comedy", 
    bio: "Actor, Singer, Writer & Creator of BB Ki Vines",
    followers: "26M",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200", 
    coverBg: "bg-gradient-to-r from-orange-500 via-amber-600 to-yellow-500" 
  },
  { 
    id: 5, 
    name: "Ranveer Allahbadia (BeerBiceps)", 
    handle: "beerbiceps", 
    category: "Business", 
    bio: "Host of The Ranveer Show, Entrepreneur & Podcaster",
    followers: "9.5M",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=200", 
    coverBg: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700" 
  },
  { 
    id: 6, 
    name: "Shlok Srivastava (Tech Burner)", 
    handle: "techburner", 
    category: "Tech", 
    bio: "Tech, Humor, Skins & Futuristic Gadget Reviews",
    followers: "11M",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200", 
    coverBg: "bg-gradient-to-r from-red-600 via-rose-600 to-pink-600" 
  },
  { 
    id: 7, 
    name: "Naman Mathur (Mortal)", 
    handle: "ig_mortal", 
    category: "Gaming", 
    bio: "Esports Legend, BGMI Champion & Co-Owner S8UL",
    followers: "7.2M",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=200", 
    coverBg: "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600" 
  },
  { 
    id: 8, 
    name: "Tanmay Bhat", 
    handle: "tanmaybhat", 
    category: "Comedy", 
    bio: "Comedian, Reaction King, Investor & Vlogger",
    followers: "4.8M",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1520409364224-63400afe26e5?auto=format&fit=crop&q=80&w=200", 
    coverBg: "bg-gradient-to-r from-blue-800 via-indigo-900 to-slate-900" 
  },
  { 
    id: 9, 
    name: "Prajakta Koli (MostlySane)", 
    handle: "mostlysane", 
    category: "Comedy", 
    bio: "Actor, UNDP Youth Champion & Digital Creator",
    followers: "7.9M",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", 
    coverBg: "bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600" 
  },
  { 
    id: 10, 
    name: "Ankur Warikoo", 
    handle: "ankurwarikoo", 
    category: "Business", 
    bio: "Author of Do Epic Shit, Entrepreneur & Educator",
    followers: "3.8M",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200", 
    coverBg: "bg-gradient-to-r from-slate-800 via-gray-900 to-black" 
  },
  { 
    id: 11, 
    name: "Kusha Kapila", 
    handle: "kushakapila", 
    category: "Beauty", 
    bio: "Actor, Fashion Enthusiast & Character Comedian",
    followers: "3.7M",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&q=80&w=200", 
    coverBg: "bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-500" 
  },
  { 
    id: 12, 
    name: "Ashish Chanchlani", 
    handle: "ashishchanchlani", 
    category: "Comedy", 
    bio: "Ashish Chanchlani Vines - Indian Comedy Legend",
    followers: "30M",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200", 
    coverBg: "bg-gradient-to-r from-red-600 via-orange-600 to-amber-500" 
  },
  { 
    id: 13, 
    name: "Kabita Singh (Kabita's Kitchen)", 
    handle: "kabitaskitchen", 
    category: "Art", 
    bio: "India's Favorite Recipe & Culinary Creator",
    followers: "13.5M",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", 
    coverBg: "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700" 
  },
  { 
    id: 14, 
    name: "Neeraj Chopra", 
    handle: "neeraj____chopra", 
    category: "Sports", 
    bio: "Olympic Champion Javelin Thrower & Athlete",
    followers: "9.2M",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200", 
    coverBg: "bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" 
  },
  { 
    id: 15, 
    name: "Nikhil Sharma (Mumbiker Nikhil)", 
    handle: "mumbikernikhil", 
    category: "Sports", 
    bio: "India's Pioneer Moto Vlogger & Lifestyle Creator",
    followers: "4.2M",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", 
    coverBg: "bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950" 
  },
  { 
    id: 16, 
    name: "Neha Kakkar", 
    handle: "nehakakkar", 
    category: "Music", 
    bio: "Bollywood Singer & India's Top Pop Icon",
    followers: "75M",
    country: "India",
    avatar: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=200", 
    coverBg: "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700" 
  },
  // Global Creators
  { 
    id: 17, 
    name: "Riley Harper", 
    handle: "rileyharper", 
    category: "Comedy", 
    bio: "Digital Creator & Skit Artist",
    followers: "1.2M",
    country: "Global",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150", 
    coverBg: "bg-[#e9c0e9]" 
  },
  { 
    id: 18, 
    name: "DJ Tech", 
    handle: "djtech", 
    category: "Music", 
    bio: "Electronic Music Producer & DJ",
    followers: "2.4M",
    country: "Global",
    avatar: "https://images.unsplash.com/photo-1520409364224-63400afe26e5?auto=format&fit=crop&q=80&w=150", 
    coverBg: "bg-[#2a5bd7]" 
  }
];

const CreatorCard = ({ creator }) => {
  return (
    <Link 
      to={`/${creator.handle}`}
      className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer flex flex-col h-full transform hover:-translate-y-1 relative"
    >
      {/* Cover Header */}
      <div className={`w-full h-[120px] ${creator.coverBg} relative overflow-hidden`}>
        {creator.country === "India" && (
          <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold border border-white/20 flex items-center gap-1">
            🇮🇳 India
          </span>
        )}
      </div>

      {/* Main Details Body */}
      <div className="relative px-5 pb-6 pt-12 flex-1 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-[80px] h-[80px] rounded-full overflow-hidden border-4 border-white bg-white shadow-md group-hover:scale-105 transition-transform duration-300">
           {creator.avatar ? (
             <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full bg-gray-100 flex items-center justify-center"><User className="text-gray-400" size={32} /></div>
           )}
        </div>

        {/* Creator Name + Verified Badge */}
        <div className="flex items-center gap-1.5 justify-center mb-0.5 w-full px-2">
          <h3 className="font-bold text-[17px] text-gray-900 tracking-tight truncate">{creator.name}</h3>
          <CheckCircle size={16} className="text-blue-500 fill-blue-500/10 shrink-0" />
        </div>

        {/* Handle */}
        <p className="text-[#2a5bd7] font-semibold text-[13px] mb-2 truncate max-w-full">
          @{creator.handle}
        </p>

        {/* Bio Tagline */}
        <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed mb-4 px-1">
          {creator.bio}
        </p>
        
        {/* Followers & Category Badges */}
        <div className="mt-auto w-full flex items-center justify-between pt-3 border-t border-gray-100 text-[11px] font-bold">
           <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-amber-100">
             <Flame size={12} className="fill-amber-500" /> {creator.followers}
           </span>
           <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
             {creator.category}
           </span>
        </div>

      </div>
    </Link>
  );
};

const Discover = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCreators = creatorsData.filter(creator => {
    // Category match
    const matchesCategory = 
      activeCategory === "All" ? true :
      activeCategory === "🇮🇳 Indian Creators" ? creator.country === "India" :
      creator.category === activeCategory;

    // Search query match
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      creator.name.toLowerCase().includes(q) ||
      creator.handle.toLowerCase().includes(q) ||
      creator.category.toLowerCase().includes(q) ||
      (creator.bio && creator.bio.toLowerCase().includes(q)) ||
      (creator.country && creator.country.toLowerCase().includes(q))
    );

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f3f3f1] font-sans pb-24">
       
       {/* Hero Search Section */}
       <div className="w-full bg-[#111827] pt-40 pb-20 px-6 lg:px-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-6">
            <span>🇮🇳 Featuring Top Indian Creators & Influencers</span>
          </div>

          <h1 className="text-white text-[3.5rem] md:text-[5rem] font-black tracking-[-0.04em] leading-[1] mb-6">
            Discover <span className="text-[#d2e823]">Creators</span>
          </h1>
          <p className="text-gray-300 text-[1.1rem] md:text-[1.3rem] font-medium max-w-2xl mb-12 leading-relaxed">
            Explore India's biggest digital stars, top Youtubers, comedians, gamers, and tech reviewers on Ai Appsec lab.
          </p>
          
          <div className="relative w-full max-w-[600px] shadow-2xl">
             <Search size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by creator name, @handle, or India..." 
                className="w-full pl-14 pr-28 py-5 rounded-full text-[16px] font-medium outline-none focus:ring-4 focus:ring-[#d2e823]/50 text-gray-900 border-none placeholder-gray-500 bg-white"
             />
             <button 
               onClick={() => {}}
               className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#d2e823] hover:bg-[#b8cc1c] text-[#111827] px-6 py-3 rounded-full font-extrabold transition cursor-pointer"
             >
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
                 className={`px-6 py-3 rounded-full font-bold text-[14px] transition-all transform hover:-translate-y-0.5 shadow-sm border cursor-pointer ${
                   activeCategory === cat 
                   ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                   : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>

          <div className="flex items-center justify-between mb-8">
             <div>
               <h2 className="text-[24px] font-[900] text-gray-900 tracking-tight">
                 {activeCategory === "All" ? "Top Trending Creators" : `Creators in ${activeCategory}`}
               </h2>
               <p className="text-xs text-gray-500 font-medium">Showing {filteredCreators.length} verified creator profiles</p>
             </div>
             {activeCategory !== "All" && (
               <button 
                 onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                 className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
               >
                 Reset Filter
               </button>
             )}
          </div>

          {/* Creators Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {filteredCreators.map(creator => (
                <CreatorCard key={creator.id} creator={creator} />
             ))}
          </div>

          {filteredCreators.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-md mx-auto">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No creators found</h3>
              <p className="text-xs text-gray-500 mb-4">Try searching for "CarryMinati", "Samay", "India", or reset your category filter.</p>
              <button 
                onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                className="bg-gray-900 text-white px-5 py-2 rounded-full font-bold text-xs hover:bg-black transition"
              >
                Clear Search
              </button>
            </div>
          )}

       </div>

    </div>
  );
};

export default Discover;
