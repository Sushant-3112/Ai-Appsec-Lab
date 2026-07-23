import React from 'react';
import { Star, Check, Sparkles } from 'lucide-react';

/**
 * Visual showcase component demonstrating the multi-template system
 * Shows users how to save and switch between multiple templates
 */
const TemplateShowcase = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 border border-indigo-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
          <Sparkles size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Multi-Template System</h3>
          <p className="text-sm text-gray-600">Save unlimited templates and switch anytime</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Feature 1 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
            <Star size={20} className="text-yellow-600" fill="currentColor" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Save Favorites</h4>
          <p className="text-sm text-gray-600">Click the ★ star on any template to save it to your collection</p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
            <Check size={20} className="text-indigo-600" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">One Active</h4>
          <p className="text-sm text-gray-600">Only one template is live at a time. Switch instantly with one click</p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
            <span className="text-green-600 font-bold text-lg">∞</span>
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Unlimited</h4>
          <p className="text-sm text-gray-600">Save as many templates as you want. No limits on your collection</p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-indigo-600">→</span> How It Works
        </h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">1</span>
            <p className="text-sm text-gray-700"><span className="font-semibold">Browse</span> all 15 templates below</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">2</span>
            <p className="text-sm text-gray-700"><span className="font-semibold">Click ★</span> to save your favorites</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">3</span>
            <p className="text-sm text-gray-700"><span className="font-semibold">Filter "Saved"</span> to see your collection</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">4</span>
            <p className="text-sm text-gray-700"><span className="font-semibold">Hover & click "Set as Active"</span> to make it live</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 flex items-center justify-center gap-8 text-center">
        <div>
          <div className="text-3xl font-bold text-indigo-600">15</div>
          <div className="text-xs text-gray-600 font-medium">Total Templates</div>
        </div>
        <div className="w-px h-12 bg-gray-200"></div>
        <div>
          <div className="text-3xl font-bold text-purple-600">∞</div>
          <div className="text-xs text-gray-600 font-medium">Can Save</div>
        </div>
        <div className="w-px h-12 bg-gray-200"></div>
        <div>
          <div className="text-3xl font-bold text-pink-600">1</div>
          <div className="text-xs text-gray-600 font-medium">Active at Once</div>
        </div>
      </div>
    </div>
  );
};

export default TemplateShowcase;
