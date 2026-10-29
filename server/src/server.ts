import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config, prisma } from './config';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import postsRouter from './routes/posts.routes';
import commentsRouter from './routes/comments.routes';
import reportsRouter from './routes/reports.routes';
import resourcesRouter from './routes/resources.routes';
import ngosRouter from './routes/ngos.routes';
import memorialRouter from './routes/memorial.routes';
import aiRouter from './routes/ai.routes';
import simulatorRouter from './routes/simulator.routes';
import moderationRouter from './routes/moderation.routes';

const app = express();

// Security Headers via Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  config.clientUrl,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (like curl, test suites) or allowed origins
    if (!origin || allowedOrigins.includes(origin) || config.nodeEnv === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Origin blocked by CORS policy'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// General API rate limiter (150 requests per 15 mins)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
  },
});

// Stricter rate limiter for AI generation (30 requests per 15 mins)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'AI query limit reached. Please wait a few moments before trying again.' }
  },
});

app.use('/api', apiLimiter);
app.use('/api/ai', aiLimiter);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    appName: 'Her Voice Backend API',
    tagline: 'Your story matters. Your identity is yours to protect.',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/posts', postsRouter);
app.use('/api/posts', commentsRouter);
app.use('/api', reportsRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/ngos', ngosRouter);
app.use('/api/memorial', memorialRouter);
app.use('/api/ai', aiRouter);
app.use('/api/simulator', simulatorRouter);
app.use('/api/moderation', moderationRouter);

// Global Error Handler
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`\n======================================================`);
    console.log(`💜 Her Voice Server is running on port ${config.port}`);
    console.log(`📡 Health Check: http://localhost:${config.port}/api/health`);
    console.log(`🤖 Ollama target: ${config.ollamaBaseUrl} (Model: ${config.ollamaModel})`);
    console.log(`======================================================\n`);
  });
}

export default app;

