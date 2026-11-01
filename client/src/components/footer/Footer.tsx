import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, PhoneCall, Mail, MapPin, ExternalLink, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-12 pb-20 sm:pb-14 border-t border-zinc-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Emergency Highlight */}
        <div className="bg-purple-950/40 border border-purple-800/40 rounded-2xl p-5 text-zinc-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-purple-200">
              <PhoneCall className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>Verified 24x7 Emergency Helplines (India)</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              All calls are toll-free and confidential. If in active physical danger, move to a secure space immediately.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            <a
              href="tel:112"
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              aria-label="Call emergency 112"
            >
              <span>112</span>
              <span className="text-[10px] opacity-80">(National Emergency)</span>
            </a>
            <a
              href="tel:1091"
              className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              aria-label="Call women in distress helpline 1091"
            >
              <span>1091 / 181</span>
              <span className="text-[10px] opacity-80">(Women Cell)</span>
            </a>
            <a
              href="tel:7827170170"
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 rounded-lg text-xs font-bold border border-zinc-700 transition"
              aria-label="Call NCW helpline 7827170170"
            >
              <span>7827170170</span>
              <span className="text-[10px] opacity-80">(NCW Line)</span>
            </a>
            <a
              href="tel:1930"
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-purple-300 rounded-lg text-xs font-bold border border-zinc-700 transition"
              aria-label="Call cyber crime helpline 1930"
            >
              <span>1930</span>
              <span className="text-[10px] opacity-80">(Cybercrime)</span>
            </a>
          </div>
        </div>

        {/* 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Mission & Legal Address */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-6 h-6 rounded-md bg-purple-700 flex items-center justify-center text-white">
                <Shield className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <span>Her Voice</span>
            </div>
            <p className="text-xs text-zinc-400 italic">
              “Your story matters. Your identity is yours to protect.”
            </p>
            <div className="pt-2 text-xs text-zinc-400 space-y-1">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Civil Society Center, 4th Floor, Lodhi Institutional Area, New Delhi 110003, India</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" aria-hidden="true" />
                <a href="mailto:privacy@hervoice.org" className="hover:text-purple-300">privacy@hervoice.org</a>
              </div>
            </div>
          </div>

          {/* Col 2: Core Platform Navigation */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Core Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/herspace" className="hover:text-purple-400 transition">HerSpace Community Feed</Link></li>
              <li><Link to="/quick-report" className="hover:text-purple-400 transition">Quick Report & Guided Triage</Link></li>
              <li><Link to="/safepath" className="hover:text-purple-400 transition">SafePath Safety Planning</Link></li>
              <li><Link to="/saathi-ai" className="hover:text-purple-400 transition">Saathi AI Companion</Link></li>
              <li><Link to="/memorial" className="hover:text-purple-400 transition">Remember Her Memorial &amp; NGOs</Link></li>
            </ul>
          </div>

          {/* Col 3: Privacy, Legal & Policy */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Legal & Governance</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/privacy-policy" className="hover:text-purple-400 transition font-medium">Privacy Policy (DPDP & IT Act)</Link></li>
              <li><Link to="/terms" className="hover:text-purple-400 transition font-medium">Terms of Service</Link></li>
              <li><Link to="/about" className="hover:text-purple-400 transition">Community Guidelines & Law</Link></li>
              <li><Link to="/privacy" className="hover:text-purple-400 transition">Anonymity & Local Wipe</Link></li>
              <li><Link to="/about#posh" className="hover:text-purple-400 transition">POSH Act (Workplace Rights)</Link></li>
              <li><Link to="/about#pwdva" className="hover:text-purple-400 transition">PWDVA 2005 (Domestic Abuse)</Link></li>
              <li><Link to="/about#zero-fir" className="hover:text-purple-400 transition">Zero FIR Filing Directives</Link></li>
            </ul>
          </div>

          {/* Col 4: Hackathon Theme & Open-Source Engine */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-2">Hackathon Mission</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Theme: Halloween & Día de los Muertos. Real-world violence can be more harrowing than fictional horror. True remembrance transforms sorrow into active legal protection and community solidarity.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
              <Terminal className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
              <span>Ollama Local Model + RAG Fallback</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 text-center md:text-left">
          <p>
            Her Voice is not a substitute for formal law enforcement, legal advocacy, or medical consultation. In emergencies, call 112.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:underline">Terms of Use</Link>
            <span>•</span>
            <Link to="/about" className="hover:underline">Contact & Grievance</Link>
            <span>•</span>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
