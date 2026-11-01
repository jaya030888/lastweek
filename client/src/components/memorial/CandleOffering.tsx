import React, { useState } from 'react';
import { Flame, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CandleOfferingProps {
  storyName: string;
  initialCandles: number;
  onTributeSubmit: (type: 'candle', message?: string) => Promise<void>;
}

export const CandleOffering: React.FC<CandleOfferingProps> = ({
  storyName,
  initialCandles,
  onTributeSubmit,
}) => {
  const [candlesCount, setCandlesCount] = useState(initialCandles);
  const [hasLitCandle, setHasLitCandle] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const confirmTribute = async () => {
    setIsSubmitting(true);
    try {
      await onTributeSubmit('candle', message);
      setCandlesCount(prev => prev + 1);
      setHasLitCandle(true);
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#fbbf24', '#d97706'],
      });
      setMessage('');
      setShowInput(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 text-zinc-100 shadow-md space-y-4">
      {/* Candle Counter & Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400">
            <Flame className={`w-5 h-5 ${hasLitCandle ? 'animate-pulse text-amber-300' : ''}`} aria-hidden="true" />
          </div>
          <div>
            <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Virtual Candles Lit</div>
            <div className="text-lg font-bold text-amber-400 font-mono">{candlesCount.toLocaleString()}</div>
          </div>
        </div>

        {hasLitCandle && (
          <span className="text-xs text-amber-300 font-medium bg-amber-950/50 border border-amber-800/60 px-3 py-1 rounded-full">
            Candle Burning in Memory
          </span>
        )}
      </div>

      {/* Single Action: Light Candle */}
      <div>
        <button
          onClick={() => setShowInput(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm rounded-xl shadow-md transition active:scale-95"
          aria-label={`Light a virtual candle in honor of ${storyName}`}
        >
          <Flame className="w-4 h-4 text-zinc-950" aria-hidden="true" />
          <span>Light Candle of Honor</span>
        </button>
      </div>

      {/* Tribute message drawer */}
      {showInput && (
        <div className="pt-3 border-t border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-300">
            <label htmlFor="tribute-message">Add an anonymous solidarity note for {storyName} (optional):</label>
            <button onClick={() => setShowInput(false)} className="text-zinc-500 hover:text-white" aria-label="Close input">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            id="tribute-message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. 'Your courage lives on in our collective fight for safety.'"
            maxLength={140}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowInput(false)}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              onClick={confirmTribute}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition"
            >
              {isSubmitting ? 'Lighting Candle...' : 'Confirm & Light Candle'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
