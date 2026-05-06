import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, CheckCircle, Instagram, Twitter, Youtube, Music, Eye } from 'lucide-react';
import templatesData from '../data/templateData';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const TemplateEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = React.useContext(AuthContext);

  const originalTemplate = templatesData.find(t => t.id === parseInt(id));

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatar: '',
    bgImage: '',
    buttons: [],
    socials: { music: true, youtube: true, twitter: true, instagram: true }
  });

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);

  useEffect(() => {
    if (originalTemplate) {
      setFormData({
        name: originalTemplate.name,
        description: originalTemplate.description,
        avatar: originalTemplate.avatar || '',
        bgImage: originalTemplate.bgImage || '',
        buttons: originalTemplate.buttons.map((btn, i) => ({ id: i, label: btn, url: '' })),
        socials: { music: true, youtube: true, twitter: true, instagram: true }
      });
    }
  }, [id]);

  if (!originalTemplate) {
    return (
      <div className="min-h-screen bg-[#f3f3f1] flex items-center justify-center pt-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Template not found</h2>
          <p className="text-gray-500 mb-8">This template doesn't exist or hasn't been created yet.</p>
          <button onClick={() => navigate('/templates')} className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors">
            ← Back to Templates
          </button>
        </div>
      </div>
    );
  }

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Bio is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    if (user) {
      try {
        const payload = {
          full_name: formData.name,
          bio: formData.description,
          avatar: formData.avatar || originalTemplate.avatar,
          theme_config: JSON.stringify({
            theme: originalTemplate.id.toString(),
            twitter: formData.socials.twitter ? 'https://twitter.com' : '',
            instagram: formData.socials.instagram ? 'https://instagram.com' : '',
            youtube: formData.socials.youtube ? 'https://youtube.com' : '',
            tiktok: formData.socials.music ? 'https://tiktok.com' : ''
          })
        };
        await axios.put('/api/profile', payload);

        // Add links
        for (const btn of formData.buttons) {
          if (btn.label && btn.url) {
            await axios.post('/api/links', {
              title: btn.label,
              url: btn.url,
              type: 'website'
            });
          }
        }
        
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          navigate('/dashboard');
        }, 1500);
      } catch (err) {
        console.error('Failed to save to profile', err);
      }
    } else {
      const savedTemplate = {
        ...originalTemplate,
        name: formData.name,
        description: formData.description,
        avatar: formData.avatar || originalTemplate.avatar,
        bgImage: formData.bgImage || originalTemplate.bgImage,
        buttons: formData.buttons.map(b => b.label),
        buttonLinks: formData.buttons.reduce((acc, b) => { acc[b.label] = b.url; return acc; }, {}),
        socials: formData.socials,
      };

      const existing = JSON.parse(localStorage.getItem('smartlink_custom_templates') || '[]');
      const idx = existing.findIndex(t => t.id === savedTemplate.id);
      if (idx > -1) existing[idx] = savedTemplate;
      else existing.push(savedTemplate);
      localStorage.setItem('smartlink_custom_templates', JSON.stringify(existing));

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleButtonChange = (btnId, field, value) => {
    setFormData(prev => ({
      ...prev,
      buttons: prev.buttons.map(b => b.id === btnId ? { ...b, [field]: value } : b)
    }));
  };

  const addButton = () => {
    const newId = formData.buttons.length > 0 ? Math.max(...formData.buttons.map(b => b.id)) + 1 : 0;
    setFormData(prev => ({
      ...prev,
      buttons: [...prev.buttons, { id: newId, label: 'New Link', url: '' }]
    }));
  };

  const removeButton = (btnId) => {
    setFormData(prev => ({
      ...prev,
      buttons: prev.buttons.filter(b => b.id !== btnId)
    }));
  };

  const toggleSocial = (key) => {
    setFormData(prev => ({
      ...prev,
      socials: { ...prev.socials, [key]: !prev.socials[key] }
    }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    if (type === 'avatar') setUploadingAvatar(true);
    else setUploadingBg(true);

    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({
        ...prev,
        [type]: res.data.url
      }));
    } catch (err) {
      console.error(`Error uploading ${type}`, err);
      alert(`Error uploading ${type}. Please try again.`);
    } finally {
      if (type === 'avatar') setUploadingAvatar(false);
      else setUploadingBg(false);
    }
  };

  // ─── Live Preview Component ───
  const LivePreview = ({ className = '' }) => (
    <div className={`relative w-full max-w-[320px] aspect-[9/18.5] rounded-[40px] overflow-hidden shadow-2xl bg-black mx-auto ${className}`}>
      {/* Background */}
      {(formData.bgImage || originalTemplate.bgImage) && (
        <img
          src={formData.bgImage || originalTemplate.bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      <div className={`absolute inset-0 ${originalTemplate.bgOverlay}`}></div>

      {/* Content */}
      <div className="relative z-10 w-full h-full px-6 py-10 flex flex-col items-center">
        {/* Avatar */}
        <div className="mt-2 mb-3 w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-white/20 shadow-md bg-white/10">
          {(formData.avatar || originalTemplate.avatar) ? (
            <img
              src={formData.avatar || originalTemplate.avatar}
              alt={formData.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white/60 text-2xl font-bold">${formData.name?.charAt(0) || '?'}</div>`;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/60 text-2xl font-bold">
              {formData.name?.charAt(0) || '?'}
            </div>
          )}
        </div>

        {/* Name & Bio */}
        <h3 className={`font-bold text-lg mb-1 text-center tracking-tight ${originalTemplate.textClass}`}>
          {formData.name || 'Your Name'}
        </h3>
        <p className={`text-[11px] text-center font-bold opacity-90 mb-6 max-w-[90%] ${originalTemplate.textClass}`}>
          {formData.description || 'Your bio goes here'}
        </p>

        {/* Buttons */}
        <div className="w-full flex-grow flex flex-col gap-3.5 overflow-y-auto">
          {formData.buttons.map((btn) => (
            <button
              key={btn.id}
              className={`w-full py-4 px-4 rounded-[40px] font-bold text-[13px] shadow-sm ${originalTemplate.btnClass}`}
            >
              {btn.label || 'Untitled'}
            </button>
          ))}
          {formData.buttons.length === 0 && (
            <div className="text-center text-white/40 text-xs mt-4">No buttons added yet</div>
          )}
        </div>

        {/* Social Icons */}
        <div className={`flex gap-5 mb-2 mt-4 ${originalTemplate.socialClass}`}>
          {formData.socials.music && <Music size={22} className="opacity-90" />}
          {formData.socials.youtube && <Youtube size={22} className="opacity-90" />}
          {formData.socials.twitter && <Twitter size={22} className="opacity-90" />}
          {formData.socials.instagram && <Instagram size={22} className="opacity-90" />}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f3f1] pt-24 pb-16 font-sans text-[#111827]">
      {/* Success Toast */}
      {saved && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-600 text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle size={20} />
          <span className="font-semibold">Template saved successfully!</span>
        </div>
      )}

      {/* Mobile Preview Overlay */}
      {mobilePreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 lg:hidden" onClick={() => setMobilePreview(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[340px]">
            <LivePreview />
            <button onClick={() => setMobilePreview(false)} className="mt-4 w-full py-3 bg-white rounded-full font-semibold text-gray-900 shadow-lg">
              Close Preview
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/templates')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Templates</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Mobile preview toggle */}
            <button
              onClick={() => setMobilePreview(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Eye size={16} />
              Preview
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Save size={16} />
              Save & Use Template
            </button>
          </div>
        </div>

        {/* Two-Panel Layout */}
        <div className="flex gap-10 items-start">

          {/* ─── LEFT: Live Preview (sticky, desktop only) ─── */}
          <div className="hidden lg:block w-[360px] flex-shrink-0 sticky top-28">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5 text-center">Live Preview</h2>
              <LivePreview />
            </div>
          </div>

          {/* ─── RIGHT: Editor Form ─── */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Form Header */}
              <div className="px-8 pt-8 pb-2">
                <h1 className="text-2xl font-[900] text-gray-900 tracking-tight">Customize Template</h1>
                <p className="text-gray-500 text-sm mt-1">Edit the fields below. Only <span className="font-semibold text-gray-700">Name</span> and <span className="font-semibold text-gray-700">Bio</span> are required.</p>
              </div>

              <div className="p-8 space-y-8">

                {/* ── Name (Required) ── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-gray-400'} focus:ring-2 focus:ring-gray-100 outline-none transition-all text-gray-900 font-medium`}
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
                </div>

                {/* ── Bio / Description (Required) ── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={e => {
                      setFormData({ ...formData, description: e.target.value });
                      if (errors.description) setErrors({ ...errors, description: '' });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-gray-400'} focus:ring-2 focus:ring-gray-100 outline-none transition-all text-gray-900 resize-none`}
                    placeholder="Describe yourself or your brand"
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.description}</p>}
                </div>

                <hr className="border-gray-100" />

                {/* ── Avatar Upload ── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Profile Photo
                  </label>
                  <p className="text-xs text-gray-400 mb-3">Upload your profile picture</p>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <label className="flex items-center justify-center px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 cursor-pointer transition-colors">
                      {uploadingAvatar ? (
                        <span className="flex items-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>Uploading...</span>
                      ) : (
                        <span>Upload Photo</span>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} disabled={uploadingAvatar} />
                    </label>
                    <span className="text-xs text-gray-400">or enter URL below</span>
                  </div>

                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none transition-all text-gray-900"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                {/* ── Background Image Upload ── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Background Image
                  </label>
                  <p className="text-xs text-gray-400 mb-3">Upload a custom background</p>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <label className="flex items-center justify-center px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 cursor-pointer transition-colors">
                      {uploadingBg ? (
                        <span className="flex items-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>Uploading...</span>
                      ) : (
                        <span>Upload Background</span>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'bgImage')} disabled={uploadingBg} />
                    </label>
                    <span className="text-xs text-gray-400">or enter URL below</span>
                  </div>

                  <input
                    type="url"
                    value={formData.bgImage}
                    onChange={e => setFormData({ ...formData, bgImage: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none transition-all text-gray-900"
                    placeholder="https://example.com/background.jpg"
                  />
                </div>

                <hr className="border-gray-100" />

                {/* ── Buttons / Links (Optional) ── */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Links / Buttons</label>
                      <p className="text-xs text-gray-400 mt-0.5">Optional — add, edit, or remove link buttons</p>
                    </div>
                    <button
                      onClick={addButton}
                      className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full transition-all border border-gray-200"
                    >
                      <Plus size={15} />
                      Add
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.buttons.map((btn, index) => (
                      <div key={btn.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 group hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-200 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            value={btn.label}
                            onChange={e => handleButtonChange(btn.id, 'label', e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-100 outline-none text-sm font-medium text-gray-900"
                            placeholder="Button label"
                          />
                          <button
                            onClick={() => removeButton(btn.id)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <input
                          type="url"
                          value={btn.url}
                          onChange={e => handleButtonChange(btn.id, 'url', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-100 outline-none text-sm text-gray-600 ml-8"
                          style={{ width: 'calc(100% - 2rem)' }}
                          placeholder="https://example.com (optional)"
                        />
                      </div>
                    ))}

                    {formData.buttons.length === 0 && (
                      <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        No buttons yet. Click "Add" to create one.
                      </div>
                    )}
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* ── Social Icons (Optional) ── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Social Icons</label>
                  <p className="text-xs text-gray-400 mb-4">Optional — toggle which social icons appear on your page</p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { key: 'music', icon: Music, label: 'Music' },
                      { key: 'youtube', icon: Youtube, label: 'YouTube' },
                      { key: 'twitter', icon: Twitter, label: 'Twitter' },
                      { key: 'instagram', icon: Instagram, label: 'Instagram' },
                    ].map(({ key, icon: Icon, label }) => (
                      <button
                        key={key}
                        onClick={() => toggleSocial(key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${
                          formData.socials[key]
                            ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon size={16} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Save Button (bottom) ── */}
                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-2xl font-bold text-base transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                  >
                    <Save size={20} />
                    Save & Use Template
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
