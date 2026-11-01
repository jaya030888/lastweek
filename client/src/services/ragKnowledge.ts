export interface KnowledgeDocument {
  id: string;
  topic: string;
  keywords: string[];
  content: string;
  source: string;
  verifiedDate: string;
}

export const VERIFIED_KNOWLEDGE_BASE: KnowledgeDocument[] = [
  {
    id: 'kb-pwdva-2005',
    topic: 'Domestic Violence Legal Rights (PWDVA 2005)',
    keywords: ['domestic', 'violence', 'husband', 'in-laws', 'beating', 'threat', 'pwdva', 'shelter', 'maintenance', 'abuse', 'gaslighting', 'home'],
    content:
      'Under the Protection of Women from Domestic Violence Act, 2005 (PWDVA), domestic abuse includes physical violence, emotional/verbal harassment, sexual abuse, and economic/financial denial. A woman has the legal right to reside in the shared household (Section 17) and cannot be evicted by the abuser. A Magistrate can grant immediate Protection Orders (barring the abuser from communicating or approaching), Residence Orders, Monetary Relief for medical/living expenses, and interim Custody Orders for children.',
    source: 'Ministry of Law and Justice, Govt. of India / Supreme Court of India',
    verifiedDate: 'October 2026',
  },
  {
    id: 'kb-zero-fir',
    topic: 'Right to File a Zero FIR',
    keywords: ['fir', 'police', 'zero fir', 'complaint', 'station', 'jurisdiction', 'refusal', 'register'],
    content:
      'Under Supreme Court guidelines and advisory by the Ministry of Home Affairs, a woman survivor has the absolute right to lodge a "Zero FIR" at ANY police station, regardless of where the incident occurred or station territorial jurisdiction. The police station cannot turn the complainant away. Once registered, the station assigns an initial number ("0") and transfers the case to the competent jurisdiction police station for detailed investigation.',
    source: 'Ministry of Home Affairs Advisory & Lalita Kumari v. Govt of UP (2014)',
    verifiedDate: 'October 2026',
  },
  {
    id: 'kb-posh-act-2013',
    topic: 'Workplace Sexual Harassment (POSH Act 2013)',
    keywords: ['workplace', 'posh', 'harassment', 'boss', 'colleague', 'office', 'ic', 'internal committee', 'inappropriate', 'messages', 'job'],
    content:
      'The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 mandates that every establishment with 10 or more employees must have an Internal Committee (IC) headed by a senior woman employee. Harassment covers unwelcome physical contact, demand for sexual favors, sexually colored remarks, or creating a hostile work environment. An inquiry must conclude within 90 days. Retaliation against complainants is illegal, and interim relief (paid leave up to 3 months or department transfer) can be requested.',
    source: 'Ministry of Women and Child Development, POSH Handbook',
    verifiedDate: 'October 2026',
  },
  {
    id: 'kb-cyber-harassment',
    topic: 'Cyber Stalking, Doxxing & Non-Consensual Imagery',
    keywords: ['cyber', 'stalking', 'online', 'instagram', 'whatsapp', 'photos', 'blackmail', 'morphed', 'doxxing', 'threats', '1930', 'leaking'],
    content:
      'Under the Information Technology Act (Sections 66E, 67, 67A) and BNS/IPC (Section 78/354D for stalking and 77/354C for voyeurism), transmitting non-consensual private images, online harassment, obscene threats, and persistent tracking is a cognizable criminal offense punishable with imprisonment up to 3 to 5 years. Victims can report immediately to National Cyber Crime Portal (cybercrime.gov.in) or call 1930. The cyber cell can issue urgent takedown notices to platforms within 24 hours under IT Intermediary Guidelines.',
    source: 'Indian Cyber Crime Coordination Centre (I4C) & IT Rules 2021',
    verifiedDate: 'October 2026',
  },
  {
    id: 'kb-emergency-safety-plan',
    topic: 'Personal Safety Planning & Emergency Preparedness',
    keywords: ['safety plan', 'escape', 'emergency bag', 'leaving', 'packing', 'code word', 'danger', 'secret', 'protection'],
    content:
      'A personal safety plan involves: 1) Emergency Grab Bag kept in an accessible secret spot (photo IDs, birth/marriage certificates, bank cards, cash, daily medications, spare house/car keys, and a cheap backup phone). 2) Code Word: Establish a specific single-word code (e.g. "Lavender") with two trusted friends or neighbors which means "Call 112 for police immediately and come to my location." 3) Safe Route: Identify multiple exits and a secure destination (a trusted friend’s house, Sakhi One Stop Centre, or NGO shelter). 4) Digital safety: Log out of shared accounts, use incognito mode, and verify location-sharing settings on your phone.',
    source: 'National Domestic Violence Resources & SNEHA Safety Guide',
    verifiedDate: 'October 2026',
  },
  {
    id: 'kb-helplines-directory',
    topic: 'Verified 24x7 Emergency Helplines in India',
    keywords: ['number', 'helpline', 'call', 'phone', 'contact', 'police', 'ambulance', 'urgent', '112', '1091', '181', '7827170170'],
    content:
      'Key verified national helplines: 112 (Pan-India National Emergency Number for Police, Medical & Fire with GPS dispatch); 1091 (Women Helpline for immediate police response); 181 (Universal Women Helpline for legal/counseling/shelter support); 7827170170 (NCW 24x7 Women in Distress Line); 1930 (National Cyber Crime Reporting Line); +91 9999 666 555 (Vandrevala Foundation 24x7 Mental Health Crisis Helpline).',
    source: 'Emergency Response Support System (ERSS) & NCW India',
    verifiedDate: 'October 2026',
  },
];

export class RagService {
  public static retrieveContext(query: string, topK: number = 3): KnowledgeDocument[] {
    const tokens = query.toLowerCase().split(/[\s,?.!-]+/).filter(t => t.length > 2);

    const scored = VERIFIED_KNOWLEDGE_BASE.map(doc => {
      let score = 0;
      for (const token of tokens) {
        if (doc.keywords.some(kw => kw.includes(token) || token.includes(kw))) {
          score += 3;
        }
        if (doc.content.toLowerCase().includes(token)) {
          score += 1;
        }
        if (doc.topic.toLowerCase().includes(token)) {
          score += 2;
        }
      }
      return { doc, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const results = scored.filter(s => s.score > 0).slice(0, topK).map(s => s.doc);
    if (results.length === 0) {
      return [VERIFIED_KNOWLEDGE_BASE[0], VERIFIED_KNOWLEDGE_BASE[4], VERIFIED_KNOWLEDGE_BASE[5]];
    }

    return results;
  }
}
