import React from 'react';
import {
  HeartHandshake,
  Shield,
  BookOpen,
  Sparkles,
  PhoneCall,
  Scale,
  Terminal,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const AboutSafetyGuidelinesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      <SEO
        title="Community Safety Guidelines & Legal Rights"
        description="Learn about Her Voice's trauma-informed community principles, strict anonymity protections, anti-doxxing policies, and verified legal frameworks."
      />
      {/* Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-purple-100 text-purple-900 rounded-full text-xs font-bold border border-purple-200">
          <HeartHandshake className="w-4 h-4 text-purple-700" />
          <span>About Her Voice</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
          Community Guidelines & Verified Legal Protections
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed italic">
          “Your story matters. Your identity is yours to protect.”
        </p>
      </div>

      {/* Section 1: The Hackathon Origin */}
      <section className="bg-gradient-to-r from-zinc-950 via-purple-950 to-zinc-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl border border-purple-800/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>The Origin & Vision Behind Her Voice</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">
          Why Halloween and Día de los Muertos?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          In fiction, horror consists of haunted houses, ghosts, and mythical monsters. But for millions of women across the globe, the most harrowing horrors unfold inside everyday living rooms, office corridors, and private chat screens. Coercive control, physical violence, and societal victim-blaming are all too real.
        </p>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          Inspired by Día de los Muertos, Her Voice centers on <strong>active remembrance</strong>. We honor the memories and sacrifices of women lost to gender violence not with hollow tragedy, but with unyielding solidarity, verified legal literacy, and actionable community protection.
        </p>
      </section>

      {/* Section 2: Community Guidelines */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
        <div className="border-b border-zinc-100 pb-3">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-700" />
            <span>HerSpace Community Guidelines</span>
          </h2>
          <p className="text-xs text-zinc-500">
            Our principles ensure that Her Voice remains a safe, empowering harbor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-700">
          <div className="p-4 bg-purple-50/60 rounded-2xl space-y-1.5 border border-purple-100">
            <strong className="block font-bold text-purple-950">1. Strict Anonymity & Anti-Doxxing</strong>
            <p className="text-zinc-600 leading-relaxed">
              Never share phone numbers, physical addresses, workplaces, or identifying real names. Protect yourself and others from retaliatory exposure.
            </p>
          </div>

          <div className="p-4 bg-purple-50/60 rounded-2xl space-y-1.5 border border-purple-100">
            <strong className="block font-bold text-purple-950">2. Zero Victim-Blaming</strong>
            <p className="text-zinc-600 leading-relaxed">
              Abuse is entirely the responsibility of the perpetrator. Questions like "Why didn't you leave?" or "What were you wearing?" are strictly prohibited.
            </p>
          </div>

          <div className="p-4 bg-purple-50/60 rounded-2xl space-y-1.5 border border-purple-100">
            <strong className="block font-bold text-purple-950">3. Trauma-Informed Dialogue</strong>
            <p className="text-zinc-600 leading-relaxed">
              Comment with empathy, listening ears, and solidarity. Avoid aggressive directives or pressuring someone into reckless confrontation with an abuser.
            </p>
          </div>

          <div className="p-4 bg-purple-50/60 rounded-2xl space-y-1.5 border border-purple-100">
            <strong className="block font-bold text-purple-950">4. Content Warnings for Triggers</strong>
            <p className="text-zinc-600 leading-relaxed">
              When describing sensitive incidents, use the Trigger Warning field to help community members navigate discussions safely.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Verified Legal Primer (India) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
        <div className="border-b border-zinc-100 pb-3">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-700" />
            <span>Essential Legal Protections in India</span>
          </h2>
          <p className="text-xs text-zinc-500">
            Verified statutory rights you are entitled to under Indian law.
          </p>
        </div>

        <div className="space-y-4 text-xs text-zinc-700">
          <div id="pwdva" className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1.5">
            <h3 className="font-bold text-purple-950 text-sm">
              Protection of Women from Domestic Violence Act, 2005 (PWDVA)
            </h3>
            <p className="leading-relaxed">
              Recognizes economic and emotional abuse as punishable domestic violence alongside physical violence. Guarantees the statutory <strong>Right to Reside</strong> in the shared household (Section 17), preventing illegal eviction. Courts can issue immediate Protection Orders barring the abuser from entering your workplace or contacting you.
            </p>
          </div>

          <div id="posh" className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1.5">
            <h3 className="font-bold text-purple-950 text-sm">
              POSH Act 2013 (Workplace Sexual Harassment)
            </h3>
            <p className="leading-relaxed">
              Mandates an <strong>Internal Committee (IC)</strong> headed by a senior woman in every organization with 10+ employees. Harassment includes unwelcome physical contact, demand for sexual favors, sexually colored remarks, or creating a hostile environment. An inquiry must conclude within 90 days, and complainants can request up to 3 months paid leave or team transfers during inquiry.
            </p>
          </div>

          <div id="zero-fir" className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1.5">
            <h3 className="font-bold text-purple-950 text-sm">
              The Constitutional Right to a "Zero FIR"
            </h3>
            <p className="leading-relaxed">
              Under Supreme Court directives (Lalita Kumari v. Govt of UP), a woman survivor can register an FIR at <strong>ANY police station</strong> in India, regardless of where the incident occurred. Police cannot cite jurisdictional lack to refuse registration; they must record the Zero FIR and transfer it to the local police station.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Open-Source Architecture */}
      <section className="bg-purple-950 text-zinc-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl border border-purple-800/50">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <Terminal className="w-4 h-4 text-purple-400" />
          <span>Open-Source AI & Transparent Technology</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Her Voice is built on the philosophy of full algorithmic transparency and user data sovereignty:
        </p>
        <ul className="text-xs text-zinc-300 space-y-1 list-disc list-inside">
          <li><strong>Frontend:</strong> React 18, TypeScript, Tailwind CSS, Framer Motion animations.</li>
          <li><strong>Backend:</strong> Node.js, Express.js, Prisma ORM with SQLite / PostgreSQL support.</li>
          <li><strong>AI Engine:</strong> Open-weight models served locally through Ollama (e.g. LLaMA-3 / Mistral / Qwen) with local verified RAG retrieval.</li>
          <li><strong>Graceful Fallback:</strong> Zero server crashes; deterministic trauma-informed safety guidance operates 100% offline if Ollama is unreachable.</li>
        </ul>
      </section>
    </div>
  );
};

