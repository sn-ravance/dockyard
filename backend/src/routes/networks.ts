import { Router } from 'express';
import { z } from 'zod';
import * as networkService from '../services/network.service.js';

const router = Router();

// List all networks
router.get('/', async (_req, res, next) => {
  try {
    const networks = await networkService.listNetworks();
    res.json(networks);
  } catch (err) {
    next(err);
  }
});

// Get network details
router.get('/:id', async (req, res, next) => {
  try {
    const network = await networkService.getNetwork(req.params.id);
    res.json(network);
  } catch (err) {
    next(err);
  }
});

// Create network
const createSchema = z.object({
  name: z.string().min(1),
  driver: z.string().optional(),
  internal: z.boolean().optional(),
  attachable: z.boolean().optional(),
  labels: z.record(z.string()).optional(),
  subnet: z.string().optional(),
  gateway: z.string().optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const options = createSchema.parse(req.body);
    const network = await networkService.createNetwork(options.name, options);
    res.status(201).json(network);
  } catch (err) {
    next(err);
  }
});

// Remove network
router.delete('/:id', async (req, res, next) => {
  try {
    await networkService.removeNetwork(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Connect container to network
const connectSchema = z.object({
  containerId: z.string().min(1),
});

router.post('/:id/connect', async (req, res, next) => {
  try {
    const { containerId } = connectSchema.parse(req.body);
    await networkService.connectContainer(req.params.id, containerId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Disconnect container from network
const disconnectSchema = z.object({
  containerId: z.string().min(1),
  force: z.boolean().optional().default(false),
});

router.post('/:id/disconnect', async (req, res, next) => {
  try {
    const { containerId, force } = disconnectSchema.parse(req.body);
    await networkService.disconnectContainer(req.params.id, containerId, force);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Prune unused networks
router.post('/prune', async (_req, res, next) => {
  try {
    const result = await networkService.pruneNetworks();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
