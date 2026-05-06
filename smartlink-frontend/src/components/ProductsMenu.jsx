import React from 'react';
import { Link } from 'react-router-dom';
import { Link2, LayoutTemplate, Users, DollarSign, BarChart2, ChevronRight, Instagram, Linkedin, Twitter } from 'lucide-react';

const ProductsMenu = () => {
  return (
    <div className="w-[1000px] bg-white rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-gray-100 flex overflow-hidden z-50 origin-top-left animate-in fade-in zoom-in-95 duration-200">
      
      {/* Column 1 */}
      <div className="w-[30%] bg-[#f3f4f6] p-4 py-6 border-r border-gray-100 flex flex-col gap-2">
        <button className="w-full flex items-center justify-between bg-white px-5 py-[18px] rounded-[16px] shadow-sm shadow-gray-200/50 hover:bg-white text-left text-gray-900 border border-transparent">
          <div className="flex items-center gap-4">
            <Link2 size={22} className="text-gray-800" />
            <span className="font-bold text-[15px] tracking-tight">Link in bio + tools</span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
        
        <button className="w-full flex items-center justify-between px-5 py-[18px] rounded-[16px] hover:bg-gray-200/60 text-left text-gray-700 transition">
          <div className="flex items-center gap-4">
            <LayoutTemplate size={22} className="text-gray-600" />
            <span className="font-semibold text-[15px] tracking-tight">Manage your social media</span>
          </div>
          <ChevronRight size={18} className="text-gray-400 opacity-0 group-hover:opacity-100 transition" />
        </button>

        <button className="w-full flex items-center justify-between px-5 py-[18px] rounded-[16px] hover:bg-gray-200/60 text-left text-gray-700 transition">
          <div className="flex items-center gap-4">
            <Users size={22} className="text-gray-600" />
            <span className="font-semibold text-[15px] tracking-tight">Grow and engage your audience</span>
          </div>
          <ChevronRight size={18} className="text-gray-400 opacity-0 transition" />
        </button>

        <button className="w-full flex items-center justify-between px-5 py-[18px] rounded-[16px] hover:bg-gray-200/60 text-left text-gray-700 transition">
          <div className="flex items-center gap-4">
            <DollarSign size={22} className="text-gray-600" />
            <span className="font-semibold text-[15px] tracking-tight">Monetize your following</span>
          </div>
          <ChevronRight size={18} className="text-gray-400 opacity-0 transition" />
        </button>

        <button className="w-full flex items-center justify-between px-5 py-[18px] rounded-[16px] hover:bg-gray-200/60 text-left text-gray-700 transition">
          <div className="flex items-center gap-4">
            <BarChart2 size={22} className="text-gray-600" />
            <span className="font-semibold text-[15px] tracking-tight">Measure your success</span>
          </div>
          <ChevronRight size={18} className="text-gray-400 opacity-0 transition" />
        </button>
      </div>

      {/* Column 2 */}
      <div className="w-[35%] py-8 px-8 flex flex-col gap-6">
        <Link to="/products" className="group flex flex-col hover:bg-gray-50 -mx-4 px-4 py-2 rounded-xl transition">
          <h4 className="font-bold text-gray-900 group-hover:text-[#1a3622] text-[16px] mb-1 tracking-tight">Link in bio</h4>
          <p className="text-[13px] text-gray-500 font-medium leading-relaxed">Customize your Ai Appsec lab</p>
        </Link>
        <Link to="/products" className="group flex flex-col hover:bg-gray-50 -mx-4 px-4 py-2 rounded-xl transition">
          <h4 className="font-bold text-gray-900 group-hover:text-[#1a3622] text-[16px] mb-1 tracking-tight">Link shortener</h4>
          <p className="text-[13px] text-gray-500 font-medium leading-relaxed">Create trackable, shareable short links</p>
        </Link>
        <Link to="/products" className="group flex flex-col hover:bg-gray-50 -mx-4 px-4 py-2 rounded-xl transition">
          <h4 className="font-bold text-gray-900 group-hover:text-[#1a3622] text-[16px] mb-1 tracking-tight">QR code generator</h4>
          <p className="text-[13px] text-gray-500 font-medium leading-relaxed">Turn links into scannable QR codes</p>
        </Link>
        <Link to="/products" className="group flex flex-col hover:bg-gray-50 -mx-4 px-4 py-2 pb-6 border-b border-gray-100/0 rounded-xl transition">
          <h4 className="font-bold text-gray-900 group-hover:text-[#1a3622] text-[16px] mb-1 tracking-tight">Canva Background Editor</h4>
          <p className="text-[13px] text-gray-500 font-medium leading-relaxed">Import your custom designs from Canva into your profile</p>
        </Link>
        
        <div className="pt-2">
          <h4 className="font-bold text-gray-900 text-[16px] mb-1 tracking-tight">Ai Appsec lab for every social platform</h4>
          <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-5">Grow and engage your audience everywhere</p>
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
         <div className="w-full bg-[#05118c] h-[240px] rounded-[24px] mb-6 relative overflow-hidden flex items-center justify-center shadow-inner group">
            {/* Inner mockup representation */}
            <div className="w-[60%] h-[90%] bg-[#e3e2db] rounded-[20px] shadow-2xl overflow-hidden relative border-[3px] border-white/10 group-hover:scale-105 transition-transform duration-500">
               <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" className="absolute top-0 w-full h-[60%] object-cover object-top" alt="Alba" />
               <div className="absolute bottom-4 w-full text-center flex flex-col items-center">
                  <h5 className="font-black text-[10px] text-gray-900 mb-0.5">Alba</h5>
                  <p className="text-[7px] font-bold opacity-60">La pancia comanda il cervello</p>
                  <div className="flex gap-2 mt-2">
                    <div className="w-3 h-3 bg-black rounded-full flex items-center justify-center"><Instagram size={6} className="text-white"/></div>
                    <div className="w-3 h-3 bg-black rounded-full text-[6px] text-white flex items-center justify-center">S</div>
                    <div className="w-3 h-3 bg-black rounded-full text-[6px] text-white flex items-center justify-center">▶</div>
                  </div>
               </div>
            </div>
            <div className="absolute top-5 right-5 bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-blue-600 shadow-md transform rotate-3">
                linktr.ee/albaaaa
            </div>
         </div>
         <h4 className="font-bold text-gray-900 text-[17px] mb-2 leading-tight tracking-[-0.01em]">Join 70M+ using Ai Appsec lab as their link in bio</h4>
         <p className="text-[14px] text-gray-500 font-medium leading-[1.6]">One link to share everything you create, curate, and sell across all your socials.</p>
      </div>

    </div>
  );
};

export default ProductsMenu;
