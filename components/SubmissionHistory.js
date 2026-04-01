'use client';

import { useState, useEffect } from 'react';
import { getCreatorSubmissions } from '@/lib/api';

export default function SubmissionHistory({ telegramId }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, [telegramId]);

  const loadSubmissions = async () => {
    try {
      const response = await getCreatorSubmissions(telegramId);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (submissions.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400 border border-gray-700">
        No submissions yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <div key={submission.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg">Submission #{submission.id}</h3>
              <p className="text-gray-400 text-sm">
                {new Date(submission.created_at).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                submission.status === 'approved'
                  ? 'bg-green-900 text-green-300'
                  : submission.status === 'rejected'
                  ? 'bg-red-900 text-red-300'
                  : 'bg-yellow-900 text-yellow-300'
              }`}
            >
              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {submission.x_link && (
              <p className="text-sm">
                <span className="text-gray-400">X:</span>{' '}
                <a href={submission.x_link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                  {submission.x_link}
                </a>
              </p>
            )}
            {submission.tiktok_link && (
              <p className="text-sm">
                <span className="text-gray-400">TikTok:</span>{' '}
                <a href={submission.tiktok_link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                  {submission.tiktok_link}
                </a>
              </p>
            )}
            {submission.instagram_link && (
              <p className="text-sm">
                <span className="text-gray-400">Instagram:</span>{' '}
                <a href={submission.instagram_link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                  {submission.instagram_link}
                </a>
              </p>
            )}
            {submission.telegram_link && (
              <p className="text-sm">
                <span className="text-gray-400">Telegram:</span>{' '}
                <a href={submission.telegram_link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                  {submission.telegram_link}
                </a>
              </p>
            )}
          </div>

          <div className="bg-gray-700 rounded p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Base Points:</span>
              <span className="font-bold">{submission.base_points}</span>
            </div>
            {submission.bonus_points > 0 && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Bonus:</span>
                <span className="font-bold text-green-400">+{submission.bonus_points}</span>
              </div>
            )}
            {submission.admin_adjustment !== 0 && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Admin Adjustment:</span>
                <span className={submission.admin_adjustment > 0 ? 'text-green-400' : 'text-red-400'}>
                  {submission.admin_adjustment > 0 ? '+' : ''}{submission.admin_adjustment}
                </span>
              </div>
            )}
            <div className="border-t border-gray-600 mt-2 pt-2 flex justify-between">
              <span className="text-gray-300 font-bold">Total:</span>
              <span className="font-bold text-lg text-blue-400">
                {submission.total_points + (submission.admin_adjustment || 0)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
