import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, X } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="alert"
      className="bg-red-700 text-white px-4 py-2 shadow-sm relative z-40 text-xs sm:text-sm border-b border-red-800"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-200" aria-hidden="true" />
          <span>
            <strong className="font-semibold text-white">Emergency Assistance:</strong> If you are in immediate physical danger, call{' '}
            <a href="tel:112" className="underline font-bold text-white hover:text-red-100 px-0.5">
              112 (National Emergency)
            </a>{' '}
            or Women Helpline{' '}
            <a href="tel:1091" className="underline font-bold text-white hover:text-red-100 px-0.5">
              1091
            </a>
            .
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 bg-white text-red-800 px-3 py-1 rounded-lg text-xs font-bold shadow-xs hover:bg-zinc-100 transition"
            aria-label="Direct dial national emergency line 112"
          >
            <PhoneCall className="w-3 h-3" aria-hidden="true" />
            <span>Call 112</span>
          </a>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss emergency banner"
            className="text-white/80 hover:text-white p-1 rounded transition"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
