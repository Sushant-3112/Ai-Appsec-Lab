import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, HelpCircle, ChevronRight } from 'lucide-react';

const LearnMenu = () => {
  return (
    <div className="w-[850px] bg-white rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-gray-100 flex overflow-hidden z-50 origin-top animate-in fade-in zoom-in-95 duration-200">
      
      {/* Column 1 */}
      <div className="w-[30%] bg-[#f3f4f6] p-4 py-6 border-r border-gray-100 flex flex-col gap-2">
        <button className="w-full flex items-center justify-between bg-white px-5 py-[18px] rounded-[16px] shadow-sm shadow-gray-200/50 hover:bg-white text-left text-gray-900 border border-transparent">
          <div className="flex items-center gap-4">
            <LayoutGrid size={22} className="text-gray-800" />
            <span className="font-bold text-[15px] tracking-tight">Resources</span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
        
        <button className="w-full flex items-center justify-between px-5 py-[18px] rounded-[16px] hover:bg-gray-200/60 text-left text-gray-700 transition group">
          <div className="flex items-center gap-4">
            <HelpCircle size={22} className="text-gray-600" />
            <span className="font-semibold text-[15px] tracking-tight">How to use Ai Appsec lab</span>
          </div>
          <ChevronRight size={18} className="text-gray-400 opacity-0 group-hover:opacity-100 transition" />
        </button>
      </div>

      {/* Column 2 */}
      <div className="w-[30%] py-8 px-8 flex flex-col gap-6">
        <Link to="/learn" className="group flex flex-col hover:bg-gray-50 -mx-4 px-4 py-2 rounded-xl transition">
          <h4 className="font-bold text-gray-900 group-hover:text-[#2a5bd7] text-[16px] mb-1 tracking-tight">Read our blog</h4>
          <p className="text-[13px] text-gray-500 font-medium leading-relaxed">All the latest tips, tricks and growth strategies</p>
        </Link>
        <Link to="/learn" className="group flex flex-col hover:bg-gray-50 -mx-4 px-4 py-2 rounded-xl transition">
          <h4 className="font-bold text-gray-900 group-hover:text-[#2a5bd7] text-[16px] mb-1 tracking-tight">Success Stories</h4>
          <p className="text-[13px] text-gray-500 font-medium leading-relaxed">Real people, real results on Ai Appsec lab</p>
        </Link>
      </div>

      {/* Column 3 */}
      <div className="w-[40%] bg-white py-8 px-8 border-l border-gray-100 flex flex-col relative z-10">
         <h4 className="font-bold text-gray-900 text-[16px] mb-4 tracking-tight">Learn with Ai Appsec lab</h4>
         
         {/* Green Rounded Banner Component */}
         <div className="w-full bg-[#275b28] h-[200px] rounded-[24px] mb-5 relative overflow-hidden flex items-center justify-center shadow-inner group p-4">
            
            {/* Inner Mockup Course Card */}
            <div className="w-[50%] h-[95%] bg-white rounded-[20px] shadow-2xl overflow-hidden relative group-hover:scale-105 transition-transform duration-500 flex flex-col">
               <img src="https://images.unsplash.com/photo-1563241527-3004b7be6b7b?auto=format&fit=crop&q=80&w=400" className="w-full h-[55%] object-cover object-center" alt="Floral Design" />
               <div className="flex-1 px-3 py-2 flex flex-col justify-between items-center text-center pb-3">
                  <div className="w-full">
                     <h5 className="font-black text-[12px] text-gray-900 mb-[2px] tracking-tight">The Art of Floral Design</h5>
                     <p className="text-[11px] text-gray-500 font-semibold mb-2 text-left w-full">$75.00</p>
                  </div>
                  <button className="w-full bg-[#1a1f2e] text-white text-[11px] font-bold py-2 rounded-full hover:scale-105 transition-transform border border-transparent">Enroll</button>
               </div>
            </div>
            
         </div>
         
         <h4 className="font-bold text-gray-900 text-[15px] mb-1 leading-tight tracking-[-0.01em]">Create & sell your own online Course</h4>
         <p className="text-[13px] text-gray-500 font-medium leading-[1.6]">If you've got something to share, you've got something to sell. Easily create and share an online course that...</p>
      </div>

    </div>
  );
};

export default LearnMenu;
