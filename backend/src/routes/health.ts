import { Router } from 'express';
import { testConnection } from '../services/docker.service.js';

const router = Router();

router.get('/', async (_req, res) => {
  const dockerConnected = await testConnection();

  res.json({
    status: dockerConnected ? 'healthy' : 'degraded',
    docker: dockerConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

export default router;
