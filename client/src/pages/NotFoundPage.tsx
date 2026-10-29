import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShieldAlert, MessageSquare } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <SEO
        title="Page Not Found (404)"
        description="The requested page could not be located on Her Voice. Access emergency helplines or return to safe community support."
      />
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-purple-100 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-700 mx-auto flex items-center justify-center font-extrabold text-2xl font-mono border border-purple-200">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            The link you followed may be broken, or the page may have been moved to safeguard community privacy.
          </p>
        </div>

        {/* Quick Access Pathways */}
        <div className="space-y-2.5 pt-2">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/quick-report"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 transition"
          >
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>Immediate Emergency Triage (112)</span>
          </Link>

          <Link
            to="/herspace"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs rounded-xl border border-zinc-200 transition"
          >
            <MessageSquare className="w-4 h-4 text-purple-700" />
            <span>HerSpace Anonymous Feed</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-zinc-100 text-xs text-zinc-400">
          If you are in danger, please remember that calling <strong className="text-zinc-700">112</strong> or pressing <strong className="text-zinc-700">ESC</strong> for Quick Exit is always available.
        </div>
      </div>
    </div>
  );
};

