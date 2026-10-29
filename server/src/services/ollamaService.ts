import { config } from '../config';
import { RagService } from './ragService';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AiResponse {
  message: string;
  isAiGenerated: boolean;
  modelUsed: string;
  retrievedContexts: Array<{ topic: string; source: string; verifiedDate: string }>;
  disclaimer: string;
  emergencyAlert?: boolean;
}

export class OllamaService {
  private static systemPrompt = `
You are "Saathi AI" (साथी AI), a compassionate, trauma-informed digital assistant built for "Her Voice", an open-source women's safety platform.

MANDATORY SAFETY BOUNDARIES:
1. Clearly identify yourself as an AI assistant.
2. NEVER claim to be a therapist, lawyer, police officer, or emergency responder.
3. NEVER determine whether an allegation is true or false.
4. NEVER promise absolute secrecy or confidentiality.
5. NEVER encourage confronting an abuser or escalating dangerous confrontations. Prioritize physical and psychological safety above all.
6. If the user mentions immediate physical violence, suicide, or active danger, immediately highlight emergency numbers: 112 (Universal Emergency in India) and 1091/181 (Women Helpline).
7. Respond empathetically, without judgment, victim-blaming, or condescension.
8. Support English, Hindi, and mixed conversational Hinglish naturally according to the user's language.
9. Use the provided verified context for all legal citations and procedural guidance.
`;

  /**
   * Check if Ollama daemon is reachable
   */
  public static async checkHealth(): Promise<{ online: boolean; model: string; message: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${config.ollamaBaseUrl}/api/tags`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json() as { models?: Array<{ name: string }> };
        const availableModels = data.models?.map(m => m.name) || [];
        return {
          online: true,
          model: config.ollamaModel,
          message: `Ollama service active. Models detected: ${availableModels.join(', ') || config.ollamaModel}`,
        };
      }
    } catch {
      // Ollama not reachable
    }

    return {
      online: false,
      model: `${config.ollamaModel} (offline / fallback active)`,
      message: 'Ollama local server not detected or currently offline. Operating safely with verified offline RAG knowledge base.',
    };
  }

  /**
   * Chat with Saathi AI (Ollama primary, Graceful fallback secondary)
   */
  public static async chat(
    userMessage: string,
    history: ChatMessage[] = [],
    language: 'en' | 'hi' = 'en'
  ): Promise<AiResponse> {
    const isUrgent = /(kill|beat|hit|suicide|blood|weapon|choke|cut|danger|emergency|die|lock me)/i.test(userMessage);

    // Retrieve verified knowledge contexts via RAG
    const ragContexts = RagService.retrieveContext(userMessage, 2);
    const ragSummaryText = ragContexts
      .map(doc => `[Verified Resource: ${doc.topic} | Source: ${doc.source}]\n${doc.content}`)
      .join('\n\n');

    const disclaimer =
      'Disclaimer: I am Saathi AI, a support companion. I am not a lawyer, doctor, or police officer. In an active emergency, call 112 or your local emergency line immediately.';

    // Try calling Ollama if running
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const promptPayload = {
        model: config.ollamaModel,
        prompt: `${this.systemPrompt}
Language preference: ${language === 'hi' ? 'Hindi / Hinglish' : 'English'}

Verified Knowledge Base Context:
${ragSummaryText}

Recent conversation history:
${history.slice(-4).map(h => `${h.role.toUpperCase()}: ${h.content}`).join('\n')}

USER: ${userMessage}
SAATHI AI:`,
        stream: false,
        options: {
          temperature: 0.4,
          top_p: 0.9,
        },
      };

      const response = await fetch(`${config.ollamaBaseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json() as { response?: string };
        if (data.response && data.response.trim().length > 0) {
          return {
            message: data.response.trim(),
            isAiGenerated: true,
            modelUsed: config.ollamaModel,
            retrievedContexts: ragContexts.map(c => ({ topic: c.topic, source: c.source, verifiedDate: c.verifiedDate })),
            disclaimer,
            emergencyAlert: isUrgent,
          };
        }
      }
    } catch {
      // Ollama unreachable, transition to deterministic verified fallback
    }

    // Graceful Fallback Engine
    const fallbackMessage = this.generateFallbackResponse(userMessage, ragContexts, language, isUrgent);

    return {
      message: fallbackMessage,
      isAiGenerated: false,
      modelUsed: 'Saathi-Verified-RAG-Fallback (Offline Engine)',
      retrievedContexts: ragContexts.map(c => ({ topic: c.topic, source: c.source, verifiedDate: c.verifiedDate })),
      disclaimer,
      emergencyAlert: isUrgent,
    };
  }

  /**
   * Deterministic Trauma-Informed Fallback Engine (English & Hindi)
   */
  private static generateFallbackResponse(
    userMessage: string,
    contexts: ReturnType<typeof RagService.retrieveContext>,
    language: 'en' | 'hi',
    isUrgent: boolean
  ): string {
    const lower = userMessage.toLowerCase();

    if (isUrgent) {
      if (language === 'hi') {
        return `🚨 कृपया तुरंत सुरक्षित स्थान पर जाएं। आपकी सुरक्षा सबसे महत्वपूर्ण है।

कृपया तुरंत इन आपातकालीन नंबरों पर कॉल करें:
- 112 (राष्ट्रीय आपातकालीन हेल्पलाइन - पुलिस, एम्बुलेंस)
- 1091 / 181 (महिला सुरक्षा हेल्पलाइन)
- 7827170170 (राष्ट्रीय महिला आयोग - NCW 24x7)

यदि आप अभी बात नहीं कर सकते, तो किसी भरोसेमंद व्यक्ति को अपना सीक्रेट कोड भेजें या सीधे 112 डायल करें।`;
      }
      return `🚨 Please prioritize your immediate physical safety right now.

If you are in immediate danger, please reach out to emergency responders immediately:
- 112 (Universal Emergency - Police, Ambulance, Fire)
- 1091 / 181 (Women in Distress Helpline)
- 7827170170 (National Commission for Women 24x7)

If you cannot speak, step into a locked room, exit the premises if safe, and contact emergency services. We are here with you.`;
    }

    if (lower.includes('workplace') || lower.includes('boss') || lower.includes('office') || lower.includes('posh')) {
      if (language === 'hi') {
        return `मुझे खेद है कि आप अपने कार्यस्थल पर इस असहज स्थिति का सामना कर रही हैं। कार्यस्थल पर सम्मान और सुरक्षा आपका संवैधानिक अधिकार है।

कानूनी प्रावधान (POSH Act 2013):
1. प्रत्येक 10 से अधिक कर्मचारियों वाले संस्थान में 'Internal Committee' (IC) होना अनिवार्य है।
2. आप घटना के 90 दिनों के भीतर लिखित शिकायत दर्ज करा सकती हैं।
3. जांच के दौरान आप 3 महीने तक की सवैतनिक छुट्टी (paid leave) या विभाग स्थानांतरण (transfer) का अनुरोध कर सकती हैं।

सलाह: सभी ईमेल, चैट स्क्रीनशॉट और तारीखों का एक सुरक्षित व्यक्तिगत बैकअप रखें। क्या आप शिकायत का औपचारिक ड्राफ्ट तैयार करने में सहायता चाहती हैं?`;
      }
      return `I hear you, and it takes immense courage to address this. No one should have to compromise their peace or safety for their career.

Key protections under the POSH Act, 2013:
1. Every workplace with 10+ employees must have an Internal Committee (IC) led by a senior woman.
2. Harassment includes unwelcome physical contact, sexual remarks, repeated late-night unprofessional messages, and hostile environments.
3. You have the right to request interim relief (department change or up to 3 months paid leave during the inquiry).

Practical next step: Keep chronological screenshots and email logs stored on a personal device. Would you like me to help format a complaint draft for your IC?`;
    }

    if (lower.includes('domestic') || lower.includes('husband') || lower.includes('in-law') || lower.includes('beating') || lower.includes('gaslight') || lower.includes('threat')) {
      if (language === 'hi') {
        return `आप अकेली नहीं हैं, और जो कुछ हो रहा है वह आपकी गलती बिल्कुल नहीं है। घरेलू हिंसा केवल शारीरिक नहीं होती; मानसिक, मौखिक और आर्थिक नियंत्रण भी कानूनन हिंसा है।

घरेलू हिंसा अधिनियम 2005 (PWDVA) के तहत आपके अधिकार:
1. 'साझा घर' में रहने का अधिकार: आपको कोई भी जबरन घर से बाहर नहीं निकाल सकता।
2. प्रोटेक्शन ऑर्डर (Protection Order): अदालत आरोपी को आपके पास आने या संपर्क करने से तुरंत रोक सकती है।
3. आर्थिक सहायता: भरण-पोषण और चिकित्सा खर्च पाने का अधिकार।

एक व्यक्तिगत सुरक्षा योजना बनाएं: अपने आवश्यक दस्तावेज़ (आधार, बैंक पासबुक, दवाइयाँ) एक सुरक्षित बैग में रखें।`;
      }
      return `I want to remind you gently: whatever has happened is NOT your fault. Abuse is never justified, whether physical, emotional, or financial.

Under the Protection of Women from Domestic Violence Act (PWDVA 2005):
1. Right to Reside: You cannot be illegally evicted from your shared matrimonial household.
2. Protection Orders: A Magistrate can legally restrain an abuser from contacting or entering your space.
3. Residence & Monetary Relief: Right to maintenance, medical expenses, and shelter support.

Safe Path recommendation: Consider packing an emergency grab-bag with key documents, cash, and spare keys at a trusted neighbor or friend's home.`;
    }

    if (lower.includes('cyber') || lower.includes('stalk') || lower.includes('photo') || lower.includes('blackmail') || lower.includes('instagram') || lower.includes('whatsapp')) {
      if (language === 'hi') {
        return `ऑनलाइन उत्पीड़न या ब्लैकमेलिंग एक गंभीर संज्ञेय अपराध है। आपको किसी भी धमकी से डरने की आवश्यकता नहीं है।

महत्वपूर्ण कदम:
1. सबूत सुरक्षित करें: आरोपी को ब्लॉक करने से पहले चैट, प्रोफाइल लिंक, फोन नंबर और तारीखों के स्पष्ट स्क्रीनशॉट लें।
2. 1930 पर कॉल करें या 'cybercrime.gov.in' पर सीधे शिकायत दर्ज करें।
3. सोशल मीडिया पर रिपोर्ट करें: आईटी नियमों के तहत प्लेटफॉर्म को 24 घंटे के भीतर गैर-सहमति वाली निजी तस्वीरें हटाने का आदेश दिया जा सकता है।`;
      }
      return `Online harassment, cyberstalking, and photo blackmail are punishable criminal offenses under IT Act Sections 66E/67A and BNS Section 78.

Steps to take immediately:
1. Document the evidence: Take full-screen screenshots showing dates, usernames, and phone numbers before blocking.
2. Report to Cyber Crime: Call 1930 or submit a confidential report at cybercrime.gov.in.
3. Platform takedowns: Social media intermediaries are required under IT Rules to remove non-consensual intimate imagery within 24 hours of reporting.`;
    }

    // Default empathetic general guidance with RAG citation
    const primaryContext = contexts[0];
    if (language === 'hi') {
      return `मैं आपकी बात ध्यान से सुन रही हूँ। आपकी सुरक्षा और निजता सबसे पहले है।

आप जो भी साझा करना चाहें, अपनी गति से साझा कर सकती हैं। यदि आप किसी विशिष्ट कानूनी अधिकार (जैसे घरेलू हिंसा, कार्यस्थल उत्पीड़न, या साइबर सुरक्षा) या शिकायत का प्रारूप तैयार करने के बारे में जानना चाहती हैं, तो मुझे बताएं।

सहायक संदर्भ (${primaryContext.topic}):
${primaryContext.content.slice(0, 260)}...`;
    }

    return `I am here with you, listening without judgment. Your identity is protected, and your feelings are completely valid.

Whether you want to understand your legal rights, build a personal safety plan, connect with a verified NGO, or organize your thoughts into a formal complaint draft, I am here to guide you step-by-step.

Helpful Verified Resource (${primaryContext.topic}):
${primaryContext.content.slice(0, 260)}...

How would you like to proceed?`;
  }

  /**
   * Complaint Drafting Assistant
   */
  public static async draftComplaint(details: {
    incidentType: string;
    targetAuthority: 'police' | 'posh_ic' | 'ncw' | 'cyber_cell';
    incidentDateRange: string;
    locationOrWorkplace: string;
    narrative: string;
    evidenceList: string[];
    reliefSought: string;
    pseudonymOrName: string;
  }): Promise<{ draftText: string; filingTips: string[] }> {
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    let authorityHeader = '';
    let subjectLine = '';
    let legalSections = '';

    switch (details.targetAuthority) {
      case 'posh_ic':
        authorityHeader = `To,\nThe Presiding Officer & Members,\nInternal Complaints Committee (ICC),\n${details.locationOrWorkplace || '[Name of Organization / Workplace]'}`;
        subjectLine = `Formal Complaint of Sexual Harassment at Workplace under the POSH Act, 2013`;
        legalSections = `Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013`;
        break;
      case 'cyber_cell':
        authorityHeader = `To,\nThe Officer-in-Charge / Superintendent of Police,\nCyber Crime Investigation Cell,\n${details.locationOrWorkplace || '[City / District]'}`;
        subjectLine = `Formal Complaint Regarding Cyber Stalking, Online Harassment & Criminal Intimidation`;
        legalSections = `Information Technology Act, 2000 (Sec 66E, 67, 67A) & BNS Sec 78 (Stalking)`;
        break;
      case 'ncw':
        authorityHeader = `To,\nThe National Commission for Women (NCW),\nPlot 21, Jasola Institutional Area, New Delhi - 110025`;
        subjectLine = `Petition for Urgent Intervention Regarding Violence & Rights Violation`;
        legalSections = `National Commission for Women Act, 1990 & PWDVA 2005`;
        break;
      case 'police':
      default:
        authorityHeader = `To,\nThe Station House Officer (SHO),\nPolice Station: ${details.locationOrWorkplace || '[Police Station Name / Zero FIR Request]'}`;
        subjectLine = `Written Complaint for Registration of FIR under Relevant Provisions of Law`;
        legalSections = `Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code (IPC) & PWDVA 2005`;
        break;
    }

    const draftText = `DATE: ${today}

${authorityHeader}

SUBJECT: ${subjectLine}

Respected Madam / Sir,

I am writing to formally submit this written complaint regarding recurring incidents of ${details.incidentType} that occurred between/on ${details.incidentDateRange || '[Date/Time Range]'} at ${details.locationOrWorkplace || '[Location/Premises]'}.

1. STATEMENT OF FACTS:
${details.narrative || '[Detailed chronological description of the incident(s), names of individuals involved, and specific conduct.]'}

2. EVIDENCE AND SUPPORTING DOCUMENTATION:
The following evidence is available and enclosed/accessible:
${details.evidenceList.length > 0 ? details.evidenceList.map((e, idx) => `   ${idx + 1}. ${e}`).join('\n') : '   1. Timestamped electronic communication / screenshots\n   2. Witness details (available upon confidential request)'}

3. RELIEF SOUGHT:
In light of the statutory mandates under ${legalSections}, I respectfully request:
   a) ${details.reliefSought || 'Immediate registration of formal complaint/FIR and prompt preliminary inquiry.'}
   b) Necessary protection orders / interim relief to prevent further harassment or retaliation.
   c) Strict maintenance of privacy and confidentiality throughout this process.

Thank you for your prompt attention to this grave matter.

Yours faithfully,
${details.pseudonymOrName || '[Complainant Signature / Pseudonym for Confidential Review]'}`;

    const filingTips = [
      'Take at least two physical photocopies or keep a signed digital PDF copy of this complaint.',
      'Always request an official stamped and dated acknowledgment ("Receiving Copy") or diary number when submitting.',
      'Remember: You have the legal right to lodge a "Zero FIR" at any police station if you are away from the incident location.',
      'Under the POSH Act, the Internal Committee must maintain strict confidentiality regarding complainant identity.',
    ];

    return { draftText, filingTips };
  }
}

