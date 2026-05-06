import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2, ExternalLink, BarChart2, Save, User as UserIcon, Palette, Youtube, Instagram, Twitter, Music, Mail, MapPin, Globe, CheckCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import templatesData from '../data/templateData';

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [links, setLinks] = useState([]);
  const [analytics, setAnalytics] = useState({ total_clicks: 0, link_stats: [] });
  const [newLink, setNewLink] = useState({ title: '', url: '', type: 'website' });
  const [activeTab, setActiveTab] = useState('links'); // 'links', 'profile', 'templates', 'analytics'
  const [loading, setLoading] = useState(true);
  
  const [profileData, setProfileData] = useState({ full_name: '', bio: '', avatar: '', theme_config: 'light', contact_email: '', location: '', twitter: '', instagram: '', youtube: '', tiktok: '' });
  const [updateMsg, setUpdateMsg] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      let parsedTheme = 'light';
      let parsedEmail = '';
      let parsedLocation = '';
      let parsedTwitter = '';
      let parsedInstagram = '';
      let parsedYoutube = '';
      let parsedTiktok = '';
      try {
        const config = JSON.parse(user.theme_config);
        parsedTheme = config.theme || 'light';
        parsedEmail = config.contact_email || '';
        parsedLocation = config.location || '';
        parsedTwitter = config.twitter || '';
        parsedInstagram = config.instagram || '';
        parsedYoutube = config.youtube || '';
        parsedTiktok = config.tiktok || '';
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
        tiktok: parsedTiktok
      });
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [linksRes, analyticsRes] = await Promise.all([
        axios.get('/api/links'),
        axios.get('/api/analytics')
      ]);
      setLinks(linksRes.data);
      setAnalytics(analyticsRes.data);
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
          tiktok: profileData.tiktok
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
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {updateMsg && (
        <div className="fixed top-20 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {updateMsg}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar / Profile Preview */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <h3 className="font-bold text-gray-400 tracking-widest text-sm mb-4 uppercase">Live Preview</h3>
          <div className="w-full max-w-[300px] aspect-[9/19] rounded-[40px] border-[8px] border-gray-900 overflow-hidden relative shadow-2xl bg-black">
            {selectedTemplate.bgImage && (
              <img src={selectedTemplate.bgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            )}
            <div className={`absolute inset-0 ${selectedTemplate.bgOverlay}`}></div>

            <div className="relative z-10 w-full h-full px-4 py-8 flex flex-col items-center overflow-y-auto scrollbar-hide">
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
                <p className={`text-center mt-1 mb-5 font-medium text-[12px] max-w-sm leading-relaxed ${bioColor}`}>{profileData.bio}</p>
              ) : (
                <div className="h-4 mb-5"></div>
              )}

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
                      className={`w-full flex items-center justify-center py-3 px-4 rounded-[24px] font-bold text-[13px] shadow-sm transition-transform hover:scale-[1.02] ${btnClass}`}
                    >
                      <Icon size={16} className="mr-2" />
                      <span className="truncate">{link.title}</span>
                    </a>
                  )
                })}
              </div>

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
            <div className="flex border-b border-gray-100 overflow-x-auto">
              <button 
                className={`flex-1 min-w-[100px] py-4 font-medium text-sm text-center ${activeTab === 'links' ? 'text-primary border-b-2 border-primary bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('links')}
              >
                Links
              </button>
              <button 
                className={`flex-1 min-w-[100px] py-4 font-medium text-sm text-center ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button 
                className={`flex-1 min-w-[100px] py-4 font-medium text-sm text-center ${activeTab === 'templates' ? 'text-primary border-b-2 border-primary bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('templates')}
              >
                Templates
              </button>
              <button 
                className={`flex-1 min-w-[100px] py-4 font-medium text-sm text-center ${activeTab === 'analytics' ? 'text-primary border-b-2 border-primary bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'links' && (
                <div>
                  <form onSubmit={handleAddLink} className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4">Add New Link</h3>
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Title (e.g. My Website)" 
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                        value={newLink.title}
                        onChange={e => setNewLink({...newLink, title: e.target.value})}
                      />
                      <input 
                        type="url" 
                        placeholder="URL (e.g. https://example.com)" 
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                        value={newLink.url}
                        onChange={e => setNewLink({...newLink, url: e.target.value})}
                      />
                      <select
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary bg-white text-gray-700"
                        value={newLink.type}
                        onChange={e => setNewLink({...newLink, type: e.target.value})}
                      >
                        <option value="website">🌐 Standard Website</option>
                        <option value="youtube">📺 YouTube Video</option>
                        <option value="instagram">📸 Instagram Profile</option>
                        <option value="twitter">🐦 Twitter / X</option>
                        <option value="linkedin">💼 LinkedIn</option>
                        <option value="github">💻 GitHub</option>
                        <option value="tiktok">🎵 TikTok</option>
                      </select>
                      <button type="submit" className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-medium transition-colors">
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
                      links.map(link => (
                        <div key={link.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all group">
                          <div className="flex-1 overflow-hidden pr-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-indigo-50 px-2 py-1 rounded">{link.type || 'website'}</span>
                              <h4 className="font-medium text-gray-900 truncate">{link.title}</h4>
                            </div>
                            <a href={link.url} target="_blank" rel="noreferrer" className="text-sm text-gray-500 truncate hover:text-primary block mt-1">
                              {link.url}
                            </a>
                          </div>
                          <button 
                            onClick={() => handleDeleteLink(link.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))
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
                  <div className="flex items-center mb-6">
                    <Palette className="text-primary mr-3" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">Choose a Template</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templatesData.map(template => (
                      <div 
                        key={template.id}
                        onClick={() => handleThemeSelect(template.id.toString())}
                        className={`cursor-pointer rounded-[30px] overflow-hidden transition-all relative aspect-[9/16] ${profileData.theme_config === template.id.toString() ? 'ring-4 ring-indigo-500 shadow-xl scale-[1.02]' : 'ring-1 ring-gray-200 hover:ring-indigo-300 hover:shadow-lg'}`}
                      >
                        {template.bgImage && (
                          <img src={template.bgImage} alt={template.name} className="absolute inset-0 w-full h-full object-cover" />
                        )}
                        <div className={`absolute inset-0 ${template.bgOverlay}`}></div>
                        
                        <div className="absolute inset-0 p-4 flex flex-col items-center justify-center z-10 pointer-events-none">
                           <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-md mb-2 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-pink-500">
                             {profileData.avatar ? (
                               <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                             ) : (
                               <span className="text-white text-2xl font-bold">{(user?.username || 'U').charAt(0).toUpperCase()}</span>
                             )}
                           </div>
                           <h4 className={`font-bold text-lg mb-1 text-center tracking-tight ${template.textClass}`}>{profileData.full_name || `@${user?.username}`}</h4>
                           <p className={`text-[10px] text-center font-bold opacity-90 mb-3 max-w-[90%] line-clamp-2 ${template.textClass}`}>{profileData.bio || 'Your bio will appear here'}</p>
                           
                           <div className="w-full flex flex-col gap-2 px-2">
                             {template.buttons.slice(0, 3).map((btn, i) => (
                               <div key={i} className={`w-full py-2.5 px-3 rounded-[20px] font-bold text-[10px] text-center shadow-sm ${template.btnClass}`}>
                                 {btn}
                               </div>
                             ))}
                           </div>
                        </div>

                        {profileData.theme_config === template.id.toString() && (
                          <div className="absolute top-4 right-4 bg-indigo-600 text-white rounded-full p-1.5 z-20 shadow-md">
                            <Save size={16} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div>
                  <div className="mb-8 p-6 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl shadow-md">
                    <p className="opacity-80 text-sm font-medium mb-1">Total Lifetime Clicks</p>
                    <h2 className="text-4xl font-bold flex items-center">
                      <BarChart2 className="mr-3" size={32} />
                      {analytics.total_clicks}
                    </h2>
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 mb-4">Clicks per Link</h3>
                  <div className="space-y-3">
                    {analytics.link_stats.length === 0 ? (
                      <p className="text-gray-500 text-sm">No click data available yet.</p>
                    ) : (
                      analytics.link_stats.map(stat => (
                        <div key={stat.link_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex-1 truncate pr-4">
                            <h4 className="font-medium text-gray-900 truncate">{stat.title}</h4>
                          </div>
                          <div className="bg-indigo-100 text-primary px-4 py-1.5 rounded-full font-bold text-sm">
                            {stat.clicks} clicks
                          </div>
                        </div>
                      ))
                    )}
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
