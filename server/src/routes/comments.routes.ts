import { Router, Request, Response } from 'express';
import { prisma } from '../config';
import { ModerationService } from '../services/moderationService';

const router = Router();

// GET /api/posts/:postId/comments
router.get('/:postId/comments', async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId as string;
    const comments = await prisma.comment.findMany({
      where: { postId, moderationStatus: 'approved' },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ success: true, data: comments });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/posts/:postId/comments
router.post('/:postId/comments', async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId as string;
    const { content, pseudonym, userId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: { message: 'Comment content cannot be empty.' } });
    }

    // Inspect comment for PII
    const modResult = ModerationService.inspectText(content);
    const sanitizedContent = modResult.hasPii ? ModerationService.maskSensitiveDetails(content) : content;

    let authorId = userId;
    let authorPseudonym = pseudonym;

    if (!authorId) {
      const user = await prisma.user.create({
        data: {
          pseudonym: pseudonym || `SisterEcho_${Math.floor(1000 + Math.random() * 9000)}`,
        },
      });
      authorId = user.id;
      authorPseudonym = user.pseudonym;
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId,
        pseudonym: authorPseudonym,
        content: sanitizedContent.trim(),
        moderationStatus: 'approved',
      },
    });

    res.status(201).json({
      success: true,
      data: comment,
      piiMasked: modResult.hasPii,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

export default router;
