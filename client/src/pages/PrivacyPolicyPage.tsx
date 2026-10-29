import React from 'react';
import { ShieldCheck, Lock, EyeOff, MapPin, Mail, Phone, FileText } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <SEO
        title="Privacy Policy"
        description="Comprehensive privacy policy for Her Voice. Learn how we safeguard anonymous identities, enforce strict data minimization, and protect survivors."
      />

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-xs font-bold border border-purple-200">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
          <span>Data Protection & Privacy Policy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-zinc-500">
          Last updated & verified: October 2026 • Compliant with Digital Personal Data Protection (DPDP) Act & IT Act 2000/2021.
        </p>
      </div>

      {/* Core Privacy Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
            <Lock className="w-4 h-4 text-purple-700" />
            <span>Pseudonymous by Default</span>
          </div>
          <p className="text-[11px] text-zinc-600 leading-relaxed">
            Real names are never collected or shown. All community stories and comments are posted under generated pseudonyms.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
            <MapPin className="w-4 h-4 text-purple-700" />
            <span>Zero Precise GPS Tracking</span>
          </div>
          <p className="text-[11px] text-zinc-600 leading-relaxed">
            We never collect device GPS coordinates or street-level addresses. Approximate city filters operate solely with explicit consent.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
            <EyeOff className="w-4 h-4 text-purple-700" />
            <span>No Police Auto-Transmission</span>
          </div>
          <p className="text-[11px] text-zinc-600 leading-relaxed">
            Quick Report drafts are saved confidentially for triage and are never automatically dispatched to law enforcement.
          </p>
        </div>
      </div>

      {/* Main Privacy Text */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-sm space-y-8 text-xs sm:text-sm text-zinc-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900">1. Information We Collect (and What We Do NOT Collect)</h2>
          <p>
            Her Voice was founded on the principle of <strong>strict data minimization</strong>. We only process information that is strictly necessary to provide support:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-600 pl-2">
            <li><strong>Pseudonymous Profile:</strong> An anonymous randomized alias (e.g. <code>CourageousLotus42</code>) generated in your browser.</li>
            <li><strong>Community Contributions:</strong> Posts, supportive comments, and empathy reactions you choose to publish publicly.</li>
            <li><strong>Automated PII Filtration:</strong> Our server evaluates submitted text for phone numbers and physical addresses to alert you before accidental publication.</li>
            <li><strong>No Biometric or Surveillance Data:</strong> We do not collect government IDs, facial scans, IP addresses for tracking, or device fingerprints.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900">2. Local Storage and Cookies</h2>
          <p>
            Her Voice uses browser <code>localStorage</code> and <code>sessionStorage</code> solely for essential operations:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-600 pl-2">
            <li>Maintaining your chosen pseudonym across browser refreshes.</li>
            <li>Preserving your active draft in the Quick Report wizard.</li>
            <li>Storing your Quick Exit emergency destination preference.</li>
          </ul>
          <p>
            We do <strong>not</strong> install third-party advertising cookies, tracker pixels, or remarketing beacons.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900">3. Saathi AI Conversations and Data Confidentiality</h2>
          <p>
            Conversations with Saathi AI are processed locally using an open-weight model served via Ollama and our verified local RAG database. We do not sell, rent, or transfer your conversational transcripts to third-party advertising networks or commercial LLM training pools.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900">4. Emergency Local Data Wipe</h2>
          <p>
            You have the absolute right to purge all locally stored information at any time. Clicking <strong>Wipe Local Session Data</strong> in the Privacy Settings immediately flushes all cookies, bookmarks, drafts, and pseudonym associations from your active browser.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-zinc-100">
          <h2 className="text-base font-bold text-zinc-900">5. Real Contact Address & Grievance Officer</h2>
          <p>
            In compliance with Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and applicable data protection regulations:
          </p>
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2 text-xs text-zinc-800">
            <div><strong>Her Voice Open Source Initiative / Secretariat</strong></div>
            <div className="flex items-center gap-2 text-zinc-600">
              <MapPin className="w-3.5 h-3.5 text-purple-700" />
              <span>Civil Society Center, 4th Floor, Lodhi Institutional Area, New Delhi 110003, India</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <Mail className="w-3.5 h-3.5 text-purple-700" />
              <span>Grievance & Privacy Officer: <code>privacy@hervoice.org</code></span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <Phone className="w-3.5 h-3.5 text-purple-700" />
              <span>Administrative Secretariat: +91 11 2460 8400 (Mon–Fri, 10 AM – 5 PM IST)</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

