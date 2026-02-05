import type { WebSocket } from 'ws';
import { streamContainerStats } from '../services/container.service.js';

export function handleStatsConnection(ws: WebSocket, containerId: string): void {
  const cleanup = streamContainerStats(
    containerId,
    (stats) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: 'stats', data: stats }));
      }
    },
    (error) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: 'error', message: error.message }));
      }
    }
  );

  ws.on('close', () => {
    cleanup();
  });

  ws.on('error', () => {
    cleanup();
  });
}
