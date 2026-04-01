'use client';

import { useState } from 'react';
import ProfileForm from './ProfileForm';
import SubmissionForm from './SubmissionForm';
import Leaderboard from './Leaderboard';
import SubmissionHistory from './SubmissionHistory';

export default function Dashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('submit');

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-slate-900 via-green-950 to-slate-900">
      {/* Header with Nexarium branding */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-slate-600 p-8 text-white shadow-2xl border-b-4 border-silver-400">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-green-800">⬡</span>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white drop-shadow-lg">NEXARIUM</h1>
              <p className="text-green-100 text-sm font-semibold">Creator Wars</p>
            </div>
          </div>

          <div className="bg-green-900 bg-opacity-50 rounded-lg p-4 mb-6 border border-green-400 border-opacity-30">
            <p className="text-green-100 text-sm mb-2">Prize Pool</p>
            <p className="text-3xl font-bold text-green-300">$25,000 worth $NXR</p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-100">@{user.telegram_username}</p>
              <p className="text-3xl font-bold mt-2 text-green-300">{user.total_points || 0} Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-green-950 border-b-2 border-green-700 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 flex gap-4 overflow-x-auto">
          {[
            { id: 'submit', label: '🚀 Submit Content' },
            { id: 'profile', label: '👤 Profile' },
            { id: 'history', label: '📋 History' },
            { id: 'leaderboard', label: '🏆 Top 300' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 whitespace-nowrap border-b-2 transition-colors font-semibold ${
                activeTab === tab.id
                  ? 'border-green-400 text-green-300 bg-green-900 bg-opacity-30'
                  : 'border-transparent text-green-200 hover:text-green-300 hover:bg-green-900 hover:bg-opacity-20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'submit' && <SubmissionForm user={user} setUser={setUser} />}
        {activeTab === 'profile' && <ProfileForm user={user} setUser={setUser} />}
        {activeTab === 'history' && <SubmissionHistory telegramId={user.telegram_id} />}
        {activeTab === 'leaderboard' && <Leaderboard />}
      </div>
    </div>
  );
}
