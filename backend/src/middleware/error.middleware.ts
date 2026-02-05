import type { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Handle Docker-specific errors
  if (err.message?.includes('No such container')) {
    res.status(404).json({ error: 'Container not found', code: 'CONTAINER_NOT_FOUND' });
    return;
  }

  if (err.message?.includes('No such image')) {
    res.status(404).json({ error: 'Image not found', code: 'IMAGE_NOT_FOUND' });
    return;
  }

  if (err.message?.includes('No such volume')) {
    res.status(404).json({ error: 'Volume not found', code: 'VOLUME_NOT_FOUND' });
    return;
  }

  if (err.message?.includes('No such network')) {
    res.status(404).json({ error: 'Network not found', code: 'NETWORK_NOT_FOUND' });
    return;
  }

  if (err.message?.includes('is already in use')) {
    res.status(409).json({ error: message, code: 'RESOURCE_IN_USE' });
    return;
  }

  if (err.message?.includes('container is not running')) {
    res.status(400).json({ error: 'Container is not running', code: 'CONTAINER_NOT_RUNNING' });
    return;
  }

  if (err.message?.includes('container is already')) {
    res.status(400).json({ error: message, code: 'INVALID_STATE' });
    return;
  }

  res.status(statusCode).json({
    error: message,
    code: err.code || 'INTERNAL_ERROR',
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Not found', code: 'NOT_FOUND' });
}
