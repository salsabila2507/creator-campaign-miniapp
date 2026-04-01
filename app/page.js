'use client';

import { useState, useEffect } from 'react';
import { loginCreator, checkIsAdmin } from '@/lib/api';
import Dashboard from '@/components/Dashboard';
import AdminPanel from '@/components/AdminPanel';

export default function Home() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Get Telegram Web App
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          tg.ready();

          // Get user from Telegram
          const telegramUser = tg.initDataUnsafe?.user;
          
          if (telegramUser) {
            await handleLogin(telegramUser);
          } else {
            setError('Telegram user data not available');
            setLoading(false);
          }
        } else {
          setError('Telegram Web App not available');
          setLoading(false);
        }
      } catch (err) {
        console.error('Init error:', err);
        setError('Failed to initialize');
        setLoading(false);
      }
    };

    initApp();
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
      setError('Login failed: ' + error.message);
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

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Creator Campaign</h1>
          <p className="text-red-400 mb-4">{error || 'Open this app from Telegram to continue'}</p>
          <p className="text-gray-400">Make sure you open this from the Telegram app</p>
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