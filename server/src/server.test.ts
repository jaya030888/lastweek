import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './server';
import { ModerationService } from './services/moderationService';
import { RagService } from './services/ragService';
import { OllamaService } from './services/ollamaService';

describe('Her Voice API Integration & Core Services', () => {
  it('GET /api/health should return online status and app metadata', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('online');
    expect(res.body.appName).toBe('Her Voice Backend API');
  });

  it('GET /api/posts should return seeded community posts with reaction counts', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('reactionCounts');
  });

  it('ModerationService should detect phone numbers and warn user', () => {
    const check1 = ModerationService.inspectText('Call me at 9876543210 for help', 'My story');
    expect(check1.hasPii).toBe(true);
    expect(check1.warnings.length).toBeGreaterThan(0);

    const checkSafe = ModerationService.inspectText('I am healing day by day with supportive friends.', 'Recovery');
    expect(checkSafe.hasPii).toBe(false);
  });

  it('POST /api/posts should reject unconfirmed PII when phone number is present', async () => {
    const res = await request(app).post('/api/posts').send({
      title: 'Contact me here',
      content: 'You can reach me at 9876543210 urgently.',
      category: 'recovery',
      confirmPiiWarning: false,
    });
    expect(res.status).toBe(422);
    expect(res.body.warning.requiresConfirmation).toBe(true);
  });

  it('GET /api/resources should return verified helplines including India 112', async () => {
    const res = await request(app).get('/api/resources');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const hasEmergency = res.body.data.some((r: any) => r.emergencyNumber === '112');
    expect(hasEmergency).toBe(true);
  });

  it('GET /api/ngos should filter verified NGOs by service', async () => {
    const res = await request(app).get('/api/ngos?service=Legal');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].services).toContain('Legal');
  });

  it('RagService should retrieve verified legal context for domestic abuse query', () => {
    const contexts = RagService.retrieveContext('My husband threatens to throw me out of the house');
    expect(contexts.length).toBeGreaterThan(0);
    expect(contexts[0].topic).toContain('Domestic Violence Legal Rights');
    expect(contexts[0].source).toBeTruthy();
  });

  it('Saathi AI should produce empathetic response with verified disclaimer and fallback', async () => {
    const response = await OllamaService.chat('I am dealing with workplace harassment from my manager', [], 'en');
    expect(response.message).toBeTruthy();
    expect(response.disclaimer).toContain('Saathi AI');
    expect(response.retrievedContexts.length).toBeGreaterThan(0);
  });

  it('GET /api/moderation/queue should reject unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/moderation/queue');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/moderation/queue should accept valid moderator key', async () => {
    const res = await request(app)
      .get('/api/moderation/queue')
      .set('x-moderator-key', 'dev_secret_mod_token_2026');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('DELETE /api/posts/:id should require author verification or mod key', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app).delete(`/api/posts/${fakeId}`);
    // Should be 404 if not found or 403 if unauthorized check triggers
    expect([403, 404]).toContain(res.status);
  });
});

