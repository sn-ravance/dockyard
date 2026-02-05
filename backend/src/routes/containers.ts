import { Router } from 'express';
import { z } from 'zod';
import * as containerService from '../services/container.service.js';

const router = Router();

// List all containers
router.get('/', async (req, res, next) => {
  try {
    const all = req.query.all !== 'false';
    const containers = await containerService.listContainers(all);
    res.json(containers);
  } catch (err) {
    next(err);
  }
});

// Get container details
router.get('/:id', async (req, res, next) => {
  try {
    const container = await containerService.getContainer(req.params.id);
    res.json(container);
  } catch (err) {
    next(err);
  }
});

// Start container
router.post('/:id/start', async (req, res, next) => {
  try {
    await containerService.startContainer(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Stop container
router.post('/:id/stop', async (req, res, next) => {
  try {
    await containerService.stopContainer(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Restart container
router.post('/:id/restart', async (req, res, next) => {
  try {
    await containerService.restartContainer(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Kill container
router.post('/:id/kill', async (req, res, next) => {
  try {
    await containerService.killContainer(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Remove container
const removeSchema = z.object({
  force: z.boolean().optional().default(false),
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { force } = removeSchema.parse(req.body);
    await containerService.removeContainer(req.params.id, force);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Get container logs (non-streaming)
const logsQuerySchema = z.object({
  tail: z.coerce.number().optional(),
  since: z.coerce.number().optional(),
  timestamps: z.coerce.boolean().optional(),
});

router.get('/:id/logs', async (req, res, next) => {
  try {
    const options = logsQuerySchema.parse(req.query);
    const logs = await containerService.getContainerLogs(req.params.id, options);
    res.json({ logs });
  } catch (err) {
    next(err);
  }
});

export default router;
