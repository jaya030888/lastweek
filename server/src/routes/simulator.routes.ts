import { Router, Request, Response } from 'express';

const router = Router();

export interface SimulatorChoice {
  id: string;
  label: string;
  actionSummary: string;
  consequence: string;
  safetyScoreChange: number; // For educational insight, not gamification
  educationalInsight: string;
  nextChapterId: number | null;
}

export interface SimulatorChapter {
  id: number;
  chapterTitle: string;
  cinematicTone: 'tense' | 'alert' | 'reflective' | 'empowered';
  sceneNarrative: string;
  internalMonologue: string;
  choices: SimulatorChoice[];
}

export interface SimulatorScenarioData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  estimatedMinutes: number;
  contentWarning: string;
  disclaimer: string;
  overview: string;
  chapters: SimulatorChapter[];
  reflection: {
    coreLessons: string[];
    harmfulAttitudesExplained: string[];
    actionableTakeaways: string[];
    helplineRecommendation: string;
  };
}

export const REALITY_SCENARIOS: SimulatorScenarioData[] = [
  {
    id: 'sc-1',
    slug: 'the-subtle-cage',
    title: 'The Subtle Cage',
    subtitle: 'Recognizing Coercive Control & Financial Isolation',
    category: 'Domestic & Intimate Partner Control',
    estimatedMinutes: 6,
    contentWarning:
      'This scenario portrays emotional manipulation, financial oversight, and psychological control. It does not contain graphic physical violence.',
    disclaimer:
      'This interactive exercise is designed for educational reflection and empathy building. It does not claim to duplicate any individual survivor’s lived trauma.',
    overview:
      'Maya and her partner have been married for two years. Over recent months, affectionate "concern" has slowly morphed into detailed scrutiny of her phone, bank transactions, and contact with family.',
    chapters: [
      {
        id: 1,
        chapterTitle: 'Chapter 1: The "Joint" Accounts',
        cinematicTone: 'tense',
        sceneNarrative:
          'It is Sunday evening. You sit at the dining table with your salary statement. Your partner sits across, smiling warmly as he holds out his phone with a financial budgeting app.\n\n"Honey, remember we agreed that all salaries should go into our single joint account so we can invest properly? Let’s redirect your direct deposit tomorrow morning, and I’ll handle all household allocations so you never have to stress about bills."',
        internalMonologue:
          'A knot tightens in your stomach. Last month, when you wanted to buy your mother a birthday gift with your own earned bonus, he asked why you needed to spend money outside the household.',
        choices: [
          {
            id: 'c1-capitulate',
            label: 'Agree to avoid conflict: "Sure, let’s merge everything."',
            actionSummary: 'You transfer your primary account control to appease his expectations.',
            consequence:
              'Within two months, you have to ask for cash for daily groceries and taxi rides. Every debit requires an explanation, leaving you with zero financial autonomy.',
            safetyScoreChange: -2,
            educationalInsight:
              'Financial control is recognized as a specific form of domestic abuse under Section 3 of the PWDVA 2005. Isolating someone from their own money creates dependence that makes leaving far more difficult.',
            nextChapterId: 2,
          },
          {
            id: 'c1-boundary',
            label: 'Set a firm, calm boundary: "I’m happy to contribute our agreed share for bills, but I will keep my salary account separate."',
            actionSummary: 'You maintain your separate bank account while offering transparent bill splitting.',
            consequence:
              'He frowns and becomes cold, giving you the silent treatment for three days and accusing you of "not trusting our marriage."',
            safetyScoreChange: 3,
            educationalInsight:
              'When an abuser encounters a boundary, they often escalate to guilt-tripping or the silent treatment. Recognizing this reaction as emotional manipulation—rather than a flaw in your communication—is critical.',
            nextChapterId: 2,
          },
        ],
      },
      {
        id: 2,
        chapterTitle: 'Chapter 2: The Family Gathering',
        cinematicTone: 'alert',
        sceneNarrative:
          'Your younger sister is graduating from university in your hometown this weekend. You booked bus tickets three weeks ago. On Friday afternoon, your partner walks in looking distressed, massaging his forehead.\n\n"I’ve come down with a terrible fever. I really need you here with me. If your family really loved you, they’d understand that your place is taking care of your husband when he is sick. Why do you always prioritize them over our home?"',
        internalMonologue:
          'You notice he didn’t mention the fever until 45 minutes before your departure. This is the fourth time a family visit has been interrupted by an unexpected crisis.',
        choices: [
          {
            id: 'c2-stay',
            label: 'Cancel your trip and stay home to care for him.',
            actionSummary: 'You call your sister with a forced apology and unpack your bag.',
            consequence:
              'Your partner makes a miraculous recovery by Saturday afternoon and suggests watching a movie. Meanwhile, your sister feels hurt and distant, widening the emotional rift between you and your support network.',
            safetyScoreChange: -2,
            educationalInsight:
              'Isolation is a systematic tactic. Abusers intentionally create friction between the target and their closest loved ones so that the target has fewer allies to lean on when abuse escalates.',
            nextChapterId: 3,
          },
          {
            id: 'c2-go',
            label: 'Arrange medicine, call a neighbor to check in, but proceed with your trip.',
            actionSummary: 'You refuse to allow fabricated crises to sever your family ties.',
            consequence:
              'During the bus ride, your phone buzzes relentlessly with 37 angry text messages and voicemails accusing you of neglect. You turn your phone on do-not-disturb and confide in your sister that evening.',
            safetyScoreChange: 4,
            educationalInsight:
              'Maintaining outside relationships is a lifeline. Keeping your family informed provides a safe harbor and external perspective that counters domestic gaslighting.',
            nextChapterId: 3,
          },
        ],
      },
      {
        id: 3,
        chapterTitle: 'Chapter 3: The Secret Safety Plan',
        cinematicTone: 'reflective',
        sceneNarrative:
          'Back home, the hostility intensifies. He has started locking the front door from the inside and monitoring your browser history. You realize that you cannot fix this relationship through compromise, because the control is escalating.\n\nYou have an afternoon while he is at work to take decisive action for your safety.',
        internalMonologue:
          'I need to prepare quietly. Confronting him while I have nowhere to go will put me in immediate danger.',
        choices: [
          {
            id: 'c3-confront',
            label: 'Confront him directly that evening and demand a divorce.',
            actionSummary: 'You announce your intention to leave without an exit plan in place.',
            consequence:
              'The confrontation turns volatile. He seizes your phone, hides your car keys, and threatens to ruin your reputation with your employers. You are trapped in the house overnight in extreme fear.',
            safetyScoreChange: -5,
            educationalInsight:
              'STATISTICAL RISK: The most dangerous time for an abuse survivor is immediately when they announce their departure. Experts advise against dramatic confrontations; secret safety planning with verified shelters or helplines is essential.',
            nextChapterId: null,
          },
          {
            id: 'c3-safety-plan',
            label: 'Pack a confidential emergency grab-bag and contact the 181 helpline.',
            actionSummary: 'You gather essential IDs, certificates, cash, and stash them at a trusted friend’s house.',
            consequence:
              'With the help of a counselor at a local One Stop Centre, you map out a safe exit strategy. When the time comes to leave, you depart during working hours to a secure shelter, accompanied by protection officers.',
            safetyScoreChange: 5,
            educationalInsight:
              'Secret preparation—holding duplicate keys, essential identity records, and having an agreed code word with friends—saves lives. You have the right to protection orders under Section 18 of the PWDVA.',
            nextChapterId: null,
          },
        ],
      },
    ],
    reflection: {
      coreLessons: [
        'Abuse is about power and control, not "bad temper" or "miscommunication".',
        'Financial oversight and social isolation are early warning signs that should never be ignored.',
        'Leaving must be planned strategically and quietly to minimize the surge in perpetrator violence.',
      ],
      harmfulAttitudesExplained: [
        '"He is just protective because he loves her" — conflating possessive surveillance with healthy affection.',
        '"Why didn\'t she just walk away earlier?" — ignoring the severe financial, psychological, and physical barriers deliberately constructed by the abuser.',
      ],
      actionableTakeaways: [
        'Keep duplicate photocopies of Aadhaar, passport, and bank documents outside the home.',
        'Establish a secret code word with trusted friends or neighbors.',
        'Call the 181 or NCW 7827170170 helpline for confidential safety planning.',
      ],
      helplineRecommendation: 'National Commission for Women 24x7: 7827170170 | Emergency: 112',
    },
  },
  {
    id: 'sc-2',
    slug: 'the-breakroom-echo',
    title: 'The Breakroom Echo',
    subtitle: 'Bystander Intervention & Workplace POSH Protocol',
    category: 'Workplace Sexual Harassment',
    estimatedMinutes: 5,
    contentWarning:
      'Portrays workplace hierarchy intimidation and unwanted sexual advances. Does not contain physical violence.',
    disclaimer:
      'This scenario illustrates proactive allyship and the 5 D’s of Bystander Intervention under the POSH Act 2013.',
    overview:
      'You are a software engineer at a mid-sized tech consultancy. You observe a senior project director making persistent, unwelcome personal comments toward an associate who reports to him.',
    chapters: [
      {
        id: 1,
        chapterTitle: 'Chapter 1: The Late-Night Slack Ping',
        cinematicTone: 'alert',
        sceneNarrative:
          'It is 10:45 PM on a Thursday. In a shared channel, you see Director Ritesh pinging Ananya, asking her to jump on a "quick 1-on-1 video call to review deck aesthetics." Ananya politely replies that she has logged off for the night.\n\nRitesh responds: "Come on Ananya, flexibility is how people get promoted here. Put on something nice and let’s sync for 10 minutes."',
        internalMonologue:
          'This is completely out of line. Ananya is on probation, and Ritesh writes her performance appraisal next month.',
        choices: [
          {
            id: 'c1-ignore',
            label: 'Look away: "It’s between them, and I don’t want to jeopardize my own project standing."',
            actionSummary: 'You close your laptop and decide not to get involved.',
            consequence:
              'Over the next two weeks, Ananya looks visibly exhausted and starts skipping team lunches. Ritesh continues cornering her in the pantry, knowing no one has challenged his authority.',
            safetyScoreChange: -3,
            educationalInsight:
              'Silence from bystanders is interpreted by perpetrators as tacit social approval. A passive workplace culture enables harassment to escalate into outright extortion.',
            nextChapterId: 2,
          },
          {
            id: 'c1-distract',
            label: 'Intervene using Distraction: Post in the channel offering to review the deck since you are still online.',
            actionSummary: 'You disrupt the predatory private solicitation by stepping into the conversation.',
            consequence:
              'Ritesh backs off immediately, typing "Never mind, we will review tomorrow morning." Ananya sends you a private message thanking you for diffusing the pressure.',
            safetyScoreChange: 4,
            educationalInsight:
              'The "Distract" technique creates a face-saving exit without directly escalating the conflict in the moment. It demonstrates to both parties that other people are watching.',
            nextChapterId: 2,
          },
        ],
      },
      {
        id: 2,
        chapterTitle: 'Chapter 2: The Formal Redressal',
        cinematicTone: 'empowered',
        sceneNarrative:
          'The following Monday, Ananya approaches you in private. She reveals that Ritesh has sent multiple inappropriate WhatsApp messages over the past month and touched her shoulder inappropriately at a client dinner. She is afraid of speaking to HR because "Ritesh brings in 40% of the company revenue."',
        internalMonologue:
          'HR often protects company leadership, but the POSH Internal Committee (IC) has external member oversight mandated by Indian law.',
        choices: [
          {
            id: 'c2-empower',
            label: 'Explain her legal rights under POSH Act and offer to accompany her as a support person to the Internal Committee.',
            actionSummary: 'You help her organize timestamped screenshots and walk alongside her to the IC.',
            consequence:
              'Ananya submits a formal complaint to the IC. Because the IC includes an independent external NGO representative, the inquiry is protected from internal executive pressure. Ananya is granted an immediate team transfer.',
            safetyScoreChange: 5,
            educationalInsight:
              'Section 4 of the POSH Act requires an external member from an NGO on every Internal Committee to prevent internal cover-ups. Retaliation against complainants or witnesses is punishable by law.',
            nextChapterId: null,
          },
        ],
      },
    ],
    reflection: {
      coreLessons: [
        'Bystanders possess significant power to interrupt harassment before it escalates.',
        'The 5 D’s of Bystander Intervention: Distract, Delegate, Document, Delay, Direct.',
        'Under the POSH Act 2013, company revenue or senior status provides zero legal immunity against harassment charges.',
      ],
      harmfulAttitudesExplained: [
        '"She should have been more assertive" — ignoring that power imbalances make refusal dangerous for junior staff.',
        '"It was just banter or mentoring" — intent does not negate impact; unwelcome conduct is harassment.',
      ],
      actionableTakeaways: [
        'Keep chronological offsite backups of emails, messages, and call logs.',
        'Every organization with 10+ employees must display IC member contact details on company premises and portals.',
      ],
      helplineRecommendation: 'National Cyber & Workplace Grievance: 1930 / 181',
    },
  },
  {
    id: 'sc-3',
    slug: 'digital-shadows',
    title: 'Digital Shadows',
    subtitle: 'Cyber Stalking, Blackmail & Digital Evidence Recovery',
    category: 'Cyber Harassment & Non-Consensual Imagery',
    estimatedMinutes: 5,
    contentWarning:
      'Portrays digital blackmail and threats of non-consensual image distribution.',
    disclaimer:
      'Highlights Indian IT Act legal protections and the official 1930 Cybercrime Reporting portal.',
    overview:
      'Tanya ended a brief relationship three weeks ago. Since then, fake social media accounts have been created using her name, and her ex is threatening to distribute private pictures if she refuses to meet him.',
    chapters: [
      {
        id: 1,
        chapterTitle: 'Chapter 1: The Ultimatums',
        cinematicTone: 'tense',
        sceneNarrative:
          'A message arrives from an anonymous Instagram handle containing a cropped photo of you, followed by:\n\n"You think you can just block me and walk away? I have the full gallery. Meet me at the cafe behind your gym tomorrow evening alone, or these go to your parents and college dean."',
        internalMonologue:
          'Your heart races. You feel paralyzed with panic and shame. You instinctively want to delete your entire Instagram account and throw your phone away.',
        choices: [
          {
            id: 'c1-delete',
            label: 'Delete the app and messages immediately in panic.',
            actionSummary: 'You erase all chats and deactivate your profile.',
            consequence:
              'Without logs, you have destroyed vital digital evidence including timestamps, IP header footprints, and username history. The perpetrator continues harassing your friends.',
            safetyScoreChange: -4,
            educationalInsight:
              'EVIDENCE INTEGRITY: Never delete threatening messages. Cyber forensic investigators require intact chat logs, full URL links, and timestamps to trace perpetrator device IDs.',
            nextChapterId: 2,
          },
          {
            id: 'c1-document',
            label: 'Take full-screen screenshots showing dates, phone headers, and URLs before locking privacy.',
            actionSummary: 'You meticulously document the evidence onto an encrypted USB drive.',
            consequence:
              'You retain an undeniable trail of criminal intimidation under Section 66E and 67A of the IT Act.',
            safetyScoreChange: 4,
            educationalInsight:
              'Documenting evidence while not engaging or arguing strips the perpetrator of leverage and prepares a bulletproof case for law enforcement.',
            nextChapterId: 2,
          },
        ],
      },
      {
        id: 2,
        chapterTitle: 'Chapter 2: The Official Cyber Report',
        cinematicTone: 'empowered',
        sceneNarrative:
          'He messages again: "2 hours left to reply." You know that paying money or meeting him will only lead to further extortion.',
        internalMonologue:
          'I will not let fear control my life. The law recognizes this as a serious criminal offense.',
        choices: [
          {
            id: 'c2-report',
            label: 'Dial 1930 and register a confidential complaint at cybercrime.gov.in under the Non-Consensual Intimate Imagery category.',
            actionSummary: 'You submit the incident with the National Cyber Crime Reporting Portal.',
            consequence:
              'The Cyber Crime Cell issues an urgent takedown request to Meta under IT Rules 2021. The fake accounts are suspended within 24 hours, and police issue a formal summons to the perpetrator.',
            safetyScoreChange: 5,
            educationalInsight:
              'Under Indian IT Intermediary Rules, platforms are legally mandated to remove non-consensual sexual imagery within 24 hours of notification. The 1930 portal enables confidential tracking.',
            nextChapterId: null,
          },
        ],
      },
    ],
    reflection: {
      coreLessons: [
        'Blackmailers rarely stop after one concession; capitulating only increases their demands.',
        'Never delete evidence; document full URLs, account IDs, and timestamps.',
        'The shame belongs entirely to the blackmailer, never to the target.',
      ],
      harmfulAttitudesExplained: [
        '"She should not have trusted someone with photos" — classic victim-blaming that absolves the criminal who breached trust and broke the law.',
      ],
      actionableTakeaways: [
        'Report immediately to 1930 or cybercrime.gov.in.',
        'Use StopNCII.org to generate digital hashes that prevent images from being uploaded across major social platforms.',
      ],
      helplineRecommendation: 'National Cyber Crime Helpline: 1930 | cybercrime.gov.in',
    },
  },
];

// GET /api/simulator/scenarios - List scenarios
router.get('/scenarios', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: REALITY_SCENARIOS.map(s => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      subtitle: s.subtitle,
      category: s.category,
      estimatedMinutes: s.estimatedMinutes,
      contentWarning: s.contentWarning,
      overview: s.overview,
      totalChapters: s.chapters.length,
    })),
  });
});

// GET /api/simulator/scenarios/:slug - Full scenario
router.get('/scenarios/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const scenario = REALITY_SCENARIOS.find(s => s.slug === slug || s.id === slug);

  if (!scenario) {
    return res.status(404).json({ success: false, error: { message: 'Scenario not found.' } });
  }

  res.json({ success: true, data: scenario });
});

export default router;

