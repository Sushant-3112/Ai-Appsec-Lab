import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MoreHorizontal, Share, CheckCircle, Mail, MapPin, Youtube, Instagram, Twitter, Linkedin, Github, Globe, Music, Lock, Send, Eye, Users, Phone, MessageSquare, DollarSign, ShoppingBag, Radio, FileText } from 'lucide-react';
import templatesData from '../data/templateData';

const PublicProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  // Advanced feature state
  const [passwordModal, setPasswordModal] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [leadModal, setLeadModal] = useState(null);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/profile/${username}`);
        setProfile(res.data);
      } catch (err) {
        setError('Profile not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handleLinkClick = async (link) => {
    // 1. Check for password protection
    if (link.has_password) {
      setPasswordModal(link);
      return;
    }

    // 2. Check for lead capture
    if (link.type === 'email_collect') {
      setLeadModal(link);
      return;
    }

    // 3. Track analytics and open
    executeLink(link);
  };

  const executeLink = async (link) => {
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isTablet = /Tablet|iPad/i.test(navigator.userAgent);
      const device = isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop';
      
      const browser = navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                      navigator.userAgent.includes('Firefox') ? 'Firefox' : 
                      navigator.userAgent.includes('Safari') ? 'Safari' : 'Other';
                      
      let os = 'Unknown';
      if (navigator.userAgent.indexOf('Win') !== -1) os = 'Windows';
      if (navigator.userAgent.indexOf('Mac') !== -1) os = 'MacOS';
      if (navigator.userAgent.indexOf('Linux') !== -1) os = 'Linux';
      if (navigator.userAgent.indexOf('Android') !== -1) os = 'Android';
      if (navigator.userAgent.indexOf('like Mac') !== -1) os = 'iOS';

      let vid = localStorage.getItem('visitor_id');
      if (!vid) {
        vid = 'vid_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('visitor_id', vid);
      }

      await axios.post('/api/analytics/track', {
        link_id: link.id,
        device,
        browser,
        os,
        referral_source: document.referrer || 'Direct',
        location: 'Unknown',
        session_duration: 5.5,
        engagement_score: 1.0,
        unique_visitor_id: vid
      });
      
      // Track view for social proof
      await axios.post(`/api/links/${link.id}/view`, { visitor_id: vid });
      
    } catch (e) {
      console.error(e);
    }
    
    if (link.url) {
      window.open(link.url, '_blank');
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const res = await axios.post(`/api/links/${passwordModal.id}/verify-password`, {
        password: passwordInput
      });
      if (res.data.valid) {
        const linkToOpen = passwordModal;
        setPasswordModal(null);
        setPasswordInput('');
        executeLink(linkToOpen);
      }
    } catch (err) {
      setPasswordError('Invalid password');
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadSubmitting(true);
    try {
      await axios.post(`/api/links/${leadModal.id}/leads`, {
        ...leadForm,
        source: 'Public Profile'
      });
      setLeadSuccess(true);
      setTimeout(() => {
        setLeadModal(null);
        setLeadSuccess(false);
        setLeadForm({ name: '', email: '', phone: '', message: '' });
      }, 2000);
    } catch (err) {
      console.error('Lead collection failed');
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowShare(false);
    }, 2000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-white text-xl font-semibold text-gray-900">User not found</div>;

  let parsedTheme = 'light';
  let contactEmail = '';
  let location = '';
  let twitter = '';
  let instagram = '';
  let youtube = '';
  let tiktok = '';

  try {
    const configObj = JSON.parse(profile.theme_config);
    parsedTheme = configObj.theme || 'light';
    contactEmail = configObj.contact_email || '';
    location = configObj.location || '';
    twitter = configObj.twitter || '';
    instagram = configObj.instagram || '';
    youtube = configObj.youtube || '';
    tiktok = configObj.tiktok || '';
  } catch (e) {
    parsedTheme = profile.theme_config || 'light';
  }

  const selectedTemplate = templatesData.find(t => t.id.toString() === parsedTheme.toString()) || templatesData[0];
  
  const textColor = selectedTemplate.textClass;
  const bioColor = selectedTemplate.textClass;
  const footerColor = selectedTemplate.textClass;
  const IconClass = "bg-white/10 border-white/20 hover:bg-white/20";
  const btnClass = selectedTemplate.btnClass;
  const socialClass = selectedTemplate.socialClass || textColor;

  const getLinkIcon = (type) => {
    switch (type) {
      case 'youtube': return <Youtube size={20} className="mr-3" />;
      case 'instagram': return <Instagram size={20} className="mr-3" />;
      case 'twitter': return <Twitter size={20} className="mr-3" />;
      case 'linkedin': return <Linkedin size={20} className="mr-3" />;
      case 'github': return <Github size={20} className="mr-3" />;
      case 'tiktok': return <Music size={20} className="mr-3" />;
      case 'spotify': return <Radio size={20} className="mr-3" />;
      case 'paypal': return <DollarSign size={20} className="mr-3" />;
      case 'stripe': return <CheckCircle size={20} className="mr-3" />;
      case 'substack': return <Mail size={20} className="mr-3" />;
      case 'medium': return <FileText size={20} className="mr-3" />;
      case 'email_collect': return <Mail size={20} className="mr-3" />;
      default: return <Globe size={20} className="mr-3" />;
    }
  };

  // Group links by category
  const categories = {};
  profile.links.forEach(link => {
    const cat = link.category || 'Default';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(link);
  });

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 relative flex flex-col transition-colors duration-500 bg-black">
      {selectedTemplate.bgImage && (
        <img src={selectedTemplate.bgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-80" />
      )}
      <div className={`absolute inset-0 ${selectedTemplate.bgOverlay}`}></div>
      
      {/* Top right icon */}
      <div className="absolute top-6 right-6 z-30">
        <button 
          onClick={() => setShowShare(!showShare)}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm cursor-pointer border transition-all duration-300 ${IconClass}`}
        >
          <MoreHorizontal className={textColor} size={20} />
        </button>
        
        {/* Share Popup */}
        {showShare && (
          <div className="absolute top-12 right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all z-50">
            <button 
              onClick={handleShare}
              className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Share size={16} className="mr-3 text-gray-500" />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        )}
      </div>

      <div className="max-w-[680px] w-full mx-auto flex flex-col items-center flex-grow mt-8 z-20 relative">
        {profile.avatar ? (
          <img src={profile.avatar} alt={profile.username} className="w-[96px] h-[96px] rounded-full object-cover mb-4 shadow-md border-2 border-white/20" />
        ) : (
          <div className="w-[96px] h-[96px] bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-md border-2 border-white/20">
            {profile.username.charAt(0).toUpperCase()}
          </div>
        )}
        
        <div className="flex items-center justify-center gap-1 mb-1">
          <h1 className={`text-[22px] font-bold tracking-tight ${textColor}`}>{profile.full_name || `@${profile.username}`}</h1>
          <CheckCircle size={18} className="text-blue-500 fill-blue-500/10" />
        </div>
        
        {profile.bio ? (
          <p className={`text-center mt-2 mb-4 font-medium text-[15px] max-w-sm leading-relaxed ${bioColor}`}>{profile.bio}</p>
        ) : (
          <div className="h-4 mb-4"></div>
        )}

        {(location || contactEmail) && (
          <div className={`flex flex-col items-center gap-2 mb-8 text-[13px] font-medium ${textColor} opacity-90`}>
            {location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={14} />
                <span>{location}</span>
              </div>
            )}
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-1.5 hover:opacity-100 transition-opacity">
                <Mail size={14} />
                <span>{contactEmail}</span>
              </a>
            )}
          </div>
        )}

        {/* Tip Jar Section */}
        {profile.theme_config && (() => {
          try {
            const config = JSON.parse(profile.theme_config);
            if (config.tip_jar_enabled) {
              return (
                <div className="w-full px-2 mb-10">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 text-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl group-hover:bg-orange-500/40 transition-colors"></div>
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg relative z-10 animate-bounce">
                      <DollarSign size={32} className="text-white" />
                    </div>
                    <h3 className="text-white font-black text-2xl mb-2 tracking-tight">Support my work</h3>
                    <p className="text-white/80 text-[15px] mb-8 leading-relaxed font-medium">
                      {config.tip_jar_message || "If you enjoy my content, consider supporting me with a small tip!"}
                    </p>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                       <button className="bg-white/10 hover:bg-white/25 text-white py-4 rounded-2xl font-bold transition border border-white/10">₹400</button>
                       <button className="bg-white/10 hover:bg-white/25 text-white py-4 rounded-2xl font-bold transition border border-white/10">₹800</button>
                       <button className="bg-white/10 hover:bg-white/25 text-white py-4 rounded-2xl font-bold transition border border-white/10">₹2000</button>
                    </div>
                    <button className="w-full bg-white text-gray-900 py-4 rounded-2xl font-black transition shadow-xl tracking-tight hover:bg-orange-50 transform hover:-translate-y-1 active:scale-95">
                      Send Custom Amount
                    </button>
                  </div>
                </div>
              );
            }
          } catch(e) {}
          return null;
        })()}

        {/* Links Grouped by Category */}
        <div className="w-full px-2 space-y-8">
          {Object.entries(categories).map(([catName, links]) => (
            <div key={catName} className="space-y-4">
              {catName !== 'Default' && (
                <h3 className={`text-xs font-bold uppercase tracking-[0.2em] mb-4 opacity-70 ${textColor}`}>{catName}</h3>
              )}
              <div className="grid grid-cols-1 gap-4">
                {links.map(link => (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link)}
                    className={`w-full flex items-center justify-between hover:scale-[1.02] transform transition-all duration-200 py-4 px-5 rounded-[20px] font-semibold text-[15px] shadow-sm hover:shadow-md relative overflow-hidden group ${btnClass} ${link.animation || ''} ${link.is_pinned ? 'border-2 border-white/40 ring-2 ring-white/10' : ''}`}
                  >
                    <div className="flex items-center flex-1">
                      <div className="mr-4 opacity-90">
                        {link.has_password ? <Lock size={20} /> : getLinkIcon(link.type)}
                      </div>
                      <span className="text-left leading-tight truncate pr-4">{link.title}</span>
                    </div>
                    
                    {link.show_view_count && (
                      <div className="flex items-center gap-1 text-[10px] opacity-60 bg-black/20 px-2 py-1 rounded-full">
                        <Eye size={10} />
                        {link.view_count}
                      </div>
                    )}
                    
                    {link.is_pinned && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-white/20 backdrop-blur-md text-[8px] font-bold uppercase px-2 py-0.5 rounded-bl-lg">Pinned</div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {profile.links.length === 0 && (
            <p className={`text-center py-10 font-medium ${bioColor}`}>This user hasn't added any links yet.</p>
          )}
        </div>
        
        {/* Products / Store Section */}
        {profile.products && profile.products.length > 0 && (
          <div className="w-full px-2 mt-12 space-y-6">
            <h3 className={`text-xs font-bold uppercase tracking-[0.2em] mb-6 opacity-70 text-center ${textColor}`}>Featured Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.products.map(product => (
                <div 
                  key={product.id} 
                  className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[24px] overflow-hidden flex flex-col group hover:bg-white/20 transition-all cursor-pointer"
                  onClick={() => product.file_url && window.open(product.file_url, '_blank')}
                >
                  <div className="aspect-square w-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center relative overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <ShoppingBag size={48} className="text-white/40 group-hover:scale-110 transition-transform" />
                    )}
                    <div className="absolute top-4 right-4 bg-white text-gray-900 px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                      ₹{product.price}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h4 className="font-bold text-white text-lg mb-1">{product.name}</h4>
                    <p className="text-white/60 text-xs mb-4 flex-1">{product.description}</p>
                    <button 
                      className="w-full bg-white text-gray-900 py-3 rounded-xl font-bold hover:bg-indigo-50 transition shadow-lg flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (product.file_url) window.open(product.file_url, '_blank');
                      }}
                    >
                      ₹ Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Social Icons */}
        {(twitter || instagram || youtube || tiktok) && (
          <div className={`flex gap-6 mt-12 mb-4 ${socialClass}`}>
            {youtube && <a href={youtube} target="_blank" rel="noreferrer" className="opacity-90 hover:opacity-100 hover:scale-110 transition-all"><Youtube size={26} /></a>}
            {instagram && <a href={instagram} target="_blank" rel="noreferrer" className="opacity-90 hover:opacity-100 hover:scale-110 transition-all"><Instagram size={26} /></a>}
            {twitter && <a href={twitter} target="_blank" rel="noreferrer" className="opacity-90 hover:opacity-100 hover:scale-110 transition-all"><Twitter size={26} /></a>}
            {tiktok && <a href={tiktok} target="_blank" rel="noreferrer" className="opacity-90 hover:opacity-100 hover:scale-110 transition-all"><Music size={26} /></a>}
          </div>
        )}
      </div>
      
      {/* Password Modal */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock size={32} className="text-gray-900" />
            </div>
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Protected Link</h3>
            <p className="text-gray-500 text-center text-sm mb-8">Enter the password to access "{passwordModal.title}"</p>
            
            <input 
              type="password"
              placeholder="Enter password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent mb-4 text-center font-bold tracking-widest"
              autoFocus
            />
            {passwordError && <p className="text-red-500 text-xs text-center mb-4 font-bold">{passwordError}</p>}
            
            <div className="flex gap-3">
              <button 
                onClick={handlePasswordSubmit}
                className="flex-1 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all"
              >
                Unlock
              </button>
              <button 
                onClick={() => { setPasswordModal(null); setPasswordInput(''); setPasswordError(''); }}
                className="px-6 py-4 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Capture Modal */}
      {leadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden relative">
            {leadSuccess ? (
              <div className="py-12 flex flex-col items-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Success!</h3>
                <p className="text-gray-500">Your information has been sent.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{leadModal.title}</h3>
                    <p className="text-xs text-gray-500">Please fill out the form below</p>
                  </div>
                </div>
                
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1">Full Name</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="text" required placeholder="John Doe"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="email" required placeholder="john@example.com"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1">Phone (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="tel" placeholder="+1 234 567 890"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1">Message (Optional)</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 text-gray-400" size={16} />
                      <textarea 
                        rows="3" placeholder="Tell us more..."
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                        value={leadForm.message} onChange={e => setLeadForm({...leadForm, message: e.target.value})}
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button 
                      type="submit" disabled={leadSubmitting}
                      className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {leadSubmitting ? 'Sending...' : 'Submit'}
                      <Send size={18} />
                    </button>
                    <button 
                      type="button" onClick={() => setLeadModal(null)}
                      className="px-6 py-4 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-12 pb-8 text-center flex-shrink-0 z-20 relative">
        <a href="/" className={`inline-flex items-center text-[22px] font-black tracking-tighter ${footerColor}`}>
          Ai Appsec lab<span className="ml-[2px] mt-1">*</span>
        </a>
      </div>
    </div>
  );
};

export default PublicProfile;
