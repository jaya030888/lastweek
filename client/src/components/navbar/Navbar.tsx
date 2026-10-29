import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield,
  MessageSquare,
  ShieldAlert,
  Bot,
  Compass,
  Flame,
  Building2,
  Menu,
  X,
  UserCheck,
  Settings,
  Heart,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { QuickExitButton } from '../common/QuickExitButton';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { pseudonym, isModerator } = useUser();

  const navLinks = [
    { label: 'HerSpace', path: '/herspace', icon: MessageSquare },
    { label: 'Quick Report', path: '/quick-report', icon: ShieldAlert },
    { label: 'SafePath', path: '/safepath', icon: Shield },
    { label: 'Saathi AI', path: '/saathi-ai', icon: Bot },
    { label: 'Reality Simulator', path: '/simulator', icon: Compass },
    { label: 'Memorial', path: '/memorial', icon: Flame },
    { label: 'NGO Connect', path: '/ngos', icon: Building2 },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand (Clean, no emojis) */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="Her Voice Homepage">
            <div className="w-8 h-8 rounded-lg bg-purple-700 flex items-center justify-center text-white shadow-xs group-hover:bg-purple-800 transition">
              <Shield className="w-4 h-4 text-purple-100" aria-hidden="true" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-zinc-900 group-hover:text-purple-700 transition-colors">
                Her Voice
              </span>
              <p className="hidden sm:block text-[10px] text-zinc-500 font-medium tracking-tight -mt-0.5">
                Your story matters. Your identity is yours to protect.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Primary Navigation">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-purple-100/90 text-purple-900'
                      : 'text-zinc-600 hover:text-purple-900 hover:bg-zinc-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-purple-700' : 'text-zinc-500'}`} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions: Pseudonym pill & Quick Exit */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/privacy"
              title="Pseudonymous Identity Settings"
              className="hidden sm:flex items-center gap-1.5 bg-zinc-50 hover:bg-purple-50 text-zinc-700 hover:text-purple-900 px-2.5 py-1 rounded-lg text-xs font-medium border border-zinc-200 transition"
              aria-label={`Current pseudonymous profile: ${pseudonym}`}
            >
              <UserCheck className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
              <span className="truncate max-w-[110px]">{pseudonym}</span>
              <Settings className="w-3 h-3 text-zinc-400" aria-hidden="true" />
            </Link>

            {isModerator && (
              <Link
                to="/moderation"
                className="hidden md:inline-flex text-xs px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-lg border border-amber-300 hover:bg-amber-200"
              >
                Mod Queue
              </Link>
            )}

            {/* Quick Exit Header Button */}
            <QuickExitButton compact />

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <span className="text-xs text-zinc-500">Browsing as:</span>
            <Link
              to="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-purple-700 flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
              {pseudonym}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium ${
                    active
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-purple-700 underline"
            >
              Safety Guidelines
            </Link>
            <Link
              to="/privacy-policy"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-purple-700 underline"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-purple-700 underline"
            >
              Terms
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
