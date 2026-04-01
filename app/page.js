'use client';

import { useState, useEffect } from 'react';
import { loginCreator, checkIsAdmin } from '@/lib/api';
import Dashboard from '@/components/Dashboard';
import AdminPanel from '@/components/AdminPanel';

export default function Home() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      let telegramUser = null;

      // Try get from Telegram
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        telegramUser = tg.initDataUnsafe?.user;
      }

      // Fallback: use test user
      if (!telegramUser) {
        telegramUser = {
          id: 5650021727,
          username: 'invisiblefoxyasuo',
          first_name: 'Test'
        };
      }

      await loginUser(telegramUser);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (telegramUser) => {
    try {
      const response = await loginCreator(
        String(telegramUser.id),
        telegramUser.username || `user_${telegramUser.id}`
      );
      setUser(response.data);

      const adminCheck = await checkIsAdmin(String(telegramUser.id));
      setIsAdmin(adminCheck.data.isAdmin);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Creator Campaign</h1>
          <p className="text-gray-400">Failed to load</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {isAdmin ? (
        <AdminPanel user={user} />
      ) : (
        <Dashboard user={user} setUser={setUser} />
      )}
    </div>
  );
}