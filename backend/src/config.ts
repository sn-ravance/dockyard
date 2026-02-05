export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  dockerSocket: process.env.DOCKER_SOCKET || '/var/run/docker.sock',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  nodeEnv: process.env.NODE_ENV || 'development',
};
