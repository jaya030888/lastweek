import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const preference = localStorage.getItem('hv_cookie_preference');
    if (!preference) {
      setShowBanner(true);
    }
  }, []);

  const handleConsent = (level: 'essential' | 'all') => {
    localStorage.setItem('hv_cookie_preference', level);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <aside
      aria-label="Privacy and Cookie Notice"
      className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-5 bg-zinc-950/95 text-zinc-200 border-t border-purple-900/60 shadow-2xl backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-bold text-white">
              Privacy First & Minimal Cookies
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
              Her Voice uses only essential local storage to preserve your pseudonymous handle and emergency quick exit settings. We do not use third-party advertising cookies or cross-site tracking. Read our{' '}
              <Link to="/privacy-policy" className="text-purple-300 underline hover:text-white">
                Privacy Policy
              </Link>{' '}
              to learn more.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end sm:mr-44">
          <button
            onClick={() => handleConsent('essential')}
            className="px-3.5 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-xs font-semibold hover:bg-zinc-800 transition"
          >
            Essential Only
          </button>
          <button
            onClick={() => handleConsent('all')}
            className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow transition"
          >
            Accept
          </button>
        </div>
      </div>
    </aside>
  );
};

