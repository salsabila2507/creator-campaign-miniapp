'use client';

import { useState } from 'react';
import ProfileForm from './ProfileForm';
import SubmissionForm from './SubmissionForm';
import Leaderboard from './Leaderboard';
import SubmissionHistory from './SubmissionHistory';

export default function Dashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('submit');

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Creator Campaign</h1>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100">@{user.telegram_username}</p>
              <p className="text-2xl font-bold mt-2">{user.total_points || 0} Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-gray-900 border-b border-gray-700 z-40">
        <div className="max-w-4xl mx-auto px-4 flex gap-4 overflow-x-auto">
          {[
            { id: 'submit', label: 'Submit Content' },
            { id: 'profile', label: 'Profile' },
            { id: 'history', label: 'History' },
            { id: 'leaderboard', label: 'Leaderboard' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
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
