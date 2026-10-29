export type CategoryType =
  | 'all'
  | 'domestic_abuse'
  | 'harassment'
  | 'sexual_violence'
  | 'relationships'
  | 'discrimination'
  | 'recovery';

export interface ReactionCounts {
  purple_heart: number;
  empathy_hug: number;
  solidarity: number;
  listening_ear: number;
}

export interface Post {
  id: string;
  authorId: string;
  pseudonym: string;
  title: string;
  content: string;
  category: CategoryType;
  triggerWarning?: string | null;
  isVerified: boolean;
  createdAt: string;
  commentCount: number;
  upvotes: number;
  reactionCounts: ReactionCounts;
  userReactions: string[];
  isBookmarked: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  pseudonym: string;
  content: string;
  createdAt: string;
}

export interface SafetyResource {
  id: string;
  title: string;
  category: 'helpline' | 'shelter' | 'legal_aid' | 'hospital' | 'cyber_safety';
  description: string;
  phoneNumber?: string | null;
  emergencyNumber?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country: string;
  is24x7: boolean;
  source: string;
  verifiedDate: string;
  url?: string | null;
}

export interface Ngo {
  id: string;
  name: string;
  mission: string;
  description: string;
  services: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  officialWebsite: string;
  officialDonationUrl: string;
  city: string;
  state: string;
  verifiedSource: string;
  verifiedDate: string;
  volunteerInfo?: string | null;
}

export interface MemorialStory {
  id: string;
  name: string;
  eraOrYear: string;
  location: string;
  biography: string;
  legacyImpact: string;
  candlesLit: number;
  marigoldsOffered: number;
  preventionNote: string;
  verifiedSource: string;
}

export interface SimulatorChoice {
  id: string;
  label: string;
  actionSummary: string;
  consequence: string;
  safetyScoreChange: number;
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

export interface SimulatorScenario {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  estimatedMinutes: number;
  contentWarning: string;
  disclaimer: string;
  overview: string;
  chapters?: SimulatorChapter[];
  totalChapters?: number;
  reflection?: {
    coreLessons: string[];
    harmfulAttitudesExplained: string[];
    actionableTakeaways: string[];
    helplineRecommendation: string;
  };
}

export interface QuickReportDraft {
  id: string;
  anonymousSessionId: string;
  incidentCategory: string;
  isImmediateDanger: boolean;
  description?: string;
  hasVoiceNote: boolean;
  locationShared: boolean;
  approxCity?: string;
  triageChoice: 'support' | 'complaint_draft' | 'official_portal';
  status: string;
  createdAt: string;
}

