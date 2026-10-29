import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PhoneCall, ShieldAlert, PlusCircle } from 'lucide-react';

export const StickyMobileCTA: React.FC = () => {
  const location = useLocation();

  // Hide on 404, simulator gameplay, or when quick-report is already active
  if (location.pathname.startsWith('/simulator/') || location.pathname === '/quick-report') {
    return null;
  }

  return (
    <nav
      aria-label="Mobile Emergency Quick Navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 border-t border-purple-100 px-3 py-2.5 backdrop-blur-md shadow-lg"
    >
      <div className="flex items-center justify-between gap-2">
        <a
          href="tel:112"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-red-600 active:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs"
          aria-label="Call Emergency Helpline 112"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call 112</span>
        </a>

        <Link
          to="/quick-report"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-purple-700 active:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs"
          aria-label="Open Safe Reporting Wizard"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Quick Report</span>
        </Link>

        <Link
          to="/herspace"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 bg-zinc-100 active:bg-zinc-200 text-zinc-800 font-semibold text-xs rounded-xl border border-zinc-200"
          aria-label="Share Story Anonymously in HerSpace"
        >
          <PlusCircle className="w-3.5 h-3.5 text-purple-700" />
          <span>HerSpace</span>
        </Link>
      </div>
    </nav>
  );
};

