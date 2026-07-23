import React, { useState } from 'react';
import { Pin, Lock, Target, Eye, Tag, Zap, Calendar, TestTube, Mail, TrendingUp, X } from 'lucide-react';

const AdvancedLinkEditor = ({ link, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    is_pinned: link?.is_pinned || false,
    password: '',
    click_goal: link?.click_goal || 0,
    show_view_count: link?.show_view_count || false,
    category: link?.category || '',
    priority: link?.priority || 0,
    conversion_goal: link?.conversion_goal || '',
    ab_test_variant: link?.ab_test_variant || '',
    scheduled_start: link?.scheduled_start || '',
    scheduled_end: link?.scheduled_end || '',
    thumbnail: link?.thumbnail || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Advanced Link Settings</h2>
            <p className="text-sm text-gray-500 mt-0.5">{link?.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Pin to Top */}
          <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <Pin size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <h3 className="font-semibold text-gray-900">Pin to Top</h3>
                  <p className="text-sm text-gray-600 mt-0.5">Keep this link at the top of your profile</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_pinned}
                  onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Password Protection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Password Protection</h3>
            </div>
            <input
              type="password"
              placeholder="Leave empty for no password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500">Visitors will need this password to access the link</p>
          </div>

          {/* Click Goal */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Click Goal</h3>
            </div>
            <input
              type="number"
              placeholder="e.g., 1000"
              value={formData.click_goal}
              onChange={(e) => setFormData({ ...formData, click_goal: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500">Set a target number of clicks to track progress</p>
          </div>

          {/* Social Proof */}
          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
              <Eye size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <h3 className="font-semibold text-gray-900">Show View Count</h3>
                  <p className="text-sm text-gray-600 mt-0.5">Display how many people viewed this link (social proof)</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.show_view_count}
                  onChange={(e) => setFormData({ ...formData, show_view_count: e.target.checked })}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag size={18} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Category</h3>
            </div>
            <input
              type="text"
              placeholder="e.g., Social Media, Products, Services"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500">Organize links into categories</p>
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Priority Level</h3>
            </div>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="0">Normal</option>
              <option value="1">High</option>
              <option value="2">Urgent</option>
            </select>
            <p className="text-xs text-gray-500">Higher priority links appear more prominently</p>
          </div>

          {/* Scheduling */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Schedule Link</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Start Date</label>
                <input
                  type="datetime-local"
                  value={formData.scheduled_start}
                  onChange={(e) => setFormData({ ...formData, scheduled_start: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">End Date</label>
                <input
                  type="datetime-local"
                  value={formData.scheduled_end}
                  onChange={(e) => setFormData({ ...formData, scheduled_end: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">Automatically show/hide link based on schedule</p>
          </div>

          {/* Conversion Goal */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Conversion Goal</h3>
            </div>
            <input
              type="text"
              placeholder="e.g., Sign up, Purchase, Download"
              value={formData.conversion_goal}
              onChange={(e) => setFormData({ ...formData, conversion_goal: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500">What action do you want visitors to take?</p>
          </div>

          {/* Thumbnail */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Thumbnail URL</h3>
            </div>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500">Add a custom thumbnail image for this link</p>
          </div>

          {/* A/B Testing */}
          <div className="space-y-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
            <div className="flex items-center gap-2">
              <TestTube size={18} className="text-purple-600" />
              <h3 className="font-semibold text-gray-900">A/B Testing</h3>
              <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-semibold">Pro</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Variant</label>
                <select
                  value={formData.ab_test_variant}
                  onChange={(e) => setFormData({ ...formData, ab_test_variant: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">None</option>
                  <option value="A">Variant A</option>
                  <option value="B">Variant B</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Test Group ID</label>
                <input
                  type="text"
                  placeholder="e.g., test-1"
                  value={formData.ab_test_group_id}
                  onChange={(e) => setFormData({ ...formData, ab_test_group_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">Test different versions of your link to see which performs better</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-md"
            >
              Save Advanced Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvancedLinkEditor;
