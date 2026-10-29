import { Router, Request, Response } from 'express';
import { prisma } from '../config';
import { quickReportSchema, contentReportSchema } from '../schemas';
import crypto from 'crypto';

const router = Router();

// POST /api/quick-reports - Save confidential quick report draft
router.post('/quick-reports', async (req: Request, res: Response) => {
  try {
    const parseResult = quickReportSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid request data',
          details: parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
        },
      });
    }

    const {
      incidentCategory,
      isImmediateDanger,
      description,
      hasVoiceNote,
      locationShared,
      approxCity,
      triageChoice,
      anonymousSessionId,
    } = parseResult.data;

    const sessionId = anonymousSessionId || `anon_sess_${crypto.randomUUID()}`;

    const draft = await prisma.quickReportDraft.create({
      data: {
        anonymousSessionId: sessionId,
        incidentCategory,
        isImmediateDanger,
        description: description?.trim() || null,
        hasVoiceNote,
        locationShared,
        approxCity: locationShared ? approxCity : null,
        triageChoice,
        status: 'draft',
      },
    });

    res.status(201).json({
      success: true,
      data: draft,
      disclaimer: {
        nonPoliceDisclaimer:
          'IMPORTANT: Submitting this report does NOT transmit it to the police or emergency services. It is saved confidentially as a local draft for triage and guidance only. Her Voice does NOT dispatch responders. If you are in immediate physical danger, please dial 112 directly.',
        officialHelpline: '112 (All-India Emergency)',
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/quick-reports/:sessionId - Retrieve user's confidential draft by session
router.get('/quick-reports/:sessionId', async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.sessionId as string;
    const drafts = await prisma.quickReportDraft.findMany({
      where: { anonymousSessionId: sessionId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: drafts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/content-reports - Report harmful community post or comment
router.post('/content-reports', async (req: Request, res: Response) => {
  try {
    const parseResult = contentReportSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid request data',
          details: parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
        },
      });
    }

    const { targetType, targetId, reason, details, reporterPseudonym } = parseResult.data;

    // Ensure reporter user exists
    let reporter = await prisma.user.findFirst({
      where: { pseudonym: reporterPseudonym || 'Anonymous_Reporter' },
    });

    if (!reporter) {
      reporter = await prisma.user.create({
        data: { pseudonym: reporterPseudonym || `Reporter_${Math.floor(1000 + Math.random() * 9000)}` },
      });
    }

    const report = await prisma.contentReport.create({
      data: {
        targetType,
        targetId,
        reporterId: reporter.id,
        reason,
        details: details?.trim() || null,
        status: 'pending',
      },
    });

    // If a post receives multiple reports, flag it automatically
    if (targetType === 'post') {
      const reportCount = await prisma.contentReport.count({
        where: { targetId, targetType: 'post' },
      });
      if (reportCount >= 2) {
        await prisma.post.update({
          where: { id: targetId },
          data: { isFlagged: true },
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Report received. Our moderation team will review this content against community guidelines.',
      data: report,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

export default router;
