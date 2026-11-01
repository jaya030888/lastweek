import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ShieldAlert,
  MessageSquare,
  Bot,
  Compass,
  Flame,
  Building2,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  EyeOff,
  Lock,
  ChevronRight,
  AlertTriangle,
  Heart,
  Users,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { SEO } from '../components/common/SEO';

export const LandingPage: React.FC = () => {
  const { pseudonym } = useUser();

  const features = [
    {
      title: 'HerSpace Community',
      tagline: 'Anonymous Empathy Feed',
      description:
        'Share experiences and receive trauma-informed support without fear of exposure. React with solidarity, listening ears, and empathy.',
      icon: MessageSquare,
      path: '/herspace',
      badge: 'Pseudonymous',
    },
    {
      title: 'Quick Report Wizard',
      tagline: 'Safe, Accessible Reporting',
      description:
        'A discreet step-by-step reporting guide with immediate danger triage, optional voice notes, and direct 112 emergency routing.',
      icon: ShieldCheck,
      path: '/quick-report',
      badge: 'Confidential',
    },
    {
      title: 'SafePath Hub',
      tagline: 'Actionable Safety Planning',
      description:
        'Emergency grab-bag checklist, digital privacy audits, relationship red-flag diagnostics, and verified 24x7 shelter directories.',
      icon: Shield,
      path: '/safepath',
      badge: 'Verified',
    },
    {
      title: 'Saathi AI Companion',
      tagline: 'Empathetic AI Guidance',
      description:
        'Trauma-informed guidance powered by an open-weight local model. Informs on legal rights in English & Hindi, and formal complaint drafting.',
      icon: Bot,
      path: '/saathi-ai',
      badge: 'Open-Weight LLM',
    },
    {
      title: 'Remember Her & Support NGOs',
      tagline: 'Memorial & Frontline Giving',
      description:
        'A unified sanctuary honoring pioneer lives with virtual candles and marigolds, paired with direct giving to verified non-profits offering shelter and legal defense.',
      icon: Flame,
      path: '/memorial',
      badge: 'Memorial & NGOs',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      <SEO
        title="Home — Women's Safety, Support & Awareness"
        description="Her Voice is an open-source platform for women's safety, anonymous community support, verified reporting guidance, Saathi AI companion, and reality simulator."
      />

      {/* Hero Section — CTA Above the Fold */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-zinc-200 bg-gradient-to-b from-purple-50/60 via-white to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pseudonym Status Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-purple-200 text-purple-900 text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" aria-hidden="true" />
              <span>Safe &amp; Confidential • Browsing as: {pseudonym}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 leading-tight">
              Your story matters.{' '}
              <span className="text-purple-700 block mt-1">
                Your identity is yours to protect.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto">
              An open-source, trauma-informed digital sanctuary. Access anonymous community solidarity, build safety plans, converse with Saathi AI, and find verified emergency and legal pathways.
            </p>

            {/* CTA Above the Fold (High contrast, clutter-free, responsive) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/herspace"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition active:scale-95"
                aria-label="Enter HerSpace anonymous community feed"
              >
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
                <span>Enter HerSpace Community</span>
              </Link>

              <Link
                to="/quick-report"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition active:scale-95"
                aria-label="Open emergency quick report triage"
              >
                <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                <span>Emergency Quick Report (112)</span>
              </Link>

              <Link
                to="/memorial"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm rounded-xl border border-zinc-700 shadow-sm transition active:scale-95"
                aria-label="Open Memorial & NGO Giving Hub"
              >
                <Flame className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>Memorial &amp; Support NGOs</span>
              </Link>
            </div>

            {/* Guarantee Strip */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-zinc-600">
              <div className="flex items-center justify-center gap-2 bg-white p-2.5 rounded-xl border border-zinc-200">
                <Lock className="w-4 h-4 text-purple-700 shrink-0" aria-hidden="true" />
                <span>100% Pseudonymous Identity</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white p-2.5 rounded-xl border border-zinc-200">
                <EyeOff className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                <span>Instant Quick Exit (ESC key)</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white p-2.5 rounded-xl border border-zinc-200">
                <PhoneCall className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
                <span>Direct Access to 112 &amp; 1091</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hackathon Theme Spotlight: Clean, Decluttered Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-purple-900/40 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-900/50 text-purple-200 rounded-full text-xs font-semibold border border-purple-700/50">
              <Shield className="w-3.5 h-3.5 text-purple-300" aria-hidden="true" />
              <span>Theme: Halloween &amp; Día de los Muertos</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
              Real-world violence can be more frightening than fictional horror.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Fictional monsters vanish with the dawn, but coercive control, domestic abuse, and victim-blaming persist in everyday lives. True remembrance honors survivors by dismantling silence, building legal literacy, and taking collective action.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/memorial"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow transition"
                aria-label="Visit Digital Memorial & Verified NGOs"
              >
                <Flame className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                <span>Visit Digital Memorial &amp; Support NGOs</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid (Clean, Generic Icons) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Comprehensive Sanctuary for Safety &amp; Support
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            Engineered with privacy-by-design, verified sources, and open-source AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Link
                key={idx}
                to={feature.path}
                className="group bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs hover:shadow-lg hover:border-purple-300 transition-all flex flex-col justify-between space-y-4"
                aria-label={`Explore ${feature.title}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center shadow-xs group-hover:bg-purple-700 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                      {feature.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-zinc-900 group-hover:text-purple-700 transition-colors">
                      {feature.title}
                    </h3>
                    <div className="text-xs font-semibold text-purple-600 mb-1">{feature.tagline}</div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center text-xs font-bold text-purple-700 group-hover:translate-x-1 transition-transform">
                  <span>Explore feature</span>
                  <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Testimonial Quote */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-purple-50/70 border border-purple-200 rounded-3xl p-8 sm:p-10 text-center space-y-3">
          <blockquote className="text-sm sm:text-base font-medium text-purple-950 italic leading-relaxed">
            “The silence was the heaviest thing I carried. Finding a space where I could speak my truth under a pseudonym, without anyone questioning my credibility or taking my agency away, was the beginning of my healing.”
          </blockquote>
          <div className="text-xs font-bold text-purple-800">
            — Anonymous HerSpace Community Member
          </div>
        </div>
      </section>
    </div>
  );
};
