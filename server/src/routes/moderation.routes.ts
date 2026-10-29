import { Router, Request, Response } from 'express';
import { prisma } from '../config';
import { requireModerator } from '../middleware/auth';

const router = Router();

// Protect all moderation actions with server-side authentication
router.use(requireModerator);

// GET /api/moderation/queue - Get pending reports and flagged content
router.get('/queue', async (_req: Request, res: Response) => {
  try {
    const reports = await prisma.contentReport.findMany({
      where: { status: 'pending' },
      include: {
        post: true,
        reporter: {
          select: { pseudonym: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const flaggedPosts = await prisma.post.findMany({
      where: {
        OR: [
          { isFlagged: true },
          { moderationStatus: 'pending' },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: {
        pendingReports: reports,
        flaggedPosts,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/moderation/action - Apply moderation action
router.post('/action', async (req: Request, res: Response) => {
  try {
    const { reportId, targetId, action, notes } = req.body;
    // action: "approve" | "hide" | "dismiss_report" | "remove_content"

    if (!action) {
      return res.status(400).json({ success: false, error: { message: 'Action is required.' } });
    }

    if (reportId) {
      await prisma.contentReport.update({
        where: { id: reportId },
        data: {
          status: action === 'dismiss_report' ? 'dismissed' : 'action_taken',
          details: notes ? `Notes: ${notes}` : undefined,
        },
      });
    }

    if (targetId) {
      if (action === 'hide' || action === 'remove_content') {
        await prisma.post.update({
          where: { id: targetId },
          data: { moderationStatus: 'hidden', isFlagged: true },
        });
      } else if (action === 'approve') {
        await prisma.post.update({
          where: { id: targetId },
          data: { moderationStatus: 'approved', isFlagged: false },
        });
      }
    }

    res.json({
      success: true,
      message: `Moderation action "${action}" successfully executed.`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

export default router;

