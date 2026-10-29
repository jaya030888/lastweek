import React, { useState } from 'react';
import { Flame, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CandleOfferingProps {
  storyName: string;
  initialCandles: number;
  initialMarigolds: number;
  onTributeSubmit: (type: 'candle' | 'marigold', message?: string) => Promise<void>;
}

export const CandleOffering: React.FC<CandleOfferingProps> = ({
  storyName,
  initialCandles,
  initialMarigolds,
  onTributeSubmit,
}) => {
  const [candlesCount, setCandlesCount] = useState(initialCandles);
  const [marigoldsCount, setMarigoldsCount] = useState(initialMarigolds);
  const [hasLitCandle, setHasLitCandle] = useState(false);
  const [hasOfferedMarigold, setHasOfferedMarigold] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [activeType, setActiveType] = useState<'candle' | 'marigold'>('candle');

  const handleTribute = async (type: 'candle' | 'marigold') => {
    setActiveType(type);
    setShowInput(true);
  };

  const confirmTribute = async () => {
    setIsSubmitting(true);
    try {
      await onTributeSubmit(activeType, message);
      if (activeType === 'candle') {
        setCandlesCount(prev => prev + 1);
        setHasLitCandle(true);
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#f59e0b', '#fbbf24', '#d97706'],
        });
      } else {
        setMarigoldsCount(prev => prev + 1);
        setHasOfferedMarigold(true);
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#ea580c', '#f59e0b', '#fb923c'],
        });
      }
      setMessage('');
      setShowInput(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-zinc-100 shadow-md space-y-4">
      {/* Counters & visual icons */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400">
            <Flame className={`w-4 h-4 ${hasLitCandle ? 'animate-pulse text-amber-300' : ''}`} aria-hidden="true" />
          </div>
          <div>
            <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Virtual Candles</div>
            <div className="text-base font-bold text-amber-400 font-mono">{candlesCount.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-950/80 border border-orange-800/60 flex items-center justify-center text-orange-400">
            <Sparkles className={`w-4 h-4 ${hasOfferedMarigold ? 'animate-spin text-orange-300' : ''}`} aria-hidden="true" />
          </div>
          <div>
            <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Marigold Petals</div>
            <div className="text-base font-bold text-orange-400 font-mono">{marigoldsCount.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          onClick={() => handleTribute('candle')}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl shadow-xs transition active:scale-95"
          aria-label={`Light a virtual candle in honor of ${storyName}`}
        >
          <Flame className="w-3.5 h-3.5 text-zinc-950" aria-hidden="true" />
          <span>Light Candle of Honor</span>
        </button>

        <button
          onClick={() => handleTribute('marigold')}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-orange-700 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95"
          aria-label={`Offer marigold petals in honor of ${storyName}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-200" aria-hidden="true" />
          <span>Offer Marigold Petals</span>
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
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
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
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg transition"
            >
              {isSubmitting ? 'Placing Offering...' : `Place ${activeType === 'candle' ? 'Candle' : 'Marigold'}`}
            </button>
          </div>
        </div>
      )}

      {(hasLitCandle || hasOfferedMarigold) && (
        <div className="text-center text-xs text-amber-300 font-medium py-1">
          Thank you for honoring her life and memory with solidarity.
        </div>
      )}
    </div>
  );
};
