import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  ShieldAlert,
  Languages,
  BookOpen,
  FileText,
  Copy,
  Printer,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { useUser } from '../context/UserContext';
import { SEO } from '../components/common/SEO';

interface Message {
  id: string;
  sender: 'user' | 'saathi';
  text: string;
  isAiGenerated?: boolean;
  modelUsed?: string;
  citations?: Array<{ topic: string; source: string; verifiedDate: string }>;
  timestamp: string;
}

export const SaathiAiChat: React.FC = () => {
  const { pseudonym } = useUser();
  const [activeTab, setActiveTab] = useState<'chat' | 'complaint_generator'>('chat');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [aiStatus, setAiStatus] = useState<{ online: boolean; model: string; message: string } | null>(null);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'saathi',
      text:
        'Hello. I am Saathi AI, a compassionate digital guide for Her Voice.\n\nI am here to listen without judgment, explain abuse warning signs, guide you through your legal protections (such as PWDVA and the POSH Act), and help prepare complaint drafts.\n\nMandatory safety reminder: I am an AI, not a lawyer, therapist, police officer, or emergency responder. If you are in immediate physical danger, please dial 112 right now.\n\nHow can I support you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Complaint Assistant State
  const [incidentType, setIncidentType] = useState('Workplace Harassment (POSH)');
  const [targetAuthority, setTargetAuthority] = useState<'police' | 'posh_ic' | 'ncw' | 'cyber_cell'>('posh_ic');
  const [incidentDateRange, setIncidentDateRange] = useState('');
  const [locationOrWorkplace, setLocationOrWorkplace] = useState('');
  const [narrative, setNarrative] = useState('');
  const [evidenceListRaw, setEvidenceListRaw] = useState('');
  const [reliefSought, setReliefSought] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);
  const [filingTips, setFilingTips] = useState<string[]>([]);
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [draftCopied, setDraftCopied] = useState(false);
  const [complaintFormError, setComplaintFormError] = useState<string | null>(null);

  useEffect(() => {
    api.checkAiStatus().then(setAiStatus).catch(console.error);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isTyping]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setIsTyping(true);

    try {
      const historyPayload = messages.slice(-4).map(m => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));

      const res = await api.chatWithSaathi(textToSend, historyPayload, language);

      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: 'saathi',
        text: res.message,
        isAiGenerated: res.isAiGenerated,
        modelUsed: res.modelUsed,
        citations: res.retrievedContexts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'saathi',
        text: 'I am experiencing a momentary connection interruption. Please remember you can dial 112 (Universal Emergency) or 1091 (Women in Distress) at any time.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentType.trim() || !narrative.trim()) {
      setComplaintFormError('Please provide both the incident type and factual narrative description.');
      return;
    }
    setComplaintFormError(null);
    setGeneratingDraft(true);

    try {
      const evidenceList = evidenceListRaw
        .split('\n')
        .map(e => e.trim())
        .filter(Boolean);

      const res = await api.draftComplaint({
        incidentType,
        targetAuthority,
        incidentDateRange,
        locationOrWorkplace,
        narrative,
        evidenceList,
        reliefSought,
        pseudonymOrName: pseudonym,
      });

      setGeneratedDraft(res.draftText);
      setFilingTips(res.filingTips || []);
    } catch (err: any) {
      console.error(err);
      setComplaintFormError(err.message || 'Failed to generate formal complaint draft.');
    } finally {
      setGeneratingDraft(false);
    }
  };

  const copyDraftToClipboard = () => {
    if (!generatedDraft) return;
    navigator.clipboard.writeText(generatedDraft);
    setDraftCopied(true);
    setTimeout(() => setDraftCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <SEO
        title="Saathi AI Support Companion | Bilingual Legal Guidance"
        description="Trauma-informed conversational AI support in English and Hindi. Cites verified statutory rights under PWDVA, POSH, and helps draft formal complaints."
      />

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
              <Bot className="w-6 h-6 text-purple-700" aria-hidden="true" />
              <span>Saathi AI Support Companion</span>
            </h1>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
              Open-Weight AI
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Empathetic, trauma-informed guidance in English &amp; Hindi with verified legal RAG.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-zinc-100 p-1 rounded-xl text-xs font-bold" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'chat' ? 'bg-white text-purple-900 shadow-xs' : 'text-zinc-600'
            }`}
          >
            Chat Companion
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'complaint_generator'}
            onClick={() => setActiveTab('complaint_generator')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'complaint_generator' ? 'bg-white text-purple-900 shadow-xs' : 'text-zinc-600'
            }`}
          >
            Complaint Drafting Assistant
          </button>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-2.5 text-xs text-purple-900">
        <ShieldAlert className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="leading-relaxed">
          <strong>Non-Clinical &amp; Non-Legal AI Disclaimer:</strong> Saathi AI provides educational information and supportive conversational assistance. It does not replace licensed psychological therapy, authorized legal counsel, or official police reporting. In an active emergency, call <strong>112</strong> immediately.
        </div>
      </div>

      {/* TAB 1: CHAT COMPANION */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs flex flex-col h-[75vh] min-h-[500px] max-h-[750px] overflow-hidden">
          {/* Chat Header Bar */}
          <div className="p-3.5 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${aiStatus?.online ? 'bg-emerald-500' : 'bg-purple-600'}`} aria-hidden="true" />
              <span className="font-semibold text-zinc-700">
                {aiStatus?.online ? `Ollama Local Model (${aiStatus.model})` : 'Saathi Verified RAG Engine (Deterministic Safe Mode)'}
              </span>
            </div>

            {/* Language switch */}
            <div className="flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
              <button
                onClick={() => setLanguage('en')}
                aria-label="Switch chat to English"
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  language === 'en' ? 'bg-purple-700 text-white' : 'text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                aria-label="Switch chat to Hindi"
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  language === 'hi' ? 'bg-purple-700 text-white' : 'text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'saathi' && (
                  <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    <Bot className="w-4 h-4" aria-hidden="true" />
                  </div>
                )}

                <div
                  className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed whitespace-pre-line shadow-sm space-y-3 ${
                    msg.sender === 'user'
                      ? 'bg-purple-700 text-white rounded-br-none font-medium'
                      : 'bg-white border border-purple-200/80 text-zinc-900 rounded-bl-none shadow-xs'
                  }`}
                >
                  <div className="font-sans leading-relaxed tracking-normal">{msg.text}</div>

                  {/* Citations pill if available */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-3 border-t border-purple-100 space-y-2">
                      <div className="text-[11px] uppercase tracking-wider font-extrabold text-purple-900 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                        <span>Verified Resources &amp; Legal Frameworks:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.citations.map((c, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center text-xs font-semibold bg-purple-50 text-purple-900 border border-purple-200/70 px-2.5 py-1 rounded-lg"
                          >
                            {c.topic} <span className="text-purple-600 ml-1">({c.verifiedDate})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className={`text-[11px] font-medium text-right pt-1 ${
                      msg.sender === 'user' ? 'text-purple-200' : 'text-zinc-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" aria-hidden="true" />
                </div>
                <div className="bg-zinc-100 rounded-2xl px-4 py-3 text-xs text-zinc-500 rounded-bl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px]">Saathi AI is formulating a trauma-informed response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompt Pills */}
          <div className="p-2.5 bg-zinc-50 border-t border-zinc-100 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
            <span className="text-[10px] text-zinc-400 font-bold uppercase shrink-0">Topics:</span>
            {[
              'What are my legal rights under PWDVA 2005?',
              'How does POSH workplace Internal Committee work?',
              'Can police refuse to register my FIR?',
              'What should I pack in an emergency grab-bag?',
            ].map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1 bg-white hover:bg-purple-100 text-zinc-700 hover:text-purple-900 border border-zinc-200 rounded-full text-xs shrink-0 transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-zinc-100 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Saathi in English or Hindi (e.g. 'What are my rights under PWDVA?')..."
              aria-label="Type message to Saathi AI"
              className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-purple-600"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
            <button
              type="button"
              disabled={isTyping || !inputMessage.trim()}
              onClick={() => handleSendMessage()}
              aria-label="Send message"
              className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs shadow transition disabled:opacity-40"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: COMPLAINT DRAFTING ASSISTANT */}
      {activeTab === 'complaint_generator' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-zinc-100 pb-4">
            <h2 className="text-lg font-bold text-zinc-900">
              Formal Complaint &amp; FIR Drafting Assistant
            </h2>
            <p className="text-xs text-zinc-500">
              Saathi AI structures your raw notes into a formal, chronological legal submission for Police, POSH Committees, NCW, or Cyber Crime Cells.
            </p>
          </div>

          {complaintFormError && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
              <span>{complaintFormError}</span>
            </div>
          )}

          <form onSubmit={handleGenerateComplaint} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="target-authority" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Recipient Authority
                </label>
                <select
                  id="target-authority"
                  value={targetAuthority}
                  onChange={(e) => setTargetAuthority(e.target.value as any)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs sm:text-sm"
                >
                  <option value="posh_ic">Workplace Internal Committee (POSH Act 2013)</option>
                  <option value="police">Station House Officer / Police (FIR / Zero FIR)</option>
                  <option value="cyber_cell">Cyber Crime Investigation Cell (1930 / IT Act)</option>
                  <option value="ncw">National Commission for Women (NCW)</option>
                </select>
              </div>

              <div>
                <label htmlFor="incident-type" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Incident Type
                </label>
                <input
                  id="incident-type"
                  type="text"
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  placeholder="e.g. Workplace Harassment, Coercive Intimidation, Cyber Stalking"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="incident-date-range" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Date / Time Range
                </label>
                <input
                  id="incident-date-range"
                  type="text"
                  value={incidentDateRange}
                  onChange={(e) => setIncidentDateRange(e.target.value)}
                  placeholder="e.g. Between October 12 and October 24, 2026"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="incident-location" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Location / Workplace Name
                </label>
                <input
                  id="incident-location"
                  type="text"
                  value={locationOrWorkplace}
                  onChange={(e) => setLocationOrWorkplace(e.target.value)}
                  placeholder="e.g. Company Office / Shared Apartment"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="statement-facts" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Statement of Facts (Chronological events, conduct, and impact)
              </label>
              <textarea
                id="statement-facts"
                rows={4}
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder="Describe what occurred factually. Include dates, exact words or gestures, and how you communicated your lack of consent."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="evidence-raw" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Evidence Items (One per line)
                </label>
                <textarea
                  id="evidence-raw"
                  rows={2}
                  value={evidenceListRaw}
                  onChange={(e) => setEvidenceListRaw(e.target.value)}
                  placeholder="Timestamped WhatsApp screenshots&#10;Email records dated Oct 14&#10;Security entry logs"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label htmlFor="relief-sought" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Specific Relief Sought
                </label>
                <textarea
                  id="relief-sought"
                  rows={2}
                  value={reliefSought}
                  onChange={(e) => setReliefSought(e.target.value)}
                  placeholder="e.g. Immediate departmental transfer, protection order, formal inquiry under POSH Act"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={generatingDraft || !narrative}
                className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow transition disabled:opacity-40"
              >
                {generatingDraft ? 'Formatting Formal Draft...' : 'Generate Legal Draft'}
              </button>
            </div>
          </form>

          {/* Generated Draft Display */}
          {generatedDraft && (
            <div className="p-5 bg-zinc-900 text-zinc-100 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs font-bold text-purple-300">Generated Formal Complaint</span>
                <div className="flex gap-2">
                  <button
                    onClick={copyDraftToClipboard}
                    className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs"
                  >
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{draftCopied ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs"
                  >
                    <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {generatedDraft}
              </pre>

              {filingTips.length > 0 && (
                <div className="p-3 bg-purple-950/60 border border-purple-800 rounded-xl space-y-1 text-xs text-purple-200">
                  <strong className="block text-amber-300">Procedural Filing Tips:</strong>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {filingTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
