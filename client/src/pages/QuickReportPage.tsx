import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  PhoneCall,
  Mic,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';
import { SEO } from '../components/common/SEO';

export const QuickReportPage: React.FC = () => {
  const { sessionId } = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Form states
  const [incidentCategory, setIncidentCategory] = useState('Domestic Abuse / Coercive Control');
  const [isImmediateDanger, setIsImmediateDanger] = useState<boolean | null>(null);
  const [description, setDescription] = useState('');
  const [isRecordingSimulated, setIsRecordingSimulated] = useState(false);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [voiceDurationSeconds, setVoiceDurationSeconds] = useState(0);

  // Form error state
  const [stepError, setStepError] = useState<string | null>(null);

  // Location
  const [locationConsent, setLocationConsent] = useState(false);
  const [approxCity, setApproxCity] = useState('');

  // Triage Choice
  const [triageChoice, setTriageChoice] = useState<'support' | 'complaint_draft' | 'official_portal'>('support');

  // Handle voice recording simulation
  const handleToggleRecord = () => {
    if (!isRecordingSimulated) {
      setIsRecordingSimulated(true);
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setVoiceDurationSeconds(count);
        if (count >= 12) {
          clearInterval(interval);
          setIsRecordingSimulated(false);
          setHasVoiceNote(true);
        }
      }, 1000);
    } else {
      setIsRecordingSimulated(false);
      setHasVoiceNote(true);
    }
  };

  const handleNextFromStep1 = () => {
    if (isImmediateDanger === null) {
      setStepError('Please answer the immediate danger assessment to help us triage safely.');
      return;
    }
    setStepError(null);
    setCurrentStep(2);
  };

  const handleSaveReport = async () => {
    setIsSubmitting(true);
    try {
      await api.submitQuickReport({
        incidentCategory,
        isImmediateDanger: Boolean(isImmediateDanger),
        description,
        hasVoiceNote,
        locationShared: locationConsent,
        approxCity: locationConsent ? approxCity : undefined,
        triageChoice,
        anonymousSessionId: sessionId,
      });
      setIsSaved(true);
      setCurrentStep(5);
    } catch (err) {
      console.error(err);
      setStepError('Failed to save draft. Please try copying the text directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedReportSummary = `HER VOICE CONFIDENTIAL REPORT SUMMARY (FOR COMPILED TRIAGE)
Date: ${new Date().toLocaleDateString('en-IN')}
Incident Category: ${incidentCategory}
Immediate Danger Flag: ${isImmediateDanger ? 'YES (Requires urgent police/emergency contact 112)' : 'NO'}
Description: ${description || '[No written description attached]'}
Voice Note Attached: ${hasVoiceNote ? `Yes (${voiceDurationSeconds}s simulated memo)` : 'No'}
Approximate Location: ${locationConsent ? approxCity || 'Disclosed by user' : 'Withheld for privacy'}
Desired Path: ${triageChoice}

LEGAL NOTICE: This document was prepared privately on Her Voice. It is not an officially acknowledged police FIR until filed with authorized law enforcement.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedReportSummary);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <SEO
        title="Quick Report Wizard | Safe Triage"
        description="A confidential, step-by-step reporting guide with immediate danger triage, 112 emergency routing, and structured draft preparation."
      />

      {/* Title & Safety Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold border border-red-200">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
          <span>Confidential Support &amp; Reporting Wizard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
          Quick Report &amp; Safety Triage
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
          This guided process helps you clarify what happened, assess active risks, organize your narrative, and connect with verified resources.
        </p>
      </div>

      {/* Critical Non-Police Transmission Notice Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl p-4 text-xs text-amber-900 space-y-1">
        <strong className="block font-semibold">Important Transparency Notice:</strong>
        <span>
          Information entered here is stored <strong>confidentially in your active session</strong> for guided triage. It is <strong>NOT automatically transmitted to the police</strong>. If you are in active danger, call 112 immediately.
        </span>
      </div>

      {/* Wizard Step Indicator */}
      <nav aria-label="Progress" className="border-b border-zinc-200 pb-3">
        <ol className="flex items-center justify-between text-xs">
          {[
            { num: 1, label: 'Danger Check' },
            { num: 2, label: 'Category' },
            { num: 3, label: 'Details & Audio' },
            { num: 4, label: 'Review & Privacy' },
            { num: 5, label: 'Support Next Steps' },
          ].map((s) => (
            <li
              key={s.num}
              className={`flex items-center gap-1.5 ${
                currentStep === s.num
                  ? 'font-bold text-purple-800'
                  : currentStep > s.num
                  ? 'text-zinc-700'
                  : 'text-zinc-400'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === s.num
                    ? 'bg-purple-700 text-white'
                    : currentStep > s.num
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                {currentStep > s.num ? '✓' : s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </li>
          ))}
        </ol>
      </nav>

      {stepError && (
        <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
          <span>{stepError}</span>
        </div>
      )}

      {/* STEP 1: Immediate Danger Triage */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900">Step 1: Immediate Danger Assessment</h2>
            <p className="text-xs text-zinc-600">
              Are you or someone else in immediate physical danger right now?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setIsImmediateDanger(true);
                setStepError(null);
              }}
              className={`p-5 rounded-2xl border text-left transition-all space-y-2 ${
                isImmediateDanger === true
                  ? 'bg-red-50 border-red-500 text-red-900 shadow-xs'
                  : 'bg-zinc-50 border-zinc-200 hover:border-red-400 text-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-red-700">
                <ShieldAlert className="w-4 h-4 text-red-600" aria-hidden="true" />
                <span>YES, I am in active danger</span>
              </div>
              <p className="text-xs text-zinc-600">
                The perpetrator is nearby, threatening violence, or you fear for your immediate physical safety.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsImmediateDanger(false);
                setStepError(null);
              }}
              className={`p-5 rounded-2xl border text-left transition-all space-y-2 ${
                isImmediateDanger === false
                  ? 'bg-purple-50 border-purple-600 text-purple-900 shadow-xs'
                  : 'bg-zinc-50 border-zinc-200 hover:border-purple-400 text-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-purple-700">
                <CheckCircle2 className="w-4 h-4 text-purple-600" aria-hidden="true" />
                <span>NO, I am in a safe space right now</span>
              </div>
              <p className="text-xs text-zinc-600">
                You are currently in a secure room, outside, or documenting an incident that occurred earlier.
              </p>
            </button>
          </div>

          {/* Urgent Emergency Alert Trigger if YES */}
          {isImmediateDanger === true && (
            <div className="p-5 bg-red-700 text-white rounded-2xl space-y-3 shadow-md animate-pulse">
              <div className="flex items-center gap-2 font-bold text-sm">
                <PhoneCall className="w-4 h-4 text-red-200" aria-hidden="true" />
                <span>URGENT: Step into safety and call emergency services</span>
              </div>
              <p className="text-xs text-red-100 leading-relaxed">
                Please do not continue filling out web forms if an abuser is approaching. Tap below to dial India's Unified Emergency line <strong>112</strong> immediately.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="tel:112"
                  className="px-4 py-2 bg-white text-red-700 font-extrabold text-xs rounded-xl shadow-xs hover:bg-zinc-100 flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Call 112 (Police &amp; Emergency)</span>
                </a>
                <a
                  href="tel:1091"
                  className="px-4 py-2 bg-red-900 text-white font-bold text-xs rounded-xl hover:bg-red-950 flex items-center gap-1.5"
                >
                  <span>Call 1091 (Women Cell)</span>
                </a>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={handleNextFromStep1}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl transition"
            >
              <span>Continue to Category</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Incident Category Selection */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900">Step 2: Incident Category</h2>
            <p className="text-xs text-zinc-600">
              Select the option that best reflects what you are experiencing:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                title: 'Domestic Abuse / Coercive Control',
                desc: 'Physical aggression, threats, financial denial, or extreme emotional control by a partner/family.',
              },
              {
                title: 'Workplace Sexual Harassment',
                desc: 'Unwelcome advances, inappropriate remarks, or retaliation by a superior or colleague (POSH).',
              },
              {
                title: 'Cyber Stalking & Blackmail',
                desc: 'Non-consensual photo threats, persistent online surveillance, impersonation, or extortion.',
              },
              {
                title: 'Public Space Harassment',
                desc: 'Physical stalking, catcalling, or physical obstruction in streets or public transport.',
              },
              {
                title: 'Sexual Assault / Violence',
                desc: 'Non-consensual physical violation requiring medical memo, forensic evidence, and trauma aid.',
              },
              {
                title: 'Other Safety Threat',
                desc: 'Disputes involving landlord intimidation, dowry harassment, or child custody threats.',
              },
            ].map((cat) => (
              <button
                key={cat.title}
                type="button"
                onClick={() => setIncidentCategory(cat.title)}
                className={`p-4 rounded-2xl border text-left transition ${
                  incidentCategory === cat.title
                    ? 'bg-purple-50 border-purple-600 text-purple-950 font-semibold shadow-xs'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-purple-300'
                }`}
              >
                <div className="text-xs sm:text-sm font-bold">{cat.title}</div>
                <div className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{cat.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl transition"
            >
              <span>Continue to Details</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Description, Voice Note, and Optional Location */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900">Step 3: Narrative &amp; Optional Voice Note</h2>
            <p className="text-xs text-zinc-600">
              Provide as much or as little detail as feels safe. You can write notes or record a short voice memo for your records.
            </p>
          </div>

          <div>
            <label htmlFor="incident-narrative" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Incident Narrative (Optional)
            </label>
            <textarea
              id="incident-narrative"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happened? When and where did it start? What boundaries were crossed? (Tip: avoid real phone numbers or full home addresses)"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs sm:text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-purple-600 leading-relaxed"
            />
          </div>

          {/* Voice Note Recorder */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-800">
                <Mic className="w-4 h-4 text-purple-700" aria-hidden="true" />
                <span>Voice Memo Simulator</span>
              </div>
              {hasVoiceNote && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Audio Captured ({voiceDurationSeconds}s)
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-600">
              If typing is difficult or unsafe, you can record an audio narrative saved locally on your browser.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleRecord}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  isRecordingSimulated
                    ? 'bg-red-600 text-white animate-pulse'
                    : hasVoiceNote
                    ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                    : 'bg-purple-700 hover:bg-purple-800 text-white'
                }`}
              >
                <Mic className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {isRecordingSimulated
                    ? `Recording (${voiceDurationSeconds}s)... Tap to Stop`
                    : hasVoiceNote
                    ? 'Re-record Voice Memo'
                    : 'Record Audio Memo'}
                </span>
              </button>

              {hasVoiceNote && (
                <button
                  type="button"
                  onClick={() => {
                    setHasVoiceNote(false);
                    setVoiceDurationSeconds(0);
                  }}
                  className="text-xs text-zinc-500 hover:text-red-600"
                >
                  Clear Audio
                </button>
              )}
            </div>
          </div>

          {/* Optional Location with Explicit Consent */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="location-consent-check"
                checked={locationConsent}
                onChange={(e) => setLocationConsent(e.target.checked)}
                className="mt-1 rounded text-purple-600 focus:ring-purple-500"
              />
              <div>
                <label htmlFor="location-consent-check" className="text-xs font-bold text-zinc-900 cursor-pointer block">
                  Share approximate city for local NGO / shelter discovery (Optional)
                </label>
                <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                  We never track GPS coordinates or street addresses. If enabled, you can specify your city to find nearest verified crisis centers.
                </p>
              </div>
            </div>

            {locationConsent && (
              <div className="pt-2">
                <input
                  type="text"
                  value={approxCity}
                  onChange={(e) => setApproxCity(e.target.value)}
                  placeholder="e.g. Mumbai, Delhi, Bengaluru, Pune"
                  aria-label="Enter approximate city"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-purple-600"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl transition"
            >
              <span>Review Draft</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review and Triage Goal */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900">Step 4: Review &amp; Select Desired Support</h2>
            <p className="text-xs text-zinc-600">
              Review your details below and choose how you would like Her Voice to assist you next:
            </p>
          </div>

          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2.5 text-xs text-zinc-700">
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span className="font-semibold text-zinc-500">Category:</span>
              <span className="font-bold text-purple-900">{incidentCategory}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span className="font-semibold text-zinc-500">Immediate Danger:</span>
              <span className={isImmediateDanger ? 'text-red-600 font-bold' : 'text-zinc-800'}>
                {isImmediateDanger ? 'Yes (Urgent)' : 'No'}
              </span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span className="font-semibold text-zinc-500">Audio Memo:</span>
              <span>{hasVoiceNote ? `Yes (${voiceDurationSeconds}s captured)` : 'None'}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span className="font-semibold text-zinc-500">Location Shared:</span>
              <span>{locationConsent ? approxCity || 'City disclosed' : 'Withheld for privacy'}</span>
            </div>
            <div>
              <span className="font-semibold text-zinc-500 block mb-1">Description:</span>
              <p className="italic text-zinc-800 bg-white p-2.5 rounded-xl border border-zinc-200">
                {description || 'No written description entered.'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
              Choose your primary desired outcome:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTriageChoice('support')}
                className={`p-3.5 rounded-xl border text-left transition ${
                  triageChoice === 'support'
                    ? 'bg-purple-100 border-purple-600 text-purple-950 font-bold'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                }`}
              >
                <div className="text-xs font-bold">1. Find Verified Support</div>
                <div className="text-[11px] text-zinc-500 font-normal mt-1">
                  Connect with free shelters, counselors, and legal aid NGOs.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTriageChoice('complaint_draft')}
                className={`p-3.5 rounded-xl border text-left transition ${
                  triageChoice === 'complaint_draft'
                    ? 'bg-purple-100 border-purple-600 text-purple-950 font-bold'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                }`}
              >
                <div className="text-xs font-bold">2. Prepare Complaint Draft</div>
                <div className="text-[11px] text-zinc-500 font-normal mt-1">
                  Use Saathi AI to format a formal written FIR or POSH complaint.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTriageChoice('official_portal')}
                className={`p-3.5 rounded-xl border text-left transition ${
                  triageChoice === 'official_portal'
                    ? 'bg-purple-100 border-purple-600 text-purple-950 font-bold'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                }`}
              >
                <div className="text-xs font-bold">3. Official Reporting Links</div>
                <div className="text-[11px] text-zinc-500 font-normal mt-1">
                  Direct official links to Cybercrime (1930) or NCW.
                </div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSaveReport}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>{isSubmitting ? 'Saving Draft...' : 'Save Draft & View Next Steps'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Confirmation & Actionable Next Steps */}
      {currentStep === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-md space-y-6">
          <div className="text-center space-y-2 border-b border-zinc-100 pb-5">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900">Your Confidential Draft is Saved</h2>
            <p className="text-xs text-zinc-600 max-w-md mx-auto">
              Your report draft is preserved for your active session. You can copy the narrative summary or proceed to guided triage.
            </p>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-900">
              Recommended Next Actions:
            </div>

            {triageChoice === 'support' && (
              <div className="space-y-2 text-xs text-zinc-700">
                <p>We recommend viewing verified shelters and crisis centers:</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href="/ngos?service=Shelter"
                    className="px-3.5 py-1.5 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800"
                  >
                    Find Verified Shelters
                  </a>
                  <a
                    href="/safepath"
                    className="px-3.5 py-1.5 bg-white border border-purple-300 text-purple-900 font-bold rounded-lg hover:bg-purple-100"
                  >
                    Open SafePath Safety Planner
                  </a>
                </div>
              </div>
            )}

            {triageChoice === 'complaint_draft' && (
              <div className="space-y-2 text-xs text-zinc-700">
                <p>Let Saathi AI help format this narrative into a formal legal submission:</p>
                <div className="pt-1">
                  <a
                    href="/saathi-ai"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800"
                  >
                    <span>Launch Complaint Drafting Assistant</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            )}

            {triageChoice === 'official_portal' && (
              <div className="space-y-2 text-xs text-zinc-700">
                <p>Official Government Reporting Portals (Outbound Direct):</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800"
                  >
                    National Cyber Crime Portal (1930) ↗
                  </a>
                  <a
                    href="http://ncw.nic.in"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-700"
                  >
                    NCW Official Portal ↗
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-700">Formatted Narrative Summary:</span>
              <button
                type="button"
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-900 font-semibold"
              >
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{copiedDraft ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
              </button>
            </div>
            <pre className="p-3 bg-zinc-900 text-zinc-200 rounded-xl text-[11px] font-mono overflow-x-auto whitespace-pre-wrap">
              {formattedReportSummary}
            </pre>
          </div>

          <div className="flex justify-between pt-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setCurrentStep(1);
                setIsSaved(false);
              }}
              className="text-zinc-500 hover:text-purple-700 underline"
            >
              Start New Report
            </button>
            <button
              type="button"
              onClick={() => navigate('/thank-you?type=report')}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl"
            >
              Complete &amp; Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
