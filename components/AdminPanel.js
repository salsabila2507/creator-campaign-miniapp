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
      showTelegramAlert('✅ Submission approved!');
      loadPendingSubmissions();
    } catch (error) {
      console.error('Error approving submission:', error);
      showTelegramAlert('❌ Failed to approve');
    }
  };

  const handleReject = async (submissionId) => {
    try {
      await rejectSubmission(submissionId, String(user.telegram_id));
      setSelectedSubmission(null);
      showTelegramAlert('❌ Submission rejected!');
      loadPendingSubmissions();
    } catch (error) {
      console.error('Error rejecting submission:', error);
      showTelegramAlert('❌ Failed to reject');
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-slate-900 via-green-950 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-800 via-green-800 to-green-700 p-8 text-white shadow-2xl border-b-4 border-red-600">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">⚙️</span>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white drop-shadow-lg">ADMIN PANEL</h1>
              <p className="text-green-100 text-sm font-semibold">Nexarium Creator Wars</p>
            </div>
          </div>
          <p className="text-red-100">@{user.telegram_username} (Admin)</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-green-300 mb-2">📋 Pending Submissions</h2>
          <p className="text-green-400">
            {loading ? 'Loading...' : `${submissions.length} pending review`}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-green-900 bg-opacity-30 rounded-lg p-6 text-center text-green-300 border-2 border-green-700">
            ✅ No pending submissions
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-green-950 rounded-lg p-6 border-2 border-green-700 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-green-300">@{submission.telegram_username}</h3>
                    <p className="text-green-400 text-sm">
                      Submission ID: #{submission.id}
                    </p>
                  </div>
                  <span className="bg-yellow-900 text-yellow-300 px-4 py-2 rounded-full text-sm font-bold border border-yellow-700">
                    ⏳ Pending
                  </span>
                </div>

                <div className="space-y-2 mb-6 p-4 bg-green-900 bg-opacity-40 rounded border border-green-700">
                  {submission.x_link && (
                    <p className="text-sm">
                      <span className="text-green-400">X:</span>{' '}
                      <a
                        href={submission.x_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-300 hover:text-green-100 hover:underline break-all"
                      >
                        {submission.x_link}
                      </a>
                    </p>
                  )}
                  {submission.tiktok_link && (
                    <p className="text-sm">
                      <span className="text-green-400">TikTok:</span>{' '}
                      <a
                        href={submission.tiktok_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-300 hover:text-green-100 hover:underline break-all"
                      >
                        {submission.tiktok_link}
                      </a>
                    </p>
                  )}
                  {submission.instagram_link && (
                    <p className="text-sm">
                      <span className="text-green-400">Instagram:</span>{' '}
                      <a
                        href={submission.instagram_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-300 hover:text-green-100 hover:underline break-all"
                      >
                        {submission.instagram_link}
                      </a>
                    </p>
                  )}
                  {submission.telegram_link && (
                    <p className="text-sm">
                      <span className="text-green-400">Telegram:</span>{' '}
                      <a
                        href={submission.telegram_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-300 hover:text-green-100 hover:underline break-all"
                      >
                        {submission.telegram_link}
                      </a>
                    </p>
                  )}
                </div>

                <div className="bg-green-900 bg-opacity-50 rounded p-4 mb-6 border border-green-700">
                  <div className="flex justify-between mb-2">
                    <span className="text-green-400">Base Points:</span>
                    <span className="font-bold text-green-300">{submission.base_points}</span>
                  </div>
                  {submission.bonus_points > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-400">Bonus:</span>
                      <span className="font-bold text-green-300">+{submission.bonus_points}</span>
                    </div>
                  )}
                  <div className="border-t border-green-700 mt-2 pt-2 flex justify-between">
                    <span className="text-green-300 font-bold">Total:</span>
                    <span className="font-bold text-green-300">{submission.total_points}</span>
                  </div>
                </div>

                {selectedSubmission === submission.id ? (
                  <div className="bg-green-900 bg-opacity-60 rounded p-4 mb-4 border border-green-600">
                    <label className="block text-sm font-medium text-green-300 mb-3">
                      💬 Score Adjustment (+ or -)
                    </label>
                    <input
                      type="number"
                      value={adjustment}
                      onChange={(e) => setAdjustment(e.target.value)}
                      placeholder="e.g., +10 or -5 (for spam/duplicate)"
                      className="w-full px-4 py-2 bg-green-800 border-2 border-green-600 rounded-lg text-white placeholder-green-500 focus:outline-none focus:border-green-400 mb-4"
                    />
                    <p className="text-xs text-green-400 mb-4">Unlimited adjustment allowed</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(submission.id)}
                        className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleReject(submission.id)}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                      >
                        ❌ Reject
                      </button>
                      <button
                        onClick={() => setSelectedSubmission(null)}
                        className="flex-1 bg-green-900 hover:bg-green-800 text-green-300 font-bold py-2 px-4 rounded-lg transition-colors border border-green-700"
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
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    🔍 Review Submission
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
