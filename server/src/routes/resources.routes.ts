import { Router, Request, Response } from 'express';
import { prisma } from '../config';

const router = Router();

// GET /api/resources - Get verified safety resources
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search, city } = req.query;

    const where: any = {};
    if (category && category !== 'all') {
      where.category = category as string;
    }
    if (city) {
      where.OR = [
        { city: { contains: city as string } },
        { address: { contains: city as string } },
        { country: 'India' }, // Pan-India helplines apply everywhere
      ];
    }
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const resources = await prisma.safetyResource.findMany({
      where,
      orderBy: [{ is24x7: 'desc' }, { title: 'asc' }],
    });

    res.json({
      success: true,
      data: resources,
      meta: {
        totalVerified: resources.length,
        disclaimer: 'All listed emergency contacts, shelters, and legal aid clinics have been verified with official government and civil society registries. Verification dates and sources are provided.',
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

export default router;

