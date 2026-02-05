import { Router } from 'express';
import { z } from 'zod';
import * as volumeService from '../services/volume.service.js';

const router = Router();

// List all volumes
router.get('/', async (_req, res, next) => {
  try {
    const volumes = await volumeService.listVolumes();
    res.json(volumes);
  } catch (err) {
    next(err);
  }
});

// Get volume details
router.get('/:name', async (req, res, next) => {
  try {
    const volume = await volumeService.getVolume(req.params.name);
    res.json(volume);
  } catch (err) {
    next(err);
  }
});

// Create volume
const createSchema = z.object({
  name: z.string().min(1),
  driver: z.string().optional(),
  labels: z.record(z.string()).optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const { name, driver, labels } = createSchema.parse(req.body);
    const volume = await volumeService.createVolume(name, { driver, labels });
    res.status(201).json(volume);
  } catch (err) {
    next(err);
  }
});

// Remove volume
const removeSchema = z.object({
  force: z.boolean().optional().default(false),
});

router.delete('/:name', async (req, res, next) => {
  try {
    const { force } = removeSchema.parse(req.body);
    await volumeService.removeVolume(req.params.name, force);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Prune unused volumes
router.post('/prune', async (_req, res, next) => {
  try {
    const result = await volumeService.pruneVolumes();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
