import React from 'react';
import { Scale, AlertTriangle, ShieldCheck, PhoneCall } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <SEO
        title="Terms of Service & Disclaimer"
        description="Terms of service and safety disclaimers for using Her Voice. Learn community rules and legal liability boundaries."
      />

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-xs font-bold border border-purple-200">
          <Scale className="w-3.5 h-3.5 text-purple-700" />
          <span>Legal Framework & Platform Disclaimers</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-zinc-500">
          Effective date: October 2026 • Open Source Platform Terms of Use
        </p>
      </div>

      {/* Emergency Notice Banner */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-xs text-red-950">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold">Not an Emergency Dispatcher:</strong>
          <span>
            Her Voice is not a law enforcement agency, hospital, or 911/112 emergency dispatch service. If you are facing an active life-threatening emergency, call <strong>112</strong> or your local emergency number immediately.
          </span>
        </div>
      </div>

      {/* Terms Body */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-sm space-y-8 text-xs sm:text-sm text-zinc-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or interacting with Her Voice, you agree to these Terms of Service, our Community Guidelines, and our Privacy Policy. If you do not agree with these principles, please exit the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900">2. Non-Clinical & Non-Legal Representation Disclaimer</h2>
          <p>
            The resources, checklists, and Saathi AI responses provided on Her Voice are for educational, informational, and emotional support purposes only. They do not constitute formal legal counsel, clinical psychiatric therapy, or emergency medical treatment. Always consult with authorized legal advocates or healthcare professionals for individualized case advice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900">3. Community Conduct & Prohibited Behavior</h2>
          <p>
            Her Voice strictly prohibits:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-600 pl-2">
            <li><strong>Doxxing:</strong> Publishing real names, personal contact numbers, workplace addresses, or private photos of any individual.</li>
            <li><strong>Harassment & Victim-Blaming:</strong> Questioning the credibility of survivors or using derogatory language.</li>
            <li><strong>Commercial Promotion & Spam:</strong> Soliciting services, spamming affiliate links, or advertising commercial products.</li>
            <li><strong>Malicious Impersonation:</strong> Falsely representing oneself as a law enforcement officer, attorney, or crisis counselor.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900">4. Third-Party Verified NGOs</h2>
          <p>
            Her Voice lists verified non-profit organizations and government helplines. All donation and assistance links direct to external, verified third-party websites. Her Voice does not process payments or accept custody of donations, and holds no liability for external organization operations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900">5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, the contributors, maintainers, and partners of the Her Voice Open Source Initiative shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this platform.
          </p>
        </section>
      </div>
    </div>
  );
};

