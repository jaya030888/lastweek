import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { QuickExitProvider } from './context/QuickExitContext';
import { EmergencyBanner } from './components/common/EmergencyBanner';
import { Navbar } from './components/navbar/Navbar';
import { Footer } from './components/footer/Footer';
import { QuickExitButton } from './components/common/QuickExitButton';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { StickyMobileCTA } from './components/common/StickyMobileCTA';
import { analytics } from './utils/analytics';
import { Loader2 } from 'lucide-react';

// Code-split dynamic page imports for optimal bundle size and fast TTFB
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const HerSpaceFeed = lazy(() => import('./pages/HerSpaceFeed').then(m => ({ default: m.HerSpaceFeed })));
const QuickReportPage = lazy(() => import('./pages/QuickReportPage').then(m => ({ default: m.QuickReportPage })));
const SafePathHub = lazy(() => import('./pages/SafePathHub').then(m => ({ default: m.SafePathHub })));
const SaathiAiChat = lazy(() => import('./pages/SaathiAiChat').then(m => ({ default: m.SaathiAiChat })));
const MemorialPage = lazy(() => import('./pages/MemorialPage').then(m => ({ default: m.MemorialPage })));
const PrivacySettingsPage = lazy(() => import('./pages/PrivacySettingsPage').then(m => ({ default: m.PrivacySettingsPage })));
const ModerationDashboard = lazy(() => import('./pages/ModerationDashboard').then(m => ({ default: m.ModerationDashboard })));
const AboutSafetyGuidelinesPage = lazy(() => import('./pages/AboutSafetyGuidelinesPage').then(m => ({ default: m.AboutSafetyGuidelinesPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage').then(m => ({ default: m.ThankYouPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));

const PageLoadingFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-purple-700">
    <Loader2 className="w-8 h-8 animate-spin" />
    <span className="text-xs font-semibold text-zinc-500">Securing environment & loading resource...</span>
  </div>
);

// Route Tracker for privacy-preserving analytics
const AnalyticsRouteTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    analytics.trackPageView(location.pathname);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <UserProvider>
      <QuickExitProvider>
        <Router>
          <AnalyticsRouteTracker />
          <div className="flex flex-col min-h-screen">
            {/* Top Emergency 112 Banner */}
            <EmergencyBanner />

            {/* Navigation Header */}
            <Navbar />

            {/* Main Content View with Code-Splitting Suspense */}
            <main className="flex-1 pb-14 sm:pb-0">
              <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/herspace" element={<HerSpaceFeed />} />
                  <Route path="/quick-report" element={<QuickReportPage />} />
                  <Route path="/safepath" element={<SafePathHub />} />
                  <Route path="/saathi-ai" element={<SaathiAiChat />} />
                  <Route path="/memorial" element={<MemorialPage />} />
                  <Route path="/ngos" element={<MemorialPage />} />
                  <Route path="/privacy" element={<PrivacySettingsPage />} />
                  <Route path="/moderation" element={<ModerationDashboard />} />
                  <Route path="/about" element={<AboutSafetyGuidelinesPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/thank-you" element={<ThankYouPage />} />
                  {/* Custom 404 Catch-All */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>

            {/* Sticky Mobile Call to Action */}
            <StickyMobileCTA />

            {/* Global Floating Quick Exit & Camouflage Trigger */}
            <QuickExitButton />

            {/* Privacy-Preserving Cookie Notice */}
            <CookieConsentBanner />

            {/* Comprehensive Decluttered Footer */}
            <Footer />
          </div>
        </Router>
      </QuickExitProvider>
    </UserProvider>
  );
};

export default App;
