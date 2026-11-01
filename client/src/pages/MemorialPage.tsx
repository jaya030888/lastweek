import React, { useState, useEffect } from 'react';
import {
  Flame,
  Sparkles,
  Heart,
  Shield,
  MapPin,
  Award,
  Loader2,
  AlertCircle,
  Building2,
  Search,
  ExternalLink,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api';
import { MemorialStory, Ngo } from '../types';
import { CandleOffering } from '../components/memorial/CandleOffering';
import { DonationModal } from '../components/memorial/DonationModal';
import { useUser } from '../context/UserContext';
import { SEO } from '../components/common/SEO';
import { CardGridSkeleton } from '../components/common/LoadingStates';

export const MemorialPage: React.FC = () => {
  const { pseudonym } = useUser();
  const [activeTab, setActiveTab] = useState<'stories' | 'ngos'>('stories');

  // Memorial Stories State
  const [stories, setStories] = useState<MemorialStory[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [storyError, setStoryError] = useState<string | null>(null);

  // NGO Directory State
  const [ngos, setNgos] = useState<Ngo[]>([]);
  const [selectedService, setSelectedService] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingNgos, setLoadingNgos] = useState(true);
  const [ngoError, setNgoError] = useState<string | null>(null);

  // Active NGO for Donation Modal
  const [selectedNgoForDonation, setSelectedNgoForDonation] = useState<Ngo | null>(null);

  const services = [
    { label: 'All Services', val: 'all' },
    { label: 'Legal Aid', val: 'Legal' },
    { label: 'Shelter', val: 'Shelter' },
    { label: 'Counselling', val: 'Counselling' },
    { label: 'Rehabilitation', val: 'Rehabilitation' },
    { label: 'Awareness', val: 'Awareness' },
  ];

  const cities = ['all', 'Mumbai', 'New Delhi', 'Bangalore', 'Pune'];

  const fetchStories = async () => {
    setLoadingStories(true);
    setStoryError(null);
    try {
      const data = await api.getMemorialStories();
      setStories(data);
    } catch (err: any) {
      console.error(err);
      setStoryError(err.message || 'Unable to load memorial archives at this time.');
    } finally {
      setLoadingStories(false);
    }
  };

  const fetchNgos = async () => {
    setLoadingNgos(true);
    setNgoError(null);
    try {
      const data = await api.getNgos({
        service: selectedService,
        city: selectedCity,
        search: searchQuery || undefined,
      });
      setNgos(data);
    } catch (err: any) {
      console.error(err);
      setNgoError(err.message || 'Unable to load NGO directory at this time.');
    } finally {
      setLoadingNgos(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    fetchNgos();
  }, [selectedService, selectedCity]);

  const handleTributeSubmit = async (storyId: string, tributeType: 'candle' | 'marigold', message?: string) => {
    await api.offerMemorialTribute(storyId, { tributeType, pseudonym, message });
    fetchStories();
  };

  const handleSearchNgos = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNgos();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      <SEO
        title="Remember Her & Support Survivors | Memorial & Verified NGOs"
        description="A unified sanctuary to remember pioneer women lost to violence, light digital tribute candles, and directly support verified non-profits offering shelter and legal defense."
      />

      {/* Memorial Header */}
      <div className="relative overflow-hidden pt-12 pb-14 border-b border-zinc-900 bg-gradient-to-b from-purple-950/60 via-zinc-950 to-zinc-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/10 text-amber-300 rounded-full text-xs font-semibold border border-amber-500/30">
            <Flame className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>Digital Memorial &amp; Active Survivor Support</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight text-white">
            Remember Her, Change Tomorrow
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Honoring pioneer lives through digital remembrance, virtual candle offerings, and direct support to frontline survivor organizations providing shelter and legal defense.
          </p>

          {/* Unified Tab Switcher */}
          <div className="inline-flex p-1.5 bg-zinc-900/90 rounded-2xl border border-zinc-800 shadow-lg mt-4">
            <button
              onClick={() => setActiveTab('stories')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'stories'
                  ? 'bg-amber-600 text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Memorial Archives ({stories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ngos')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'ngos'
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Verified NGOs &amp; Donate ({ngos.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        {/* TAB 1: MEMORIAL STORIES */}
        {activeTab === 'stories' && (
          <div className="space-y-12">
            {loadingStories ? (
              <div className="p-16 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                <p className="text-xs">Illuminating the digital memorial archive...</p>
              </div>
            ) : storyError ? (
              <div className="p-6 bg-red-950/40 border border-red-800 text-red-200 rounded-2xl flex items-center gap-3 text-xs">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{storyError}</span>
                <button
                  onClick={fetchStories}
                  className="ml-auto underline font-bold hover:text-white"
                >
                  Retry
                </button>
              </div>
            ) : stories.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-3xl text-xs">
                No memorial archives currently indexed.
              </div>
            ) : (
              stories.map((story) => (
                <article
                  key={story.id}
                  className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md"
                >
                  {/* Top Info Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
                    <div>
                      <span className="text-xs text-amber-400 font-mono tracking-wider">
                        {story.eraOrYear}
                      </span>
                      <h2 className="text-2xl font-bold font-serif text-white">{story.name}</h2>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                      <span>{story.location}</span>
                    </div>
                  </div>

                  {/* Biography celebrating life and dreams */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Life, Dreams &amp; Aspirations</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-serif">
                      {story.biography}
                    </p>
                  </div>

                  {/* Enduring Legal Impact & Reform Spark */}
                  <div className="p-4 bg-purple-950/40 border border-purple-800/40 rounded-2xl space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" aria-hidden="true" />
                      <span>Enduring Social Awakening &amp; Legal Reform</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-purple-200 leading-relaxed font-serif">
                      {story.legacyImpact}
                    </p>
                  </div>

                  {/* Prevention Note */}
                  <div className="p-3.5 bg-zinc-800/60 rounded-xl text-xs text-zinc-400 border border-zinc-700/50 flex items-start gap-2">
                    <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <strong className="text-zinc-200">Systemic Protection Legacy: </strong>
                      {story.preventionNote}
                    </div>
                  </div>

                  {/* Interactive Candle Offering */}
                  <CandleOffering
                    storyName={story.name}
                    initialCandles={story.candlesLit}
                    onTributeSubmit={(_type, message) => handleTributeSubmit(story.id, 'candle', message)}
                  />

                  {/* Direct Donate Option for this Story */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-800/40 p-4 rounded-2xl border border-zinc-700/50">
                    <div className="text-xs text-zinc-300 space-y-0.5 text-center sm:text-left">
                      <strong className="text-white block font-semibold">Transform Tribute into Real-World Action</strong>
                      <span>Support verified grassroots shelters protecting women right now in honor of {story.name}.</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('ngos')}
                      className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-xl shadow transition"
                    >
                      <Heart className="w-3.5 h-3.5 text-purple-200" />
                      <span>Donate to Frontline NGOs ↗</span>
                    </button>
                  </div>

                  {/* Verified Source Stamp */}
                  <div className="text-[11px] text-zinc-500 pt-1 flex justify-between items-center border-t border-zinc-800">
                    <span>Verified Public Record Source:</span>
                    <span className="italic text-zinc-400">{story.verifiedSource}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {/* TAB 2: VERIFIED NGOS & DIRECT DONATION */}
        {activeTab === 'ngos' && (
          <div className="space-y-8">
            {/* Filter and Search Bar */}
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <form onSubmit={handleSearchNgos} className="relative w-full sm:w-80">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search NGO by name or keyword..."
                    aria-label="Search NGO by name or keyword"
                    className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" aria-hidden="true" />
                </form>

                {/* City Filter */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <MapPin className="w-4 h-4 text-zinc-400 shrink-0" aria-hidden="true" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="text-xs bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city === 'all' ? 'All Locations' : city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist">
                {services.map((s) => (
                  <button
                    key={s.val}
                    type="button"
                    onClick={() => setSelectedService(s.val)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition shrink-0 ${
                      selectedService === s.val
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* NGOs Grid */}
            {loadingNgos ? (
              <div className="p-16 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                <p className="text-xs">Loading verified NGO registry...</p>
              </div>
            ) : ngoError ? (
              <div className="p-6 bg-red-950/40 border border-red-800 text-red-200 rounded-2xl flex items-center gap-3 text-xs">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{ngoError}</span>
                <button
                  onClick={fetchNgos}
                  className="ml-auto underline font-bold hover:text-white"
                >
                  Retry
                </button>
              </div>
            ) : ngos.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-3xl text-xs space-y-2">
                <p className="font-semibold text-zinc-300">No organizations found matching your criteria.</p>
                <p>Try resetting the city or service filter to view all verified non-profits.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ngos.map((ngo) => (
                  <div
                    key={ngo.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-md hover:border-purple-800/60 transition flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-white">{ngo.name}</h3>
                            <span title="Verified NGO">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
                            <span>{ngo.city}, {ngo.state}</span>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-950 border border-purple-800/60 text-purple-300 rounded-full text-[10px] font-bold">
                          <Shield className="w-3 h-3 text-purple-400" aria-hidden="true" />
                          <span>Verified Non-Profit</span>
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300 italic font-serif">
                        “{ngo.mission}”
                      </p>

                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                        {ngo.description}
                      </p>

                      {/* Service Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {ngo.services.split(',').map((serv, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-zinc-800 text-purple-300 font-semibold px-2.5 py-0.5 rounded-lg border border-zinc-700"
                          >
                            {serv.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Direct Action & Donate Button */}
                    <div className="pt-4 border-t border-zinc-800 space-y-3">
                      {ngo.volunteerInfo && (
                        <div className="flex items-start gap-1.5 text-[11px] text-zinc-400">
                          <Users className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" aria-hidden="true" />
                          <span><strong>Volunteer:</strong> {ngo.volunteerInfo}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                        <a
                          href={ngo.officialWebsite}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-purple-300 hover:text-white font-semibold"
                          aria-label={`Visit official website for ${ngo.name} (opens in new tab)`}
                        >
                          <span>Official Website</span>
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>

                        <button
                          onClick={() => setSelectedNgoForDonation(ngo)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl shadow-xs transition active:scale-95"
                          aria-label={`Donate directly to ${ngo.name}`}
                        >
                          <Heart className="w-3.5 h-3.5 text-purple-200" aria-hidden="true" />
                          <span>Donate Directly ↗</span>
                        </button>
                      </div>

                      <div className="text-[10px] text-zinc-500 flex justify-between items-center pt-1 border-t border-zinc-800/80">
                        <span>Verified: {ngo.verifiedDate}</span>
                        <span className="truncate max-w-[170px]">{ngo.verifiedSource}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Donation Modal */}
      <DonationModal
        ngo={selectedNgoForDonation}
        onClose={() => setSelectedNgoForDonation(null)}
      />
    </div>
  );
};
