import { Router, Request, Response } from 'express';
import { OllamaService } from '../services/ollamaService';

const router = Router();

// GET /api/ai/status - Health check for local Ollama instance
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const health = await OllamaService.checkHealth();
    res.json({ success: true, status: health });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/ai/chat - Talk to Saathi AI
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], language = 'en' } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: { message: 'Message content is required.' } });
    }

    const aiResult = await OllamaService.chat(message.trim(), history, language);

    res.json({
      success: true,
      data: aiResult,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/ai/draft-complaint - Complaint Drafting Assistant
router.post('/draft-complaint', async (req: Request, res: Response) => {
  try {
    const {
      incidentType,
      targetAuthority = 'police',
      incidentDateRange,
      locationOrWorkplace,
      narrative,
      evidenceList = [],
      reliefSought,
      pseudonymOrName,
    } = req.body;

    if (!incidentType || !narrative) {
      return res.status(400).json({
        success: false,
        error: { message: 'Incident type and narrative description are required.' },
      });
    }

    const result = await OllamaService.draftComplaint({
      incidentType,
      targetAuthority,
      incidentDateRange,
      locationOrWorkplace,
      narrative,
      evidenceList,
      reliefSought,
      pseudonymOrName,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

export default router;

