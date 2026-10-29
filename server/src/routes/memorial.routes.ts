import { Router, Request, Response } from 'express';
import { prisma } from '../config';

const router = Router();

// GET /api/memorial - Get memorial stories
router.get('/', async (_req: Request, res: Response) => {
  try {
    const stories = await prisma.memorialStory.findMany({
      orderBy: { candlesLit: 'desc' },
    });

    res.json({
      success: true,
      data: stories,
      memorialTheme: {
        title: 'Remember Her, Change Tomorrow',
        hackathonNote:
          'Inspired by Día de los Muertos and Halloween: Remembering that real-world violence is more harrowing than fictional horror, and that remembrance must spark education, protection, and collective action.',
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/memorial/:id/tribute - Light a candle or offer a marigold flower
router.post('/:id/tribute', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { tributeType = 'candle', pseudonym, message } = req.body;

    const story = await prisma.memorialStory.findUnique({ where: { id } });
    if (!story) {
      return res.status(404).json({ success: false, error: { message: 'Memorial story not found.' } });
    }

    const isCandle = tributeType === 'candle';

    const updated = await prisma.memorialStory.update({
      where: { id },
      data: isCandle
        ? { candlesLit: { increment: 1 } }
        : { marigoldsOffered: { increment: 1 } },
    });

    const tribute = await prisma.memorialTribute.create({
      data: {
        storyId: id,
        tributeType: isCandle ? 'candle' : 'marigold',
        pseudonym: pseudonym || 'An Empathic Voice',
        message: message?.trim() || null,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        story: updated,
        tribute,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

export default router;
