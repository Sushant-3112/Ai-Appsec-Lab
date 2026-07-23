import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi there! 👋 I'm the SmartLink AI Assistant. I know everything about this platform. How can I help you today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const generateAIResponse = (query) => {
    const q = query.toLowerCase();
    
    // Simple simulated knowledge base for the website
    if (q.includes('add a link') || q.includes('create link')) {
      return "To add a new link, head over to your Dashboard and click on the 'Links' tab. Fill in the Title and URL fields, choose an icon type, and click 'Add Link'. It will instantly appear on your live profile!";
    }
    if (q.includes('analytics') || q.includes('stats') || q.includes('visitors')) {
      return "Our Advanced AI-Powered Analytics engine tracks your performance in real time! Go to the 'Analytics' tab on your dashboard to view traffic forecasts, referrers, device breakdowns, and smart ML recommendations.";
    }
    if (q.includes('profile') || q.includes('photo') || q.includes('bio') || q.includes('theme')) {
      return "You can customize your public profile in the 'Profile' tab of your dashboard. There you can upload an avatar, update your bio, set your location, and select a gorgeous theme from our template library.";
    }
    if (q.includes('qr code') || q.includes('download')) {
      return "We automatically generate a custom QR code for your profile! Just navigate to the 'QR Code' tab on your dashboard. You can download it as a high-quality PNG to print on flyers or business cards.";
    }
    if (q.includes('monetize') || q.includes('money') || q.includes('stripe')) {
      return "SmartLink offers a built-in Monetization Hub. You can connect your Stripe or PayPal account to sell digital products, collect tips, or gate premium content directly from your profile.";
    }
    if (q.includes('animation') || q.includes('bounce') || q.includes('pulse')) {
      return "Yes! You can add Pro Animations to your links! When adding or editing a link in your Dashboard, select an animation like Bounce, Pulse, or Spin from the Animation dropdown. This helps draw visitors' attention to your most important links.";
    }
    if (q.includes('price') || q.includes('cost') || q.includes('free')) {
      return "SmartLink is currently free to use! You get access to unlimited links, beautiful themes, and advanced ML predictive analytics at no cost.";
    }
    if (q.includes('hello') || q.includes('hi ') || q.includes('hey')) {
      return "Hello! How can I assist you with SmartLink today? You can ask me about adding links, checking analytics, or customizing your profile.";
    }

    return "That's a great question! While I'm still learning, I recommend checking out your Dashboard to explore all the features. Our platform is designed to be very intuitive—just look for the corresponding tab (Links, Profile, Analytics, etc.) for what you need!";
  };

  const handleSendMessage = (e, textOverride = null) => {
    if (e) e.preventDefault();
    const textToSubmit = textOverride || inputValue;
    if (!textToSubmit.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSubmit.trim()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const botResponseText = generateAIResponse(newUserMessage.text);
      const newBotMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponseText
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const clearHistory = () => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: "Chat history cleared! How can I help you today?"
      }
    ]);
  }

  const suggestedQuestions = [
    "How do I add a link?",
    "Tell me about animations",
    "Where is my QR code?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden flex flex-col transition-all duration-300 animate-in slide-in-from-bottom-5 zoom-in-95">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white shadow-md z-10 relative">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm shadow-inner border border-white/20">
                <Bot size={22} className="text-white drop-shadow-sm" />
              </div>
              <div>
                <h3 className="font-bold text-[15px] tracking-tight flex items-center gap-1">SmartLink AI <Sparkles size={12} className="text-yellow-300"/></h3>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
                  <span className="text-[11px] text-indigo-100 font-medium tracking-wide">Online & ready</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearHistory}
                className="text-white/70 hover:text-white hover:bg-white/10 px-2 py-1.5 rounded-lg transition-colors text-[10px] font-bold tracking-wider uppercase border border-white/10"
                title="Clear Chat"
              >
                Clear
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-4 space-y-5 bg-[#f8f9fa] scrollbar-hide flex flex-col relative">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
              >
                <div className={`flex items-end space-x-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border border-indigo-100'}`}>
                    {msg.sender === 'user' ? <User size={14} /> : <Bot size={16} />}
                  </div>
                  <div className={`px-4 py-3 text-[14px] shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)]'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-in fade-in">
                <div className="flex items-end space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white border border-indigo-100 flex items-center justify-center shadow-sm">
                    <Bot size={16} />
                  </div>
                  <div className="px-4 py-4 bg-white border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>

          {/* Quick Suggestions Area */}
          {!isTyping && messages.length < 5 && (
            <div className="px-4 py-2 bg-[#f8f9fa] border-t border-gray-100 flex gap-2 overflow-x-auto hide-scrollbar">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(null, q)}
                  className="whitespace-nowrap text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors flex-shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={(e) => handleSendMessage(e)} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 relative z-10">
            <input 
              type="text" 
              placeholder="Ask anything..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 text-[14px] rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium placeholder:font-normal"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md flex-shrink-0 group"
            >
              <Send size={18} className="ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-[60px] h-[60px] bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-[0_10px_25px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_35px_rgba(79,70,229,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center text-white group border-2 border-white/20 relative"
        aria-label="Open AI Assistant"
      >
        <div className={`absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-10 transition-opacity`}></div>
        {isOpen ? (
          <X size={26} className="transform group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <div className="relative flex items-center justify-center">
             <Bot size={28} className="drop-shadow-md" />
             <Sparkles size={14} className="absolute -top-1 -right-2 text-yellow-300 animate-pulse" />
          </div>
        )}
        
        {/* Unread indicator dot */}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-bounce shadow-sm"></span>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
