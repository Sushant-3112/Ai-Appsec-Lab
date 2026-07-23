import React, { useState } from 'react';
import { Search, Music, Twitter, Youtube, DollarSign, Store, ShoppingBag, Radio, MessagesSquare, FileText, Share2, Facebook, Check, Shield, Code, Sparkles, ExternalLink, Plus, X, Upload, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AppCard = ({ icon, title, description, bgToken, category, url, onConnect, isConnected }) => (
  <div className="flex items-center gap-4 p-4 rounded-[20px] bg-white border border-gray-100 hover:border-amber-300 hover:shadow-lg transition-all w-full text-left group relative overflow-hidden">
     {/* App Icon + External Link */}
     <a 
       href={url || '#'} 
       target="_blank" 
       rel="noopener noreferrer" 
       className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden transition-transform group-hover:scale-105 ${bgToken || 'bg-white border border-gray-200'}`}
       title={`Visit official ${title} website`}
     >
        {icon}
     </a>

     <div className="flex-1 min-w-0 pr-2">
       <div className="flex items-center gap-1.5">
         <a 
           href={url || '#'} 
           target="_blank" 
           rel="noopener noreferrer"
           className="font-bold text-gray-900 text-[16px] group-hover:text-[#780016] transition-colors tracking-tight truncate flex items-center gap-1 hover:underline"
         >
           <span>{title}</span>
           <ExternalLink size={13} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
         </a>
         {category && <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full shrink-0">{category}</span>}
       </div>
       <p className="font-medium text-[13px] text-gray-500 leading-snug line-clamp-2 mt-0.5">{description}</p>
     </div>
     
     <button 
       onClick={() => onConnect({ title, icon, bgToken, description, url })}
       className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
         isConnected 
           ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
           : 'bg-gray-900 hover:bg-black text-white shadow-xs'
       }`}
     >
       {isConnected ? (
         <span className="flex items-center gap-1"><Check size={14} /> Connected</span>
       ) : (
         <span className="flex items-center gap-1"><Plus size={14} /> Connect</span>
       )}
     </button>
  </div>
);

const AppSection = ({ title, seeAllText, apps, connectedApps, handleConnect }) => (
  <div className="mb-16">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-[28px] font-black tracking-[-0.03em] text-gray-900">{title}</h2>
      </div>
      {seeAllText && <button className="font-bold text-[14px] text-[#2a5bd7] hover:underline underline-offset-4 cursor-pointer">{seeAllText}</button>}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       {apps.map((app, i) => (
         <AppCard 
           key={i} 
           {...app} 
           isConnected={connectedApps.includes(app.title)}
           onConnect={handleConnect}
         />
       ))}
    </div>
  </div>
);

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedApps, setConnectedApps] = useState(['YouTube', 'Shopify']);
  const [activeTab, setActiveTab] = useState('All');
  const [toastMessage, setToastMessage] = useState('');
  
  // Connect & Content Upload Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [contentForm, setContentForm] = useState({
    title: '',
    url: '',
    animation: 'pulse',
    category: 'Marketplace'
  });

  const handleOpenConnectModal = (app) => {
    setSelectedApp(app);
    setContentForm({
      title: `${app.title} - Official Link`,
      url: app.url || '',
      animation: 'pulse',
      category: 'Marketplace'
    });
    setIsModalOpen(true);
  };

  const handleSaveAndUpload = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('/api/links', {
          title: contentForm.title || selectedApp.title,
          url: contentForm.url || selectedApp.url,
          type: selectedApp.title.toLowerCase(),
          animation: contentForm.animation,
          category: 'Marketplace',
          is_active: true
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (!connectedApps.includes(selectedApp.title)) {
        setConnectedApps([...connectedApps, selectedApp.title]);
      }

      setIsModalOpen(false);
      showToast(`🎉 Connected ${selectedApp.title} & uploaded content to your bio profile!`);
    } catch (err) {
      console.error("Content upload error:", err);
      // Local fallback
      if (!connectedApps.includes(selectedApp.title)) {
        setConnectedApps([...connectedApps, selectedApp.title]);
      }
      setIsModalOpen(false);
      showToast(`🎉 Connected ${selectedApp.title} to your profile!`);
    } finally {
      setUploading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const shareApps = [
    { icon: <Music className="text-[#f9a01b]" fill="currentColor" size={28}/>, bgToken: 'bg-white border-2 border-gray-100', title: 'Audiomack', description: 'Add an Audiomack player to your Ai Appsec lab', url: 'https://audiomack.com' },
    { icon: <Music className="text-white" fill="currentColor" size={28}/>, bgToken: 'bg-[#ff5500]', title: 'SoundCloud', description: 'Get your music heard on SoundCloud', url: 'https://soundcloud.com' },
    { icon: <Music className="text-white" size={28}/>, bgToken: 'bg-black', title: 'TikTok', description: 'Share your TikToks on your Ai Appsec lab', url: 'https://tiktok.com' },
    { icon: <Twitter className="text-white" fill="currentColor" size={24} />, bgToken: 'bg-black', title: 'X (Twitter)', description: 'Showcase your posts and X feed', url: 'https://x.com' },
    { icon: <Youtube className="text-[#ff0000]" fill="currentColor" size={28}/>, bgToken: 'bg-white border flex items-center justify-center', title: 'YouTube', description: 'Share YouTube videos on your Ai Appsec lab', url: 'https://www.youtube.com/@SamayRainaOfficial' },
    { icon: <div className="text-white font-[900] text-3xl mb-1 tracking-tighter">C</div>, bgToken: 'bg-black', title: 'Cameo', description: 'Make impossible fan connections possible', url: 'https://cameo.com' },
    { icon: <Radio className="text-black" size={28}/>, bgToken: 'bg-[#1ed760]', title: 'Spotify', description: 'Share your latest tracks, playlists or podcasts', url: 'https://spotify.com' },
    { icon: <Facebook className="text-[#1877f2]" fill="currentColor" size={32}/>, bgToken: 'bg-white border-2 border-gray-100', title: 'Facebook', description: 'Add Facebook videos and page feed', url: 'https://facebook.com' },
    { icon: <div className="text-white font-[900] text-[40px] italic pr-1 pb-1">P</div>, bgToken: 'bg-[#e60023]', title: 'Pinterest', description: 'Showcase Pins, boards and collections', url: 'https://pinterest.com' }
  ];

  const moneyApps = [
    { icon: <DollarSign className="text-white" size={28}/>, bgToken: 'bg-[#00b964]', title: 'GoFundMe', description: 'Promote the causes you care about most', url: 'https://gofundme.com' },
    { icon: <ShoppingBag className="text-white" fill="currentColor" size={24}/>, bgToken: 'bg-black', title: 'Amaze', description: 'Design and sell physical products directly', url: 'https://amaze.co' },
    { icon: <Store className="text-white" size={28}/>, bgToken: 'bg-[#95bf47]', title: 'Shopify', description: 'Display your products to boost online sales', url: 'https://shopify.com' },
    { icon: <div className="text-white font-black text-2xl">☕</div>, bgToken: 'bg-[#ffdd00]', title: 'Buy Me a Coffee', description: 'Accept tips and memberships from fans', url: 'https://buymeacoffee.com' },
    { icon: <div className="text-white font-black text-2xl">P</div>, bgToken: 'bg-[#ff424d]', title: 'Patreon', description: 'Monetize exclusive content for supporters', url: 'https://patreon.com' },
    { icon: <DollarSign className="text-white" size={28}/>, bgToken: 'bg-[#003087]', title: 'PayPal', description: 'Collect direct payments and donations', url: 'https://paypal.com' }
  ];

  const audienceApps = [
    { icon: <div className="w-8 h-8 rounded bg-yellow-400"></div>, bgToken: 'bg-[#fffc00]', title: 'Snapchat', description: 'Promote your Snapchat Public Profile', url: 'https://snapchat.com' },
    { icon: <div className="text-white font-black text-3xl transform -translate-y-[2px]">r</div>, bgToken: 'bg-[#ff4500]', title: 'Reddit', description: 'Showcase your Reddit profile and posts', url: 'https://reddit.com' },
    { icon: <FileText className="text-white" size={24}/>, bgToken: 'bg-[#9932cc]', title: 'Contact Details', description: 'Easily share downloadable vCard contact file', url: 'https://contacts.google.com' },
    { icon: <MessagesSquare className="text-white" size={24} fill="currentColor"/>, bgToken: 'bg-black', title: 'Community SMS', description: 'Build an SMS subscriber list', url: 'https://community.com' },
    { icon: <Share2 className="text-gray-400" size={28}/>, bgToken: 'bg-white border-2 border-gray-100', title: 'Gleam', description: 'Run giveaways and growth campaigns', url: 'https://gleam.io' },
    { icon: <FileText className="text-white" size={24}/>, bgToken: 'bg-[#4b0082]', title: 'Form', description: 'Collect visitor contact info and inquiries', url: 'https://forms.google.com' }
  ];

  const devSecurityApps = [
    { icon: <Code className="text-white" size={28}/>, bgToken: 'bg-[#24292e]', title: 'GitHub', description: 'Showcase repositories, gists & open-source projects', url: 'https://github.com/Sushant-3112' },
    { icon: <Shield className="text-white" size={28}/>, bgToken: 'bg-[#7c3aed]', title: 'AppSec Scanner', description: 'Display live vulnerability badges & audit status', url: 'https://ai-appsec-lab.vercel.app' },
    { icon: <Sparkles className="text-white" size={28}/>, bgToken: 'bg-[#059669]', title: 'Postman Hub', description: 'Share interactive API collections & documentation', url: 'https://postman.com' }
  ];

  // Filter apps by search
  const filterApps = (apps) => apps.filter(app => 
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-gray-900 pb-20">
       
       {/* Toast Notification */}
       {toastMessage && (
         <div className="fixed bottom-8 right-8 z-50 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 animate-bounce border border-white/20">
           <span>⚡</span> 
           <span>{toastMessage}</span>
           <button 
             onClick={() => navigate('/editor')} 
             className="ml-2 bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1"
           >
             View in Editor <ArrowRight size={12} />
           </button>
         </div>
       )}

       {/* Sub Header Bar */}
       <div className="bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center px-6 lg:px-12 justify-between py-4 shadow-2xs">
          <div className="flex items-center gap-6">
             <span className="font-black text-[20px] tracking-tight flex items-center gap-1.5">
               <span>Ai Appsec lab</span>
               <span className="text-[#10b981] font-black">*</span> 
               <span className="text-gray-300 font-light mx-1">|</span> 
               <span className="text-gray-600 font-semibold">Marketplace</span>
             </span>
             
             {/* Category Filter Pills */}
             <div className="hidden md:flex gap-2">
               {['All', 'Share Content', 'Monetization', 'Audience', 'Security'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                     activeTab === tab 
                       ? 'bg-gray-900 text-white' 
                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                   }`}
                 >
                   {tab}
                 </button>
               ))}
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={() => navigate('/editor')}
               className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-full text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
             >
               <span>Template Editor</span>
               <ArrowRight size={14} />
             </button>
             <span className="text-xs font-bold text-gray-500 hidden sm:inline">
               Connected Apps: <span className="text-emerald-600 font-black">{connectedApps.length}</span>
             </span>
          </div>
       </div>

       {/* Hero Section */}
       <div className="bg-[#780016] w-full relative overflow-hidden flex items-center lg:items-start pt-16 pb-24 px-6 lg:px-16 min-h-[460px]">
          <div className="w-full lg:w-[48%] z-20 relative lg:pt-6">
             <span className="px-3.5 py-1 bg-white/10 backdrop-blur-md text-amber-300 font-bold text-xs rounded-full border border-amber-400/30 uppercase tracking-wider mb-4 inline-block">
               Linktree Integrations Marketplace
             </span>
             <h1 className="text-[#fce7f3] font-black text-[3.5rem] sm:text-[4.5rem] lg:text-[5.2rem] leading-[0.95] tracking-[-0.04em] mb-5">
               Connect<br />more of you
             </h1>
             <p className="text-[#fbcfe8] text-[1.1rem] font-medium leading-[1.5] max-w-md mb-8">
               Bring the best content, products, and security integrations across the internet into your official Ai Appsec lab.
             </p>

             {/* Search Bar */}
             <div className="relative max-w-[450px]">
                <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 25+ Link Apps & integrations..." 
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white shadow-xl text-[15px] font-medium outline-none focus:ring-4 focus:ring-amber-500/30 text-gray-900"
                />
             </div>
          </div>

          {/* Right Side Showcase Banner */}
          <div className="hidden lg:block absolute right-12 top-10 w-[46%] h-[380px] bg-gradient-to-br from-[#8b001a] to-[#4a000d] rounded-3xl border border-white/10 p-8 shadow-2xl overflow-hidden">
             <div className="flex justify-between items-center mb-6">
               <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">⚡ Featured Apps</span>
               <span className="text-xs font-semibold text-white/70">25+ Apps Available</span>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               <a href="https://www.youtube.com/@SamayRainaOfficial" target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-3 hover:bg-white/20 transition cursor-pointer">
                 <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shrink-0">
                   ▶
                 </div>
                 <div>
                   <p className="text-white text-xs font-bold flex items-center gap-1">YouTube <ExternalLink size={10} /></p>
                   <p className="text-white/60 text-[10px]">Video Embeds</p>
                 </div>
               </a>

               <a href="https://shopify.com" target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-3 hover:bg-white/20 transition cursor-pointer">
                 <div className="w-10 h-10 rounded-xl bg-[#95bf47] flex items-center justify-center text-white font-bold shrink-0">
                   🛒
                 </div>
                 <div>
                   <p className="text-white text-xs font-bold flex items-center gap-1">Shopify <ExternalLink size={10} /></p>
                   <p className="text-white/60 text-[10px]">Product Store</p>
                 </div>
               </a>

               <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-3 hover:bg-white/20 transition cursor-pointer">
                 <div className="w-10 h-10 rounded-xl bg-[#1ed760] flex items-center justify-center text-black font-bold shrink-0">
                   🎵
                 </div>
                 <div>
                   <p className="text-white text-xs font-bold flex items-center gap-1">Spotify <ExternalLink size={10} /></p>
                   <p className="text-white/60 text-[10px]">Audio Player</p>
                 </div>
               </a>

               <a href="https://github.com/Sushant-3112" target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-3 hover:bg-white/20 transition cursor-pointer">
                 <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                   🛡️
                 </div>
                 <div>
                   <p className="text-white text-xs font-bold flex items-center gap-1">AppSec Lab <ExternalLink size={10} /></p>
                   <p className="text-white/60 text-[10px]">Security Badges</p>
                 </div>
               </a>
             </div>
          </div>
       </div>

       {/* Content Grid Container */}
       <div className="max-w-[1240px] mx-auto px-6 lg:px-12 py-12">
          
          {(activeTab === 'All' || activeTab === 'Share Content') && (
            <AppSection 
              title="Share your content" 
              seeAllText="See 25 Apps"
              apps={filterApps(shareApps)}
              connectedApps={connectedApps}
              handleConnect={handleOpenConnectModal}
            />
          )}

          {(activeTab === 'All' || activeTab === 'Monetization') && (
            <AppSection 
              title="Make and collect money" 
              seeAllText="See 14 Apps"
              apps={filterApps(moneyApps)}
              connectedApps={connectedApps}
              handleConnect={handleOpenConnectModal}
            />
          )}

          {/* Developer Program Banner */}
          <div className="w-full bg-gradient-to-r from-slate-900 to-indigo-950 rounded-[32px] overflow-hidden flex min-h-[260px] my-16 relative px-8 lg:px-12 py-12 text-white shadow-2xl border border-white/10">
             <div className="relative z-20 max-w-lg">
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2 block">Developer Ecosystem</span>
                <h2 className="text-[34px] lg:text-[42px] font-black leading-[1.05] tracking-tight text-white mb-3">Join our developer program</h2>
                <p className="text-[15px] font-medium text-slate-300 mb-6">Build custom Linktree integrations, AppSec widgets, and monetization APIs for millions of creators.</p>
                <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-3.5 rounded-full font-extrabold text-sm transition transform hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-emerald-500/20">
                  Register Developer Key
                </button>
             </div>
          </div>

          {(activeTab === 'All' || activeTab === 'Audience') && (
            <AppSection 
              title="Grow your following" 
              seeAllText="See 20 Apps"
              apps={filterApps(audienceApps)}
              connectedApps={connectedApps}
              handleConnect={handleOpenConnectModal}
            />
          )}

          {(activeTab === 'All' || activeTab === 'Security') && (
            <AppSection 
              title="Developer & AppSec Integrations" 
              seeAllText="See All"
              apps={filterApps(devSecurityApps)}
              connectedApps={connectedApps}
              handleConnect={handleOpenConnectModal}
            />
          )}

       </div>

       {/* Upload Content & Connect App Modal */}
       {isModalOpen && selectedApp && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn font-sans">
           <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 text-gray-900 relative">
             
             {/* Modal Header */}
             <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/50">
               <div className="flex items-center gap-3">
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedApp.bgToken}`}>
                   {selectedApp.icon}
                 </div>
                 <div>
                   <h3 className="text-base font-bold text-gray-900">Connect {selectedApp.title}</h3>
                   <p className="text-xs text-gray-500">Upload & Embed Content on your Profile</p>
                 </div>
               </div>
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition"
               >
                 <X size={20} />
               </button>
             </div>

             {/* Modal Body */}
             <form onSubmit={handleSaveAndUpload} className="p-6 space-y-4 text-left">
               <div>
                 <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                   Link / Content Title
                 </label>
                 <input 
                   type="text"
                   required
                   value={contentForm.title}
                   onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                   placeholder="e.g. Samay Raina - India's Got Latent EP 5"
                   className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                 />
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                   {selectedApp.title} Embed / Content URL
                 </label>
                 <input 
                   type="url"
                   required
                   value={contentForm.url}
                   onChange={(e) => setContentForm({ ...contentForm, url: e.target.value })}
                   placeholder={`https://${selectedApp.title.toLowerCase().replace(/\s+/g, '')}.com/your-content`}
                   className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                 />
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                   Button Animation & Style
                 </label>
                 <select
                   value={contentForm.animation}
                   onChange={(e) => setContentForm({ ...contentForm, animation: e.target.value })}
                   className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                 >
                   <option value="pulse">⚡ Pulsing Glow</option>
                   <option value="bounce">🏀 Bounce Effect</option>
                   <option value="wobble">✨ Wobble Highlight</option>
                   <option value="none">Standard Solid</option>
                 </select>
               </div>

               <div className="pt-4 flex gap-3">
                 <button
                   type="button"
                   onClick={() => setIsModalOpen(false)}
                   className="flex-1 py-3 px-4 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   disabled={uploading}
                   className="flex-1 py-3 px-4 text-xs font-bold text-white bg-gray-900 hover:bg-black rounded-full transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                 >
                   {uploading ? (
                     <span>Uploading & Connecting...</span>
                   ) : (
                     <>
                       <Upload size={14} />
                       <span>Upload & Embed Link</span>
                     </>
                   )}
                 </button>
               </div>
             </form>

           </div>
         </div>
       )}

    </div>
  );
};

export default Marketplace;
