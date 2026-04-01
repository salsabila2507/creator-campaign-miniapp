'use client';

import { useState, useEffect } from 'react';
import { initTelegram, getTelegramUser, showTelegramAlert } from '@/lib/telegram';
import { loginCreator, checkIsAdmin } from '@/lib/api';
import Dashboard from '@/components/Dashboard';
import AdminPanel from '@/components/AdminPanel';

export default function Home() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = initTelegram();
    if (tg) {
      tg.ready();
    }

    const telegramUser = getTelegramUser();
    if (telegramUser) {
      handleLogin(telegramUser);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (telegramUser) => {
    try {
      const response = await loginCreator(
        String(telegramUser.id),
        telegramUser.username || `user_${telegramUser.id}`
      );
      setUser(response.data);

      // Check if admin
      const adminCheck = await checkIsAdmin(String(telegramUser.id));
      setIsAdmin(adminCheck.data.isAdmin);
    } catch (error) {
      console.error('Login error:', error);
      showTelegramAlert('Login failed');
    } finally {
      setLoading(false);
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
          <p className="text-gray-400 mb-8">Open this app from Telegram to continue</p>
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
