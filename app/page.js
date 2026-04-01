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
    let isMounted = true;

    const initApp = async () => {
      // Wait for Telegram SDK
      let attempts = 0;
      while (!window.Telegram?.WebApp && attempts < 50) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
      }

      if (!isMounted) return;

      try {
        const tg = window.Telegram?.WebApp;
        
        if (!tg) {
          setError('Telegram Web App SDK not found');
          setLoading(false);
          return;
        }

        tg.ready();

        const user = tg.initDataUnsafe?.user;
        
        if (!user) {
          setError('Could not get Telegram user. Make sure you open this from Telegram app.');
          setLoading(false);
          return;
        }

        // Login
        const response = await loginCreator(
          String(user.id),
          user.username || `user_${user.id}`
        );
        
        if (!isMounted) return;
        
        setUser(response.data);

        // Check admin
        const adminRes = await checkIsAdmin(String(user.id));
        setIsAdmin(adminRes.data.isAdmin);
      } catch (err) {
        console.error('Error:', err);
        if (isMounted) {
          setError('Error: ' + err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initApp();

    return () => {
      isMounted = false;
    };
  }, []);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Creator Campaign</h1>
          <p className="text-red-400 mb-2">{error}</p>
          <p className="text-gray-400 text-sm">Open from Telegram app</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Creator Campaign</h1>
          <p className="text-gray-400">Opening from Telegram...</p>
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