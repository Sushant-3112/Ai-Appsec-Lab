import React from 'react';
import { Search, Music, Twitter, Youtube, DollarSign, Store, ShoppingBag, Radio, MessagesSquare, FileText, Share2, Facebook } from 'lucide-react';

const AppCard = ({ icon, title, description, bgToken }) => (
  <button className="flex items-center gap-4 p-4 rounded-[16px] hover:bg-gray-50 transition w-full text-left group">
     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden ${bgToken || 'bg-white border border-gray-200'}`}>
        {icon}
     </div>
     <div className="flex-1 pr-2">
       <h4 className="font-bold text-gray-900 text-[16px] mb-0.5 group-hover:text-amber-800 transition-colors tracking-tight">{title}</h4>
       <p className="font-medium text-[13px] text-gray-500 leading-snug">{description}</p>
     </div>
  </button>
);

const AppSection = ({ title, seeAllText, apps }) => (
  <div className="mb-16">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-[28px] font-black tracking-[-0.03em] text-gray-900">{title}</h2>
      {seeAllText && <button className="font-semibold text-[15px] text-[#2a5bd7] hover:underline underline-offset-4">{seeAllText}</button>}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
       {apps.map((app, i) => <AppCard key={i} {...app} />)}
    </div>
  </div>
);

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
       
       {/* Sub Navbar (Fake) */}
       <div className="h-[76px] bg-white border-b border-gray-100 sticky top-0 z-40 flex items-center px-6 lg:px-12 justify-between mt-20">
          <div className="flex items-center gap-6">
             <span className="font-black text-[22px] tracking-tight">Ai Appsec lab<span className="align-super text-[16px]">*</span> <span className="text-gray-300 font-light mx-2">|</span> Marketplace</span>
             <div className="hidden md:flex gap-6 mt-1 text-[15px] font-semibold">
                <button className="text-gray-500 hover:text-gray-900 transition">Browse</button>
                <button className="text-gray-900">Marketplace</button>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-6 py-3 rounded-full text-[15px] transition">Admin</button>
             <button className="bg-gray-900 hover:bg-black text-white font-bold px-6 py-3 rounded-full text-[15px] transition">Sign up free</button>
          </div>
       </div>

       {/* Hero Section */}
       <div className="bg-[#780016] w-full relative overflow-hidden flex items-center lg:items-start pt-24 pb-32 px-6 lg:px-16 min-h-[560px]">
          <div className="w-full lg:w-[45%] z-20 relative lg:pt-10">
             <h1 className="text-[#e9c0e9] font-black text-[4rem] sm:text-[5rem] lg:text-[6rem] leading-[0.9] tracking-[-0.04em] mb-6">
               Connect<br />more of you
             </h1>
             <p className="text-[#f7e6f7] text-[1.15rem] font-medium leading-[1.5] max-w-md mb-8">
               Bring the best experiences across the internet to one place: your Ai Appsec lab
             </p>
             <div className="relative max-w-[420px]">
                <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search Link Apps and integrations..." 
                  className="w-full pl-12 pr-6 py-[18px] rounded-[12px] shadow-lg text-[15px] font-medium outline-none focus:ring-4 focus:ring-black/20"
                />
             </div>
          </div>

          {/* Right Side 3D Graphic Elements */}
          <div className="hidden lg:block absolute right-0 top-0 w-[55%] h-full">
             {/* Abstract Rocks */}
             <div className="absolute right-[30%] top-[10%] w-[180px] h-[300px] z-10 flex flex-col justify-center gap-1 opacity-90 drop-shadow-2xl">
                 <div className="w-full h-[30px] bg-[#435343] rounded-[100%] transform -rotate-6"></div>
                 <div className="w-[80%] h-[70px] bg-[#e77443] rounded-[40px] shadow-inner transform rotate-3 ml-4"></div>
                 <div className="w-[90%] h-[35px] bg-[#435343] rounded-[100%] shadow-inner transform rotate-2 ml-1"></div>
                 <div className="w-[85%] h-[60px] bg-[#e77443] rounded-[40px] shadow-inner transform -rotate-3 ml-5"></div>
                 <div className="w-full h-[30px] bg-[#435343] rounded-[100%] shadow-inner transform rotate-6"></div>
             </div>
             
             {/* Phone Mockup Frame */}
             <div className="absolute right-[10%] top-[25%] w-[260px] h-[550px] bg-gradient-to-b from-[#b3401c] to-[#45140b] rounded-[40px] border-8 border-transparent shadow-2xl z-20 overflow-hidden flex flex-col items-center pt-10 px-4 transform -rotate-6 transition-transform hover:rotate-0 duration-500">
                <div className="w-[80px] h-[80px] rounded-full border-4 border-white/20 overflow-hidden mb-3">
                   <img src="https://images.unsplash.com/photo-1542361002-23c316f73775?auto=format&fit=crop&q=80&w=150" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-white font-black text-[15px] mb-0.5">Justin Peaches</h4>
                <p className="text-white/70 font-bold text-[10px] mb-6">Funk & R&B Singer</p>
                <div className="w-full bg-[#fdecd5] text-[#45140b] font-bold text-[12px] py-4 text-center rounded-2xl mb-3 shadow-sm hover:scale-105 transition">Listen to Hazy Gaze</div>
                <div className="w-full bg-[#fdecd5] text-[#45140b] font-bold text-[12px] py-4 text-center rounded-2xl mb-3 shadow-sm hover:scale-105 transition">Merch drop</div>
                <div className="w-full bg-[#fdecd5] text-[#45140b] font-bold text-[12px] py-4 text-center rounded-2xl mb-3 shadow-sm hover:scale-105 transition">Harvest Tour</div>
             </div>
             
             {/* Floating Neon Card */}
             <div className="absolute left-[8%] top-[45%] z-30 bg-[#d2e823] w-[180px] h-[200px] rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] p-6 flex flex-col items-center justify-center transform rotate-[-8deg] hover:rotate-0 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full border-2 border-[#1a3622] flex items-center justify-center mb-4">
                   <DollarSign className="text-[#1a3622]" size={24} />
                </div>
                <div className="text-[#1a3622] font-black text-[32px] leading-none mb-2 tracking-tight">$1,536</div>
                <div className="text-[#1a3622] font-semibold text-[13px]">Total Revenue</div>
             </div>

             {/* Merch Card Mockup */}
             <div className="absolute right-[0%] bottom-[-5%] z-30 bg-white w-[250px] h-[280px] rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-5 transform rotate-3">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                  <span className="font-bold text-[12px] text-gray-900">Merch Drop</span>
                  <div className="w-4 h-4">^</div>
                </div>
                <div className="w-full h-[200px] flex gap-2">
                   <div className="w-1/2 h-full bg-gray-100 rounded-xl overflow-hidden"><img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=200" alt="Merch" className="w-full h-full object-cover" /></div>
                   <div className="w-1/2 h-full bg-gray-100 rounded-xl overflow-hidden"><img src="https://images.unsplash.com/photo-1610425332766-0dbdfda7fcf5?auto=format&fit=crop&q=80&w=200" alt="Merch" className="w-full h-full object-cover" /></div>
                </div>
             </div>

             {/* Social Indicators */}
             <div className="absolute bottom-[10%] left-[25%] z-30 flex gap-3">
                 <div className="w-12 h-12 bg-[#ffe8d6] shadow-xl rounded-[16px] flex items-center justify-center text-[#780016]"><Music size={20} /></div>
                 <div className="w-12 h-12 bg-[#ffe8d6] shadow-xl rounded-[16px] flex items-center justify-center text-[#780016]"><MessagesSquare size={20} /></div>
                 <div className="w-12 h-12 bg-[#ffe8d6] shadow-xl rounded-[16px] flex items-center justify-center text-[#780016]"><Youtube size={20} /></div>
             </div>
          </div>
       </div>

       {/* Content Grid Container */}
       <div className="max-w-[1240px] mx-auto px-6 lg:px-12 py-16">
          
          <AppSection 
            title="Share your content" 
            seeAllText="See 25 Apps"
            apps={[
              { icon: <Music className="text-[#f9a01b]" fill="currentColor" size={28}/>, bgToken: 'bg-white border-2 border-gray-100', title: 'Audiomack', description: 'Add an Audiomack player to your Ai Appsec lab' },
              { icon: <Music className="text-white" fill="currentColor" size={28}/>, bgToken: 'bg-[#ff5500]', title: 'SoundCloud', description: 'Get your music heard on SoundCloud' },
              { icon: <Music className="text-white" size={28}/>, bgToken: 'bg-black', title: 'TikTok', description: 'Share your TikToks on your Ai Appsec lab' },
              { icon: <Twitter className="text-white" fill="currentColor" size={24} />, bgToken: 'bg-black', title: 'X', description: 'Showcase your posts and X feed' },
              { icon: <Youtube className="text-[#ff0000]" fill="currentColor" size={28}/>, bgToken: 'bg-white border flex items-center justify-center', title: 'YouTube', description: 'Share YouTube videos on your Ai Appsec lab' },
              { icon: <div className="text-white font-[900] text-3xl mb-1 tracking-tighter">C</div>, bgToken: 'bg-black', title: 'Cameo', description: 'Make impossible fan connections possible' },
            ]}
          />

          <AppSection 
            title="Make and collect money" 
            seeAllText="See 14 Apps"
            apps={[
              { icon: <DollarSign className="text-white" size={28}/>, bgToken: 'bg-[#00b964]', title: 'GoFundMe', description: 'Promote the causes you care about most' },
              { icon: <ShoppingBag className="text-white" fill="currentColor" size={24}/>, bgToken: 'bg-black', title: 'Amaze', description: 'Design and sell physical products' },
              { icon: <Store className="text-white" size={28}/>, bgToken: 'bg-[#95bf47]', title: 'Shopify', description: 'Display your products to boost sales' }
            ]}
          />

          {/* Banner */}
          <div className="w-full bg-[#c2a9af] rounded-[32px] overflow-hidden flex min-h-[300px] mb-20 relative px-10 py-16">
             <div className="relative z-20 max-w-lg">
                <h2 className="text-[42px] font-[900] leading-[1.05] tracking-tight text-gray-900 mb-4">Join our developer program</h2>
                <p className="text-[17px] font-medium text-gray-800 mb-8 max-w-md">We're expanding access to our APIs and SDKs.</p>
                <button className="bg-[#1f2937] hover:bg-black text-white px-8 py-4 rounded-full font-bold shadow-lg transition transform hover:-translate-y-1">
                  Register Now
                </button>
             </div>
             
             {/* Abstract background graphics on the right */}
             <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden hidden md:block z-10">
                <div className="absolute right-[10%] top-[40%] bg-[#cc00ff] w-[280px] h-[340px] transform rotate-[-8deg] shadow-2xl backdrop-blur-md flex justify-center items-center">
                   <div className="w-[180px] h-[220px] bg-[#d7b0b7] rounded-full mix-blend-multiply opacity-80"></div>
                </div>
                <div className="absolute right-[-10%] top-[-20%] bg-[#082a6d] w-[300px] h-[400px] transform rotate-[15deg] shadow-2xl flex items-center justify-center overflow-hidden">
                   <div className="w-[80%] h-[80%] border-[20px] border-[#31569d] rounded-full"></div>
                </div>
                <div className="absolute right-[30%] top-[-20%] bg-[#1b4313] w-[180px] h-[400px] transform rotate-[-15deg] shadow-2xl"></div>
             </div>
          </div>

          <AppSection 
            title="Grow your following" 
            seeAllText="See 20 Apps"
            apps={[
              { icon: <div className="w-8 h-8 rounded bg-yellow-400"></div>, bgToken: 'bg-[#fffc00]', title: 'Snapchat', description: 'Promote your Public Profile' },
              { icon: <div className="text-white font-black text-3xl transform -translate-y-[2px]">r</div>, bgToken: 'bg-[#ff4500]', title: 'Reddit', description: 'Showcase your Reddit profile' },
              { icon: <FileText className="text-white" size={24}/>, bgToken: 'bg-[#9932cc]', title: 'Contact Details', description: 'Easily share downloadable contact details' },
              { icon: <MessagesSquare className="text-white" size={24} fill="currentColor"/>, bgToken: 'bg-black', title: 'Community SMS', description: 'Build an SMS subscriber list' },
              { icon: <Share2 className="text-gray-400" size={28}/>, bgToken: 'bg-white border-2 border-gray-100', title: 'Gleam', description: 'Run campaigns to grow your audience' },
              { icon: <FileText className="text-white" size={24}/>, bgToken: 'bg-[#4b0082]', title: 'Form', description: 'Collect visitor contact info and messages' },
            ]}
          />

          <AppSection 
            title="All link apps and integrations" 
            seeAllText="See All"
            apps={[
              { icon: <Radio className="text-black" size={28}/>, bgToken: 'bg-[#1ed760]', title: 'Spotify', description: 'Share your latest or favorite music' },
              { icon: <Facebook className="text-[#1877f2]" fill="currentColor" size={32}/>, bgToken: 'bg-white border-2 border-gray-100', title: 'Facebook', description: 'Add Facebook videos to your Ai Appsec lab' },
              { icon: <div className="text-white font-[900] text-[40px] italic pr-1 pb-1">P</div>, bgToken: 'bg-[#e60023]', title: 'Pinterest', description: 'Showcase Pins, boards and more' },
              { icon: <Radio className="text-[#1a3622]" size={28}/>, bgToken: 'bg-[#d2e823]', title: 'Podcasts', description: 'Get more podcast listeners and subscribers' }
            ]}
          />

       </div>
    </div>
  );
};

export default Marketplace;
