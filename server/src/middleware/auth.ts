import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export interface AuthenticatedRequest extends Request {
  isModerator?: boolean;
}

/**
 * Server-side guard to protect administrative / moderation actions.
 * Enforces a shared MODERATOR_SECRET header or token.
 */
export const requireModerator = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const modHeader = req.headers['x-moderator-key'] || req.headers['authorization'];
  const expectedSecret = process.env.MODERATOR_SECRET;

  // In test or local dev without a secret set, provide a fallback warning token
  const validSecret = expectedSecret || 'dev_secret_mod_token_2026';

  if (!modHeader) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Moderator authentication required to access this endpoint.',
      },
    });
  }

  const token = Array.isArray(modHeader) ? modHeader[0] : modHeader;
  const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

  if (cleanToken !== validSecret) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Invalid moderator credentials provided.',
      },
    });
  }

  req.isModerator = true;
  next();
};

