import React from 'react';
import { Link } from 'react-router-dom';

const GenericPage = ({ title, subtitle, bgColor, textColor }) => {
  return (
    <div className={`min-h-screen pt-32 px-4 md:px-12 flex flex-col justify-center ${bgColor} ${textColor} font-sans`}>
      <div className="max-w-[1240px] mx-auto w-full text-center py-20">
        <h1 className="text-[4rem] sm:text-[5.5rem] lg:text-[7rem] leading-[0.85] font-black tracking-[-0.04em] mb-8">
          {title}
        </h1>
        <p className="text-[1.2rem] sm:text-[1.4rem] font-medium opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed tracking-tight">
          {subtitle}
        </p>
        <Link to="/register" className={`inline-flex items-center justify-center bg-white text-slate-900 h-[72px] px-12 rounded-full text-lg font-bold transition-all shadow-xl tracking-tight hover:scale-105`}>
          Get started for free
        </Link>
      </div>
    </div>
  );
};

export const Products = () => <GenericPage title="Ai Appsec lab Products" subtitle="Explore all the powerful tools we offer to help you monetize your audience." bgColor="bg-[#2a5bd7]" textColor="text-white" />;
export const Learn = () => <GenericPage title="Learn & Grow" subtitle="Read our blog, watch tutorials, and master the art of the perfect link in bio." bgColor="bg-[#1a3622]" textColor="text-[#d2e823]" />;
