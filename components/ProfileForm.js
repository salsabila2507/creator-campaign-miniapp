'use client';

import { useState } from 'react';
import { updateCreatorProfile } from '@/lib/api';
import { showTelegramAlert } from '@/lib/telegram';

export default function ProfileForm({ user, setUser }) {
  const [formData, setFormData] = useState({
    x_handle: user.x_handle || '',
    tiktok_handle: user.tiktok_handle || '',
    instagram_handle: user.instagram_handle || '',
    telegram_channel: user.telegram_channel || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updateCreatorProfile(user.telegram_id, formData);
      setUser(response.data);
      showTelegramAlert('✅ Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      showTelegramAlert('❌ Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-950 rounded-lg p-6 border-2 border-green-700 shadow-lg">
      <h2 className="text-2xl font-bold text-green-300 mb-6">👤 Social Media Handles</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-green-300 mb-2">X (Twitter)</label>
          <input
            type="text"
            name="x_handle"
            value={formData.x_handle}
            onChange={handleChange}
            placeholder="@yourhandle"
            className="w-full px-4 py-2 bg-green-900 border-2 border-green-700 rounded-lg text-white placeholder-green-600 focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-300 mb-2">TikTok</label>
          <input
            type="text"
            name="tiktok_handle"
            value={formData.tiktok_handle}
            onChange={handleChange}
            placeholder="@yourhandle"
            className="w-full px-4 py-2 bg-green-900 border-2 border-green-700 rounded-lg text-white placeholder-green-600 focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-300 mb-2">Instagram</label>
          <input
            type="text"
            name="instagram_handle"
            value={formData.instagram_handle}
            onChange={handleChange}
            placeholder="@yourhandle"
            className="w-full px-4 py-2 bg-green-900 border-2 border-green-700 rounded-lg text-white placeholder-green-600 focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-300 mb-2">Telegram Channel/Group</label>
          <input
            type="text"
            name="telegram_channel"
            value={formData.telegram_channel}
            onChange={handleChange}
            placeholder="https://t.me/yourchannel"
            className="w-full px-4 py-2 bg-green-900 border-2 border-green-700 rounded-lg text-white placeholder-green-600 focus:outline-none focus:border-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-colors mt-6"
        >
          {loading ? '⏳ Saving...' : '💾 Save Profile'}
        </button>
      </form>
    </div>
  );
}
