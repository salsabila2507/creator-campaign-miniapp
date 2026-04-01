'use client';

import { useState, useEffect } from 'react';
import { showTelegramAlert } from '@/lib/telegram';

export default function AdminDashboard({ user }) {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [pointAdjustment, setPointAdjustment] = useState(0);
  const [notes, setNotes] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    loadCreators();
  }, []);

  const loadCreators = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/creators`);
      const data = await response.json();
      setCreators(data);
    } catch (error) {
      console.error('Error loading creators:', error);
      showTelegramAlert('Failed to load creators');
    } finally {
      setLoading(false);
    }
  };

  const searchCreators = async () => {
    if (!searchQuery.trim()) {
      loadCreators();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/creators/search/${searchQuery}`);
      const data = await response.json();
      setCreators(data);
    } catch (error) {
      console.error('Error searching:', error);
      showTelegramAlert('Search failed');
    }
  };

  const handleAdjustPoints = async () => {
    if (!selectedCreator) return;

    try {
      const response = await fetch(
        `${API_URL}/api/admin/creators/${selectedCreator.id}/points`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            adjustment: parseInt(pointAdjustment),
            notes 
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to update points');

      const updated = await response.json();
      
      // Update local list
      const updatedCreators = creators.map(c => 
        c.id === updated.id ? updated : c
      ).sort((a, b) => b.total_points - a.total_points);
      
      setCreators(updatedCreators);
      setSelectedCreator(null);
      setPointAdjustment(0);
      setNotes('');
      
      showTelegramAlert(`✅ Updated! New points: ${updated.total_points}`);
    } catch (error) {
      console.error('Error updating points:', error);
      showTelegramAlert('Failed to update points');
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-slate-900 via-green-950 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-800 p-8 text-white shadow-2xl border-b-4 border-green-500">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-black text-white drop-shadow-lg mb-2">📊 Creator Management</h1>
          <p className="text-green-100">Nexarium Creator Wars - Manage Points & Data</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="bg-green-950 rounded-lg p-6 border-2 border-green-700 mb-8 shadow-lg">
          <label className="block text-sm font-medium text-green-300 mb-3">🔍 Search Creator</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username, X handle, or TikTok handle..."
              className="flex-1 px-4 py-2 bg-green-900 border-2 border-green-700 rounded-lg text-white placeholder-green-600 focus:outline-none focus:border-green-500"
              onKeyPress={(e) => e.key === 'Enter' && searchCreators()}
            />
            <button
              onClick={searchCreators}
              className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Search
            </button>
            <button
              onClick={() => {
                setSearchQuery('');
                loadCreators();
              }}
              className="bg-green-900 hover:bg-green-800 text-green-300 font-bold py-2 px-6 rounded-lg transition-colors border border-green-700"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-lg p-4 border-2 border-green-500 text-white">
            <p className="text-green-100 text-sm">Total Creators</p>
            <p className="text-3xl font-bold">{creators.length}</p>
          </div>
          <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-lg p-4 border-2 border-green-500 text-white">
            <p className="text-green-100 text-sm">Total Points Distributed</p>
            <p className="text-3xl font-bold">{creators.reduce((sum, c) => sum + c.total_points, 0).toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-lg p-4 border-2 border-green-500 text-white">
            <p className="text-green-100 text-sm">Top Creator Points</p>
            <p className="text-3xl font-bold">{creators[0]?.total_points.toLocaleString() || '0'}</p>
          </div>
        </div>

        {/* Creators List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          </div>
        ) : creators.length === 0 ? (
          <div className="bg-green-900 bg-opacity-30 rounded-lg p-6 text-center text-green-300 border-2 border-green-700">
            No creators found
          </div>
        ) : (
          <div className="space-y-4">
            {creators.map((creator, index) => (
              <div
                key={creator.id}
                className="bg-green-950 rounded-lg p-6 border-2 border-green-700 hover:border-green-500 transition-all shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center font-bold text-white">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-green-300">@{creator.telegram_username}</h3>
                        <p className="text-green-400 text-sm">ID: {creator.telegram_id}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 text-sm">Current Points</p>
                    <p className="text-3xl font-bold text-green-300">{creator.total_points.toLocaleString()}</p>
                  </div>
                </div>

                {/* Social Handles */}
                <div className="bg-green-900 bg-opacity-40 rounded p-3 mb-4 text-sm space-y-1 border border-green-700">
                  {creator.x_handle && <p className="text-green-300">𝕏: <span className="text-green-400">@{creator.x_handle}</span></p>}
                  {creator.tiktok_handle && <p className="text-green-300">TikTok: <span className="text-green-400">@{creator.tiktok_handle}</span></p>}
                  {creator.instagram_handle && <p className="text-green-300">Instagram: <span className="text-green-400">@{creator.instagram_handle}</span></p>}
                  {creator.telegram_channel && <p className="text-green-300">Telegram: <span className="text-green-400">{creator.telegram_channel}</span></p>}
                </div>

                {selectedCreator?.id === creator.id ? (
                  <div className="bg-green-900 bg-opacity-60 rounded p-4 border border-green-600">
                    <label className="block text-sm font-medium text-green-300 mb-2">Points Adjustment</label>
                    <input
                      type="number"
                      value={pointAdjustment}
                      onChange={(e) => setPointAdjustment(e.target.value)}
                      placeholder="e.g., +50 or -10"
                      className="w-full px-4 py-2 bg-green-800 border-2 border-green-600 rounded-lg text-white placeholder-green-500 focus:outline-none focus:border-green-400 mb-3"
                    />

                    <label className="block text-sm font-medium text-green-300 mb-2">Notes (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Why are you adjusting points? (spam, duplicate, quality issue, etc.)"
                      className="w-full px-4 py-2 bg-green-800 border-2 border-green-600 rounded-lg text-white placeholder-green-500 focus:outline-none focus:border-green-400 mb-4"
                      rows="2"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={handleAdjustPoints}
                        className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                      >
                        ✅ Apply Changes
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCreator(null);
                          setPointAdjustment(0);
                          setNotes('');
                        }}
                        className="flex-1 bg-green-900 hover:bg-green-800 text-green-300 font-bold py-2 px-4 rounded-lg transition-colors border border-green-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedCreator(creator);
                      setPointAdjustment(0);
                      setNotes('');
                    }}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    ✏️ Adjust Points
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}