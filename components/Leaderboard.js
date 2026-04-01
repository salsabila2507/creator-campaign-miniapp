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
    return <div className="text-center py-8 text-green-300">Loading leaderboard...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-lg p-6 mb-6 border-2 border-green-500 shadow-lg">
        <h2 className="text-3xl font-bold text-white">🏆 Top 300 Creators</h2>
        <p className="text-green-100 mt-2">Total {leaderboard.length} creators | Prize Pool: $25,000 worth $NXR</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="bg-green-900 bg-opacity-30 rounded-lg p-6 text-center text-green-300 border-2 border-green-700">
          No creators with points yet
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((creator, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                index < 3
                  ? 'bg-gradient-to-r from-yellow-900 to-yellow-800 border-yellow-600 shadow-md'
                  : index < 10
                  ? 'bg-gradient-to-r from-green-800 to-green-700 border-green-600'
                  : index < 50
                  ? 'bg-gradient-to-r from-green-900 to-green-800 border-green-700'
                  : 'bg-green-950 border-green-700'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center font-bold text-white shadow-lg">
                  {index < 3 ? (
                    <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-white">@{creator.telegram_username}</p>
                  <p className="text-sm text-green-200">Rank #{creator.rank}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-300">
                {creator.total_points.toLocaleString()} pts
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
