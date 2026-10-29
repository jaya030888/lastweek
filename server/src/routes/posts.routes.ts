import { Router, Request, Response } from 'express';
import { prisma } from '../config';
import { ModerationService } from '../services/moderationService';
import { createPostSchema } from '../schemas';

const router = Router();

// GET /api/posts - Get community feed
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, sort = 'newest', search, page = '1', limit = '10', userId } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * pageSize;

    const where: any = {
      moderationStatus: 'approved',
    };

    if (category && category !== 'all') {
      where.category = category as string;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { content: { contains: search as string } },
      ];
    }

    const orderBy: any = sort === 'popular' ? { upvotes: 'desc' } : { createdAt: 'desc' };

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: {
          reactions: true,
          bookmarks: true,
          _count: {
            select: { comments: true },
          },
        },
      }),
    ]);

    // Format posts with aggregated reaction counts and user's reaction/bookmark state
    const formatted = posts.map(post => {
      const reactionCounts = {
        purple_heart: post.reactions.filter(r => r.type === 'purple_heart').length,
        empathy_hug: post.reactions.filter(r => r.type === 'empathy_hug').length,
        solidarity: post.reactions.filter(r => r.type === 'solidarity').length,
        listening_ear: post.reactions.filter(r => r.type === 'listening_ear').length,
      };

      const userReactions = userId
        ? post.reactions.filter(r => r.userId === (userId as string)).map(r => r.type)
        : [];

      const isBookmarked = userId
        ? post.bookmarks.some(b => b.userId === (userId as string))
        : false;

      return {
        id: post.id,
        authorId: post.authorId,
        pseudonym: post.pseudonym,
        title: post.title,
        content: post.content,
        category: post.category,
        triggerWarning: post.triggerWarning,
        isVerified: post.isVerified,
        createdAt: post.createdAt,
        commentCount: post._count.comments,
        upvotes: post.upvotes,
        reactionCounts,
        userReactions,
        isBookmarked,
      };
    });

    res.json({
      success: true,
      data: formatted,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/posts - Create new post
router.post('/', async (req: Request, res: Response) => {
  try {
    const parseResult = createPostSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid request data',
          details: parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
        },
      });
    }

    const { title, content, category, triggerWarning, pseudonym, avatarSeed = 'lavender', confirmPiiWarning } = parseResult.data;

    // Inspect for PII & sensitive exposure
    const moderationResult = ModerationService.inspectText(content, title);
    if (moderationResult.hasPii && !confirmPiiWarning) {
      return res.status(422).json({
        success: false,
        warning: {
          requiresConfirmation: true,
          message: 'Potential personally identifying details detected in your post.',
          details: moderationResult.warnings,
        },
      });
    }

    const effectivePseudonym = pseudonym?.trim() || `CourageousVoice_${Math.floor(1000 + Math.random() * 9000)}`;

    // Ensure User exists
    let user = await prisma.user.findUnique({
      where: { pseudonym: effectivePseudonym },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          pseudonym: effectivePseudonym,
          avatarSeed: avatarSeed || 'lavender',
        },
      });
    }

    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        pseudonym: user.pseudonym,
        title: title.trim(),
        content: content.trim(),
        category,
        triggerWarning: triggerWarning?.trim() || null,
        moderationStatus: 'approved',
      },
    });

    res.status(201).json({
      success: true,
      data: post,
      user: { id: user.id, pseudonym: user.pseudonym },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/posts/:id/react - Toggle empathetic reaction
router.post('/:id/react', async (req: Request, res: Response) => {
  try {
    const postId = req.params.id as string;
    const { userId, pseudonym, type } = req.body;

    if (!postId || !type) {
      return res.status(400).json({ success: false, error: { message: 'Post ID and reaction type required.' } });
    }

    let effectiveUserId = userId;
    if (!effectiveUserId) {
      const user = await prisma.user.create({
        data: {
          pseudonym: pseudonym || `Supporter_${Math.floor(1000 + Math.random() * 9000)}`,
        },
      });
      effectiveUserId = user.id;
    }

    const existing = await prisma.reaction.findUnique({
      where: {
        postId_userId_type: { postId, userId: effectiveUserId, type },
      },
    });

    if (existing) {
      await prisma.reaction.delete({ where: { id: existing.id } });
      res.json({ success: true, action: 'removed', type, userId: effectiveUserId });
    } else {
      await prisma.reaction.create({
        data: { postId, userId: effectiveUserId, type },
      });
      res.json({ success: true, action: 'added', type, userId: effectiveUserId });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/posts/:id/bookmark - Toggle bookmark
router.post('/:id/bookmark', async (req: Request, res: Response) => {
  try {
    const postId = req.params.id as string;
    const { userId, pseudonym } = req.body;

    let effectiveUserId = userId;
    if (!effectiveUserId) {
      const user = await prisma.user.create({
        data: {
          pseudonym: pseudonym || `Reader_${Math.floor(1000 + Math.random() * 9000)}`,
        },
      });
      effectiveUserId = user.id;
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        postId_userId: { postId, userId: effectiveUserId },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      res.json({ success: true, isBookmarked: false, userId: effectiveUserId });
    } else {
      await prisma.bookmark.create({
        data: { postId, userId: effectiveUserId },
      });
      res.json({ success: true, isBookmarked: true, userId: effectiveUserId });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// DELETE /api/posts/:id - Protected with author verification or moderator token
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const authorId = req.headers['x-author-id'] as string;
    const modHeader = req.headers['x-moderator-key'] || req.headers['authorization'];
    const validModSecret = process.env.MODERATOR_SECRET || 'dev_secret_mod_token_2026';
    const isMod = modHeader && (modHeader === validModSecret || modHeader === `Bearer ${validModSecret}`);

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return res.status(404).json({ success: false, error: { message: 'Post not found.' } });
    }

    // Require either authorId match or moderator token
    if (!isMod && (!authorId || authorId !== existingPost.authorId)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Unauthorized: You can only delete your own posts unless you are a moderator.' },
      });
    }

    await prisma.post.delete({ where: { id } });
    res.json({ success: true, message: 'Post removed successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

export default router;
