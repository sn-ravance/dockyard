import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';

import { config } from './config.js';
import { corsMiddleware } from './middleware/cors.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { testConnection } from './services/docker.service.js';
import { setupWebSocket } from './websocket/index.js';

import healthRoutes from './routes/health.js';
import systemRoutes from './routes/system.js';
import containerRoutes from './routes/containers.js';
import imageRoutes from './routes/images.js';
import volumeRoutes from './routes/volumes.js';
import networkRoutes from './routes/networks.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(corsMiddleware);

// Rate limiting for resource-intensive operations
const pullLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 pulls per minute
  message: { error: 'Too many pull requests, please try again later' },
});

const pruneLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 prune operations per minute
  message: { error: 'Too many prune requests, please try again later' },
});

// Body parsing
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/containers', containerRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/volumes', volumeRoutes);
app.use('/api/networks', networkRoutes);

// Apply rate limiters to specific routes
app.use('/api/images/pull', pullLimiter);
app.use('/api/images/prune', pruneLimiter);
app.use('/api/volumes/prune', pruneLimiter);
app.use('/api/networks/prune', pruneLimiter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Create HTTP server and setup WebSocket
const server = createServer(app);
setupWebSocket(server);

// Start server
async function start() {
  // Test Docker connection
  const connected = await testConnection();
  if (!connected) {
    console.warn('Warning: Could not connect to Docker. Some features may not work.');
    console.warn(`Docker socket path: ${config.dockerSocket}`);
  } else {
    console.log('Docker connection established');
  }

  server.listen(config.port, () => {
    console.log(`Dockyard API server running on port ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`CORS origins: ${config.corsOrigins.join(', ')}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
