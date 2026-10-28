import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  handleStreamRequest,
  handleGenerateRequest,
} from './src/utils/geminiServerLogic';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  // Real-time SSE streaming endpoint
  app.post('/api/doa/stream', async (req, res) => {
    await handleStreamRequest(req, res);
  });

  // Regular single-turn endpoint as fallback
  app.post('/api/doa/generate', async (req, res) => {
    await handleGenerateRequest(req, res);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Do'a & Munajat PRO server running on http://localhost:${PORT}`);
  });
}

startServer();
