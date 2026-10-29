import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Heart, ArrowRight, Home } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const ThankYouPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'general';

  const config = {
    report: {
      title: 'Your Confidential Draft is Saved',
      subtitle: 'Thank you for taking this courageous step.',
      body: 'Your draft has been stored securely in your active session. It has NOT been sent to external authorities. You can copy the narrative or proceed to guided support.',
      primaryBtn: { label: 'Explore Verified Shelters & NGOs', path: '/ngos' },
    },
    story: {
      title: 'Your Voice Has Been Shared',
      subtitle: 'Thank you for breaking the silence.',
      body: 'Your experience is now published pseudonymously in HerSpace. Community members can read, offer empathetic solidarity, and find strength in your courage.',
      primaryBtn: { label: 'View in HerSpace Feed', path: '/herspace' },
    },
    tribute: {
      title: 'Tribute Received in Honor',
      subtitle: 'Her memory continues to inspire change.',
      body: 'Your virtual candle or marigold offering has been placed in the digital memorial. Thank you for reaffirming our collective commitment to justice.',
      primaryBtn: { label: 'Return to Digital Memorial', path: '/memorial' },
    },
    general: {
      title: 'Thank You for Connecting',
      subtitle: 'Your story matters. Your identity is protected.',
      body: 'Her Voice is dedicated to standing with you with empathy, privacy, and verified support pathways.',
      primaryBtn: { label: 'Return to Sanctuary Homepage', path: '/' },
    },
  }[type as 'report' | 'story' | 'tribute'] || {
    title: 'Thank You for Connecting',
    subtitle: 'Your story matters. Your identity is protected.',
    body: 'Her Voice is dedicated to standing with you with empathy, privacy, and verified support pathways.',
    primaryBtn: { label: 'Return to Sanctuary Homepage', path: '/' },
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <SEO
        title="Thank You | Her Voice"
        description="Confirmation and safe next steps for community contributions, reports, and tributes on Her Voice."
      />
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-purple-100 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            {config.title}
          </h1>
          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
            {config.subtitle}
          </p>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed pt-1">
            {config.body}
          </p>
        </div>

        <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-2xl flex items-center gap-2.5 text-xs text-purple-900 text-left">
          <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
          <span>
            Remember: You can press <strong>ESC</strong> at any point to trigger an instant Quick Exit to a neutral weather page.
          </span>
        </div>

        <div className="space-y-2.5 pt-2">
          <Link
            to={config.primaryBtn.path}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <span>{config.primaryBtn.label}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs rounded-xl border border-zinc-200 transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

