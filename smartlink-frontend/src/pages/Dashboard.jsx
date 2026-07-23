import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2, ExternalLink, BarChart2, Save, User as UserIcon, Palette, Youtube, Instagram, Twitter, Music, Mail, MapPin, Globe, CheckCircle, Download, Bot, Activity, Calendar, ArrowUpRight, ArrowDownRight, MoreHorizontal, DollarSign, Star, StarOff, LayoutTemplate, Check, X, ShoppingBag, Store } from 'lucide-react';
import { Navigate, useLocation } from 'react-router-dom';
import templatesData from '../data/templateData';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';

const COLORS = ['#4F46E5', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B', '#3B82F6'];

const Dashboard = () => {
  const location = useLocation();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [links, setLinks] = useState([]);
  const [analytics, setAnalytics] = useState({ total_clicks: 0, link_stats: [], timeline: [], devices: [], browsers: [], os: [], referrals: [] });
  const [selectedReferrer, setSelectedReferrer] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [mlForecast, setMlForecast] = useState([]);
  const [mlInsights, setMlInsights] = useState({ best_posting_time: '', confidence_score: 0 });
  const [newLink, setNewLink] = useState({ title: '', url: '', type: 'website', animation: '' });
  const [products, setProducts] = useState([]);
  
  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };
  
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'links';
  const [activeTab, setActiveTab] = useState(initialTab); 
  
  const [loading, setLoading] = useState(true);
  const analyticsRef = useRef(null);
  
  const [profileData, setProfileData] = useState({ full_name: '', bio: '', avatar: '', theme_config: 'light', contact_email: '', location: '', twitter: '', instagram: '', youtube: '', tiktok: '' });
  const [updateMsg, setUpdateMsg] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [qrDesign, setQrDesign] = useState({ id: 'classic', name: 'Classic Dark', fgColor: '#000000', bgColor: '#ffffff' });

  // ── Multi-template system ──
  const STORAGE_KEY = `smartlink_saved_templates_${user?.id || 'guest'}`;
  const [savedTemplateIds, setSavedTemplateIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('smartlink_saved_template_ids') || '[]'); } catch { return []; }
  });
  const [templateFilter, setTemplateFilter] = useState('all'); // 'all' | 'saved'

  const isSaved = (id) => savedTemplateIds.includes(id);

  const toggleSaveTemplate = (id) => {
    setSavedTemplateIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('smartlink_saved_template_ids', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    if (user) {
      let parsedTheme = 'light';
      let parsedEmail = '';
      let parsedLocation = '';
      let parsedTwitter = '';
      let parsedInstagram = '';
      let parsedYoutube = '';
      let parsedTiktok = '';
      let parsedTipJarEnabled = false;
      let parsedTipJarMessage = '';
      
      try {
        const config = JSON.parse(user.theme_config);
        parsedTheme = config.theme || 'light';
        parsedEmail = config.contact_email || '';
        parsedLocation = config.location || '';
        parsedTwitter = config.twitter || '';
        parsedInstagram = config.instagram || '';
        parsedYoutube = config.youtube || '';
        parsedTiktok = config.tiktok || '';
        parsedTipJarEnabled = config.tip_jar_enabled || false;
        parsedTipJarMessage = config.tip_jar_message || '';
      } catch (e) {
        parsedTheme = user.theme_config || 'light';
      }
      
      setProfileData({ 
        full_name: user.full_name || '', 
        bio: user.bio || '', 
        avatar: user.avatar || '',
        theme_config: parsedTheme,
        contact_email: parsedEmail,
        location: parsedLocation,
        twitter: parsedTwitter,
        instagram: parsedInstagram,
        youtube: parsedYoutube,
        tiktok: parsedTiktok,
        tip_jar_enabled: parsedTipJarEnabled,
        tip_jar_message: parsedTipJarMessage
      });
    }
  }, [user]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [linksRes, analyticsRes, summaryRes, mlRes, productsRes] = await Promise.all([
        axios.get('/api/links'),
        axios.get('/api/analytics'),
        axios.get('/api/analytics/summary').catch(() => ({ data: { summary: 'Summary not available yet.' } })),
        axios.get('/api/analytics/predict').catch(() => ({ data: { forecast: [], best_posting_time: '', confidence_score: 0 } })),
        axios.get('/api/products').catch(() => ({ data: [] }))
      ]);
      setLinks(linksRes.data);
      setProducts(productsRes.data);
      if (mlRes.data.forecast && mlRes.data.forecast.length > 0) {
        setMlForecast(mlRes.data.forecast.map(f => ({
          date: new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          clicks: f.predicted_clicks
        })));
        setMlInsights({
          best_posting_time: mlRes.data.best_posting_time,
          confidence_score: mlRes.data.confidence_score
        });
      }
      let fetchedAnalytics = analyticsRes.data;
      
      // Inject "Proper Video Analysis" mock data if user has no real traffic yet
      if (!fetchedAnalytics.referrals || fetchedAnalytics.referrals.length === 0) {
        fetchedAnalytics.referrals = [
          { name: 'youtube.com', value: 16391 },
          { name: 'tiktok.com', value: 8545 },
          { name: 'instagram.com', value: 7321 },
          { name: 'twitter.com', value: 3153 },
          { name: 'vimeo.com', value: 918 }
        ];
        fetchedAnalytics.total_clicks = 36328;
        fetchedAnalytics.timeline = [
          { date: 'May 1', clicks: 4200 }, { date: 'May 2', clicks: 5800 },
          { date: 'May 3', clicks: 5100 }, { date: 'May 4', clicks: 7300 },
          { date: 'May 5', clicks: 6400 }, { date: 'May 6', clicks: 8900 },
          { date: 'May 7', clicks: 12000 }
        ];
        fetchedAnalytics.devices = [
          { name: 'Mobile', value: 24500 }, { name: 'Desktop', value: 10000 }, { name: 'Tablet', value: 1828 }
        ];
        fetchedAnalytics.browsers = [
          { name: 'Chrome', value: 20000 }, { name: 'Safari', value: 12000 }, { name: 'Firefox', value: 4328 }
        ];
        fetchedAnalytics.os = [
          { name: 'iOS', value: 18000 }, { name: 'Android', value: 12000 }, { name: 'Windows', value: 6328 }
        ];
        if (linksRes.data && linksRes.data.length > 0) {
          fetchedAnalytics.link_stats = linksRes.data.map((l, index) => ({
            link_id: l.id,
            title: l.title,
            url: l.url,
            clicks: Math.floor(fetchedAnalytics.total_clicks / linksRes.data.length) + (index * 123)
          }));
        } else {
          fetchedAnalytics.link_stats = [];
        }
      }

      setAnalytics(fetchedAnalytics);
      if (fetchedAnalytics.referrals && fetchedAnalytics.referrals.length > 0) {
        setSelectedReferrer(fetchedAnalytics.referrals[0]);
      }
      setAiSummary(summaryRes.data.summary);
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return;
    try {
      await axios.post('/api/links', newLink);
      setNewLink({ title: '', url: '', type: 'website' });
      fetchData();
    } catch (err) {
      console.error('Error adding link', err);
    }
  };

  const handleDeleteLink = async (id) => {
    try {
      await axios.delete(`/api/links/${id}`);
      fetchData();
    } catch (err) {
      console.error('Error deleting link', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...profileData,
        theme_config: JSON.stringify({
          theme: profileData.theme_config,
          contact_email: profileData.contact_email,
          location: profileData.location,
          twitter: profileData.twitter,
          instagram: profileData.instagram,
          youtube: profileData.youtube,
          tiktok: profileData.tiktok,
          tip_jar_enabled: profileData.tip_jar_enabled,
          tip_jar_message: profileData.tip_jar_message
        })
      };
      await axios.put('/api/profile', payload);
      setUpdateMsg('Profile updated automatically!');
      setTimeout(() => setUpdateMsg(''), 3000);
      setTimeout(() => window.location.reload(), 1000); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleThemeSelect = async (theme) => {
    try {
      setProfileData({...profileData, theme_config: theme});
      const payload = JSON.stringify({
        theme: theme,
        contact_email: profileData.contact_email,
        location: profileData.location,
        twitter: profileData.twitter,
        instagram: profileData.instagram,
        youtube: profileData.youtube,
        tiktok: profileData.tiktok
      });
      await axios.put('/api/profile', { theme_config: payload });
      setUpdateMsg('Theme applied!');
      setTimeout(() => setUpdateMsg(''), 3000);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingAvatar(true);
    try {
      const res = await axios.post('/api/upload', formData);
      setProfileData(prev => {
        const updatedData = {...prev, avatar: res.data.url};
        
        // Auto-save the avatar change
        const payload = {
          ...updatedData,
          theme_config: JSON.stringify({
            theme: updatedData.theme_config,
            contact_email: updatedData.contact_email,
            location: updatedData.location,
            twitter: updatedData.twitter,
            instagram: updatedData.instagram,
            youtube: updatedData.youtube,
            tiktok: updatedData.tiktok
          })
        };
        axios.put('/api/profile', payload).catch(err => console.error(err));
        
        return updatedData;
      });
      setUpdateMsg('Photo uploaded and saved!');
      setTimeout(() => setUpdateMsg(''), 3000);
    } catch (err) {
      console.error('Error uploading file', err);
      setUpdateMsg('Error uploading photo.');
      setTimeout(() => setUpdateMsg(''), 3000);
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (authLoading || loading) return <div className="p-10 text-center flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>Loading dashboard...</div>;
  if (!user) return <Navigate to="/login" />;

  const selectedTemplate = templatesData.find(t => t.id.toString() === profileData.theme_config.toString()) || templatesData[0];
  const textColor = selectedTemplate.textClass;
  const bioColor = selectedTemplate.textClass;
  const btnClass = selectedTemplate.btnClass;
  const socialClass = selectedTemplate.socialClass || textColor;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-48 pb-8 sm:px-6 lg:px-8">
      {updateMsg && (
        <div className="fixed top-32 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {updateMsg}
        </div>
      )}

      {/* Profile Link Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 mb-8 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between shadow-sm">
        <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4 text-indigo-600 flex-shrink-0">
             <Globe size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Your personal link is live</p>
            <a href={`/${user?.username}`} target="_blank" rel="noreferrer" className="text-sm sm:text-base font-bold text-indigo-700 hover:text-indigo-900 transition truncate block w-full">
              {window.location.origin}/{user?.username}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <button 
             onClick={() => {
               navigator.clipboard.writeText(`${window.location.origin}/${user?.username}`);
               setUpdateMsg('Link Copied to Clipboard!');
               setTimeout(() => setUpdateMsg(''), 3000);
             }}
             className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm text-sm"
           >
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
             Copy
           </button>
           <button 
             onClick={() => {
               if (navigator.share) {
                 navigator.share({
                   title: `${profileData.full_name || user?.username}'s Profile`,
                   url: `${window.location.origin}/${user?.username}`
                 }).catch(console.error);
               } else {
                 navigator.clipboard.writeText(`${window.location.origin}/${user?.username}`);
                 setUpdateMsg('Link Copied to Clipboard!');
                 setTimeout(() => setUpdateMsg(''), 3000);
               }
             }}
             className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md text-sm"
           >
             Share
           </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar / Profile Preview */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <h3 className="font-bold text-gray-400 tracking-widest text-sm mb-4 uppercase">Live Preview</h3>
          
          {/* Original Single Preview */}
          <div className="w-full max-w-[300px] aspect-[9/19] rounded-[40px] border-[8px] border-gray-900 overflow-hidden relative shadow-2xl bg-black"
            style={selectedTemplate.bgStyle ? { background: selectedTemplate.bgStyle } : {}}
          >
            {selectedTemplate.bgImage && (
              <img src={selectedTemplate.bgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            )}
            {selectedTemplate.bgOverlay && (
              <div className={`absolute inset-0 ${selectedTemplate.bgOverlay}`}></div>
            )}
            {/* Decorative blobs for linktree variants */}
            {selectedTemplate.variant?.startsWith('linktree') && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-60"
                  style={{ background: selectedTemplate.id === 12 ? '#ff6f00' : selectedTemplate.id === 13 ? '#f9a825' : '#e91e63' }} />
                <div className="absolute top-1/3 -left-10 w-28 h-28 rounded-full opacity-50"
                  style={{ background: selectedTemplate.id === 12 ? '#e91e8c' : selectedTemplate.id === 13 ? '#000' : '#ff6f00' }} />
              </div>
            )}

            <div className="relative z-10 w-full h-full px-4 pt-14 pb-8 flex flex-col items-center overflow-y-auto scrollbar-hide">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="Profile" className="w-[72px] h-[72px] rounded-full object-cover mb-3 shadow-md border-2 border-white/20" />
              ) : (
                <div className="w-[72px] h-[72px] bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-md border-2 border-white/20">
                  {(user?.username || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="flex items-center justify-center gap-1 mb-1">
                <h2 className={`text-[17px] font-bold tracking-tight text-center ${textColor}`}>{profileData.full_name || `@${user?.username}`}</h2>
                <CheckCircle size={14} className="text-blue-500 fill-blue-500/10" />
              </div>
              
              {profileData.bio ? (
                <p className={`text-center mt-1 mb-3 font-medium text-[12px] max-w-sm leading-relaxed ${bioColor}`}>{profileData.bio}</p>
              ) : (
                <div className="h-4 mb-3"></div>
              )}

              {(profileData.location || profileData.contact_email) && (
                <div className={`flex flex-col items-center gap-1.5 mb-5 text-[11px] font-medium ${textColor} opacity-90`}>
                  {profileData.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  {profileData.contact_email && (
                    <a href={`mailto:${profileData.contact_email}`} className="flex items-center gap-1 hover:opacity-100 transition-opacity">
                      <Mail size={12} />
                      <span>{profileData.contact_email}</span>
                    </a>
                  )}
                </div>
              )}

              {/* Dynamic Rendering Based on Template Type */}
              {(profileData.theme_config === '7' || profileData.theme_config === 7) ? (
                // Voice Messages Template
                <div className="w-full flex-1 overflow-y-auto px-2 space-y-2 pb-6 scrollbar-hide mt-1">
                   {links.map((link, i) => (
                     <div key={link.id} className="bg-white rounded-lg p-2.5 shadow-sm flex gap-2 relative">
                       {i < 2 && <div className="absolute left-1 top-4 w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>}
                       <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold flex-shrink-0 ml-1 text-xs">
                         {link.title.charAt(0)}
                       </div>
                       <div className="overflow-hidden">
                         <h4 className="text-[11px] font-bold text-gray-800 truncate">{link.title}</h4>
                         <p className="text-[9px] text-gray-500 leading-tight mt-0.5 truncate">{link.url}</p>
                       </div>
                     </div>
                   ))}
                </div>
              ) : (profileData.theme_config === '8' || profileData.theme_config === 8) ? (
                // Library Template
                <div className="w-full flex-1 overflow-y-auto px-2 space-y-2 pb-6 scrollbar-hide mt-1">
                   {links.map((link, i) => (
                     <div key={link.id} className="bg-white rounded-lg p-2.5 shadow-sm flex items-center justify-between">
                       <div className="flex items-center gap-2 overflow-hidden">
                         <div className="w-6 h-6 rounded-full bg-[#6348c5] flex items-center justify-center text-white text-[9px] flex-shrink-0">▶</div>
                         <div className="overflow-hidden">
                           <h4 className="text-[11px] font-bold text-gray-800 truncate">{link.title}</h4>
                         </div>
                       </div>
                       <div className="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 text-xs flex-shrink-0 ml-1">+</div>
                     </div>
                   ))}
                </div>
              ) : (profileData.theme_config === '9' || profileData.theme_config === 9) ? (
                // Interludes Template
                <div className="w-full flex-1 overflow-y-auto px-2 space-y-2 pb-6 scrollbar-hide mt-1">
                   <div className="w-full bg-white/20 rounded-full flex items-center px-3 py-2 text-[10px] mb-2 text-white/80">
                      <span className="opacity-70 mr-2">🔍</span> Search interludes
                   </div>
                   {links.map((link, i) => (
                     <div key={link.id} className="bg-white rounded-lg p-2 shadow-sm flex items-center justify-between">
                       <div className="flex items-center gap-2 overflow-hidden">
                         <div className="w-6 h-6 rounded-full bg-[#ea8bbb]/20 flex items-center justify-center text-[#ea8bbb] text-[9px] flex-shrink-0">▶</div>
                         <div className="overflow-hidden">
                           <h4 className="text-[11px] font-bold text-gray-800 truncate">{link.title}</h4>
                         </div>
                       </div>
                       <div className="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 text-xs flex-shrink-0 ml-1">+</div>
                     </div>
                   ))}
                </div>
              ) : (profileData.theme_config === '10' || profileData.theme_config === 10) ? (
                // Sounds Template
                <div className="w-full flex-1 overflow-y-auto px-2 space-y-2 pb-6 scrollbar-hide mt-1">
                   <div className="w-full bg-white/20 rounded-full flex items-center px-3 py-2 text-[10px] mb-2 text-white/80">
                      <span className="opacity-70 mr-2">🔍</span> Search sounds
                   </div>
                   {links.map((link, i) => (
                     <div key={link.id} className="bg-white rounded-lg p-2 shadow-sm flex items-center justify-between">
                       <div className="flex items-center gap-2 overflow-hidden">
                         <div className="w-6 h-6 rounded-full bg-[#3f99a8] flex items-center justify-center text-white text-[9px] flex-shrink-0">▶</div>
                         <div className="overflow-hidden">
                           <h4 className="text-[11px] font-bold text-gray-800 truncate">{link.title}</h4>
                         </div>
                       </div>
                       <div className="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 text-xs flex-shrink-0 ml-1">+</div>
                     </div>
                   ))}
                </div>
              ) : (profileData.theme_config === '11' || profileData.theme_config === 11) ? (
                // Songs Template
                <div className="w-full flex-1 overflow-y-auto px-2 space-y-2 pb-6 scrollbar-hide mt-1">
                   <div className="w-full bg-white rounded-full flex items-center px-3 py-2 text-[10px] text-gray-500 mb-2">
                      <span className="opacity-70 mr-2">🔍</span> Search songs
                   </div>
                   {links.map((link, i) => (
                     <div key={link.id} className="bg-white rounded-lg p-1.5 shadow-sm flex items-center gap-2">
                       <div className="w-8 h-8 rounded object-cover bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-xs">
                         {link.title.charAt(0)}
                       </div>
                       <div className="overflow-hidden">
                         <h4 className="text-[11px] font-bold text-gray-800 leading-tight truncate">{link.title}</h4>
                       </div>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="w-full space-y-3 mt-1">
                  {links.map(link => {
                    let Icon = Globe;
                    if (link.type === 'youtube') Icon = Youtube;
                    else if (link.type === 'instagram') Icon = Instagram;
                    else if (link.type === 'twitter') Icon = Twitter;
                    else if (link.type === 'tiktok') Icon = Music;
                    
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`w-full flex items-center justify-center py-3 px-4 rounded-[24px] font-bold text-[13px] shadow-sm transition-transform hover:scale-[1.02] ${btnClass} ${link.animation || ''}`}
                      >
                        <Icon size={16} className="mr-2" />
                        <span className="truncate">{link.title}</span>
                      </a>
                    )
                  })}
                </div>
              )}

              {/* Bottom Social Icons */}
              {(profileData.twitter || profileData.instagram || profileData.youtube || profileData.tiktok) && (
                <div className={`flex gap-5 mt-auto pt-8 mb-2 ${socialClass}`}>
                  {profileData.youtube && <a href={profileData.youtube} target="_blank" rel="noreferrer" className="opacity-90 hover:opacity-100 hover:scale-110 transition-transform"><Youtube size={20} /></a>}
                  {profileData.instagram && <a href={profileData.instagram} target="_blank" rel="noreferrer" className="opacity-90 hover:opacity-100 hover:scale-110 transition-transform"><Instagram size={20} /></a>}
                  {profileData.twitter && <a href={profileData.twitter} target="_blank" rel="noreferrer" className="opacity-90 hover:opacity-100 hover:scale-110 transition-transform"><Twitter size={20} /></a>}
                  {profileData.tiktok && <a href={profileData.tiktok} target="_blank" rel="noreferrer" className="opacity-90 hover:opacity-100 hover:scale-110 transition-transform"><Music size={20} /></a>}
                </div>
              )}
            </div>
          </div>
          
          <a 
            href={`/${user?.username}`} 
            target="_blank" 
            rel="noreferrer"
            className="mt-6 flex items-center justify-center space-x-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors bg-indigo-50 px-6 py-2.5 rounded-full"
          >
            <span>View Full Live Profile</span>
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
              <button 
                className={`min-w-[100px] px-4 py-4 font-medium text-sm text-center ${activeTab === 'links' ? 'text-primary border-b-2 border-primary bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('links')}
              >
                Links
              </button>
              <button 
                className={`min-w-[100px] px-4 py-4 font-medium text-sm text-center ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button 
                className={`min-w-[100px] px-4 py-4 font-medium text-sm text-center ${activeTab === 'templates' ? 'text-primary border-b-2 border-primary bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('templates')}
              >
                Templates
              </button>
              <button 
                className={`min-w-[100px] px-4 py-4 font-medium text-sm text-center ${activeTab === 'analytics' ? 'text-primary border-b-2 border-primary bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
              <button 
                className={`min-w-[100px] px-4 py-4 font-medium text-sm text-center ${activeTab === 'qrcode' ? 'text-primary border-b-2 border-primary bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('qrcode')}
              >
                QR Code
              </button>
              <button 
                className={`min-w-[100px] px-4 py-4 font-medium text-sm text-center ${activeTab === 'monetize' ? 'text-primary border-b-2 border-primary bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('monetize')}
              >
                Monetize
              </button>
              <button 
                className={`min-w-[100px] px-4 py-4 font-medium text-sm text-center ${activeTab === 'audience' ? 'text-primary border-b-2 border-primary bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('audience')}
              >
                Audience
              </button>
              <button 
                className={`min-w-[120px] px-4 py-4 font-medium text-sm text-center ${activeTab === 'planner' ? 'text-primary border-b-2 border-primary bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => window.location.href = '/social-planner'}
              >
                📅 Social Planner
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'links' && (
                <div>
                  <form onSubmit={handleAddLink} className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-900 text-lg">Add New Link</h3>
                      <button type="button" className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">✨ Pro Features Unlocked</button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          placeholder="Title (e.g. My Website)" 
                          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary text-sm font-medium"
                          value={newLink.title}
                          onChange={e => setNewLink({...newLink, title: e.target.value})}
                        />
                        <input 
                          type="url" 
                          placeholder="URL (e.g. https://example.com)" 
                          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary text-sm font-medium"
                          value={newLink.url}
                          onChange={e => setNewLink({...newLink, url: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Icon Type</label>
                          <select
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary bg-white text-gray-700 text-sm font-medium"
                            value={newLink.type}
                            onChange={e => setNewLink({...newLink, type: e.target.value})}
                          >
                            <option value="website">🌐 Standard Website</option>
                            <option value="youtube">📺 YouTube Video</option>
                            <option value="spotify">🎵 Spotify Music</option>
                            <option value="instagram">📸 Instagram Profile</option>
                            <option value="twitter">🐦 Twitter / X</option>
                            <option value="tiktok">🎵 TikTok</option>
                            <option value="linkedin">💼 LinkedIn</option>
                            <option value="github">💻 GitHub</option>
                            <option value="email_collect">📧 Email Collection</option>
                            <option value="paypal">💰 PayPal Tip</option>
                            <option value="stripe">💳 Stripe Payment</option>
                            <option value="substack">📝 Substack</option>
                            <option value="medium">✍️ Medium</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider flex items-center gap-1">Animation <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">Pro</span></label>
                          <select
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary bg-white text-gray-700 text-sm font-medium"
                            value={newLink.animation || ''}
                            onChange={e => setNewLink({...newLink, animation: e.target.value})}
                          >
                            <option value="">None</option>
                            <option value="animate-bounce">Bounce</option>
                            <option value="animate-pulse">Pulse</option>
                            <option value="hover:animate-spin">Spin on Hover</option>
                            <option value="hover:-translate-y-1">Pop Up</option>
                            <option value="hover:scale-110">Scale Up</option>
                          </select>
                        </div>
                      </div>

                      <button type="submit" className="w-full flex items-center justify-center space-x-2 bg-gray-900 hover:bg-black text-white p-3.5 rounded-xl font-bold transition-transform hover:scale-[1.01] shadow-md mt-2">
                        <Plus size={20} />
                        <span>Add Link</span>
                      </button>
                    </div>
                  </form>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800">Your Links</h3>
                    {links.length === 0 ? (
                      <p className="text-gray-500 text-sm">No links added yet.</p>
                    ) : (
                      links.map(link => {
                        const linkStat = analytics.link_stats?.find(s => s.link_id === link.id);
                        const clicks = linkStat ? linkStat.clicks : 0;
                        return (
                          <div key={link.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all group gap-4 sm:gap-0">
                            <div className="flex-1 overflow-hidden pr-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-indigo-50 px-2 py-1 rounded">{link.type || 'website'}</span>
                                <h4 className="font-medium text-gray-900 truncate">{link.title}</h4>
                                {link.animation && (
                                  <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                    {link.animation.split('-').pop()}
                                  </span>
                                )}
                              </div>
                              <a href={link.url} target="_blank" rel="noreferrer" className="text-sm text-gray-500 truncate hover:text-primary block mt-1">
                                {link.url}
                              </a>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                <BarChart2 size={16} className="text-[#8B5CF6]" />
                                <span className="text-sm font-bold text-gray-700">{clicks.toLocaleString()} clicks</span>
                              </div>
                              <button 
                                onClick={() => handleDeleteLink(link.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Link"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="flex items-center mb-6">
                    <UserIcon className="text-primary mr-3" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                    <div className="flex items-center space-x-4 mb-4">
                      {profileData.avatar ? (
                        <img src={profileData.avatar} alt="Avatar Preview" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                          <UserIcon size={24} />
                        </div>
                      )}
                      <div className="flex-1">
                        <label className="flex items-center justify-center w-full max-w-xs px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                          {uploadingAvatar ? (
                            <span className="flex items-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>Uploading...</span>
                          ) : (
                            <span>Upload New Photo</span>
                          )}
                          <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                        </label>
                      </div>
                    </div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Or paste image URL</label>
                    <input 
                      type="url" 
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 mb-4 text-sm"
                      value={profileData.avatar || ''}
                      onChange={e => setProfileData({...profileData, avatar: e.target.value})}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                      value={profileData.full_name}
                      onChange={e => setProfileData({...profileData, full_name: e.target.value})}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea 
                      rows="4"
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      value={profileData.bio}
                      onChange={e => setProfileData({...profileData, bio: e.target.value})}
                      placeholder="Describe yourself to your audience..."
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email (Public)</label>
                      <input 
                        type="email" 
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        value={profileData.contact_email}
                        onChange={e => setProfileData({...profileData, contact_email: e.target.value})}
                        placeholder="hello@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input 
                        type="text" 
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        value={profileData.location}
                        onChange={e => setProfileData({...profileData, location: e.target.value})}
                        placeholder="e.g. New York, USA"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Social Icons (Bottom of Profile)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                        <input 
                          type="url" 
                          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                          value={profileData.instagram}
                          onChange={e => setProfileData({...profileData, instagram: e.target.value})}
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Twitter / X URL</label>
                        <input 
                          type="url" 
                          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                          value={profileData.twitter}
                          onChange={e => setProfileData({...profileData, twitter: e.target.value})}
                          placeholder="https://twitter.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                        <input 
                          type="url" 
                          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                          value={profileData.youtube}
                          onChange={e => setProfileData({...profileData, youtube: e.target.value})}
                          placeholder="https://youtube.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">TikTok URL</label>
                        <input 
                          type="url" 
                          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                          value={profileData.tiktok}
                          onChange={e => setProfileData({...profileData, tiktok: e.target.value})}
                          placeholder="https://tiktok.com/..."
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button type="submit" className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    <Save size={20} />
                    <span>Save Changes</span>
                  </button>
                </form>
              )}

              {activeTab === 'templates' && (
                <div>
                  {/* Multi-Template Showcase */}
                  <div className="mb-8">
                    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-indigo-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                          <Star size={20} className="text-white" fill="white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Multi-Template System Active!</h3>
                          <p className="text-xs text-gray-600">Save unlimited templates • Switch instantly • One active at a time</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="font-semibold">Step 1:</span> Click ★ to save favorites
                        </div>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="font-semibold">Step 2:</span> Filter by "Saved"
                        </div>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="font-semibold">Step 3:</span> Set as Active
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <LayoutTemplate className="text-indigo-600" size={24} />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">My Templates</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Save multiple templates and switch your active one anytime</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTemplateFilter('all')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${templateFilter === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                      >
                        All ({templatesData.length})
                      </button>
                      <button
                        onClick={() => setTemplateFilter('saved')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all flex items-center gap-1.5 ${templateFilter === 'saved' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}
                      >
                        <Star size={14} />
                        Saved ({savedTemplateIds.length})
                      </button>
                    </div>
                  </div>

                  {/* Active template banner */}
                  {(() => {
                    const active = templatesData.find(t => t.id.toString() === profileData.theme_config.toString());
                    return active ? (
                      <div className="mb-6 flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-3.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                          <Check size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-indigo-900">Active Template: <span className="text-indigo-600">{active.name}</span></p>
                          <p className="text-xs text-indigo-500 truncate">{active.description}</p>
                        </div>
                        <span className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full font-semibold flex-shrink-0">Live</span>
                      </div>
                    ) : null;
                  })()}

                  {/* Empty saved state */}
                  {templateFilter === 'saved' && savedTemplateIds.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                      <Star size={40} className="mx-auto mb-3 opacity-30" />
                      <p className="font-semibold text-gray-500">No saved templates yet</p>
                      <p className="text-sm mt-1">Click the ★ on any template to save it here</p>
                      <button onClick={() => setTemplateFilter('all')} className="mt-4 text-indigo-600 font-semibold text-sm hover:underline">Browse all templates →</button>
                    </div>
                  )}

                  {/* Template grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templatesData
                      .filter(t => templateFilter === 'all' || savedTemplateIds.includes(t.id))
                      .map(template => {
                        const isActive = profileData.theme_config === template.id.toString();
                        const saved = isSaved(template.id);
                        return (
                          <div key={template.id} className="relative group">
                            {/* Template card */}
                            <div
                              className={`cursor-pointer rounded-[28px] overflow-hidden transition-all relative aspect-[9/16]
                                ${isActive
                                  ? 'ring-4 ring-indigo-500 shadow-xl scale-[1.02]'
                                  : 'ring-1 ring-gray-200 hover:ring-indigo-300 hover:shadow-lg'
                                }`}
                              style={template.bgStyle ? { background: template.bgStyle } : {}}
                            >
                              {template.bgImage && (
                                <img src={template.bgImage} alt={template.name} className="absolute inset-0 w-full h-full object-cover" />
                              )}
                              {template.bgOverlay && (
                                <div className={`absolute inset-0 ${template.bgOverlay}`} />
                              )}

                              {/* Decorative blobs for linktree variants */}
                              {template.variant?.startsWith('linktree') && (
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                  <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-60"
                                    style={{ background: template.id === 12 ? '#ff6f00' : template.id === 13 ? '#f9a825' : '#e91e63' }} />
                                  <div className="absolute top-1/3 -left-8 w-24 h-24 rounded-full opacity-50"
                                    style={{ background: template.id === 12 ? '#e91e8c' : template.id === 13 ? '#000' : '#ff6f00' }} />
                                </div>
                              )}

                              <div className="absolute inset-0 p-4 flex flex-col items-center justify-start z-10 pointer-events-none pt-8">
                                {/* Avatar */}
                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 shadow-md mb-2 flex items-center justify-center bg-white/20">
                                  {profileData.avatar ? (
                                    <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-white text-xl font-bold">{(user?.username || 'U').charAt(0).toUpperCase()}</span>
                                  )}
                                </div>
                                <h4 className={`font-bold text-sm mb-0.5 text-center tracking-tight ${template.textClass}`}>
                                  {profileData.full_name || `@${user?.username}`}
                                </h4>
                                <p className={`text-[9px] text-center opacity-80 mb-3 max-w-[90%] line-clamp-2 ${template.textClass}`}>
                                  {profileData.bio || template.description}
                                </p>
                                <div className="w-full flex flex-col gap-1.5 px-1">
                                  {template.buttons.slice(0, 3).map((btn, i) => (
                                    <div key={i} className={`w-full py-2 px-3 rounded-[20px] font-bold text-[9px] text-center shadow-sm ${template.btnClass}`}>
                                      {btn}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Active badge */}
                              {isActive && (
                                <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-20 flex items-center gap-1 shadow-md">
                                  <Check size={10} /> Active
                                </div>
                              )}

                              {/* Hover overlay with actions */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 flex flex-col items-center justify-center gap-3 px-4">
                                <button
                                  onClick={() => handleThemeSelect(template.id.toString())}
                                  className={`w-full py-2.5 rounded-full font-bold text-sm shadow-lg transition-all
                                    ${isActive
                                      ? 'bg-indigo-600 text-white cursor-default'
                                      : 'bg-white text-gray-900 hover:bg-indigo-600 hover:text-white'
                                    }`}
                                >
                                  {isActive ? '✓ Currently Active' : 'Set as Active'}
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleSaveTemplate(template.id); }}
                                  className={`w-full py-2.5 rounded-full font-bold text-sm border transition-all flex items-center justify-center gap-2
                                    ${saved
                                      ? 'bg-yellow-400 text-gray-900 border-yellow-400'
                                      : 'bg-white/20 text-white border-white/40 hover:bg-white/30'
                                    }`}
                                >
                                  {saved ? <><Star size={14} fill="currentColor" /> Saved</> : <><Star size={14} /> Save Template</>}
                                </button>
                              </div>
                            </div>

                            {/* Card footer */}
                            <div className="mt-2.5 px-1 flex items-center justify-between">
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-800 truncate">{template.name}</p>
                                <p className="text-xs text-gray-400 truncate">{template.description}</p>
                              </div>
                              <button
                                onClick={() => toggleSaveTemplate(template.id)}
                                className={`ml-2 p-1.5 rounded-full transition-all flex-shrink-0 ${saved ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-300 hover:text-yellow-400'}`}
                                title={saved ? 'Remove from saved' : 'Save template'}
                              >
                                <Star size={16} fill={saved ? 'currentColor' : 'none'} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Browse more CTA */}
                  <div className="mt-8 text-center">
                    <a
                      href="/templates"
                      className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors shadow-md"
                    >
                      <LayoutTemplate size={16} />
                      Browse All Templates & Customize
                    </a>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div ref={analyticsRef} className="bg-[#fafbfc] min-h-screen p-6 rounded-2xl">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Welcome back, {user?.full_name || user?.username}</h2>
                      <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <button 
                      onClick={() => {
                        let csvContent = "Referrer,Visits,Percentage\n";
                        if (analytics.referrals) {
                          analytics.referrals.forEach(ref => {
                            const percent = analytics.total_clicks > 0 ? Math.round((ref.value / analytics.total_clicks) * 100) : 0;
                            csvContent += `${ref.name},${ref.value},${percent}%\n`;
                          });
                        }
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.setAttribute("href", url);
                        link.setAttribute("download", "analytics_export.csv");
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="flex items-center space-x-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm"
                    >
                      <Download size={16} className="text-gray-400" />
                      <span>Export CSV</span>
                    </button>
                    
                    <button 
                      onClick={async () => {
                        const canvas = await html2canvas(analyticsRef.current);
                        const imgData = canvas.toDataURL('image/png');
                        const pdf = new jsPDF('p', 'mm', 'a4');
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                        pdf.save('analytics-report.pdf');
                      }}
                      className="flex items-center space-x-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm"
                    >
                      <Calendar size={16} className="text-gray-400" />
                      <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <Download size={14} className="ml-2 text-gray-400" />
                    </button>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Left Column */}
                    <div className="flex-1 space-y-6">
                      
                      {/* Chart Area */}
                      <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100/50">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="text-gray-500 text-sm font-medium">Link clicks</h3>
                              <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center">
                                14.3% <ArrowUpRight size={12} className="ml-0.5" />
                              </span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{analytics.total_clicks ?? 0}</div>
                          </div>
                          <select className="bg-gray-50 border-none text-sm text-gray-600 rounded-lg px-3 py-2 outline-none cursor-pointer">
                            <option>Annually</option>
                            <option>Monthly</option>
                            <option>Weekly</option>
                          </select>
                        </div>
                        
                        <div className="h-64 mt-4 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.timeline && analytics.timeline.length ? analytics.timeline : [
                              {date: 'Jul', clicks: 400}, {date: 'Aug', clicks: 300}, {date: 'Sep', clicks: 600}, {date: 'Oct', clicks: 400}, {date: 'Nov', clicks: 900}
                            ]}>
                              <defs>
                                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} dy={10} />
                              <RechartsTooltip 
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                              />
                              <Area type="monotone" dataKey="clicks" stroke="#EC4899" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                            </AreaChart>
                          </ResponsiveContainer>


                        </div>
                      </div>

                      {/* KPI Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100/50">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-gray-500 text-sm font-medium">Link clicks</h3>
                            <span className="bg-emerald-50 text-emerald-500 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center">
                              21.6% <ArrowUpRight size={10} />
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900">{analytics.total_clicks || 0}</div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100/50">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-gray-500 text-sm font-medium">Link visitors</h3>
                            <span className="bg-rose-50 text-rose-500 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center">
                              3% <ArrowDownRight size={10} />
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900">{Math.round((analytics.total_clicks || 0) * 0.8)}</div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100/50">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-gray-500 text-sm font-medium">Link referrers</h3>
                            <span className="bg-emerald-50 text-emerald-500 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center">
                              4% <ArrowUpRight size={10} />
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900">{analytics.referrals ? analytics.referrals.length : 0}</div>
                        </div>
                      </div>

                    </div>

                    {/* Right Column - Referrers */}
                    <div className="w-full lg:w-80 relative flex flex-col">
                      <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100/50 flex-1">
                        <div className="flex justify-between items-center mb-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          <span>Referrer</span>
                          <span>Visits</span>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                          {analytics.referrals && analytics.referrals.length > 0 ? analytics.referrals.map((ref, idx) => {
                            const isYoutube = ref.name.toLowerCase().includes('youtube');
                            const isTwitter = ref.name.toLowerCase().includes('twitter') || ref.name.toLowerCase().includes('t.co');
                            const isInsta = ref.name.toLowerCase().includes('instagram');
                            const isFb = ref.name.toLowerCase().includes('facebook');
                            const isReddit = ref.name.toLowerCase().includes('reddit');
                            const isGoogle = ref.name.toLowerCase().includes('google');
                            const isBing = ref.name.toLowerCase().includes('bing');
                            const isPinterest = ref.name.toLowerCase().includes('pinterest');
                            
                            let Icon = Globe;
                            let colorClass = 'text-gray-500 bg-gray-50';
                            if (isYoutube) { Icon = Youtube; colorClass = 'text-white bg-red-600'; }
                            else if (isTwitter) { Icon = Twitter; colorClass = 'text-white bg-[#1DA1F2]'; }
                            else if (isInsta) { Icon = Instagram; colorClass = 'text-white bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500'; }
                            else if (isFb) { Icon = Globe; colorClass = 'text-white bg-[#1877F2]'; }
                            else if (isReddit) { Icon = Globe; colorClass = 'text-white bg-[#FF4500]'; }
                            else if (isGoogle) { Icon = Globe; colorClass = 'text-white bg-[#DB4437]'; }
                            else if (isPinterest) { Icon = Globe; colorClass = 'text-white bg-[#E60023]'; }
                            else if (isBing) { Icon = Globe; colorClass = 'text-white bg-[#008373]'; }

                            const isSelected = selectedReferrer && selectedReferrer.name === ref.name;

                            return (
                              <div key={idx} onClick={() => setSelectedReferrer(ref)} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                                    {isSelected && <CheckCircle size={10} className="text-white" />}
                                  </div>
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${colorClass} shadow-sm`}>
                                    <Icon size={12} />
                                  </div>
                                  <span className={`text-[13px] font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'} truncate max-w-[120px]`}>{ref.name}</span>
                                </div>
                                <span className={`text-[13px] ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>{ref.value.toLocaleString()}</span>
                              </div>
                            );
                          }) : (
                            <p className="text-sm text-gray-500 text-center py-4">No referrer data yet.</p>
                          )}
                        </div>
                        
                        {/* Distribution Bars below the referrers */}
                        <div className="space-y-4 pt-6 border-t border-gray-50">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                              <div className="bg-[#8B5CF6] h-full rounded-full" style={{width: '3.4%'}}></div>
                            </div>
                            <span className="text-[10px] font-semibold text-gray-500 w-8 text-right">3.4%</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                              <div className="bg-[#8B5CF6] h-full rounded-full" style={{width: '2.2%'}}></div>
                            </div>
                            <span className="text-[10px] font-semibold text-gray-500 w-8 text-right">2.2%</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                              <div className="bg-[#8B5CF6] h-full rounded-full" style={{width: '0.7%'}}></div>
                            </div>
                            <span className="text-[10px] font-semibold text-gray-500 w-8 text-right">0.7%</span>
                          </div>
                        </div>
                      </div>


                    </div>
                  </div>

                  {/* AI Predictive Engine Section */}
                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Traffic Forecast */}
                     <div className="col-span-1 p-6 bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 rounded-2xl shadow-xl relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute -top-10 -right-10 p-4 opacity-10">
                           <Activity size={180} className="text-indigo-300" />
                        </div>
                        <div className="relative z-10">
                           <div className="flex items-center space-x-2 text-indigo-300 mb-2">
                             <Bot size={16} />
                             <span className="text-xs font-bold tracking-wider uppercase">Predictive ML Engine</span>
                           </div>
                           <h4 className="text-white text-xl font-bold mb-1">Traffic Forecast (30 Days)</h4>
                           <p className="text-indigo-200 text-sm mb-6">Based on linear regression of your timeline data, our model projects continued traffic.</p>
                           
                           <div className="flex items-end space-x-4">
                              <div>
                                <span className="text-4xl font-black text-white">
                                  {mlForecast.length > 0 ? mlForecast[mlForecast.length - 1].clicks : (analytics.total_clicks || 0) + 1420}
                                </span>
                                <span className="text-indigo-300 text-sm ml-2 block mt-1">Projected Total Visitors</span>
                              </div>
                              <div className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded-md mb-8 flex items-center">
                                Model Confidence: {mlInsights.confidence_score}%
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Smart Recommendations */}
                     <div className="col-span-1 lg:col-span-2 p-6 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col justify-between">
                        <div className="flex items-center space-x-2 text-[#8B5CF6] mb-4">
                          <Activity size={20} />
                          <h4 className="font-bold text-gray-900 text-lg">AI Smart Recommendations</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                             <div className="flex items-center mb-2">
                               <div className="bg-green-100 p-1.5 rounded-full mr-2"><Calendar size={14} className="text-green-600" /></div>
                               <h5 className="font-bold text-gray-800 text-sm">Best Posting Time</h5>
                             </div>
                             <p className="text-xs text-gray-500">ML analysis indicates your audience is most active around <strong>{mlInsights.best_posting_time || '6 PM - 8 PM EST'}</strong>. Schedule campaigns then for optimal CTR.</p>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                             <div className="flex items-center mb-2">
                               <div className="bg-blue-100 p-1.5 rounded-full mr-2"><Activity size={14} className="text-blue-600" /></div>
                               <h5 className="font-bold text-gray-800 text-sm">High-Conversion Alert</h5>
                             </div>
                             <p className="text-xs text-gray-500">Traffic from <strong>{selectedReferrer ? selectedReferrer.name : 'Direct'}</strong> sources converts higher. Prioritize optimizing these landing pages.</p>
                          </div>
                        </div>
                        
                        {/* NLP Summary */}
                        <div className="bg-[#8B5CF6]/5 rounded-xl p-4 border border-[#8B5CF6]/10 flex items-start">
                          <Bot size={20} className="text-[#8B5CF6] mr-3 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700 leading-relaxed">
                            <strong>NLP Summary:</strong> {aiSummary || "Your links are establishing a baseline. Our clustering algorithms are gathering behavior data to identify your primary audience segments."}
                          </p>
                        </div>
                     </div>
                  </div>
                  
                </div>
              )}

              {activeTab === 'qrcode' && (
                <div className="flex flex-col md:flex-row gap-8 py-6">
                  {/* Left Side - Options */}
                  <div className="w-full md:w-1/2 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">QR Code Design</h3>
                      <p className="text-gray-500 text-sm">Customize how your profile QR code looks before downloading it for your business cards, flyers, or merchandise.</p>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                      <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Select Theme</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'classic', name: 'Classic', fgColor: '#000000', bgColor: '#ffffff', wrapperStyle: { background: '#ffffff' } },
                          { id: 'brand', name: 'Brand Indigo', fgColor: '#4F46E5', bgColor: '#ffffff', wrapperStyle: { background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' } },
                          { id: 'neon', name: 'Neon Dark', fgColor: '#EC4899', bgColor: '#111827', wrapperStyle: { background: 'linear-gradient(135deg, #111827 0%, #374151 100%)' } },
                          { id: 'ocean', name: 'Ocean', fgColor: '#0284C7', bgColor: '#ffffff', wrapperStyle: { background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)' } },
                          { id: 'emerald', name: 'Emerald', fgColor: '#047857', bgColor: '#ffffff', wrapperStyle: { background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' } },
                          { id: 'sunset', name: 'Sunset', fgColor: '#EA580C', bgColor: '#ffffff', wrapperStyle: { background: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)' } },
                          { id: 'purple', name: 'Purple Dream', fgColor: '#ffffff', bgColor: '#7e22ce', wrapperStyle: { background: 'linear-gradient(135deg, #d8b4fe 0%, #a855f7 100%)' } }
                        ].map(design => (
                          <button
                            key={design.id}
                            onClick={() => setQrDesign(design)}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${qrDesign.id === design.id ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-gray-200 hover:border-indigo-300 bg-white'}`}
                          >
                            <div className="w-6 h-6 rounded-full border shadow-sm" style={design.wrapperStyle}></div>
                            <span className="text-sm font-semibold text-gray-700">{design.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Preview */}
                  <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-50 rounded-3xl p-8 border border-gray-200">
                    <div id="qr-code-wrapper" className="p-10 rounded-3xl shadow-xl transition-all duration-300 relative group flex flex-col items-center justify-center" style={{ ...(qrDesign.wrapperStyle || { background: qrDesign.bgColor }) }}>
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm mb-4">
                        <QRCodeSVG 
                          value={`${window.location.origin}/${user?.username}`}
                          size={200}
                          bgColor={"transparent"}
                          fgColor={qrDesign.fgColor}
                          level={"Q"}
                          includeMargin={false}
                          imageSettings={{
                            src: profileData.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                            x: undefined,
                            y: undefined,
                            height: 40,
                            width: 40,
                            excavate: true,
                          }}
                        />
                      </div>
                      <div className={`font-bold text-center tracking-tight text-lg mt-2 ${qrDesign.bgColor === '#ffffff' ? 'text-gray-800' : 'text-white'}`}>
                        @{user?.username || 'user'}
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-8 w-full justify-center">
                      <button 
                        onClick={async () => {
                          const wrapper = document.getElementById('qr-code-wrapper');
                          if (!wrapper) return;
                          
                          try {
                            const canvas = await html2canvas(wrapper, {
                              scale: 3,
                              backgroundColor: null,
                              logging: false
                            });
                            
                            const imgURI = canvas.toDataURL('image/png');
                            const a = document.createElement('a');
                            a.setAttribute('download', `smartlink-qr-${user?.username || 'profile'}.png`);
                            a.setAttribute('href', imgURI);
                            a.click();
                          } catch (err) {
                            console.error('Error generating QR image', err);
                          }
                        }}
                        className="flex-1 max-w-[200px] bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md flex justify-center items-center gap-2"
                      >
                        <Download size={18} /> Download High-Res
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'monetize' && (
                <div className="space-y-8">
                  {/* Premium Hero Banner */}
                  <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                     <div className="absolute bottom-0 left-0 w-40 h-40 bg-fuchsia-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                     <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                       <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="bg-white/20 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full border border-white/20">✨ AI-Powered</span>
                            <span className="bg-emerald-400/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">Gemini + OpenAI</span>
                          </div>
                          <h3 className="text-3xl font-black mb-2 tracking-tight">Product Studio</h3>
                          <p className="text-white/70 max-w-md font-medium">Create, sell, and monetize digital products with AI-powered idea generation and premium storefronts.</p>
                       </div>
                       <div className="flex gap-3">
                          <button onClick={async () => {
                            try {
                              const res = await axios.post('/api/ai/product-ideas', { category: 'general', niche: 'tech', price_range: 'medium' });
                              if (res.data.success && res.data.ideas) {
                                const modal = document.getElementById('ai-ideas-modal');
                                if (modal) { modal.dataset.ideas = JSON.stringify(res.data); modal.style.display = 'flex'; }
                              }
                            } catch(err) { console.error(err); }
                          }} className="bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition shadow-lg flex items-center gap-2 group">
                             <Bot size={18} className="group-hover:animate-spin" /> Generate Ideas with AI
                          </button>
                       </div>
                     </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
                      <div className="text-3xl font-black text-gray-900 mb-1">{products.length}</div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Products</div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
                      <div className="text-3xl font-black text-emerald-600 mb-1">₹{products.reduce((s,p) => s + (Number(p.price)||0), 0).toLocaleString()}</div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Value</div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
                      <div className="text-3xl font-black text-purple-600 mb-1">{profileData.tip_jar_enabled ? '🟢' : '⚪'}</div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tip Jar</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Tip Jar Settings */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                             <DollarSign size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-gray-900">Tip Jar</h4>
                            <p className="text-xs text-gray-400">Let fans support you</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={profileData.tip_jar_enabled} onChange={(e) => setProfileData({...profileData, tip_jar_enabled: e.target.checked})} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Support Message</label>
                          <textarea rows="2" placeholder="e.g. If you enjoy my content, buy me a coffee!" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none text-sm" value={profileData.tip_jar_message || ''} onChange={(e) => setProfileData({...profileData, tip_jar_message: e.target.value})}></textarea>
                        </div>
                        <button onClick={handleUpdateProfile} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                          <Save size={16} /> Save Settings
                        </button>
                      </div>
                    </div>

                    {/* Add Product Form */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
                           <ShoppingBag size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-gray-900">Add Product</h4>
                          <p className="text-xs text-gray-400">Create a new listing</p>
                        </div>
                      </div>
                      <form className="space-y-3" onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const data = { name: formData.get('name'), price: formData.get('price'), description: formData.get('description'), file_url: formData.get('file_url'), image_url: formData.get('image_url') };
                        const btn = e.target.querySelector('button[type="submit"]');
                        btn.disabled = true;
                        btn.textContent = 'Adding...';
                        try {
                          await axios.post('/api/products', data);
                          e.target.reset();
                          setUpdateMsg('Product added successfully!');
                          setTimeout(() => setUpdateMsg(''), 3000);
                          await fetchProducts();
                        } catch (err) { alert(err.response?.data?.message || 'Failed to add'); }
                        finally { btn.disabled = false; btn.textContent = '🚀 Create Product'; }
                      }}>
                        <input type="text" name="name" required placeholder="Product Name" className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm" />
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                            <input type="number" step="0.01" min="0" name="price" required placeholder="Price" className="w-full pl-9 pr-3 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm" />
                          </div>
                          <input type="text" name="file_url" placeholder="Download URL" className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm" />
                        </div>
                        <textarea name="description" rows="2" placeholder="Brief description..." className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none resize-none text-sm"></textarea>
                        <input type="url" name="image_url" placeholder="Product Image URL" className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm" />
                        <button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg transition-all">🚀 Create Product</button>
                      </form>
                    </div>
                  </div>

                  {/* Product Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                        <Store size={22} className="text-purple-500" /> Your Products
                      </h4>
                      <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">{products.length} items</span>
                    </div>
                    {products.length === 0 ? (
                      <div className="bg-gradient-to-br from-gray-50 to-purple-50 border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center">
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"><ShoppingBag size={36} className="text-purple-400" /></div>
                        <p className="text-gray-600 font-semibold text-lg mb-1">No products yet</p>
                        <p className="text-gray-400 text-sm">Create your first digital product above or use AI to generate ideas!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map(p => (
                          <div key={p.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer" onClick={() => p.file_url && window.open(p.file_url, '_blank')}>
                            <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden">
                              {p.image_url ? (
                                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={40} className="text-purple-300" /></div>
                              )}
                              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full font-bold text-sm shadow-md">₹{Number(p.price).toLocaleString()}</div>
                            </div>
                            <div className="p-4">
                              <h5 className="font-bold text-gray-900 mb-1 truncate">{p.name}</h5>
                              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{p.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-purple-600 font-semibold">Click to view →</span>
                                <button onClick={async (e) => { e.stopPropagation(); await axios.delete(`/api/products/${p.id}`); fetchProducts(); }} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'audience' && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-white flex justify-between items-center">
                     <div>
                        <h3 className="text-2xl font-bold mb-2">Audience Manager</h3>
                        <p className="text-white/80 max-w-md">Collect emails and phone numbers to own your audience and reach them instantly.</p>
                     </div>
                     <button className="bg-white text-teal-600 px-6 py-3 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg">Export CSV</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                        <div className="text-4xl font-black text-gray-900 mb-1">0</div>
                        <div className="text-sm font-medium text-gray-500">Total Subscribers</div>
                     </div>
                     <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                        <div className="text-4xl font-black text-gray-900 mb-1">0%</div>
                        <div className="text-sm font-medium text-gray-500">Conversion Rate</div>
                     </div>
                     <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                        <div className="text-4xl font-black text-gray-900 mb-1">0</div>
                        <div className="text-sm font-medium text-gray-500">Emails Sent</div>
                     </div>
                  </div>

                  <div className="border border-gray-200 rounded-2xl p-8 text-center bg-gray-50 flex flex-col items-center">
                    <Mail size={48} className="text-gray-300 mb-4" />
                    <h4 className="text-lg font-bold text-gray-900 mb-2">No subscribers yet</h4>
                    <p className="text-gray-500 max-w-sm mb-6">Add an Email Collection block to your profile to start capturing your audience.</p>
                    <button className="bg-teal-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-teal-700 transition">Add Email Block</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
