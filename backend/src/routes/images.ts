import { Router } from 'express';
import { z } from 'zod';
import * as imageService from '../services/image.service.js';

const router = Router();

// List all images
router.get('/', async (_req, res, next) => {
  try {
    const images = await imageService.listImages();
    res.json(images);
  } catch (err) {
    next(err);
  }
});

// Get image details
router.get('/:id', async (req, res, next) => {
  try {
    const image = await imageService.getImage(req.params.id);
    res.json(image);
  } catch (err) {
    next(err);
  }
});

// Pull image with SSE progress
const pullSchema = z.object({
  image: z.string().min(1),
});

router.post('/pull', async (req, res, next) => {
  try {
    const { image } = pullSchema.parse(req.body);

    // Set up SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await imageService.pullImage(image, (progress) => {
      res.write(`data: ${JSON.stringify(progress)}\n\n`);
    });

    res.write(`data: ${JSON.stringify({ status: 'complete' })}\n\n`);
    res.end();
  } catch (err) {
    // If headers already sent, send error as SSE event
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: (err as Error).message })}\n\n`);
      res.end();
    } else {
      next(err);
    }
  }
});

// Remove image
const removeSchema = z.object({
  force: z.boolean().optional().default(false),
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { force } = removeSchema.parse(req.body);
    await imageService.removeImage(req.params.id, force);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Prune unused images
router.post('/prune', async (_req, res, next) => {
  try {
    const result = await imageService.pruneImages();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Tag image
const tagSchema = z.object({
  repo: z.string().min(1),
  tag: z.string().optional().default('latest'),
});

router.post('/:id/tag', async (req, res, next) => {
  try {
    const { repo, tag } = tagSchema.parse(req.body);
    await imageService.tagImage(req.params.id, repo, tag);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
