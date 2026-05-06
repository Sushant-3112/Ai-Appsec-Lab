import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleClaim = (e) => {
    e.preventDefault();
    navigate(`/register?u=${username}`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* SECTION 1: Green (Hero) */}
      <section className="bg-[#d2e823] text-[#254f30] px-4 md:px-12 flex flex-col w-full align-center min-h-[95vh] pt-[200px] pb-32">
        <div className="max-w-[1240px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           <div className="max-w-2xl px-4 lg:px-0">
             <h1 className="text-[4.5rem] sm:text-[5rem] lg:text-[7rem] leading-[0.85] font-[900] text-[#1a3622] tracking-[-0.05em] mb-10">
               Everything you are. In one, simple link in bio.
             </h1>
             <p className="text-[1.1rem] sm:text-[1.2rem] font-[500] text-[#1a3622] mb-12 max-w-lg leading-relaxed tracking-[-0.01em]">
               Join 50M+ people using Ai Appsec lab for their link in bio. One link to help you share everything you create, curate and sell from your Instagram, TikTok, Twitter, YouTube and other social media profiles.
             </p>
             <form onSubmit={handleClaim} className="flex flex-col sm:flex-row gap-4 max-w-xl relative">
               <div className="flex-1 bg-white rounded-[16px] flex items-center px-6 h-[72px] shadow-[0_2px_4px_rgba(0,0,0,0.05)] focus-within:ring-[3px] focus-within:ring-[#1a3622] transition-shadow">
                 <span className="text-gray-500 font-semibold text-[17px] whitespace-nowrap">linktr.ee/</span>
                 <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="yourname" 
                    className="w-full bg-transparent border-none outline-none text-[#111827] font-semibold text-[17px] placeholder-gray-400 h-full" 
                 />
               </div>
               <button type="submit" className="bg-[#e9c0e9] hover:bg-[#d8b0d8] text-slate-900 h-[72px] px-10 rounded-full text-lg font-bold transition-all whitespace-nowrap tracking-tight">
                 Claim your Ai Appsec lab
               </button>
             </form>
           </div>
           <div className="relative w-full h-[600px] hidden lg:block">
             <img src="https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=1200&auto=format&fit=crop" className="absolute top-0 right-10 w-[440px] h-[580px] object-cover rounded-[50px] shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700 cursor-pointer border-4 border-[#d2e823]" alt="Mockup" />
             <div className="absolute bottom-10 right-28 bg-white/90 backdrop-blur-md px-6 py-5 rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center gap-4 hover:scale-105 transition-transform duration-500">
                 <div className="w-14 h-14 bg-black rounded-full text-white flex items-center justify-center font-bold text-xl">L*</div>
                 <div className="font-extrabold text-[22px] text-slate-900 tracking-tight">@averyclothing</div>
             </div>
           </div>
        </div>
      </section>

      {/* SECTION 2: Maroon */}
      <section className="bg-[#780016] text-[#e9c0e9] py-[180px] px-4 md:px-12 flex flex-col justify-center min-h-[100vh]">
        <div className="max-w-[1240px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div className="order-2 lg:order-1 relative w-full h-[700px] hidden lg:block perspective-1000">
             <div className="w-[340px] h-[550px] bg-[#1d4ed8] rounded-[40px] absolute right-40 top-10 transform -rotate-12 shadow-2xl hover:-rotate-6 transition-all duration-700 cursor-pointer"></div>
             <div className="w-[340px] h-[550px] bg-[#a855f7] rounded-[40px] absolute right-24 top-20 transform -rotate-6 shadow-2xl hover:rotate-0 transition-all duration-700 cursor-pointer"></div>
             <div className="w-[340px] h-[550px] bg-[#ec4899] rounded-[40px] absolute right-12 top-32 transform rotate-2 shadow-2xl hover:rotate-6 transition-all duration-700 cursor-pointer z-10"></div>
             <div className="w-[340px] h-[550px] bg-[#f8fafc] rounded-[40px] absolute right-0 top-44 transform rotate-12 shadow-[0_30px_60px_rgba(0,0,0,0.4)] p-8 hover:translate-x-4 hover:-translate-y-4 hover:rotate-[14deg] transition-all duration-700 cursor-pointer z-20">
               <div className="w-full h-full bg-white rounded-3xl shadow-inner border border-gray-100 p-8 flex flex-col items-center pt-16">
                  <div className="w-[120px] h-[120px] bg-[#d2e823] rounded-full border-[6px] border-white shadow-[0_10px_20px_rgba(0,0,0,0.1)] mb-8"></div>
                  <div className="w-[80%] h-6 bg-gray-200 rounded-full mb-10"></div>
                  <div className="w-full space-y-5">
                    <div className="w-full h-[60px] bg-gray-100 hover:bg-gray-200 transition-colors rounded-[24px]"></div>
                    <div className="w-full h-[60px] bg-gray-100 hover:bg-gray-200 transition-colors rounded-[24px]"></div>
                    <div className="w-full h-[60px] bg-gray-100 hover:bg-gray-200 transition-colors rounded-[24px]"></div>
                  </div>
               </div>
             </div>
           </div>
           <div className="order-1 lg:order-2 max-w-xl pl-0 lg:pl-10">
             <h2 className="text-[4rem] sm:text-[5rem] lg:text-[6.5rem] leading-[0.85] font-black tracking-[-0.04em] mb-10 text-[#e9c0e9]">
               Share your Ai Appsec lab anywhere you like!
             </h2>
             <p className="text-[1.1rem] sm:text-[1.3rem] font-[500] text-white mb-12 max-w-[450px] leading-[1.6] tracking-[-0.01em]">
               Add your unique Ai Appsec lab URL to all the platforms and places you find your audience. Then use your QR code to drive your offline traffic online.
             </p>
             <Link to="/register" className="inline-flex items-center justify-center bg-[#e9c0e9] hover:bg-[#d8b0d8] text-[#502224] h-[72px] px-12 rounded-full text-lg font-bold transition-all shadow-sm tracking-tight">
               Get started for free
             </Link>
           </div>
        </div>
      </section>

      {/* SECTION 3: Blue */}
      <section className="bg-[#2a5bd7] text-white py-[180px] px-4 md:px-12 flex flex-col justify-center min-h-[100vh]">
        <div className="max-w-[1240px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div className="max-w-2xl px-4 lg:px-0">
             <h2 className="text-[4rem] sm:text-[5rem] lg:text-[6.5rem] leading-[0.85] font-black tracking-[-0.04em] mb-10 text-[#d2e823]">
               Create and customize your Ai Appsec lab in minutes
             </h2>
             <p className="text-[1.1rem] sm:text-[1.3rem] font-[500] text-white mb-12 max-w-md leading-[1.6] tracking-[-0.01em]">
               Connect your TikTok, Instagram, Twitter, website, store, videos, music, podcast, events and more. It all comes together in a link in bio landing page designed to convert.
             </p>
             <Link to="/register" className="inline-flex items-center justify-center bg-[#d2e823] hover:bg-[#c6d721] text-[#1a3622] h-[72px] px-12 rounded-full text-lg font-bold transition-all shadow-sm tracking-tight">
               Get started for free
             </Link>
           </div>
           <div className="relative w-full h-[700px] hidden lg:flex items-center justify-center">
             <div className="absolute w-[360px] h-[550px] bg-white rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] p-5 transform -rotate-6 z-20 hover:rotate-0 transition-transform duration-700 ease-out cursor-pointer">
                <div className="w-full h-full bg-[#f8fafc] rounded-[24px] overflow-hidden relative shadow-inner border border-gray-100">
                  <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop" className="absolute top-0 left-0 w-full h-[65%] object-cover" alt="food" />
                  <div className="absolute bottom-0 left-0 w-full h-[35%] bg-white p-6 flex flex-col justify-center items-center">
                     <p className="text-[11px] font-[800] text-gray-400 uppercase tracking-widest mb-2">Intro Course</p>
                     <h4 className="font-black text-[26px] text-slate-900 tracking-tight leading-none text-center">Basque<br/>Cheesecake</h4>
                  </div>
                </div>
             </div>
             
             {/* Small floating components over the image */}
             <div className="absolute top-[25%] right-10 bg-white p-5 rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] flex items-center gap-5 transform rotate-12 z-30 hover:scale-110 transition-transform duration-300 cursor-pointer">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-2xl">t</div>
                <div>
                  <div className="w-[120px] h-[14px] bg-gray-200 rounded-full mb-3"></div>
                  <div className="w-20 h-[14px] bg-gray-200 rounded-full"></div>
                </div>
             </div>
             <div className="absolute bottom-[10%] left-[-20px] bg-[#d2e823] p-6 rounded-[24px] shadow-2xl flex flex-col transform -rotate-12 z-30 hover:-translate-y-2 transition-transform duration-300">
                <span className="font-black text-4xl text-[#1a3622] leading-none mb-2">12k+</span>
                <span className="font-bold text-[#1a3622]/80 uppercase tracking-tight text-sm">Followers</span>
             </div>
           </div>
        </div>
      </section>

      {/* SECTION 4: Dark Blue - Connect with audiences */}
      <section className="bg-[#0e178a] text-white py-[160px] px-4 md:px-12 flex flex-col justify-center min-h-[90vh] overflow-hidden">
        <div className="max-w-[1240px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div className="max-w-2xl px-4 lg:px-0 z-10">
             <h2 className="text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[1] font-[900] tracking-[-0.04em] mb-8 text-white">
               Control how you connect with your audiences
             </h2>
             <p className="text-[1.1rem] sm:text-[1.2rem] font-medium text-white mb-10 max-w-lg leading-relaxed">
               Build and reach your community with Ai Appsec lab. Integrate with MailChimp, Google Sheets or Community.com to generate leads & collect Email or SMS subscribers.
             </p>
             <Link to="/register" className="inline-flex items-center justify-center bg-[#d2e823] hover:bg-[#c6d721] text-[#1a3622] h-[64px] px-10 rounded-full text-[17px] font-bold transition-all shadow-sm tracking-tight w-max">
               Get your free Ai Appsec lab
             </Link>
           </div>
           
           <div className="relative w-full h-[600px] hidden lg:block perspective-1000">
             {/* Phone Mockup */}
             <div className="absolute right-[15%] top-10 w-[240px] h-[500px] bg-gradient-to-b from-gray-900 to-indigo-900 rounded-[40px] border-8 border-gray-900 shadow-2xl transform rotate-12 z-10 flex flex-col items-center pt-8">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-400 mb-2">
                   <img src="https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?q=80&w=150&auto=format&fit=crop" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-white text-[12px] font-bold">Super Wintendo</h4>
                <p className="text-indigo-300 text-[9px] mb-6">Streaming every Tuesday</p>
                <div className="w-[85%] h-10 bg-white/10 rounded-xl mb-3"></div>
                <div className="w-[85%] h-10 bg-white/10 rounded-xl mb-3"></div>
             </div>
             {/* Floating Mailchimp UI */}
             <div className="absolute left-[10%] top-[25%] bg-[#f4d7f4] p-5 rounded-[20px] shadow-2xl transform -rotate-6 z-20 hover:-translate-y-2 transition-transform cursor-pointer w-[180px] flex flex-col items-center">
                 <div className="w-8 h-8 mb-2 border-2 border-indigo-900 rounded flex justify-center items-center">
                    <svg className="w-4 h-4 text-indigo-900" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                 </div>
                 <h4 className="text-[#0e178a] text-[24px] font-bold leading-none mb-1 text-center">2,638</h4>
                 <p className="text-[#0e178a] text-[10px] font-semibold text-center">Email subscribers</p>
             </div>
             {/* Floating Text Form */}
             <div className="absolute right-[0%] bottom-[0%] bg-[#f3f3f1] p-5 pt-6 rounded-t-[32px] rounded-br-[32px] shadow-2xl transform 5 z-30 w-[220px] h-[340px] flex flex-col">
                 <p className="text-center text-gray-900 font-bold text-[12px] mb-4">Text me</p>
                 <div className="flex gap-2 mb-3">
                    <div className="bg-white rounded-lg w-1/3 h-10 flex items-center justify-center text-[11px] font-bold text-gray-400 shadow-sm">+03</div>
                    <div className="bg-white rounded-lg w-2/3 h-10 flex items-center px-3 text-[11px] font-bold text-gray-400 shadow-sm">Mobile*</div>
                 </div>
                 <div className="bg-white rounded-lg w-full flex-1 mb-4 flex pt-3 px-3 text-[11px] font-bold text-gray-400 shadow-sm">Message*</div>
                 <div className="bg-[#00c6d2] text-white w-full h-11 rounded-full flex items-center justify-center font-bold text-[12px] shadow-sm cursor-pointer hover:bg-[#00b2bd] transition-colors">Send message</div>
             </div>
             {/* Monkey Circle Badge */}
             <div className="absolute right-[35%] top-[55%] bg-[#ffe01b] w-14 h-14 rounded-full border-[3px] border-white shadow-xl z-30 flex items-center justify-center transform rotate-12">
                 <span className="font-bold text-2xl text-black leading-none -mt-1">🐵</span>
             </div>
           </div>
        </div>
      </section>

      {/* SECTION 5: Light Gray - Build a fan base */}
      <section className="bg-[#f3f3f1] text-[#111827] py-[160px] px-4 md:px-12 flex flex-col justify-center min-h-[90vh] overflow-hidden">
        <div className="max-w-[1240px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div className="relative w-full h-[500px] hidden lg:flex justify-center items-center perspective-1000 pl-10">
               {/* Cascading Cards */}
               <div className="w-[280px] h-[300px] bg-[#d92298] rounded-[32px] absolute left-32 top-10 transform shadow-xl p-5 flex justify-end">
                   <div className="w-8 h-8 rounded border-2 border-white flex justify-center items-center text-white font-bold text-xl leading-none">IG</div>
               </div>
               <div className="w-[280px] h-[300px] bg-[#9146ff] rounded-[32px] absolute left-24 top-16 transform shadow-xl p-5 flex justify-end">
                   <div className="w-8 h-8 rounded border-2 border-white flex justify-center items-center text-white font-bold text-xl leading-none">Tw</div>
               </div>
               <div className="w-[280px] h-[300px] bg-[#ff0000] rounded-[32px] absolute left-16 top-24 transform shadow-xl p-5 flex justify-end">
                   <div className="w-8 h-8 rounded border-2 border-white flex justify-center items-center text-white font-bold text-xl leading-none">YT</div>
               </div>
               <div className="w-[280px] h-[300px] bg-[#1da1f2] rounded-[32px] absolute left-8 top-32 transform shadow-xl p-5 flex justify-end">
                   <div className="w-8 h-8 rounded border-2 border-white flex justify-center items-center text-white font-bold text-xl leading-none">X</div>
               </div>
               <div className="w-[280px] h-[300px] bg-[#2a5bd7] rounded-[32px] absolute left-0 top-40 transform shadow-[0_20px_40px_rgba(0,0,0,0.2)] p-6 z-10 flex flex-col pt-12">
                   <div className="flex justify-between items-start w-full">
                      <div className="flex gap-4 items-center">
                         <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-md">
                           <img src="https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?q=80&w=150&auto=format&fit=crop" className="w-full h-full object-cover" />
                         </div>
                         <div className="flex flex-col gap-2">
                            <div className="w-16 h-2 bg-blue-300 rounded-full"></div>
                            <div className="w-10 h-2 bg-blue-400 rounded-full"></div>
                         </div>
                      </div>
                      <div className="w-8 h-8 rounded bg-blue-600 border border-white flex items-center justify-center text-white font-bold">f</div>
                   </div>
                   <div className="absolute -left-8 top-44 bg-white px-5 py-4 rounded-full shadow-2xl flex items-center gap-3">
                       <span className="text-[20px] font-black leading-none">*</span>
                       <span className="font-bold text-gray-900 text-[15px]">/superwintendo</span>
                   </div>
               </div>
           </div>
           
           <div className="max-w-xl pr-0 lg:pr-10 z-20">
             <h2 className="text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[1] font-black tracking-[-0.04em] mb-8 text-[#111827]">
               Build a fan base that follows you everywhere
             </h2>
             <p className="text-[1.1rem] sm:text-[1.2rem] font-medium text-gray-700 mb-10 max-w-lg leading-relaxed">
               Finding your true fans is the key to meaningful monetization. Connect people to everything you are and give them one powerful place to find, follow & engage with you.
             </p>
             <Link to="/register" className="inline-flex items-center justify-center bg-[#e9c0e9] hover:bg-[#d8b0d8] text-[#502224] h-[64px] px-10 rounded-full text-[17px] font-bold transition-all shadow-sm tracking-tight w-max">
               Get your free Ai Appsec lab
             </Link>
           </div>
        </div>
      </section>

      {/* SECTION 6: Dark Red - Connect Tools */}
      <section className="bg-[#780016] text-[#e9c0e9] py-[160px] px-4 md:px-12 flex flex-col justify-center min-h-[90vh] overflow-hidden">
        <div className="max-w-[1240px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div className="max-w-2xl px-4 lg:px-0 z-10">
             <h2 className="text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[1] font-black tracking-[-0.04em] mb-8 text-[#e9c0e9]">
               Connect tools you already use with Link Apps
             </h2>
             <p className="text-[1.1rem] sm:text-[1.2rem] font-medium text-pink-100 mb-10 max-w-lg leading-relaxed">
               Connect the best experiences on the internet to your Ai Appsec lab by choosing from Typeform, Cameo, Twitter and over 30+ other Link Apps. Each will help you get more engagement with your content, make and collect more money and grow your following faster.
             </p>
             <Link to="/marketplace" className="inline-flex items-center justify-center bg-[#e9c0e9] hover:bg-[#d8b0d8] text-[#502224] h-[64px] px-10 rounded-full text-[17px] font-bold transition-all shadow-sm tracking-tight w-max">
               Explore Marketplace
             </Link>
           </div>
           
           <div className="relative w-full h-[600px] hidden lg:block perspective-1000">
               {/* Bandsintown Phone */}
               <div className="w-[180px] h-[380px] bg-gradient-to-tr from-purple-800 to-pink-600 rounded-[32px] absolute right-40 top-10 transform -rotate-12 shadow-2xl p-2 z-10 hover:-translate-y-4 hover:z-40 transition-all duration-300 cursor-pointer overflow-hidden border-4 border-transparent">
                  <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-[24px] pt-10 flex flex-col items-center">
                     <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 mb-2">
                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150" className="w-full h-full object-cover" />
                     </div>
                     <h5 className="text-white text-[11px] font-bold mb-4">Ty Denize</h5>
                     <div className="w-[90%] bg-white rounded-xl p-2 shadow-md">
                        <p className="font-bold text-[9px] text-gray-900 border-b pb-1 mb-1">On tour now!</p>
                        <div className="flex justify-between items-center bg-gray-50 p-1 rounded">
                           <span className="font-bold text-[8px] text-gray-600">JUL 26</span>
                           <span className="font-bold text-[8px] text-gray-800">Gasparilla Music...</span>
                           <span className="text-[8px]">↗</span>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Cameo Phone */}
               <div className="w-[190px] h-[400px] bg-[#fbbf24] rounded-[36px] absolute right-16 top-24 transform -rotate-6 shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-2 z-20 hover:-translate-y-4 hover:z-40 transition-all duration-300 cursor-pointer overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-b from-white/90 to-white/40 rounded-[26px] pt-8 flex flex-col items-center">
                     <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow mb-2">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150" className="w-full h-full object-cover" />
                     </div>
                     <h5 className="text-gray-900 text-[12px] font-black mb-4">Zola Johnson</h5>
                     <div className="w-[90%] bg-white rounded-xl p-2 shadow-lg flex flex-col">
                        <p className="font-black text-[10px] text-gray-900 border-b border-gray-100 pb-1 mb-2 text-center">My Cameo Profile</p>
                        <div className="w-full h-24 bg-gray-200 rounded-lg overflow-hidden relative">
                           <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150" className="w-full h-full object-cover opacity-80" />
                           <div className="absolute inset-0 flex items-center justify-center"><div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center bg-black/50 text-[8px] text-white">▶</div></div>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Patreon Phone */}
               <div className="w-[200px] h-[420px] bg-[#b1a098] rounded-[36px] absolute right-[-20px] top-36 transform rotate-6 shadow-2xl p-2 z-30 hover:-translate-y-4 hover:rotate-3 transition-all duration-300 cursor-pointer overflow-hidden">
                  <div className="w-full h-full bg-[#fcf9f2] rounded-[26px] pt-6 flex flex-col items-center shadow-inner">
                     <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-200 shadow mb-2 relative">
                        <img src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=150" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-black text-[9px]">SWANK</div>
                     </div>
                     <h5 className="text-[#3b2d22] text-[13px] font-black tracking-tight mb-4">Swank Podcast</h5>
                     <div className="w-[90%] bg-white rounded-2xl p-3 shadow border border-gray-100 flex flex-col items-center">
                        <p className="font-bold text-[10px] text-gray-900 border-b pb-2 mb-2 w-full text-center">Support The Podcast</p>
                        <div className="w-full flex gap-2">
                           <div className="w-1/2 h-20 bg-amber-700/80 rounded-lg"></div>
                           <div className="w-1/2 h-20 bg-rose-800/80 rounded-lg"></div>
                        </div>
                        <div className="w-full bg-[#111827] text-white text-[9px] font-bold py-2 mt-3 rounded-md text-center">Become A Patron</div>
                     </div>
                  </div>
               </div>
           </div>
        </div>
      </section>

      {/* SECTION 7: Light Gray - Infinite Ways Built-In Grid */}
      <section className="bg-[#f3f3f1] text-[#111827] py-[160px] px-6 lg:px-12 flex flex-col items-center min-h-[100vh]">
         <h2 className="text-[3rem] sm:text-[4.5rem] leading-[1] font-black tracking-[-0.04em] mb-16 text-[#111827] text-center max-w-4xl">
            Infinite ways to share your content
         </h2>
         
         <div className="max-w-[1240px] w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Social Icons */}
            <div className="bg-[#e9c0e9] rounded-[32px] p-8 md:p-12 flex flex-col h-[400px] hover:scale-[1.02] transition-transform duration-300">
               <div className="flex-1 flex items-center justify-center mb-6">
                  <div className="grid grid-cols-3 gap-3">
                     <div className="w-12 h-12 bg-[#819460] rounded-full text-white flex justify-center items-center">t</div>
                     <div className="w-12 h-12 bg-[#819460] rounded-full text-white flex justify-center items-center">tk</div>
                     <div className="w-12 h-12 bg-[#819460] rounded-full text-white flex justify-center items-center">S</div>
                     <div className="w-12 h-12 bg-[#819460] rounded-full text-white flex justify-center items-center">f</div>
                     <div className="w-12 h-12 bg-[#819460] rounded-full text-white flex justify-center items-center">i</div>
                     <div className="w-12 h-12 bg-[#819460] rounded-full text-white flex justify-center items-center">in</div>
                  </div>
               </div>
               <h3 className="text-[#3b203b] text-[24px] font-bold mb-3">Social Icons</h3>
               <p className="text-[#593959] text-[15px] font-medium leading-relaxed">Make your socials simple to discover and utilize analytics to learn which is driving the most activity and engagement.</p>
            </div>
            
            {/* Card 2: Video */}
            <div className="bg-[#d2e823] rounded-[32px] p-8 md:p-12 flex flex-col h-[400px] hover:scale-[1.02] transition-transform duration-300">
               <div className="flex-1 flex items-center justify-center mb-6">
                  <div className="w-[80%] h-32 rounded-[16px] overflow-hidden relative shadow-lg">
                     <img src="https://images.unsplash.com/photo-1542361002-23c316f73775?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover" />
                     <div className="absolute left-3 bottom-3 w-6 h-6 bg-white rounded flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-900 rounded-sm"></div>
                     </div>
                     <div className="absolute left-12 bottom-5 w-24 h-1 bg-white/50 rounded-full"><div className="w-1/2 h-full bg-white rounded-full"></div></div>
                  </div>
               </div>
               <h3 className="text-[#1a3622] text-[24px] font-bold mb-3">Video</h3>
               <p className="text-[#254f30] text-[15px] font-medium leading-relaxed">Engage your visitors with video. Connect Twitch, TikTok, Facebook & YouTube and control how they display on your Ai Appsec lab.</p>
            </div>
            
            {/* Card 3: Email & SMS */}
            <div className="bg-[#780016] rounded-[32px] p-8 md:p-12 flex flex-col h-[400px] hover:scale-[1.02] transition-transform duration-300">
               <div className="flex-1 flex items-center justify-center mb-6">
                  <div className="w-[70%] bg-white rounded-[16px] p-4 shadow-xl relative">
                     <div className="w-10 h-10 rounded-full mx-auto mb-2 overflow-hidden border border-gray-200">
                       <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150" />
                     </div>
                     <p className="text-[9px] text-center font-bold mb-3 text-gray-900">Subscribe for updates</p>
                     <div className="w-full h-6 bg-gray-100 rounded text-[7px] text-gray-400 font-bold px-2 flex items-center">Email address</div>
                     <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#cc00ff] rounded-full border-2 border-[#780016] flex items-center justify-center text-white text-[10px]">🔔</div>
                  </div>
               </div>
               <h3 className="text-[#f7e6f7] text-[24px] font-bold mb-3">Email & SMS Integrations</h3>
               <p className="text-[#f7e6f7]/80 text-[15px] font-medium leading-relaxed">Build an audience you can reach anywhere, any time by collecting email and SMS details on your Ai Appsec lab.</p>
            </div>

            {/* Card 4: Contact Form */}
            <div className="bg-[#0e178a] rounded-[32px] p-8 md:p-12 flex flex-col h-[400px] hover:scale-[1.02] transition-transform duration-300">
               <div className="flex-1 flex items-center justify-center mb-6">
                  <div className="w-[60%] bg-white rounded-[16px] p-4 pt-5 shadow-2xl">
                     <p className="text-[9px] text-center font-bold mb-3 text-gray-900 border-b pb-2">Get in touch</p>
                     <div className="w-full h-5 bg-gray-100 rounded mb-2 text-[7px] text-gray-400 font-bold px-2 flex items-center">Name</div>
                     <div className="w-full h-5 bg-gray-100 rounded mb-2 text-[7px] text-gray-400 font-bold px-2 flex items-center">Email</div>
                     <div className="w-full h-10 bg-gray-100 rounded mb-3 text-[7px] text-gray-400 font-bold px-2 pt-1 border">Message</div>
                     <div className="w-full h-5 bg-gray-900 rounded-full text-white text-[8px] font-bold flex items-center justify-center">Submit</div>
                  </div>
               </div>
               <h3 className="text-white text-[24px] font-bold mb-3">Contact Form Link App</h3>
               <p className="text-indigo-200 text-[15px] font-medium leading-relaxed mb-6">Create a contact form to collect visitor names, emails, mobile numbers, countries, and let them leave you messages.</p>
               <div className="flex gap-2">
                 {['Free', 'Premium', 'Pro', 'Starter'].map(badge => <span key={badge} className="px-3 py-1 text-[11px] font-bold text-white border border-indigo-500 rounded-full">{badge}</span>)}
               </div>
            </div>

            {/* Card 5: Google Sheets */}
            <div className="bg-[#24521f] rounded-[32px] p-8 md:p-12 flex flex-col h-[400px] hover:scale-[1.02] transition-transform duration-300">
               <div className="flex-1 flex items-center justify-center mb-6">
                  <div className="w-24 h-28 bg-[#d2e823] rounded-[16px] shadow-2xl flex flex-col items-center justify-center relative transform -rotate-6">
                     <span className="text-[20px] mb-1">💬</span>
                     <h4 className="text-[#1a3622] font-black text-[20px] leading-tight">2,345</h4>
                     <p className="text-[#1a3622] text-[8px] font-bold text-center">SMS Subscribers</p>
                     <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#0f9d58] rounded-full border-2 border-[#24521f] flex items-center justify-center text-white text-md">📊</div>
                  </div>
               </div>
               <h3 className="text-[#d2e823] text-[24px] font-bold mb-3">Google Sheets</h3>
               <p className="text-[#819460] text-[15px] font-medium leading-relaxed mb-6">Have the email and SMS details your visitors enter via your Ai Appsec lab feed directly into Google Sheets.</p>
               <div className="flex gap-2 mt-auto">
                 {['Premium', 'Pro'].map(badge => <span key={badge} className="px-3 py-1 text-[11px] font-bold text-gray-200 border border-green-600 rounded-full">{badge}</span>)}
               </div>
            </div>

            {/* Card 6: MailChimp */}
            <div className="bg-[#cc9b33] rounded-[32px] p-8 md:p-12 flex flex-col h-[400px] hover:scale-[1.02] transition-transform duration-300">
               <div className="flex-1 flex items-center justify-center mb-6">
                  <div className="w-24 h-28 bg-[#222222] rounded-[16px] shadow-2xl flex flex-col items-center justify-center relative transform rotate-6">
                     <span className="text-white text-[18px] mb-1">✉</span>
                     <h4 className="text-white font-black text-[20px] leading-tight">5,678</h4>
                     <p className="text-white text-[8px] font-bold text-center">Email Subscribers</p>
                     <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#ffe01b] rounded-full border-2 border-[#cc9b33] flex items-center justify-center text-black text-lg">🐵</div>
                  </div>
               </div>
               <h3 className="text-[#3a2908] text-[24px] font-bold mb-3">MailChimp Connection</h3>
               <p className="text-[#5c4412] text-[15px] font-medium leading-relaxed mb-6">Capture email signups directly from your Ai Appsec lab, straight into your Mailchimp account.</p>
               <div className="flex gap-2 mt-auto">
                 {['Premium', 'Pro'].map(badge => <span key={badge} className="px-3 py-1 text-[11px] font-bold text-[#5c4412] border border-[#a67a22] rounded-full">{badge}</span>)}
               </div>
            </div>

         </div>
      </section>

      {/* SECTION 8: Light Gray - Paid Plan Features */}
      <section className="bg-[#f3f3f1] text-[#111827] py-[160px] px-6 lg:px-12 flex flex-col items-center">
         <h2 className="text-[3rem] sm:text-[4.5rem] leading-[1] font-black tracking-[-0.04em] mb-16 text-[#111827] text-center max-w-4xl">
            Do more, get more on a paid plan.
         </h2>
         
         <div className="max-w-[1240px] w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm hover:shadow-xl transition-shadow duration-300">
               <div className="w-16 h-16 bg-[#e9c0e9] rounded-full flex items-center justify-center mb-10 shadow-inner border border-[#d8b0d8]">
                  <span className="text-[#502224] text-2xl font-black opacity-80">💬</span>
               </div>
               <h3 className="text-[26px] font-black text-[#111827] mb-6 leading-[1.15] tracking-tight">Save time and automate your Ai Appsec lab</h3>
               <p className="text-gray-700 text-[16px] font-medium leading-[1.6]">
                  Schedule links to go live at the right time and autopopulate Ai Appsec lab with your latest Tweet, YouTube or RSS feed.
               </p>
            </div>
            
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm hover:shadow-xl transition-shadow duration-300">
               <div className="w-16 h-16 bg-[#e9c0e9] rounded-full flex items-center justify-center mb-10 shadow-inner border border-[#d8b0d8]">
                  <span className="text-[#502224] text-2xl font-black opacity-80">👥</span>
               </div>
               <h3 className="text-[26px] font-black text-[#111827] mb-6 leading-[1.15] tracking-tight">Drive engagement and decide how links display</h3>
               <p className="text-gray-700 text-[16px] font-medium leading-[1.6]">
                  Highlight your most important content with priority animations & styling or temporarily redirect visitors to one link.
               </p>
            </div>
            
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm hover:shadow-xl transition-shadow duration-300">
               <div className="w-16 h-16 bg-[#e9c0e9] rounded-full flex items-center justify-center mb-10 shadow-inner border border-[#d8b0d8]">
                  <span className="text-[#502224] text-2xl font-black opacity-80">📊</span>
               </div>
               <h3 className="text-[26px] font-black text-[#111827] mb-6 leading-[1.15] tracking-tight">Get meaningful insights to improve your content</h3>
               <p className="text-gray-700 text-[16px] font-medium leading-[1.6]">
                  See what's driving the most engagement in real time and understand your audience better with powerful insights & analytics.
               </p>
            </div>
         </div>
      </section>

      {/* SECTION 9: Compare / Jumpstart Wrapper */}
      <section className="w-full flex flex-col">
         {/* Top Half: Compare Plans (Light Pink) */}
         <div className="bg-[#e9c0e9] py-24 mb-[-80px] lg:mb-[-120px] rounded-b-[100px] lg:rounded-b-[200px] z-10 flex flex-col items-center relative shadow-sm border-b-4 border-black/5">
            <h2 className="text-[#502224] text-[3rem] sm:text-[4.5rem] leading-[1] font-black tracking-[-0.04em] z-20">
               Compare paid plans
            </h2>
         </div>
         
         {/* Bottom Half: Jumpstart Footer (Dark Purple) */}
         <div className="bg-[#481e5b] pt-[140px] lg:pt-[240px] pb-32 px-4 md:px-12 flex flex-col items-center text-center relative overflow-hidden">
             {/* Silhouette Graphic */}
             <div className="absolute left-[-5%] lg:left-[5%] bottom-0 w-64 lg:w-96 h-full opacity-30 lg:opacity-100 flex items-end">
                <svg viewBox="0 0 200 300" className="w-[100%] h-auto text-[#00c6d2] fill-current">
                   <path d="M50,300 L50,280 C60,280 80,270 90,240 C100,210 100,180 90,150 C80,120 70,80 80,50 C90,20 120,10 140,20 C160,30 180,60 170,100 C160,140 180,170 190,200 C200,230 180,260 150,290 C140,300 130,300 130,300 Z" />
                   <path d="M30,300 L50,280 C40,250 50,230 60,200 C70,170 50,140 40,110 Z" />
                </svg>
             </div>
             
             <div className="max-w-[1240px] w-full z-10 flex flex-col items-center">
                 <h2 className="text-[#e9c0e9] text-[3rem] sm:text-[4.5rem] lg:text-[5rem] leading-[1] font-black tracking-[-0.04em] mb-12 max-w-4xl px-4 drop-shadow-md">
                   Jumpstart your corner of the internet today
                 </h2>
                 <form onSubmit={handleClaim} className="flex flex-col sm:flex-row gap-4 max-w-2xl w-full relative z-20 shadow-2xl">
                   <div className="flex-1 bg-white rounded-xl flex items-center px-5 h-[64px] border border-white focus-within:ring-[3px] focus-within:ring-[#d2e823] transition-shadow">
                     <span className="text-gray-500 font-semibold text-[17px] whitespace-nowrap">linktr.ee/</span>
                     <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="yourname" 
                        className="w-full bg-transparent border-none outline-none text-[#111827] font-semibold text-[17px] placeholder-gray-400 h-full pl-1" 
                     />
                   </div>
                   <button type="submit" className="bg-[#d2e823] hover:bg-[#c6d721] text-[#1a3622] h-[64px] px-8 rounded-full text-[17px] font-bold transition-all whitespace-nowrap tracking-tight">
                     Claim your Ai Appsec lab
                   </button>
                 </form>
             </div>
         </div>
      </section>

    </div>
  );
};

export default LandingPage;
