import { Post, Comment, SafetyResource, Ngo, MemorialStory, SimulatorScenario, QuickReportDraft } from '../types';

const API_BASE = '/api';

export const api = {
  // Posts & HerSpace
  async getPosts(params?: { category?: string; sort?: string; search?: string; page?: number; userId?: string }): Promise<{ data: Post[]; pagination: any }> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.userId) query.set('userId', params.userId);

    const res = await fetch(`${API_BASE}/posts?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load community feed');
    return res.json();
  },

  async createPost(payload: {
    title: string;
    content: string;
    category: string;
    triggerWarning?: string;
    pseudonym?: string;
    avatarSeed?: string;
    confirmPiiWarning?: boolean;
  }): Promise<{ success: boolean; data?: Post; warning?: any }> {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok && res.status !== 422) {
      throw new Error(data.error?.message || 'Failed to create post');
    }
    return data;
  },

  async toggleReaction(postId: string, type: string, userId?: string, pseudonym?: string) {
    const res = await fetch(`${API_BASE}/posts/${postId}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, userId, pseudonym }),
    });
    return res.json();
  },

  async toggleBookmark(postId: string, userId?: string, pseudonym?: string) {
    const res = await fetch(`${API_BASE}/posts/${postId}/bookmark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, pseudonym }),
    });
    return res.json();
  },

  // Comments
  async getComments(postId: string): Promise<Comment[]> {
    const res = await fetch(`${API_BASE}/posts/${postId}/comments`);
    const data = await res.json();
    return data.data || [];
  },

  async addComment(postId: string, content: string, pseudonym?: string, userId?: string) {
    const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, pseudonym, userId }),
    });
    return res.json();
  },

  // Quick Report
  async submitQuickReport(payload: {
    incidentCategory: string;
    isImmediateDanger: boolean;
    description?: string;
    hasVoiceNote?: boolean;
    locationShared?: boolean;
    approxCity?: string;
    triageChoice: string;
    anonymousSessionId: string;
  }): Promise<{ success: boolean; data: QuickReportDraft; disclaimer: any }> {
    const res = await fetch(`${API_BASE}/quick-reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Content Reports
  async reportContent(payload: {
    targetType: 'post' | 'comment';
    targetId: string;
    reason: string;
    details?: string;
    reporterPseudonym?: string;
  }) {
    const res = await fetch(`${API_BASE}/content-reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Safety Resources
  async getResources(params?: { category?: string; search?: string; city?: string }): Promise<SafetyResource[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.city) query.set('city', params.city);

    const res = await fetch(`${API_BASE}/resources?${query.toString()}`);
    const data = await res.json();
    return data.data || [];
  },

  // NGOs
  async getNgos(params?: { service?: string; city?: string; search?: string }): Promise<Ngo[]> {
    const query = new URLSearchParams();
    if (params?.service && params.service !== 'all') query.set('service', params.service);
    if (params?.city && params.city !== 'all') query.set('city', params.city);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`${API_BASE}/ngos?${query.toString()}`);
    const data = await res.json();
    return data.data || [];
  },

  async getNgoById(id: string): Promise<Ngo> {
    const res = await fetch(`${API_BASE}/ngos/${id}`);
    const data = await res.json();
    return data.data;
  },

  // Memorial
  async getMemorialStories(): Promise<MemorialStory[]> {
    const res = await fetch(`${API_BASE}/memorial`);
    const data = await res.json();
    return data.data || [];
  },

  async offerMemorialTribute(id: string, payload: { tributeType: 'candle' | 'marigold'; pseudonym?: string; message?: string }) {
    const res = await fetch(`${API_BASE}/memorial/${id}/tribute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Saathi AI
  async chatWithSaathi(message: string, history: Array<{ role: 'user' | 'assistant'; content: string }>, language: 'en' | 'hi' = 'en') {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, language }),
    });
    const data = await res.json();
    return data.data;
  },

  async checkAiStatus() {
    const res = await fetch(`${API_BASE}/ai/status`);
    const data = await res.json();
    return data.status;
  },

  async draftComplaint(payload: any) {
    const res = await fetch(`${API_BASE}/ai/draft-complaint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data.data;
  },

  // Reality Simulator
  async getScenarios(): Promise<SimulatorScenario[]> {
    const res = await fetch(`${API_BASE}/simulator/scenarios`);
    const data = await res.json();
    return data.data || [];
  },

  async getScenarioBySlug(slug: string): Promise<SimulatorScenario> {
    const res = await fetch(`${API_BASE}/simulator/scenarios/${slug}`);
    const data = await res.json();
    return data.data;
  },

  // Moderation
  async getModerationQueue() {
    const res = await fetch(`${API_BASE}/moderation/queue`);
    const data = await res.json();
    return data.data;
  },

  async applyModerationAction(payload: { reportId?: string; targetId?: string; action: string; notes?: string }) {
    const res = await fetch(`${API_BASE}/moderation/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};

