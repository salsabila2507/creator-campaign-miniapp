'use client';

import { useState } from 'react';
import { submitContent, getCreatorProfile } from '@/lib/api';
import { showTelegramAlert } from '@/lib/telegram';

export default function SubmissionForm({ user, setUser }) {
  const [formData, setFormData] = useState({
    x_link: '',
    tiktok_link: '',
    instagram_link: '',
    telegram_link: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.x_link && !formData.tiktok_link) {
      showTelegramAlert('X or TikTok link is required');
      return;
    }

    setLoading(true);

    try {
      await submitContent(user.telegram_id, formData);

      // Refresh user data to update points
      const updatedUser = await getCreatorProfile(user.telegram_id);
      setUser(updatedUser.data);

      setFormData({
        x_link: '',
        tiktok_link: '',
        instagram_link: '',
        telegram_link: '',
      });

      showTelegramAlert('Content submitted successfully! Waiting for admin review...');
    } catch (error) {
      console.error('Error submitting content:', error);
      showTelegramAlert('Failed to submit content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-2">Submit Content</h2>
      <p className="text-gray-400 mb-6">
        X/TikTok: 100 points | Instagram: +50% | Telegram: +30%
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">X (Twitter) Link *</label>
          <input
            type="url"
            name="x_link"
            value={formData.x_link}
            onChange={handleChange}
            placeholder="https://x.com/..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">TikTok Link *</label>
          <input
            type="url"
            name="tiktok_link"
            value={formData.tiktok_link}
            onChange={handleChange}
            placeholder="https://www.tiktok.com/..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Instagram Link (bonus)</label>
          <input
            type="url"
            name="instagram_link"
            value={formData.instagram_link}
            onChange={handleChange}
            placeholder="https://instagram.com/..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Telegram Link (bonus)</label>
          <input
            type="url"
            name="telegram_link"
            value={formData.telegram_link}
            onChange={handleChange}
            placeholder="https://t.me/..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <p className="text-sm text-gray-400">* At least X or TikTok required</p>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-colors mt-6"
        >
          {loading ? 'Submitting...' : 'Submit Content'}
        </button>
      </form>
    </div>
  );
}
