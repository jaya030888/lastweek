import { VERIFIED_KNOWLEDGE_BASE, RagService, KnowledgeDocument } from './ragKnowledge';

export { VERIFIED_KNOWLEDGE_BASE, RagService };
export type { KnowledgeDocument };

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

export class ClientAiService {
  public static async chat(
    userMessage: string,
    history: ChatMessage[] = [],
    language: 'en' | 'hi' = 'en'
  ): Promise<AiResponse> {
    const isUrgent = /(kill|beat|hit|suicide|blood|weapon|choke|cut|danger|emergency|die|lock me)/i.test(userMessage);
    const ragContexts = RagService.retrieveContext(userMessage, 2);
    const disclaimer =
      'Disclaimer: I am Saathi AI, a support companion. I am not a lawyer, doctor, or police officer. In an active emergency, call 112 or your local emergency line immediately.';

    const fallbackMessage = this.generateResponse(userMessage, ragContexts, language, isUrgent);

    return {
      message: fallbackMessage,
      isAiGenerated: false,
      modelUsed: 'Saathi-Verified-RAG-Engine (In-Browser Offline Mode)',
      retrievedContexts: ragContexts.map(c => ({ topic: c.topic, source: c.source, verifiedDate: c.verifiedDate })),
      disclaimer,
      emergencyAlert: isUrgent,
    };
  }

  private static generateResponse(
    userMessage: string,
    contexts: KnowledgeDocument[],
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

    if (lower.includes('domestic') || lower.includes('husband') || lower.includes('in-law') || lower.includes('beating') || lower.includes('gaslight') || lower.includes('threat') || lower.includes('pwdva')) {
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
1. Right to Reside: You cannot be illegally evicted from your shared matrimonial household (Section 17).
2. Protection Orders: A Magistrate can legally restrain an abuser from contacting or entering your space.
3. Residence & Monetary Relief: Right to maintenance, medical expenses, and emergency shelter support.

Safe Path recommendation: Consider packing an emergency grab-bag with key documents, cash, and spare keys at a trusted neighbor or friend's home.`;
    }

    if (lower.includes('cyber') || lower.includes('stalk') || lower.includes('photo') || lower.includes('blackmail') || lower.includes('instagram') || lower.includes('whatsapp') || lower.includes('online')) {
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

    return `I am listening closely to you. You are in a safe, judgment-free space where your dignity comes first.

Take all the time you need. If you would like guidance on your legal rights under Indian law (such as PWDVA 2005, POSH Act, cyber harassment laws), or if you need an emergency safety plan or an official complaint draft, I am here to help.

Helpful Reference (${primaryContext.topic}):
${primaryContext.content}`;
  }
}
