import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

const plans = [
  {
    name: "Free",
    description: "For your basic link in bio.",
    priceMonthly: 0,
    priceAnnually: 0,
    highlight: false,
    buttonText: "Join for free",
    buttonClass: "bg-white border-2 border-gray-200 text-gray-900 hover:bg-gray-50",
    features: [
      "Unlimited links",
      "Custom Ai Appsec lab URL",
      "Standard themes",
      "Basic analytics (28 days)",
      { text: "Advanced Customization", available: false },
      { text: "Priority Support", available: false }
    ]
  },
  {
    name: "Starter",
    description: "For growing creators.",
    priceMonthly: 499,
    priceAnnually: 399,
    highlight: false,
    buttonText: "Upgrade to Starter",
    buttonClass: "bg-[#e9c0e9] hover:bg-[#d6afd6] text-[#502224] transition-colors",
    features: [
      { text: "Everything in Free, plus:", isBold: true },
      "Custom themes and buttons",
      "Basic integrations (Mailchimp)",
      "Analytics history (90 days)",
      "Spotlight and scheduling",
      { text: "Priority Support", available: false }
    ]
  },
  {
    name: "Pro",
    description: "For businesses and brands.",
    priceMonthly: 999,
    priceAnnually: 799,
    highlight: true,
    badgeText: "Most popular",
    badgeClass: "bg-[#2a5bd7] text-white",
    buttonText: "Upgrade to Pro",
    buttonClass: "bg-[#2a5bd7] hover:bg-[#1f47b2] text-white transition-colors",
    features: [
      { text: "Everything in Starter, plus:", isBold: true },
      "Advanced customization",
      "Full analytics access (1 year)",
      "Priority customer support",
      "Hide Ai Appsec lab logo",
      "Store integrations (Shopify)"
    ]
  },
  {
    name: "Premium",
    description: "For scaling businesses.",
    priceMonthly: 2499,
    priceAnnually: 1999,
    highlight: false,
    buttonText: "Upgrade to Premium",
    buttonClass: "bg-[#d2e823] hover:bg-[#b8cc1c] text-[#1a3622] transition-colors font-bold",
    features: [
      { text: "Everything in Pro, plus:", isBold: true },
      "Custom domain mapping",
      "Dedicated success manager",
      "1-on-1 onboarding session",
      "Multiple administrators",
      "Export your data easily"
    ]
  }
];

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-[#f3f3f1] font-sans pb-32">
       
       {/* Hero Section */}
       <div className="w-full bg-slate-900 pt-44 pb-32 px-6 lg:px-12 flex flex-col items-center text-center rounded-b-[40px] md:rounded-b-[80px]">
          <h1 className="text-white text-[3.5rem] md:text-[5rem] lg:text-[6rem] font-[900] tracking-[-0.04em] leading-[0.95] mb-8 max-w-4xl">
            Simple, transparent <span className="text-[#d2e823]">pricing</span>
          </h1>
          <p className="text-gray-300 text-[1.15rem] md:text-[1.3rem] font-medium max-w-2xl mb-12 leading-relaxed">
            Always know what you'll pay. Start for free, upgrade when you need more power to grow your audience and monetize.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center gap-4 bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/10">
             <button 
               onClick={() => setIsAnnual(false)}
               className={`px-8 py-3 rounded-full font-bold text-[15px] transition-all ${
                 !isAnnual ? 'bg-white text-slate-900 shadow-md scale-105' : 'text-white hover:bg-white/10'
               }`}
             >
               Monthly
             </button>
             <button 
               onClick={() => setIsAnnual(true)}
               className={`px-8 py-3 rounded-full font-bold text-[15px] transition-all flex items-center gap-2 ${
                 isAnnual ? 'bg-[#d2e823] text-slate-900 shadow-md scale-105' : 'text-white hover:bg-white/10'
               }`}
             >
               Annual
               <span className="bg-slate-900 text-[#d2e823] text-[11px] font-[900] px-2 py-0.5 rounded-full uppercase tracking-wide">Save 20%</span>
             </button>
          </div>
       </div>

       {/* Pricing Cards Layout */}
       <div className="max-w-[1300px] mx-auto px-4 lg:px-8 -mt-16 xl:-mt-20 relative z-10 w-full mb-24">
          <div className="flex flex-col xl:flex-row items-stretch justify-center gap-6">
             {plans.map(plan => (
               <div key={plan.name} className={`flex-1 relative bg-white rounded-[32px] p-8 lg:p-10 flex flex-col shadow-xl transition-transform hover:-translate-y-2 duration-300 ${plan.highlight ? 'border-4 border-[#2a5bd7] scale-100 xl:scale-105 z-20 xl:-translate-y-4 shadow-[0_30px_60px_rgba(42,91,215,0.15)]' : 'border border-gray-100'}`}>
                 
                 {plan.highlight && (
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <span className={`${plan.badgeClass} px-4 py-1.5 rounded-full text-[13px] font-bold tracking-tight shadow-md whitespace-nowrap`}>
                        {plan.badgeText}
                      </span>
                   </div>
                 )}

                 <h3 className="font-black text-gray-900 text-[28px] tracking-tight mb-2">{plan.name}</h3>
                 <p className="text-gray-500 font-medium text-[15px] mb-8 h-10">{plan.description}</p>
                 
                 <div className="mb-8 flex items-baseline gap-1">
                   <span className="text-gray-900 font-[900] text-[48px] leading-none tracking-tight">
                     ₹{isAnnual ? plan.priceAnnually : plan.priceMonthly}
                   </span>
                   {plan.priceMonthly > 0 && <span className="text-gray-500 font-semibold text-[15px]">/mo</span>}
                 </div>

                 <p className="text-gray-400 font-medium text-[13px] mb-6 h-5">
                   {isAnnual && plan.priceAnnually > 0 ? `Billed ₹${(plan.priceAnnually * 12).toLocaleString()} annually` : 
                    (!isAnnual && plan.priceMonthly > 0 ? `Billed ₹${plan.priceMonthly.toLocaleString()} monthly` : '')}
                 </p>

                 <button className={`w-full py-4 rounded-full font-bold text-[16px] mb-10 transition-transform hover:scale-[1.02] shadow-sm ${plan.buttonClass}`}>
                   {plan.buttonText}
                 </button>

                 <div className="flex-1">
                    <ul className="space-y-4">
                      {plan.features.map((feature, i) => {
                         const isObject = typeof feature === 'object';
                         const text = isObject ? feature.text : feature;
                         const isBold = isObject && feature.isBold;
                         const available = !isObject || feature.available !== false;
                         
                         return (
                           <li key={i} className="flex items-start gap-3">
                              {available ? (
                                <div className={`mt-0.5 rounded-full p-0.5 ${plan.highlight ? 'bg-[#2a5bd7]/10' : 'bg-green-100'}`}>
                                  <Check size={16} className={plan.highlight ? 'text-[#2a5bd7]' : 'text-green-600'} strokeWidth={3} />
                                </div>
                              ) : (
                                <div className="mt-0.5 rounded-full p-0.5">
                                  <X size={16} className="text-gray-300" strokeWidth={3} />
                                </div>
                              )}
                              <span className={`text-[15px] leading-snug ${
                                available ? 'text-gray-700' : 'text-gray-400 line-through'
                              } ${isBold ? 'font-bold text-gray-900' : 'font-medium'}`}>
                                {text}
                              </span>
                           </li>
                         );
                      })}
                    </ul>
                 </div>

               </div>
             ))}
          </div>
       </div>

       {/* FAQ Section */}
       <div className="max-w-[800px] mx-auto px-6 lg:px-12 pb-24">
          <h2 className="text-gray-900 text-[2.5rem] font-black tracking-tight text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
             {[
               { q: "Can I use Ai Appsec lab for free?", a: "Yes! Our Free plan provides everything you need to build a beautiful link in bio, permanently." },
               { q: "What's the difference between Starter and Pro?", a: "Starter is great for customization and basic tracking. Pro unlocks VIP support, deep analytics, and removes our branding entirely." },
               { q: "Can I switch plans later?", a: "Absolutely. You can upgrade, downgrade, or cancel your subscription at any time right from your billing dashboard." },
               { q: "Do you offer discounts for non-profits?", a: "Yes we do! Please contact our highest priority support team to apply for a specialized non-profit discount program." }
             ].map((faq, i) => (
               <details key={i} className="group bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden cursor-pointer open:bg-gray-50 transition-colors">
                  <summary className="flex items-center justify-between p-6 font-bold text-[18px] text-gray-900 list-none">
                     {faq.q}
                     <span className="text-[#2a5bd7] group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                  </summary>
                  <p className="px-6 pb-6 text-[15px] font-medium text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                     {faq.a}
                  </p>
               </details>
             ))}
          </div>
       </div>

    </div>
  );
};

export default Pricing;
