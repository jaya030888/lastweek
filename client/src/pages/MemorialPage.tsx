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
} from 'lucide-react';
import { api } from '../services/api';
import { MemorialStory } from '../types';
import { CandleOffering } from '../components/memorial/CandleOffering';
import { useUser } from '../context/UserContext';
import { SEO } from '../components/common/SEO';

export const MemorialPage: React.FC = () => {
  const { pseudonym } = useUser();
  const [stories, setStories] = useState<MemorialStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchStories = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await api.getMemorialStories();
      setStories(data);
    } catch (err: any) {
      console.error(err);
      setFetchError(err.message || 'Unable to load memorial archives at this time.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleTributeSubmit = async (storyId: string, tributeType: 'candle' | 'marigold', message?: string) => {
    await api.offerMemorialTribute(storyId, { tributeType, pseudonym, message });
    fetchStories();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-16">
      <SEO
        title="Remember Her, Change Tomorrow | Digital Memorial"
        description="A respectful digital memorial celebrating the lives, aspirations, and legal reforms sparked by women lost to gender-based violence. Light a virtual candle and offer marigold petals."
      />

      {/* Memorial Header (Dignified, Clean, No Emoji Clutter) */}
      <div className="relative overflow-hidden pt-12 pb-16 border-b border-zinc-900 bg-gradient-to-b from-purple-950/50 via-zinc-950 to-zinc-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-300 rounded-full text-xs font-semibold border border-amber-500/30">
            <Flame className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>Digital Memorial &amp; Remembrance Sanctuary</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight text-white">
            Remember Her, Change Tomorrow
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            We honor the lives, vibrant spirits, and enduring legacies of women whose memories transformed societal consciousness and forged landmark legal reforms. Light a candle, offer a marigold, and reaffirm our shared commitment to eradicate violence.
          </p>

          <div className="flex items-center justify-center gap-6 text-xs text-amber-300/80 pt-2 font-serif">
            <span>Never Forgotten</span>
            <span>•</span>
            <span>Eternal Flame</span>
            <span>•</span>
            <span>Relentless Justice</span>
          </div>
        </div>
      </div>

      {/* Stories Catalog */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        {loading ? (
          <div className="p-12 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <p className="text-xs">Illuminating the digital memorial archive...</p>
          </div>
        ) : fetchError ? (
          <div className="p-6 bg-red-950/40 border border-red-800 text-red-200 rounded-2xl flex items-center gap-3 text-xs">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{fetchError}</span>
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
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md"
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
            <div className="space-y-3">
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

            {/* Interactive Candle & Marigold Offering */}
            <CandleOffering
              storyName={story.name}
              initialCandles={story.candlesLit}
              initialMarigolds={story.marigoldsOffered}
              onTributeSubmit={(type, message) => handleTributeSubmit(story.id, type, message)}
            />

            {/* Verified Source Stamp */}
            <div className="text-[11px] text-zinc-500 pt-1 flex justify-between items-center border-t border-zinc-800">
              <span>Verified Public Record Source:</span>
              <span className="italic text-zinc-400">{story.verifiedSource}</span>
            </div>
          </article>
        )))}
      </div>
    </div>
  );
};
