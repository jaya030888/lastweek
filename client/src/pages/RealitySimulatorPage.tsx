import React, { useState, useEffect } from 'react';
import {
  Compass,
  Clock,
  AlertTriangle,
  Play,
  Shield,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { api } from '../services/api';
import { SimulatorScenario } from '../types';
import { SimulatorPlayer } from '../components/simulator/SimulatorPlayer';
import { SEO } from '../components/common/SEO';
import { CardGridSkeleton } from '../components/common/LoadingStates';

export const RealitySimulatorPage: React.FC = () => {
  const [scenarios, setScenarios] = useState<SimulatorScenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<SimulatorScenario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getScenarios()
      .then(setScenarios)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLaunchScenario = async (slug: string) => {
    setLoading(true);
    try {
      const fullScenario = await api.getScenarioBySlug(slug);
      setActiveScenario(fullScenario);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (activeScenario) {
    return (
      <div className="py-8 px-4 sm:px-6">
        <SEO
          title={`${activeScenario.title} — Reality Simulator`}
          description={activeScenario.overview}
        />
        <SimulatorPlayer
          scenario={activeScenario}
          onExit={() => setActiveScenario(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <SEO
        title="The Reality Simulator — Interactive Scenarios"
        description="Experience realistic branching scenarios exploring coercive control, workplace POSH intervention, and cyber harassment without victim-blaming."
      />

      {/* Cinematic Header (Clean, No Emojis) */}
      <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-purple-900/40 relative overflow-hidden space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-900/50 text-purple-200 rounded-full text-xs font-semibold border border-purple-700/50">
          <Compass className="w-3.5 h-3.5 text-purple-300" aria-hidden="true" />
          <span>The Reality Simulator — Main Interactive USP</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Step into Realistic Decisions. Dismantle Violence.
        </h1>

        <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
          Inspired by our hackathon mission: Real-world violence can be more terrifying than fictional horror. Navigate realistic, trauma-informed scenarios involving coercive control, workplace harassment, and cyberstalking. Make choices, examine consequences, and discover safer responses without victim-blaming.
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
            No Graphic Violence
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            Trauma-Informed Takeaways
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
            Discreet Quick Exit Enabled
          </span>
        </div>
      </div>

      {/* Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900">Scenario Experiences</h2>
          <span className="text-xs text-zinc-500">{scenarios.length} Scenarios Available</span>
        </div>

        {loading ? (
          <CardGridSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scenarios.map((sc) => (
              <div
                key={sc.id}
                className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs hover:shadow-lg hover:border-purple-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                      {sc.category}
                    </span>
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {sc.estimatedMinutes} min
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 leading-snug">{sc.title}</h3>
                    <p className="text-xs text-purple-600 font-semibold mb-1.5">{sc.subtitle}</p>
                    <p className="text-xs text-zinc-600 leading-relaxed">{sc.overview}</p>
                  </div>

                  {sc.contentWarning && (
                    <div className="p-2.5 bg-zinc-50 rounded-xl text-[11px] text-zinc-500 border border-zinc-100 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{sc.contentWarning}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleLaunchScenario(sc.slug)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-950 hover:bg-purple-900 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95"
                    aria-label={`Launch scenario: ${sc.title}`}
                  >
                    <Play className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                    <span>Launch Scenario</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
