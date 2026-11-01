import React, { useState, useEffect } from 'react';
import {
  Shield,
  CheckSquare,
  AlertTriangle,
  PhoneCall,
  Search,
  MapPin,
  ExternalLink,
  BookOpen,
  Lock,
  Smartphone,
  Key,
  FileText,
  Heart,
  Navigation,
  Route,
  Clock,
  LocateFixed,
} from 'lucide-react';
import { api } from '../services/api';
import { SafetyResource } from '../types';
import { SEO } from '../components/common/SEO';
import { CardGridSkeleton } from '../components/common/LoadingStates';

export const SafePathHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'planner' | 'diagnostic' | 'resources'>('planner');

  // Safety Planner Checklist State
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    'doc-id': false,
    'doc-certs': false,
    'cash-hidden': false,
    'keys-dup': false,
    'meds-supply': false,
    'backup-phone': false,
    'code-word': false,
    'digital-cleanup': false,
  });

  const toggleChecklistItem = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const checklistCompletedCount = Object.values(checklist).filter(Boolean).length;

  // Route planner state (kept entirely inside the SafePath page)
  const [routeOrigin, setRouteOrigin] = useState('');
  const [routeDestination, setRouteDestination] = useState('');
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState('');
  const [routeResult, setRouteResult] = useState<{
    distanceKm: number;
    durationMinutes: number;
    mapUrl: string;
  } | null>(null);

  const findSafePath = async () => {
    if (!routeOrigin.trim() || !routeDestination.trim()) {
      setRouteError('Please enter both your starting point and destination.');
      setRouteResult(null);
      return;
    }

    setRouteLoading(true);
    setRouteError('');
    setRouteResult(null);

    try {
      const geocode = async (place: string) => {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(place)}`
        );
        if (!response.ok) throw new Error('Location search is temporarily unavailable. Please try again.');
        const results = await response.json();
        if (!results.length) throw new Error(`Could not find: ${place}. Try adding the city or state.`);
        return { lat: Number(results[0].lat), lon: Number(results[0].lon) };
      };

      const [start, end] = await Promise.all([
        geocode(routeOrigin.trim()),
        geocode(routeDestination.trim()),
      ]);

      const routeResponse = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=false&steps=false`
      );
      if (!routeResponse.ok) throw new Error('Could not calculate a route right now. Please try again.');
      const routeData = await routeResponse.json();
      if (routeData.code !== 'Ok' || !routeData.routes?.length) {
        throw new Error('No drivable route was found between these locations.');
      }

      const bestRoute = routeData.routes[0];
      const mapUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${start.lat}%2C${start.lon}%3B${end.lat}%2C${end.lon}`;
      setRouteResult({
        distanceKm: bestRoute.distance / 1000,
        durationMinutes: bestRoute.duration / 60,
        mapUrl,
      });
    } catch (error) {
      setRouteError(error instanceof Error ? error.message : 'Something went wrong while finding the route.');
    } finally {
      setRouteLoading(false);
    }
  };

  // Red Flag Diagnostic State
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<{ [key: number]: number }>({});
  const [showDiagnosticScore, setShowDiagnosticScore] = useState(false);

  const diagnosticQuestions = [
    {
      id: 1,
      q: 'Does your partner or family member demand full oversight of your financial accounts or forbid you from keeping your own money?',
      category: 'Financial Control',
    },
    {
      id: 2,
      q: 'Do they inspect your text messages, call history, or demand your social media passwords under the guise of "transparency"?',
      category: 'Digital Surveillance',
    },
    {
      id: 3,
      q: 'Do they create conflicts right before you plan to visit friends, family, or professional networking events to keep you isolated?',
      category: 'Social Isolation',
    },
    {
      id: 4,
      q: 'When you bring up your feelings, do they insist "you are imagining things", "too sensitive", or rewrite the history of what happened (Gaslighting)?',
      category: 'Psychological Gaslighting',
    },
    {
      id: 5,
      q: 'Have they ever blocked the doorway, confiscated your car/house keys, or prevented you from leaving a room during a disagreement?',
      category: 'Physical Intimidation',
    },
    {
      id: 6,
      q: 'Do they alternate between intense hostility and sudden excessive affection ("love bombing") that keeps you walking on eggshells?',
      category: 'Cycle of Abuse',
    },
    {
      id: 7,
      q: 'Have they threatened self-harm or threatened to ruin your reputation if you ever mention ending the relationship?',
      category: 'Coercive Blackmail',
    },
    {
      id: 8,
      q: 'Have they ever broken objects, slammed fists near you, or made subtle gestures that make you feel physically unsafe?',
      category: 'Veiled Physical Threats',
    },
  ];

  const handleAnswerDiagnostic = (qId: number, score: number) => {
    setDiagnosticAnswers(prev => ({ ...prev, [qId]: score }));
  };

  const calculateDiagnosticRisk = () => {
    return Object.values(diagnosticAnswers).reduce((a, b) => a + b, 0);
  };

  // Resources Directory State
  const [resources, setResources] = useState<SafetyResource[]>([]);
  const [resourceCategory, setResourceCategory] = useState('all');
  const [searchCity, setSearchCity] = useState('');
  const [loadingResources, setLoadingResources] = useState(false);

  const fetchResources = async () => {
    setLoadingResources(true);
    try {
      const data = await api.getResources({
        category: resourceCategory,
        city: searchCity || undefined,
      });
      setResources(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResources(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'resources') {
      fetchResources();
    }
  }, [activeTab, resourceCategory]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <SEO
        title="SafePath Hub — Safety Planning & Verified Helplines"
        description="Actionable safety planning, emergency grab-bag checklists, relationship red-flag diagnostics, and verified 24/7 shelters across India."
      />

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-xs font-bold border border-purple-200">
          <Shield className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
          <span>SafePath Interactive Safety Hub</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
          Practical Safety Planning &amp; Verified Resources
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl leading-relaxed">
          Knowledge is safety. Build an emergency departure checklist, analyze behavioral red flags without self-doubt, and access verified government and civil helplines.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 space-x-2 sm:space-x-4" role="tablist">
        {[
          { id: 'planner', label: '1. Emergency Safety Planner', count: `${checklistCompletedCount}/8 ready` },
          { id: 'diagnostic', label: '2. Red Flag Relationship Diagnostic' },
          { id: 'resources', label: '3. Verified Helplines & Shelters' },
        ].map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition ${
              activeTab === tab.id
                ? 'border-purple-700 text-purple-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count && (
              <span className="ml-2 text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-semibold">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: SAFETY PLANNER */}
      {activeTab === 'planner' && (
        <div className="space-y-8">
          {/* Start-to-destination route finder */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-5" aria-labelledby="route-planner-title">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                <Navigation className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h2 id="route-planner-title" className="text-lg font-bold text-zinc-900">SafePath Route Finder</h2>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Enter your starting point and destination to find a suggested road route.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="space-y-1.5 text-xs font-semibold text-zinc-700">
                Initial Location
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-emerald-600" aria-hidden="true" />
                  <input
                    type="text"
                    value={routeOrigin}
                    onChange={(e) => setRouteOrigin(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && findSafePath()}
                    placeholder="e.g. Gandhi Maidan, Patna"
                    className="w-full pl-9 pr-3 py-3 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
                    autoComplete="street-address"
                  />
                </div>
              </label>
              <label className="space-y-1.5 text-xs font-semibold text-zinc-700">
                Destination
                <div className="relative">
                  <LocateFixed className="w-4 h-4 absolute left-3 top-3 text-red-600" aria-hidden="true" />
                  <input
                    type="text"
                    value={routeDestination}
                    onChange={(e) => setRouteDestination(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && findSafePath()}
                    placeholder="e.g. Patna Junction, Patna"
                    className="w-full pl-9 pr-3 py-3 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
                    autoComplete="street-address"
                  />
                </div>
              </label>
            </div>

            <button
              type="button"
              onClick={findSafePath}
              disabled={routeLoading}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition disabled:opacity-60"
            >
              {routeLoading ? <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Finding route...</> : <><Route className="w-4 h-4" aria-hidden="true" /> Find Suggested Route</>}
            </button>

            {routeError && (
              <p role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">{routeError}</p>
            )}

            {routeResult && (
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-3" role="status">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-purple-950">
                    <Route className="w-4 h-4 text-purple-700" aria-hidden="true" />
                    {routeResult.distanceKm.toFixed(1)} km
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-purple-950">
                    <Clock className="w-4 h-4 text-purple-700" aria-hidden="true" />
                    About {Math.round(routeResult.durationMinutes)} min
                  </div>
                </div>
                <p className="text-xs text-purple-900">
                  A suggested driving route is ready. Open the map to view the route and navigation details.
                </p>
                <a
                  href={routeResult.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl"
                >
                  Open route map <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            )}

            <p className="text-[11px] text-zinc-500 leading-relaxed">
              <strong>Important safety note:</strong> This tool provides a suggested driving route based on OpenStreetMap road data. It cannot verify real-time crime, lighting, traffic, closures, or personal safety, so it cannot guarantee the safest route. If you are in immediate danger, call 112. Location searches are sent to OpenStreetMap services to calculate the route.
            </p>
          </section>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Emergency Grab-Bag Checklist</h2>
                <p className="text-xs text-zinc-500">
                  Keep these items assembled in an accessible, secret spot (e.g. at a trusted friend’s home or workplace desk).
                </p>
              </div>
              <div className="px-3.5 py-1.5 bg-purple-50 text-purple-800 rounded-full text-xs font-bold border border-purple-200">
                Preparedness: {Math.round((checklistCompletedCount / 8) * 100)}%
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                {
                  id: 'doc-id',
                  icon: Key,
                  title: 'Duplicate Photocopies of Key IDs',
                  desc: 'Aadhaar card, voter ID, passport, driving license stored securely in physical copy or encrypted drive.',
                },
                {
                  id: 'doc-certs',
                  icon: FileText,
                  title: 'Essential Legal Documents',
                  desc: 'Marriage certificate, children birth certificates, vehicle registration, property deeds, lease agreement.',
                },
                {
                  id: 'cash-hidden',
                  icon: Lock,
                  title: 'Confidential Emergency Cash Fund',
                  desc: 'Physical paper currency hidden separately from shared joint accounts, enough for travel and lodging.',
                },
                {
                  id: 'keys-dup',
                  icon: Key,
                  title: 'Spare House & Car Keys',
                  desc: 'Duplicate keys left with a trusted ally so you are not stranded if locked out.',
                },
                {
                  id: 'meds-supply',
                  icon: Heart,
                  title: 'Essential Prescription Medications',
                  desc: 'At least 7 days of daily medications for yourself and children, plus medical prescriptions.',
                },
                {
                  id: 'backup-phone',
                  icon: Smartphone,
                  title: 'Backup Pre-paid Phone & Charger',
                  desc: 'An inexpensive secondary phone that has not been synced or monitored by an abuser.',
                },
                {
                  id: 'code-word',
                  icon: Shield,
                  title: 'Established Emergency Code Word',
                  desc: 'A single word (e.g. "Lavender") sent to 2 contacts meaning: "Call 112 immediately and dispatch help to me."',
                },
                {
                  id: 'digital-cleanup',
                  icon: Smartphone,
                  title: 'Digital Safety Audit Completed',
                  desc: 'Checked phone for unrecognized tracking apps, turned off shared location, and changed email passwords.',
                },
              ].map((item) => {
                const checked = checklist[item.id];
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                      checked
                        ? 'bg-purple-50/80 border-purple-500 shadow-xs'
                        : 'bg-zinc-50 border-zinc-200 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      aria-label={item.title}
                      className="mt-1 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                        <span className={`text-xs font-bold ${checked ? 'text-purple-950 line-through' : 'text-zinc-900'}`}>
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RED FLAG DIAGNOSTIC */}
      {activeTab === 'diagnostic' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
            <div className="space-y-2 border-b border-zinc-100 pb-4">
              <h2 className="text-lg font-bold text-zinc-900">
                Relationship Red Flag &amp; Coercive Control Diagnostic
              </h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Abuse often creeps in under the disguise of "protection" or "intense love." Answer these questions truthfully for yourself. No data is sent or recorded; calculations run entirely on your device.
              </p>
            </div>

            <div className="space-y-4">
              {diagnosticQuestions.map((q, idx) => (
                <div key={q.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs font-bold text-zinc-900">
                      {idx + 1}. {q.q}
                    </span>
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full shrink-0">
                      {q.category}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    {[
                      { label: 'Never (0)', score: 0 },
                      { label: 'Rarely / Mild (1)', score: 1 },
                      { label: 'Frequently / Severe (2)', score: 2 },
                    ].map((opt) => (
                      <button
                        key={opt.score}
                        type="button"
                        onClick={() => handleAnswerDiagnostic(q.id, opt.score)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          diagnosticAnswers[q.id] === opt.score
                            ? 'bg-purple-700 text-white shadow-xs'
                            : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-purple-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                disabled={Object.keys(diagnosticAnswers).length < 4}
                onClick={() => setShowDiagnosticScore(true)}
                className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow transition disabled:opacity-40"
              >
                Analyze Diagnostic Results
              </button>
            </div>

            {showDiagnosticScore && (
              <div role="region" aria-label="Diagnostic Result" className="p-6 bg-purple-50 border border-purple-300 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-purple-950 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" aria-hidden="true" />
                    <span>Diagnostic Risk Assessment</span>
                  </div>
                  <span className="text-xs font-mono font-bold bg-purple-200 text-purple-900 px-2.5 py-1 rounded-full">
                    Score: {calculateDiagnosticRisk()} / 16
                  </span>
                </div>

                {calculateDiagnosticRisk() >= 6 ? (
                  <div className="space-y-2 text-xs text-purple-900 leading-relaxed">
                    <p className="font-bold text-red-700">
                      High Presence of Reported Stress &amp; Boundary Crossing Indicators.
                    </p>
                    <p>
                      Your answers reflect patterns often associated with isolation, digital oversight, or emotional distress. Please note: this tool does not provide a psychological diagnosis, clinical assessment, or guaranteed prediction of safety. It is an educational reflection designed to help you organize your observations.
                    </p>
                    <div className="p-3 bg-white rounded-xl border border-purple-200 space-y-1">
                      <strong className="block text-zinc-900">Recommended Confidential Support Pathways:</strong>
                      <ul className="list-disc list-inside space-y-1 text-zinc-700">
                        <li>Consider speaking with a licensed counselor or contacting the 181 Women Helpline or NCW 7827170170.</li>
                        <li>Explore practical, discreet exit options at your own pace without feeling pressured to take sudden actions that could raise risks.</li>
                        <li>Review statutory protections under the Protection of Women from Domestic Violence Act 2005.</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs text-purple-900 leading-relaxed">
                    <p className="font-bold text-emerald-800">
                      Low to Moderate Reported Indicator Levels.
                    </p>
                    <p>
                      While fewer high-risk indicators were selected, any dynamic causing you ongoing anxiety, fear, or loss of personal agency is valid and deserves compassionate attention. This assessment is purely reflective and non-clinical.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: VERIFIED RESOURCES DIRECTORY */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0" role="tablist">
              {[
                { label: 'All Resources', val: 'all' },
                { label: 'Helplines', val: 'helpline' },
                { label: 'Shelters', val: 'shelter' },
                { label: 'Cyber Safety', val: 'cyber_safety' },
              ].map((c) => (
                <button
                  key={c.val}
                  type="button"
                  onClick={() => setResourceCategory(c.val)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    resourceCategory === c.val
                      ? 'bg-purple-700 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchResources()}
                placeholder="Filter by city (e.g. Delhi)..."
                aria-label="Filter resources by city"
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl"
              />
              <MapPin className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" aria-hidden="true" />
            </div>
          </div>

          {loadingResources ? (
            <CardGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-zinc-900 leading-snug">{res.title}</h3>
                      {res.is24x7 && (
                        <span className="text-[10px] bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded-full shrink-0">
                          24x7
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">{res.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-100 text-xs">
                    {res.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <PhoneCall className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                        <a
                          href={`tel:${res.phoneNumber}`}
                          className="font-bold text-purple-700 hover:underline"
                          aria-label={`Call ${res.title} at ${res.phoneNumber}`}
                        >
                          {res.phoneNumber}
                        </a>
                      </div>
                    )}

                    {res.address && (
                      <div className="flex items-start gap-2 text-zinc-500 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{res.address}</span>
                      </div>
                    )}

                    <div className="text-[11px] text-zinc-400 pt-1 flex justify-between items-center">
                      <span>Verified: {res.verifiedDate}</span>
                      <span className="truncate max-w-[150px]">{res.source}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
