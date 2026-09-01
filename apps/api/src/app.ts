import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';
import { errorHandler } from './middlewares/errorHandler';

import authRoutes from './routes/auth.routes';
import contentRoutes from './routes/content.routes';
import viewRoutes from './routes/view.routes';
import creatorRoutes from './routes/creator.routes';
import adminRoutes from './routes/admin.routes';

export const createApp = (): Express => {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: '*', credentials: true }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Basic rate limiter
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use(limiter);

  // Serve local uploads folder if fallback mock is active
  const uploadDir = path.join(__dirname, '../public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadDir));

  // Local R2 mock upload endpoint for offline dev fallback
  app.put('/api/v1/uploads/mock-r2-upload', (req: Request, res: Response) => {
    return res.status(200).json({ success: true, message: 'Mock R2 upload completed.' });
  });

  // ==========================================================
  // SWAGGER & OPENAPI DOCUMENTATION UI (FOR FLUTTER DEVELOPERS)
  // ==========================================================
  const swaggerOptions = {
    customCss: `
      .swagger-ui .topbar { background-color: #0f172a; padding: 12px 0; }
      .swagger-ui .topbar .topbar-wrapper img { content: url('https://pub-r2.naagrik.news/media/branding/logo.png'); height: 32px; }
      .swagger-ui .info { margin: 24px 0; }
      .swagger-ui .info .title { font-family: system-ui, sans-serif; font-weight: 700; color: #0f172a; }
      .swagger-ui .scheme-container { background: #f8fafc; padding: 16px; border-radius: 8px; }
    `,
    customSiteTitle: 'Naagrik API Documentation (OpenAPI 3.0)'
  };

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

  // Raw OpenAPI 3.0 JSON Specification endpoint for client code generation (Flutter/openapi-generator)
  app.get('/docs/json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // API Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/content', contentRoutes);
  app.use('/api/v1/views', viewRoutes);
  app.use('/api/v1/creator', creatorRoutes);
  app.use('/api/v1/admin', adminRoutes);

  // Health check & Documentation Index
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Naagrik Backend API',
      database: 'Supabase PostgreSQL',
      docsUrl: 'http://localhost:5000/docs',
      timestamp: new Date()
    });
  });

  app.get('/', (req: Request, res: Response) => {
    res.redirect('/docs');
  });

  app.use(errorHandler);

  return app;
};
