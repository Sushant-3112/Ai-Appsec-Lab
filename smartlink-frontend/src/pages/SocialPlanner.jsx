import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Clock, Instagram, Youtube, Twitter, TrendingUp, Zap, Plus, Edit2, Trash2, CheckCircle, AlertCircle, BarChart3, Sparkles, Image as ImageIcon, Video, FileText, Send } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const SocialPlanner = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [generatingIdeas, setGeneratingIdeas] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  
  const [newPost, setNewPost] = useState({
    platform: 'instagram',
    content: '',
    scheduledTime: '',
    mediaType: 'image',
    caption: '',
    hashtags: ''
  });

  useEffect(() => {
    if (user) {
      fetchScheduledPosts();
      fetchAnalytics();
      generateAISuggestions();
    }
  }, [user]);

  const fetchScheduledPosts = async () => {
    // Mock data for demo
    setPosts([
      {
        id: 1,
        platform: 'instagram',
        content: 'Check out my latest project! 🚀',
        scheduledTime: '2026-05-08T10:00:00',
        status: 'scheduled',
        mediaType: 'image'
      },
      {
        id: 2,
        platform: 'youtube',
        content: 'New tutorial video coming soon!',
        scheduledTime: '2026-05-08T14:00:00',
        status: 'scheduled',
        mediaType: 'video'
      },
      {
        id: 3,
        platform: 'twitter',
        content: 'Just launched my new link in bio! Check it out 🔗',
        scheduledTime: '2026-05-08T18:00:00',
        status: 'scheduled',
        mediaType: 'text'
      }
    ]);
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/analytics/predict');
      setAnalytics(response.data);
    } catch (err) {
      console.error('Error fetching analytics', err);
    }
  };

  const generateAISuggestions = async () => {
    try {
      const response = await axios.get('/api/ai/suggestions?niche=tech');
      // Map string icons to components
      const iconMap = {
        'Clock': Clock,
        'TrendingUp': TrendingUp,
        'Sparkles': Sparkles,
        'Zap': Zap
      };
      
      const suggestions = response.data.map(s => ({
        ...s,
        icon: iconMap[s.icon] || Sparkles
      }));
      
      setAiSuggestions(suggestions);
    } catch (err) {
      console.error('Error fetching AI suggestions:', err);
    }
  };

  const handleGenerateIdeas = async (type = 'post_ideas') => {
    setGeneratingIdeas(true);
    try {
      const response = await axios.post('/api/ai/generate-ideas', {
        type: type,
        niche: 'tech',
        platform: 'instagram',
        context: ''
      });

      if (response.data.success) {
        setGeneratedContent(response.data);
        setShowContentModal(true);
      }
    } catch (err) {
      console.error('Error generating ideas:', err);
    } finally {
      setGeneratingIdeas(false);
    }
  };

  const handleGenerateCaption = async () => {
    setGeneratingIdeas(true);
    try {
      const response = await axios.post('/api/ai/generate-ideas', {
        type: 'caption',
        niche: 'tech',
        platform: newPost.platform,
        context: newPost.content
      });

      if (response.data.success && response.data.ideas.length > 0) {
        // Use first generated caption
        setNewPost({...newPost, content: response.data.ideas[0].caption});
      }
    } catch (err) {
      console.error('Error generating caption:', err);
    } finally {
      setGeneratingIdeas(false);
    }
  };

  const handleGenerateHashtags = async () => {
    setGeneratingIdeas(true);
    try {
      const response = await axios.post('/api/ai/generate-ideas', {
        type: 'hashtags',
        niche: 'tech',
        platform: newPost.platform,
        context: newPost.content
      });

      if (response.data.success && response.data.ideas) {
        const allHashtags = [
          ...(response.data.ideas.high_reach || []).slice(0, 2),
          ...(response.data.ideas.medium_reach || []).slice(0, 2),
          ...(response.data.ideas.trending || []).slice(0, 1)
        ];
        setNewPost({...newPost, hashtags: allHashtags.join(' ')});
      }
    } catch (err) {
      console.error('Error generating hashtags:', err);
    } finally {
      setGeneratingIdeas(false);
    }
  };

  const handleSchedulePost = () => {
    const post = {
      id: Date.now(),
      ...newPost,
      mediaUrl: mediaPreview,
      status: 'scheduled'
    };
    setPosts([...posts, post]);
    setShowNewPost(false);
    setMediaFile(null);
    setMediaPreview(null);
    setNewPost({
      platform: 'instagram',
      content: '',
      scheduledTime: '',
      mediaType: 'image',
      caption: '',
      hashtags: ''
    });
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const getPlatformIcon = (platform) => {
    switch(platform) {
      case 'instagram': return Instagram;
      case 'youtube': return Youtube;
      case 'twitter': return Twitter;
      default: return Instagram;
    }
  };

  const getPlatformColor = (platform) => {
    switch(platform) {
      case 'instagram': return 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500';
      case 'youtube': return 'bg-red-600';
      case 'twitter': return 'bg-blue-400';
      default: return 'bg-gray-500';
    }
  };

  const getMediaIcon = (type) => {
    switch(type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'text': return FileText;
      default: return ImageIcon;
    }
  };

  if (authLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-48 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Welcome to Plann by SmartLink
          </h1>
          <p className="text-gray-600 text-lg">Your all-in-one tool to schedule, automate and grow on social media.</p>
          <button 
            onClick={() => setShowNewPost(true)}
            className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <Plus size={20} />
            Start Planning Today
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Powerful, efficient scheduling */}
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                  <Youtube size={24} className="text-red-600" />
                </div>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                  <Instagram size={24} className="text-pink-600" />
                </div>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                  <Twitter size={24} className="text-blue-400" />
                </div>
              </div>
              <div className="flex-1 bg-white rounded-2xl p-4 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">📅 May schedule</span>
                  <span className="text-xs text-gray-400">100%</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(28)].map((_, i) => (
                    <div key={i} className={`w-4 h-4 rounded ${i % 3 === 0 ? 'bg-indigo-400' : i % 2 === 0 ? 'bg-purple-300' : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Powerful, efficient scheduling</h3>
            <p className="text-gray-700 mb-6">Crosspost on every platform in seconds, so you can focus on what's next.</p>
            <button 
              onClick={() => setShowNewPost(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-all"
            >
              Schedule a post
            </button>
          </div>

          {/* Sync your Instagram */}
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Instagram size={16} className="text-pink-600" />
                    <span className="text-xs font-semibold">@{user?.username}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full" />
                    <span className="text-xs font-bold">Link posted!</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className={`aspect-square rounded-lg ${i === 5 ? 'bg-orange-400' : 'bg-gradient-to-br from-blue-200 to-purple-200'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-32 h-32 bg-white rounded-2xl shadow-md overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Sync your Instagram to your link in bio</h3>
            <p className="text-gray-700 mb-6">Every time a post lands in your grid, the linked version appears on your Linktree.</p>
            <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-all">
              Get synced up
            </button>
          </div>

          {/* Schedule on the go */}
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-white rounded-xl shadow-md overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/planner${i}/200/200`}
                      alt={`Post ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="w-40 bg-white rounded-2xl p-3 shadow-md">
                <div className="text-xs font-semibold mb-2">May 2026</div>
                <div className="grid grid-cols-7 gap-1 text-[8px] text-center mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-gray-500">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(31)].map((_, i) => (
                    <div key={i} className={`text-[8px] text-center py-1 rounded ${i === 7 ? 'bg-indigo-500 text-white' : 'text-gray-700'}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Schedule on the go with the mobile app!</h3>
            <p className="text-gray-700 mb-6">Plan your content calendar anywhere, anytime with our mobile apps.</p>
            <div className="flex gap-3">
              <button className="bg-black text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-gray-800 transition-all">
                <span>🍎</span> App Store
              </button>
              <button className="bg-black text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-gray-800 transition-all">
                <span>▶️</span> Google Play
              </button>
            </div>
          </div>

          {/* AI Content Ideas */}
          <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 bg-white rounded-2xl p-4 shadow-md">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-900 mb-1">Brand new ideas? Say less.</div>
                      <div className="text-[10px] text-gray-600">Get AI-generated caption and hashtag ideas</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 size={16} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-900 mb-1">Your personal post ideas for this week</div>
                      <div className="text-[10px] text-gray-600">Based on trending topics in your niche</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ImageIcon size={16} className="text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-900 mb-1">Start with an image</div>
                      <div className="text-[10px] text-gray-600">Upload and let AI suggest captions</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-32 h-32 bg-white rounded-2xl shadow-md overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <Sparkles size={48} className="text-teal-500 mx-auto mb-2" />
                  <div className="text-xs font-bold text-gray-900">AI Ready</div>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Need post or caption ideas? We've got you.</h3>
            <p className="text-gray-700 mb-6">Doing it yourself is hard work. Stick to the fun part and let AI handle the legwork.</p>
            <button 
              onClick={() => handleGenerateIdeas('post_ideas')}
              disabled={generatingIdeas}
              className="bg-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {generatingIdeas ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Ideas
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="text-purple-600" />
            AI-Powered Suggestions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiSuggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100">
                  <div className={`w-12 h-12 ${suggestion.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{suggestion.title}</h3>
                  <p className="text-sm text-gray-600">{suggestion.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scheduled Posts */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="text-indigo-600" />
              Your Scheduled Posts
            </h2>
            <button 
              onClick={() => setShowNewPost(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              New Post
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No posts scheduled yet</p>
              <button 
                onClick={() => setShowNewPost(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all"
              >
                Schedule Your First Post
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => {
                const PlatformIcon = getPlatformIcon(post.platform);
                const MediaIcon = getMediaIcon(post.mediaType);
                return (
                  <div 
                    key={post.id} 
                    onClick={() => setViewingPost(post)}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all cursor-pointer group"
                  >
                    <div className={`w-12 h-12 ${getPlatformColor(post.platform)} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                      <PlatformIcon size={24} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MediaIcon size={14} className="text-gray-500" />
                        <span className="font-bold text-gray-900 truncate block">{post.content}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 font-semibold">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(post.scheduledTime).toLocaleString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle size={14} className="text-green-500" />
                          <span className="uppercase tracking-wider text-[10px]">{post.status}</span>
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post.id);
                      }}
                      className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* New Post Modal */}
        {showNewPost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Schedule New Post</h3>
                <button 
                  onClick={() => setShowNewPost(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Platform</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['instagram', 'youtube', 'twitter'].map((platform) => {
                      const Icon = getPlatformIcon(platform);
                      return (
                        <button
                          key={platform}
                          onClick={() => setNewPost({...newPost, platform})}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            newPost.platform === platform 
                              ? 'border-indigo-600 bg-indigo-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon size={24} className="mx-auto mb-2" />
                          <span className="text-sm font-semibold capitalize">{platform}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Content</label>
                    <button
                      type="button"
                      onClick={handleGenerateCaption}
                      disabled={generatingIdeas}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 disabled:opacity-50"
                    >
                      <Sparkles size={14} />
                      {generatingIdeas ? 'Generating...' : 'AI Generate'}
                    </button>
                  </div>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="What's on your mind?"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    rows="4"
                  />
                </div>

                {/* Media Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Media Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { type: 'image', icon: ImageIcon, label: 'Image' },
                      { type: 'video', icon: Video, label: 'Video' },
                      { type: 'text', icon: FileText, label: 'Text Only' }
                    ].map(({ type, icon: Icon, label }) => (
                      <button
                        key={type}
                        onClick={() => {
                          setNewPost({...newPost, mediaType: type});
                          setMediaFile(null);
                          setMediaPreview(null);
                        }}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          newPost.mediaType === type 
                            ? 'border-indigo-600 bg-indigo-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon size={20} className="mx-auto mb-1" />
                        <span className="text-xs font-semibold">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Media Upload */}
                {newPost.mediaType !== 'text' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Upload {newPost.mediaType === 'image' ? 'Photo' : 'Video'}
                    </label>
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-indigo-500 transition-all cursor-pointer bg-gray-50 group"
                      onClick={() => document.getElementById('media-upload').click()}
                    >
                      {mediaPreview ? (
                        <div className="relative inline-block w-full">
                          {newPost.mediaType === 'image' ? (
                            <img src={mediaPreview} alt="Preview" className="max-h-60 rounded-xl mx-auto shadow-md" />
                          ) : (
                            <video src={mediaPreview} className="max-h-60 rounded-xl mx-auto shadow-md" controls />
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setMediaFile(null);
                              setMediaPreview(null);
                            }}
                            className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3 py-4">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            {newPost.mediaType === 'image' ? (
                              <ImageIcon className="text-indigo-500" size={32} />
                            ) : (
                              <Video className="text-purple-500" size={32} />
                            )}
                          </div>
                          <div>
                            <p className="text-base text-gray-700 font-bold">Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-500">Your {newPost.mediaType} will be scheduled for posting</p>
                          </div>
                          <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                            PNG, JPG, MP4 up to 50MB
                          </div>
                        </div>
                      )}
                      <input 
                        id="media-upload"
                        type="file" 
                        accept={newPost.mediaType === 'image' ? 'image/*' : 'video/*'}
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setMediaFile(file);
                            setMediaPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Schedule Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Schedule Time</label>
                  <input
                    type="datetime-local"
                    value={newPost.scheduledTime}
                    onChange={(e) => setNewPost({...newPost, scheduledTime: e.target.value})}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Hashtags */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Hashtags (optional)</label>
                    <button
                      type="button"
                      onClick={handleGenerateHashtags}
                      disabled={generatingIdeas}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 disabled:opacity-50"
                    >
                      <Sparkles size={14} />
                      {generatingIdeas ? 'Generating...' : 'AI Suggest'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newPost.hashtags}
                    onChange={(e) => setNewPost({...newPost, hashtags: e.target.value})}
                    placeholder="#example #hashtags"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSchedulePost}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Schedule Post
                  </button>
                  <button
                    onClick={() => setShowNewPost(false)}
                    className="px-6 py-4 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Post Modal */}
        {viewingPost && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-[32px] p-8 max-w-2xl w-full shadow-2xl relative animate-in fade-in zoom-in duration-300">
              <button 
                onClick={() => setViewingPost(null)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-900"
              >
                ✕
              </button>
              
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 ${getPlatformColor(viewingPost.platform)} rounded-2xl flex items-center justify-center shadow-lg`}>
                  {React.createElement(getPlatformIcon(viewingPost.platform), { size: 28, className: "text-white" })}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 capitalize">{viewingPost.platform} Post Details</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                    <span className="flex items-center gap-1"><Clock size={14} /> {new Date(viewingPost.scheduledTime).toLocaleString()}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-indigo-600 font-bold uppercase tracking-wider text-[10px]">{viewingPost.status}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {viewingPost.mediaUrl && (
                  <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-black">
                    {viewingPost.mediaType === 'image' ? (
                      <img src={viewingPost.mediaUrl} alt="Post Content" className="w-full max-h-80 object-contain mx-auto" />
                    ) : (
                      <video src={viewingPost.mediaUrl} className="w-full max-h-80" controls />
                    )}
                  </div>
                )}
                
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <p className="text-lg text-gray-800 leading-relaxed font-medium">
                    {viewingPost.content}
                  </p>
                  {viewingPost.hashtags && (
                    <p className="mt-4 text-indigo-600 font-bold tracking-tight">
                      {viewingPost.hashtags}
                    </p>
                  )}
                </div>

                <div className="flex gap-4 pt-2">
                   <button 
                     onClick={() => setViewingPost(null)}
                     className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:shadow-lg transition-all"
                   >
                     Done Viewing
                   </button>
                   <button 
                     onClick={() => {
                       handleDeletePost(viewingPost.id);
                       setViewingPost(null);
                     }}
                     className="px-8 border-2 border-red-100 text-red-500 rounded-2xl font-bold hover:bg-red-50 transition-all"
                   >
                     Delete Post
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      
      {/* AI Content Modal */}
      {showContentModal && generatedContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">AI Generated Ideas</h3>
                  <p className="text-sm text-gray-500 capitalize">{generatedContent.type.replace('_', ' ')} for {generatedContent.platform}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowContentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {generatedContent.type === 'post_ideas' && Array.isArray(generatedContent.ideas) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedContent.ideas.map((idea, index) => (
                    <div key={index} className="border border-gray-200 rounded-2xl p-5 hover:border-teal-500 transition-all group">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">{idea.day}</span>
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-semibold">{idea.format}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">{idea.title}</h4>
                      <p className="text-sm text-gray-600 mb-4">{idea.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <TrendingUp size={12} />
                          Potential: {idea.engagement}
                        </span>
                        <button 
                          onClick={() => {
                            setNewPost({
                              ...newPost,
                              content: idea.description,
                              mediaType: idea.format === 'video' ? 'video' : 'image',
                              platform: generatedContent.platform
                            });
                            setShowContentModal(false);
                            setShowNewPost(true);
                          }}
                          className="text-xs font-bold text-teal-600 hover:text-teal-700 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          Use this idea →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : generatedContent.type === 'caption' && Array.isArray(generatedContent.ideas) ? (
                <div className="space-y-3">
                  {generatedContent.ideas.map((cap, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl border border-transparent hover:border-teal-500 transition-all cursor-pointer"
                      onClick={() => {
                        setNewPost({...newPost, content: cap.caption});
                        setShowContentModal(false);
                        setShowNewPost(true);
                      }}
                    >
                      <p className="text-gray-800 mb-2">{cap.caption}</p>
                      <div className="flex gap-2">
                        <span className="text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full capitalize">{cap.tone}</span>
                        <span className="text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full capitalize">{cap.length}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No ideas found. Please try again.</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowContentModal(false)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SocialPlanner;
