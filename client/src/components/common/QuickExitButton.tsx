import React, { useState } from 'react';
import { LogOut, EyeOff, ShieldCheck, HelpCircle } from 'lucide-react';
import { useQuickExit } from '../../context/QuickExitContext';

export const QuickExitButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { triggerExit, toggleCamouflage } = useQuickExit();
  const [showInfo, setShowInfo] = useState(false);

  if (compact) {
    return (
      <button
        onClick={triggerExit}
        title="Quick Exit (Press ESC anytime)"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Quick Exit (ESC)</span>
      </button>
    );
  }

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 group">
        <button
          onClick={toggleCamouflage}
          title="Discreet Camouflage Mode"
          className="p-3 bg-zinc-800/90 hover:bg-zinc-900 text-zinc-300 hover:text-white rounded-full shadow-lg backdrop-blur-sm border border-zinc-700 transition"
        >
          <EyeOff className="w-4 h-4" />
        </button>

        <button
          onClick={triggerExit}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-xl font-medium text-xs sm:text-sm tracking-wide transition-all active:scale-95 border border-red-500"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-bold">Quick Exit</span>
          <kbd className="hidden sm:inline-block bg-red-800 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded text-white/90">ESC</kbd>
        </button>

        <button
          onClick={() => setShowInfo(true)}
          className="p-2 bg-white text-zinc-500 hover:text-zinc-800 rounded-full shadow border text-xs"
          title="Safety Notice about Quick Exit"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>

      {showInfo && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-bold text-lg">
              <ShieldCheck className="w-6 h-6" />
              <span>Digital Safety & Quick Exit</span>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Clicking <strong>Quick Exit</strong> or pressing the <strong>Escape (ESC)</strong> key will immediately navigate your browser to a neutral weather reference page.
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <strong className="block font-semibold">Important Device Safety Notice:</strong>
              <span>
                Quick Exit redirects your active tab, but it <strong>cannot erase your browser history</strong> or cache. If someone is monitoring your device, use Incognito / Private Browsing mode and clear your history afterward.
              </span>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowInfo(false)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-xl transition"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

