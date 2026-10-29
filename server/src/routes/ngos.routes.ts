import { Router, Request, Response } from 'express';
import { prisma } from '../config';

const router = Router();

// GET /api/ngos - Search and filter verified NGOs
router.get('/', async (req: Request, res: Response) => {
  try {
    const { service, city, search } = req.query;

    const where: any = {};

    if (service && service !== 'all') {
      where.services = { contains: service as string };
    }

    if (city && city !== 'all') {
      where.city = { contains: city as string };
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { mission: { contains: search as string } },
        { description: { contains: search as string } },
        { services: { contains: search as string } },
      ];
    }

    const ngos = await prisma.ngo.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: ngos,
      disclaimer: 'Her Voice links directly to verified official NGO donation portals. We never process or collect funds on behalf of third-party organizations.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/ngos/:id - Get NGO details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const ngo = await prisma.ngo.findUnique({ where: { id } });

    if (!ngo) {
      return res.status(404).json({ success: false, error: { message: 'NGO not found.' } });
    }

    res.json({ success: true, data: ngo });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

export default router;
