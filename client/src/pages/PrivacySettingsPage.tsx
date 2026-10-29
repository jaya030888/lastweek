import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  RefreshCw,
  Trash2,
  Lock,
  EyeOff,
  MapPin,
  ExternalLink,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useQuickExit } from '../context/QuickExitContext';
import { SEO } from '../components/common/SEO';

export const PrivacySettingsPage: React.FC = () => {
  const {
    pseudonym,
    setPseudonym,
    regeneratePseudonym,
    locationConsent,
    setLocationConsent,
    wipeAllLocalData,
    isModerator,
    toggleModerator,
  } = useUser();

  const { triggerExit, exitUrl, setExitUrl } = useQuickExit();
  const [customName, setCustomName] = useState(pseudonym);
  const [nameSaved, setNameSaved] = useState(false);
  const [confirmWipeOpen, setConfirmWipeOpen] = useState(false);

  const handleSavePseudonym = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName.trim()) {
      setPseudonym(customName.trim());
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <SEO
        title="Privacy & Anonymity Settings"
        description="Manage your pseudonymous persona, location consent flags, emergency quick-exit triggers, and local memory clearance controls."
      />
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-xs font-bold border border-purple-200">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
          <span>Security & Anonymity Controls</span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
          Privacy Settings & Anonymous Profile
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
          Your identity is yours to protect. Configure your public pseudonym, manage location permissions, and wipe local browser data on demand.
        </p>
      </div>

      {/* Pseudonym Management Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900">Your Pseudonymous Alias</h2>
            <p className="text-xs text-zinc-500">
              This name is shown when you publish stories or comments in HerSpace.
            </p>
          </div>
          <button
            onClick={() => {
              regeneratePseudonym();
              setCustomName(pseudonym);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl border border-purple-200 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate New Alias</span>
          </button>
        </div>

        <form onSubmit={handleSavePseudonym} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Enter your chosen pseudonym..."
              maxLength={24}
              className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-purple-600 font-bold"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow transition"
            >
              Save Alias
            </button>
          </div>
          {nameSaved && (
            <p className="text-xs text-emerald-600 font-medium">✓ Pseudonym updated successfully.</p>
          )}
        </form>
      </div>

      {/* Quick Exit Configuration Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-4">
        <div className="border-b border-zinc-100 pb-3">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-red-600" />
            <span>Quick Exit & Camouflage Target</span>
          </h2>
          <p className="text-xs text-zinc-500">
            Pressing <strong>Escape (ESC)</strong> or clicking the floating escape button redirects here immediately.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Emergency Redirect Destination URL
            </label>
            <input
              type="url"
              value={exitUrl}
              onChange={(e) => setExitUrl(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-800 font-mono"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={triggerExit}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition"
            >
              Test Quick Exit (ESC)
            </button>
            <span className="text-[11px] text-zinc-400">
              Instantly opens the disguised destination and rewrites browser tab title.
            </span>
          </div>
        </div>
      </div>

      {/* Location Sharing Consent Settings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-4">
        <div className="border-b border-zinc-100 pb-3">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-700" />
            <span>Optional Location Sharing</span>
          </h2>
          <p className="text-xs text-zinc-500">
            By default, location sharing is strictly disabled across Her Voice.
          </p>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-zinc-900 block">
              Allow approximate city discovery for shelters and legal aid
            </span>
            <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
              We never collect GPS coordinates. When enabled, your approximate city filters relevant support organizations in your state.
            </p>
          </div>
          <button
            onClick={() => setLocationConsent(!locationConsent)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              locationConsent
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
            }`}
          >
            {locationConsent ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* Anonymity Limitations Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <span>Understanding Device-Level Anonymity Limitations</span>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed">
          While Her Voice does not display your real identity or share your information with third parties, <strong>software running on a device monitored by an abuser cannot guarantee absolute safety</strong>.
        </p>
        <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
          <li>Spyware, keyloggers, or family-sharing iCloud/Google accounts can monitor screen activity.</li>
          <li>Always use private/incognito browsing and delete browser history after leaving.</li>
          <li>If you suspect your phone is tracked, use a secure device at a public library, workplace, or friend's home.</li>
        </ul>
      </div>

      {/* Emergency Wipe Local Session Data */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-200 shadow-sm space-y-4">
        <div className="border-b border-zinc-100 pb-3">
          <h2 className="text-base font-bold text-red-700 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-600" />
            <span>Emergency Local Data Wipe</span>
          </h2>
          <p className="text-xs text-zinc-500">
            Instantly clears all local bookmarks, saved report drafts, session IDs, and reset pseudonyms on this browser.
          </p>
        </div>

        {confirmWipeOpen ? (
          <div className="p-4 bg-red-50 border border-red-300 rounded-2xl space-y-3">
            <p className="text-xs font-bold text-red-900">
              Are you sure? This will permanently delete your session history and local drafts from this browser.
            </p>
            <div className="flex gap-2">
              <button
                onClick={wipeAllLocalData}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Yes, Wipe Everything Now
              </button>
              <button
                onClick={() => setConfirmWipeOpen(false)}
                className="px-3 py-2 bg-white border border-zinc-300 text-zinc-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmWipeOpen(true)}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-xl transition"
          >
            Wipe Local Session Data
          </button>
        )}
      </div>

      {/* Developer / Moderator Testing Sandbox */}
      <div className="p-4 bg-zinc-100 rounded-2xl flex items-center justify-between text-xs text-zinc-600">
        <span>Moderation Testing Shield:</span>
        <button
          onClick={toggleModerator}
          className={`px-3 py-1 rounded-lg font-bold text-xs ${
            isModerator ? 'bg-amber-600 text-white' : 'bg-zinc-200 text-zinc-700'
          }`}
        >
          {isModerator ? 'Moderator Role Active' : 'Switch to Moderator Role'}
        </button>
      </div>
    </div>
  );
};

