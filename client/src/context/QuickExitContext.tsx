import React, { createContext, useContext, useEffect, useState } from 'react';

interface QuickExitContextType {
  triggerExit: () => void;
  exitUrl: string;
  setExitUrl: (url: string) => void;
  isCamouflageActive: boolean;
  toggleCamouflage: () => void;
}

const QuickExitContext = createContext<QuickExitContextType | undefined>(undefined);

export const QuickExitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exitUrl, setExitUrl] = useState<string>('https://en.wikipedia.org/wiki/Weather');
  const [isCamouflageActive, setIsCamouflageActive] = useState<boolean>(false);

  const triggerExit = () => {
    // Overwrite document title and history state before redirecting
    document.title = 'Current Weather Updates & Forecast';
    window.location.replace(exitUrl);
  };

  const toggleCamouflage = () => {
    setIsCamouflageActive(prev => !prev);
  };

  // Global ESC key listener for instant exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [exitUrl]);

  return (
    <QuickExitContext.Provider
      value={{
        triggerExit,
        exitUrl,
        setExitUrl,
        isCamouflageActive,
        toggleCamouflage,
      }}
    >
      {isCamouflageActive ? (
        <div className="min-h-screen bg-white text-zinc-800 p-8 font-sans">
          <div className="max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Today's National Weather Overview</h1>
            <p className="text-zinc-600">Partly cloudy across metropolitan areas with seasonal temperatures ranging from 22°C to 31°C. Light evening breeze expected.</p>
            <div className="pt-4 border-t flex justify-between items-center text-sm text-zinc-500">
              <span>Updated 5 minutes ago</span>
              <button
                onClick={toggleCamouflage}
                className="text-xs px-3 py-1 bg-zinc-100 hover:bg-zinc-200 rounded border text-zinc-600"
              >
                Resume
              </button>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </QuickExitContext.Provider>
  );
};

export const useQuickExit = (): QuickExitContextType => {
  const context = useContext(QuickExitContext);
  if (!context) throw new Error('useQuickExit must be used within a QuickExitProvider');
  return context;
};

