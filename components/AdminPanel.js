'use client';

import { useState, useEffect } from 'react';
import { getPendingSubmissions, approveSubmission, rejectSubmission } from '@/lib/api';
import { showTelegramAlert } from '@/lib/telegram';

export default function AdminPanel({ user }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [adjustment, setAdjustment] = useState(0);

  useEffect(() => {
    loadPendingSubmissions();
    const interval = setInterval(loadPendingSubmissions, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadPendingSubmissions = async () => {
    try {
      const response = await getPendingSubmissions();
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId) => {
    try {
      await approveSubmission(submissionId, String(user.telegram_id), parseInt(adjustment));
      setAdjustment(0);
      setSelectedSubmission(null);
      showTelegramAlert('Submission approved!');
      loadPendingSubmissions();
    } catch (error) {
      console.error('Error approving submission:', error);
      showTelegramAlert('Failed to approve');
    }
  };

  const handleReject = async (submissionId) => {
    try {
      await rejectSubmission(submissionId, String(user.telegram_id));
      setSelectedSubmission(null);
      showTelegramAlert('Submission rejected!');
      loadPendingSubmissions();
    } catch (error) {
      console.error('Error rejecting submission:', error);
      showTelegramAlert('Failed to reject');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-red-100">@{user.telegram_username} (Admin)</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Pending Submissions</h2>
          <p className="text-gray-400">
            {loading ? 'Loading...' : `${submissions.length} pending review`}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400 border border-gray-700">
            No pending submissions
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">@{submission.telegram_username}</h3>
                    <p className="text-gray-400 text-sm">
                      Submission ID: #{submission.id}
                    </p>
                  </div>
                  <span className="bg-yellow-900 text-yellow-300 px-3 py-1 rounded-full text-sm font-bold">
                    Pending
                  </span>
                </div>

                <div className="space-y-2 mb-6 p-4 bg-gray-700 rounded">
                  {submission.x_link && (
                    <p className="text-sm">
                      <span className="text-gray-400">X:</span>{' '}
                      <a
                        href={submission.x_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline break-all"
                      >
                        {submission.x_link}
                      </a>
                    </p>
                  )}
                  {submission.tiktok_link && (
                    <p className="text-sm">
                      <span className="text-gray-400">TikTok:</span>{' '}
                      <a
                        href={submission.tiktok_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline break-all"
                      >
                        {submission.tiktok_link}
                      </a>
                    </p>
                  )}
                  {submission.instagram_link && (
                    <p className="text-sm">
                      <span className="text-gray-400">Instagram:</span>{' '}
                      <a
                        href={submission.instagram_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline break-all"
                      >
                        {submission.instagram_link}
                      </a>
                    </p>
                  )}
                  {submission.telegram_link && (
                    <p className="text-sm">
                      <span className="text-gray-400">Telegram:</span>{' '}
                      <a
                        href={submission.telegram_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline break-all"
                      >
                        {submission.telegram_link}
                      </a>
                    </p>
                  )}
                </div>

                <div className="bg-gray-700 rounded p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Base Points:</span>
                    <span className="font-bold">{submission.base_points}</span>
                  </div>
                  {submission.bonus_points > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bonus:</span>
                      <span className="font-bold text-green-400">+{submission.bonus_points}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-600 mt-2 pt-2 flex justify-between">
                    <span className="text-gray-300 font-bold">Total:</span>
                    <span className="font-bold text-blue-400">{submission.total_points}</span>
                  </div>
                </div>

                {selectedSubmission === submission.id ? (
                  <div className="bg-gray-700 rounded p-4 mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Point Adjustment (optional)
                    </label>
                    <input
                      type="number"
                      value={adjustment}
                      onChange={(e) => setAdjustment(e.target.value)}
                      placeholder="e.g., +5 or -10"
                      className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 mb-4"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(submission.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(submission.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => setSelectedSubmission(null)}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedSubmission(submission.id);
                      setAdjustment(0);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Review
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
