import React, { useState } from 'react';
import { Heart, ExternalLink, ShieldCheck, DollarSign, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Ngo } from '../../types';

interface DonationModalProps {
  ngo: Ngo | null;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ ngo, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(500);
  const [customAmount, setCustomAmount] = useState('');
  const [donorPseudonym, setDonorPseudonym] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!ngo) return null;

  const presetAmounts = [250, 500, 1000, 2500, 5000];

  const handleSimulateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9333ea', '#a855f7', '#f59e0b', '#10b981'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-zinc-100 shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition"
          aria-label="Close donation modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-xs font-semibold border border-purple-700/50">
            <Heart className="w-3.5 h-3.5 text-purple-400" />
            <span>Direct Solidarity Giving</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Support {ngo.name}
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Your contribution directly assists frontline survivor shelter, emergency trauma therapy, and legal defense.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-900/80 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-emerald-300">Thank You for Your Generosity</h4>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Your pledged donation helps transform remembrance into living protection. To complete official tax-exempt payment directly to {ngo.name}:
              </p>
            </div>
            <a
              href={ngo.officialDonationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              <span>Proceed to Official {ngo.name} Portal ↗</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="text-xs text-zinc-400 hover:text-zinc-200 underline block mx-auto pt-2"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSimulateDonation} className="space-y-5">
            {/* Quick Amount Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-300">
                Choose Donation Amount (INR ₹):
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                      selectedAmount === amt
                        ? 'bg-purple-700 text-white border-purple-500 shadow-sm'
                        : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount input */}
            <div className="space-y-1.5">
              <label htmlFor="custom-amount" className="block text-xs font-semibold text-zinc-300">
                Or enter custom amount:
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-zinc-400 text-xs font-bold">₹</span>
                <input
                  id="custom-amount"
                  type="number"
                  min="50"
                  max="100000"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  placeholder="e.g. 1500"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-8 pr-4 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Pseudonymous note */}
            <div className="space-y-1.5">
              <label htmlFor="donor-note" className="block text-xs font-semibold text-zinc-300">
                Solidarity Note or Pseudonym (optional):
              </label>
              <input
                id="donor-note"
                type="text"
                maxLength={60}
                value={donorPseudonym}
                onChange={(e) => setDonorPseudonym(e.target.value)}
                placeholder="e.g. 'In memory of survivors everywhere'"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Transparency guarantee */}
            <div className="p-3 bg-zinc-800/60 rounded-xl border border-zinc-700/60 flex items-start gap-2.5 text-[11px] text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>100% Direct Giving Policy:</strong> Her Voice never takes platform fees or processes bank payments. All giving directly links to registered, certified NGO portals.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 px-4 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <Heart className="w-3.5 h-3.5 text-purple-200" />
                <span>Pledge ₹{customAmount || selectedAmount || 500} &amp; Donate</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
