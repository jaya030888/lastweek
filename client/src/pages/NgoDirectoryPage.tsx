import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  MapPin,
  ExternalLink,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Users,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { Ngo } from '../types';
import { SEO } from '../components/common/SEO';
import { CardGridSkeleton } from '../components/common/LoadingStates';

export const NgoDirectoryPage: React.FC = () => {
  const [ngos, setNgos] = useState<Ngo[]>([]);
  const [selectedService, setSelectedService] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const services = [
    { label: 'All Services', val: 'all' },
    { label: 'Legal Aid', val: 'Legal' },
    { label: 'Shelter', val: 'Shelter' },
    { label: 'Counselling', val: 'Counselling' },
    { label: 'Rehabilitation', val: 'Rehabilitation' },
    { label: 'Awareness', val: 'Awareness' },
  ];

  const cities = ['all', 'Mumbai', 'New Delhi', 'Bangalore', 'Pune'];

  const fetchNgos = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await api.getNgos({
        service: selectedService,
        city: selectedCity,
        search: searchQuery || undefined,
      });
      setNgos(data);
    } catch (err: any) {
      console.error(err);
      setFetchError(err.message || 'Unable to load NGO directory at this time.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgos();
  }, [selectedService, selectedCity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNgos();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <SEO
        title="Verified NGO Directory & Direct Support"
        description="Search verified non-profit organizations supporting women across India with shelter, free legal aid, trauma counseling, and crisis response."
      />

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-xs font-bold border border-purple-200">
          <Building2 className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
          <span>Verified Non-Profit Support Network</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
          Verified NGO Connect &amp; Direct Support
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
          Discover trusted organizations providing specialized legal defense, safe shelter, psychological healing, and youth education for survivors of gender-based violence.
        </p>
      </div>

      {/* Donation Transparency Notice */}
      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-start gap-3 text-xs text-zinc-800">
        <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <strong className="block font-semibold">100% Direct Support Policy:</strong>
          <span>
            Her Voice does not accept, hold, or process donations. All donation links route directly to the official, verified portals of the non-profits listed below.
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NGOs by name, services, or focus area..."
              aria-label="Search verified NGOs"
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-purple-600"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" aria-hidden="true" />
          </form>

          {/* City Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="city-select" className="text-xs font-semibold text-zinc-500">City:</label>
            <select
              id="city-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-700"
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
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* NGOs Grid */}
      {loading ? (
        <CardGridSkeleton count={4} />
      ) : fetchError ? (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{fetchError}</span>
          <button
            onClick={fetchNgos}
            className="ml-auto underline font-bold hover:text-red-900"
          >
            Retry
          </button>
        </div>
      ) : ngos.length === 0 ? (
        <div className="p-12 text-center text-zinc-500 bg-white border border-zinc-200 rounded-3xl text-xs space-y-2">
          <p className="font-semibold text-zinc-700">No organizations found matching your criteria.</p>
          <p>Try resetting the city or service filter to view all verified non-profits.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ngos.map((ngo) => (
            <div
              key={ngo.id}
              className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-zinc-900 leading-snug">{ngo.name}</h2>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-600" aria-hidden="true" />
                      <span>{ngo.city}, {ngo.state}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                    Verified
                  </span>
                </div>

                <p className="text-xs font-medium text-purple-900 italic">
                  “{ngo.mission}”
                </p>

                <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">
                  {ngo.description}
                </p>

                {/* Service Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ngo.services.split(',').map((serv, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-purple-50 text-purple-700 font-semibold px-2.5 py-0.5 rounded-lg border border-purple-100"
                    >
                      {serv.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Volunteer & Direct Action Links */}
              <div className="pt-3 border-t border-zinc-100 space-y-3">
                {ngo.volunteerInfo && (
                  <div className="flex items-start gap-1.5 text-[11px] text-zinc-500">
                    <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span><strong>Volunteer:</strong> {ngo.volunteerInfo}</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                  <a
                    href={ngo.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-900 font-semibold"
                    aria-label={`Visit official website for ${ngo.name} (opens in new tab)`}
                  >
                    <span>Official Website</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>

                  <a
                    href={ngo.officialDonationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-xs transition"
                    aria-label={`Donate directly to ${ngo.name} on their official page (opens in new tab)`}
                  >
                    <Heart className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                    <span>Donate Directly ↗</span>
                  </a>
                </div>

                <div className="text-[10px] text-zinc-400 flex justify-between items-center pt-1 border-t border-zinc-100">
                  <span>Verified: {ngo.verifiedDate}</span>
                  <span className="truncate max-w-[170px]">{ngo.verifiedSource}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
