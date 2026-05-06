import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MoreHorizontal, Share, CheckCircle, Mail, MapPin, Youtube, Instagram, Twitter, Linkedin, Github, Globe, Music } from 'lucide-react';
import templatesData from '../data/templateData';

const PublicProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleLinkClick = (linkId, url) => {
    axios.post(`/api/links/${linkId}/click`).catch(e => console.error(e));
    window.open(url, '_blank');
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
      default: return <Globe size={20} className="mr-3" />;
    }
  };

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
            
            {(contactEmail || location) && (
              <div className="border-t border-gray-100">
                {contactEmail && (
                  <a 
                    href={`mailto:${contactEmail}`} 
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Mail size={16} className="mr-3 text-gray-500" />
                    Contact Me
                  </a>
                )}
                {location && (
                  <div className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <MapPin size={16} className="mr-3 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{location}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="max-w-[680px] w-full mx-auto flex flex-col items-center flex-grow mt-8 z-20 relative">
        {profile.avatar ? (
          <img 
            src={profile.avatar} 
            alt={profile.username} 
            className="w-[96px] h-[96px] rounded-full object-cover mb-4 shadow-md border-2 border-white/20" 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className="w-[96px] h-[96px] bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full items-center justify-center text-white text-4xl font-bold mb-4 shadow-md border-2 border-white/20"
          style={{ display: profile.avatar ? 'none' : 'flex' }}
        >
          {profile.username.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex items-center justify-center gap-1 mb-1">
          <h1 className={`text-[22px] font-bold tracking-tight ${textColor}`}>{profile.full_name || `@${profile.username}`}</h1>
          <CheckCircle size={18} className="text-blue-500 fill-blue-500/10" />
        </div>
        
        {profile.bio ? (
          <p className={`text-center mt-2 mb-6 font-medium text-[15px] max-w-sm leading-relaxed ${bioColor}`}>{profile.bio}</p>
        ) : (
          <div className="h-6 mb-6"></div>
        )}

        {/* Social / Info bar removed - moved to 3 dots menu */}

        <div className="w-full space-y-4 px-2">
          {profile.links.map(link => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id, link.url)}
              className={`w-full flex items-center justify-center hover:scale-[1.02] transform transition-all duration-200 py-[18px] px-6 rounded-[30px] font-semibold text-[15px] ${btnClass}`}
            >
              {getLinkIcon(link.type)}
              {link.title}
            </button>
          ))}
          {profile.links.length === 0 && (
            <p className={`text-center py-10 font-medium ${bioColor}`}>This user hasn't added any links yet.</p>
          )}
        </div>
        
        {/* Bottom Social Icons */}
        {(twitter || instagram || youtube || tiktok) && (
          <div className={`flex gap-6 mt-12 mb-4 ${socialClass}`}>
            {youtube && (
              <a href={youtube} target="_blank" rel="noreferrer" className="opacity-90 hover:opacity-100 hover:scale-110 transition-all">
                <Youtube size={26} />
              </a>
            )}
            {instagram && (
              <a href={instagram} target="_blank" rel="noreferrer" className="opacity-90 hover:opacity-100 hover:scale-110 transition-all">
                <Instagram size={26} />
              </a>
            )}
            {twitter && (
              <a href={twitter} target="_blank" rel="noreferrer" className="opacity-90 hover:opacity-100 hover:scale-110 transition-all">
                <Twitter size={26} />
              </a>
            )}
            {tiktok && (
              <a href={tiktok} target="_blank" rel="noreferrer" className="opacity-90 hover:opacity-100 hover:scale-110 transition-all">
                <Music size={26} />
              </a>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-12 pb-8 text-center flex-shrink-0 z-20 relative">
        <a href="/" className={`inline-flex items-center text-[22px] font-black tracking-tighter ${footerColor}`}>
          Ai Appsec lab<span className="ml-[2px] mt-1">*</span>
        </a>
      </div>
    </div>
  );
};

export default PublicProfile;
