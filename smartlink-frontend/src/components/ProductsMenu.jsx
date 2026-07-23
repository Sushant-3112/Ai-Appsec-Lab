import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link2, LayoutTemplate, Users, DollarSign, BarChart2, ChevronRight, Instagram, Linkedin, Twitter, MessageCircle, Share2, Youtube, QrCode } from 'lucide-react';

const ProductsMenu = () => {
  const [activeTab, setActiveTab] = useState('linkInBio');

  const contentMap = {
    linkInBio: {
      items: [
        { title: 'Link in bio', desc: 'Customize your Ai Appsec lab', link: '/dashboard?tab=profile' },
        { title: 'Link shortener', desc: 'Create trackable, shareable short links', link: '/dashboard?tab=links' },
        { title: 'QR code generator', desc: 'Turn links into scannable QR codes', link: '/dashboard?tab=qrcode' },
        { title: 'Canva Background Editor', desc: 'Import your custom designs from Canva into your profile', link: '/dashboard?tab=templates' }
      ],
      socialText: 'Ai Appsec lab for every social platform',
      socialDesc: 'Grow and engage your audience everywhere',
      featuredTitle: 'Join 70M+ using Ai Appsec lab as their link in bio',
      featuredDesc: 'One link to share everything you create, curate, and sell across all your socials.',
      featuredImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
      featuredHandle: 'linktr.ee/albaaaa',
      bgColor: 'bg-[#05118c]'
    },
    manageSocial: {
      items: [
        { title: 'Social Media Scheduler', desc: 'Plan and publish content across platforms', link: '/dashboard?tab=links' },
        { title: 'Content Calendar', desc: 'Visualize your entire content strategy', link: '/dashboard?tab=analytics' },
        { title: 'Auto-posting', desc: 'Set it and forget it for maximum reach', link: '/dashboard?tab=links' }
      ],
      socialText: 'Connect all your accounts',
      socialDesc: 'Seamlessly manage your online presence from one dashboard',
      featuredTitle: 'Save 10+ hours a week',
      featuredDesc: 'Creators who schedule content grow 3x faster than those who don\'t.',
      featuredImg: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop',
      featuredHandle: 'Social Pro',
      bgColor: 'bg-[#1a3622]'
    },
    growAudience: {
      items: [
        { title: 'Email collection', desc: 'Capture subscriber emails directly from your bio', link: '/dashboard?tab=audience' },
        { title: 'SMS marketing', desc: 'Text your biggest fans with instant updates', link: '/dashboard?tab=audience' },
        { title: 'Community chat', desc: 'Host a private space for your followers', link: '/dashboard?tab=audience' }
      ],
      socialText: 'Turn followers into true fans',
      socialDesc: 'Build a community that goes wherever you go',
      featuredTitle: 'Own your audience',
      featuredDesc: 'Never rely on the algorithm again. Reach your fans directly every time.',
      featuredImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&auto=format&fit=crop',
      featuredHandle: 'Community Hub',
      bgColor: 'bg-[#e55934]'
    },
    monetize: {
      items: [
        { title: 'Digital Products', desc: 'Sell ebooks, templates, and courses', link: '/dashboard?tab=monetize' },
        { title: 'Tip Jar', desc: 'Let your biggest fans support your work directly', link: '/dashboard?tab=monetize' },
        { title: 'Affiliate links', desc: 'Organize and track your affiliate partnerships', link: '/dashboard?tab=monetize' }
      ],
      socialText: 'Start earning today',
      socialDesc: 'Turn your passion into a profitable business',
      featuredTitle: 'Make money doing what you love',
      featuredDesc: 'Over $200M has been earned by creators using our monetization tools.',
      featuredImg: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400&auto=format&fit=crop',
      featuredHandle: 'Creator Store',
      bgColor: 'bg-[#f4a261]'
    },
    measure: {
      items: [
        { title: 'Advanced Analytics', desc: 'See exactly where your traffic comes from', link: '/dashboard?tab=analytics' },
        { title: 'Click tracking', desc: 'Know which links convert the best', link: '/dashboard?tab=analytics' },
        { title: 'Conversion tracking', desc: 'Connect to Google Analytics and Facebook Pixel', link: '/dashboard?tab=analytics' }
      ],
      socialText: 'Data-driven decisions',
      socialDesc: 'Understand your audience better than ever',
      featuredTitle: 'Measure what matters',
      featuredDesc: 'Get actionable insights to grow your audience and increase your revenue.',
      featuredImg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop',
      featuredHandle: 'Analytics Pro',
      bgColor: 'bg-[#2a9d8f]'
    }
  };

  const activeData = contentMap[activeTab];

  return (
    <div className="w-[1000px] bg-white rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-gray-100 flex overflow-hidden z-50 origin-top-left animate-in fade-in zoom-in-95 duration-200">
      
      {/* Column 1 */}
      <div className="w-[30%] bg-[#f3f4f6] p-4 py-6 border-r border-gray-100 flex flex-col gap-2">
        <button 
          onMouseEnter={() => setActiveTab('linkInBio')}
          className={`w-full flex items-center justify-between px-5 py-[18px] rounded-[16px] text-left transition ${activeTab === 'linkInBio' ? 'bg-white shadow-sm shadow-gray-200/50 text-gray-900 border border-transparent' : 'hover:bg-gray-200/60 text-gray-700'}`}
        >
          <div className="flex items-center gap-4">
            <Link2 size={22} className={activeTab === 'linkInBio' ? 'text-gray-800' : 'text-gray-600'} />
            <span className={`font-semibold text-[15px] tracking-tight ${activeTab === 'linkInBio' ? 'font-bold' : ''}`}>Link in bio + tools</span>
          </div>
          <ChevronRight size={18} className={`transition ${activeTab === 'linkInBio' ? 'text-gray-400 opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'}`} />
        </button>
        
        <button 
          onMouseEnter={() => setActiveTab('manageSocial')}
          className={`w-full flex items-center justify-between px-5 py-[18px] rounded-[16px] text-left transition ${activeTab === 'manageSocial' ? 'bg-white shadow-sm shadow-gray-200/50 text-gray-900 border border-transparent' : 'hover:bg-gray-200/60 text-gray-700'}`}
        >
          <div className="flex items-center gap-4">
            <LayoutTemplate size={22} className={activeTab === 'manageSocial' ? 'text-gray-800' : 'text-gray-600'} />
            <span className={`font-semibold text-[15px] tracking-tight ${activeTab === 'manageSocial' ? 'font-bold' : ''}`}>Manage your social media</span>
          </div>
          <ChevronRight size={18} className={`transition ${activeTab === 'manageSocial' ? 'text-gray-400 opacity-100' : 'text-gray-400 opacity-0'}`} />
        </button>

        <button 
          onMouseEnter={() => setActiveTab('growAudience')}
          className={`w-full flex items-center justify-between px-5 py-[18px] rounded-[16px] text-left transition ${activeTab === 'growAudience' ? 'bg-white shadow-sm shadow-gray-200/50 text-gray-900 border border-transparent' : 'hover:bg-gray-200/60 text-gray-700'}`}
        >
          <div className="flex items-center gap-4">
            <Users size={22} className={activeTab === 'growAudience' ? 'text-gray-800' : 'text-gray-600'} />
            <span className={`font-semibold text-[15px] tracking-tight ${activeTab === 'growAudience' ? 'font-bold' : ''}`}>Grow and engage your audience</span>
          </div>
          <ChevronRight size={18} className={`transition ${activeTab === 'growAudience' ? 'text-gray-400 opacity-100' : 'text-gray-400 opacity-0'}`} />
        </button>

        <button 
          onMouseEnter={() => setActiveTab('monetize')}
          className={`w-full flex items-center justify-between px-5 py-[18px] rounded-[16px] text-left transition ${activeTab === 'monetize' ? 'bg-white shadow-sm shadow-gray-200/50 text-gray-900 border border-transparent' : 'hover:bg-gray-200/60 text-gray-700'}`}
        >
          <div className="flex items-center gap-4">
            <DollarSign size={22} className={activeTab === 'monetize' ? 'text-gray-800' : 'text-gray-600'} />
            <span className={`font-semibold text-[15px] tracking-tight ${activeTab === 'monetize' ? 'font-bold' : ''}`}>Monetize your following</span>
          </div>
          <ChevronRight size={18} className={`transition ${activeTab === 'monetize' ? 'text-gray-400 opacity-100' : 'text-gray-400 opacity-0'}`} />
        </button>

        <button 
          onMouseEnter={() => setActiveTab('measure')}
          className={`w-full flex items-center justify-between px-5 py-[18px] rounded-[16px] text-left transition ${activeTab === 'measure' ? 'bg-white shadow-sm shadow-gray-200/50 text-gray-900 border border-transparent' : 'hover:bg-gray-200/60 text-gray-700'}`}
        >
          <div className="flex items-center gap-4">
            <BarChart2 size={22} className={activeTab === 'measure' ? 'text-gray-800' : 'text-gray-600'} />
            <span className={`font-semibold text-[15px] tracking-tight ${activeTab === 'measure' ? 'font-bold' : ''}`}>Measure your success</span>
          </div>
          <ChevronRight size={18} className={`transition ${activeTab === 'measure' ? 'text-gray-400 opacity-100' : 'text-gray-400 opacity-0'}`} />
        </button>
      </div>

      {/* Column 2 */}
      <div className="w-[35%] py-8 px-8 flex flex-col gap-6 relative">
        <div className="flex-1">
          {activeData.items.map((item, index) => (
            <Link key={index} to={item.link} className={`group flex flex-col hover:bg-gray-50 -mx-4 px-4 py-2 rounded-xl transition ${index === activeData.items.length - 1 ? 'pb-6 border-b border-gray-100/0' : ''}`}>
              <h4 className="font-bold text-gray-900 group-hover:text-[#1a3622] text-[16px] mb-1 tracking-tight">{item.title}</h4>
              <p className="text-[13px] text-gray-500 font-medium leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
        
        <div className="pt-2 mt-auto">
          <h4 className="font-bold text-gray-900 text-[16px] mb-1 tracking-tight">{activeData.socialText}</h4>
          <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-5">{activeData.socialDesc}</p>
          <div className="flex gap-3">
            <button className="w-[50px] h-[50px] bg-gray-100 hover:bg-gray-200 rounded-[14px] flex items-center justify-center text-gray-700 transition"><Instagram size={24} /></button>
            <button className="w-[50px] h-[50px] bg-gray-100 hover:bg-gray-200 rounded-[14px] flex items-center justify-center font-bold text-2xl text-gray-700 transition">t</button>
            <button className="w-[50px] h-[50px] bg-gray-100 hover:bg-gray-200 rounded-[14px] flex items-center justify-center text-gray-700 transition"><Linkedin size={22} /></button>
            <button className="w-[50px] h-[50px] bg-gray-100 hover:bg-gray-200 rounded-[14px] flex items-center justify-center text-gray-700 transition"><Twitter size={22} /></button>
          </div>
        </div>
      </div>

      {/* Column 3 */}
      <div className="w-[35%] bg-white py-8 px-8 border-l border-gray-100 flex flex-col relative z-10">
         <h4 className="font-bold text-gray-900 text-[16px] mb-5 tracking-tight">Featured</h4>
         <div className={`w-full ${activeData.bgColor} h-[240px] rounded-[24px] mb-6 relative overflow-hidden flex items-center justify-center shadow-inner group transition-colors duration-500`}>
            {/* Inner mockup representation */}
            <div className="w-[60%] h-[90%] bg-[#e3e2db] rounded-[20px] shadow-2xl overflow-hidden relative border-[3px] border-white/10 group-hover:scale-105 transition-transform duration-500">
               <img src={activeData.featuredImg} className="absolute top-0 w-full h-[60%] object-cover object-top" alt="Featured" />
               <div className="absolute bottom-4 w-full text-center flex flex-col items-center">
                  <h5 className="font-black text-[10px] text-gray-900 mb-0.5">Alba</h5>
                  <p className="text-[7px] font-bold opacity-60 line-clamp-1 px-2">Welcome to my space</p>
                  <div className="flex gap-2 mt-2">
                    <div className="w-3 h-3 bg-black rounded-full flex items-center justify-center"><Instagram size={6} className="text-white"/></div>
                    <div className="w-3 h-3 bg-black rounded-full text-[6px] text-white flex items-center justify-center">S</div>
                    <div className="w-3 h-3 bg-black rounded-full text-[6px] text-white flex items-center justify-center">▶</div>
                  </div>
               </div>
            </div>
            <div className="absolute top-5 right-5 bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-blue-600 shadow-md transform rotate-3">
                {activeData.featuredHandle}
            </div>
         </div>
         <h4 className="font-bold text-gray-900 text-[17px] mb-2 leading-tight tracking-[-0.01em]">{activeData.featuredTitle}</h4>
         <p className="text-[14px] text-gray-500 font-medium leading-[1.6]">{activeData.featuredDesc}</p>
      </div>

    </div>
  );
};

export default ProductsMenu;
