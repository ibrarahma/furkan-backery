import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRouter } from './server/routes';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Parse JSON and URL-encoded request bodies
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API router mounted first before Vite middlewares
  app.use('/api', apiRouter);

  if (!isProd) {
    // Development mode: Vite middleware
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: PORT,
        host: '0.0.0.0'
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n==================================================`);
    console.log(`🎂 Sweet Crumbs Bakery Server running on port ${PORT}`);
    console.log(`   Mode: ${isProd ? 'Production' : 'Development'}`);
    console.log(`   Admin Auth status: Check GET /api/admin/status`);
    console.log(`==================================================\n`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting bakery server:', err);
  process.exit(1);
});
