'use client';

import { useState, useEffect } from 'react';
import { getLeaderboard } from '@/lib/api';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await getLeaderboard();
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading leaderboard...</div>;
  }

  return (
    <div className="space-y-2">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-4 mb-6">
        <h2 className="text-2xl font-bold">Top 200 Creators</h2>
        <p className="text-blue-100">Total {leaderboard.length} creators</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400 border border-gray-700">
          No creators with points yet
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((creator, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                index < 3
                  ? 'bg-yellow-900 border-yellow-700'
                  : index < 10
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-800 border-gray-700'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold">
                  {index < 3 ? (
                    <span className="text-xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                  ) : (
                    index + 1
                  )}
                </div>
                <div>
                  <p className="font-bold">@{creator.telegram_username}</p>
                  <p className="text-sm text-gray-400">Rank #{creator.rank}</p>
                </div>
              </div>
              <p className="text-xl font-bold text-blue-400">{creator.total_points} pts</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
