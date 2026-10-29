import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title cannot exceed 200 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters').max(10000, 'Content cannot exceed 10000 characters'),
  category: z.enum([
    'domestic_abuse',
    'harassment',
    'sexual_violence',
    'relationships',
    'discrimination',
    'recovery',
  ]),
  triggerWarning: z.string().max(100).optional().nullable(),
  pseudonym: z.string().max(50).optional().nullable(),
  avatarSeed: z.string().max(30).optional().nullable(),
  confirmPiiWarning: z.boolean().optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(2, 'Comment must be at least 2 characters').max(2000, 'Comment cannot exceed 2000 characters'),
  pseudonym: z.string().max(50).optional().nullable(),
  userId: z.string().optional().nullable(),
});

export const quickReportSchema = z.object({
  incidentCategory: z.string().min(2).max(100),
  isImmediateDanger: z.boolean().default(false),
  description: z.string().max(5000).optional().nullable(),
  hasVoiceNote: z.boolean().default(false),
  locationShared: z.boolean().default(false),
  approxCity: z.string().max(100).optional().nullable(),
  triageChoice: z.enum(['support', 'complaint_draft', 'official_portal']).default('support'),
  anonymousSessionId: z.string().max(100).optional().nullable(),
});

export const contentReportSchema = z.object({
  targetType: z.enum(['post', 'comment']),
  targetId: z.string().min(1),
  reason: z.enum(['harassment', 'doxxing', 'hate_speech', 'spam', 'misinformation', 'other']),
  details: z.string().max(1000).optional().nullable(),
  reporterPseudonym: z.string().max(50).optional().nullable(),
});

