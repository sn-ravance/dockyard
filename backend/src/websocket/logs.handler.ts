import type { WebSocket } from 'ws';
import { streamContainerLogs } from '../services/container.service.js';

export function handleLogsConnection(ws: WebSocket, containerId: string): void {
  let cleanup: (() => void) | null = null;

  const startStreaming = () => {
    cleanup = streamContainerLogs(
      containerId,
      (data) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ type: 'log', data }));
        }
      },
      (error) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ type: 'error', message: error.message }));
        }
      }
    );
  };

  // Start streaming immediately
  startStreaming();

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.action === 'restart') {
        if (cleanup) {
          cleanup();
        }
        startStreaming();
      }
    } catch {
      // Ignore invalid messages
    }
  });

  ws.on('close', () => {
    if (cleanup) {
      cleanup();
    }
  });

  ws.on('error', () => {
    if (cleanup) {
      cleanup();
    }
  });
}
