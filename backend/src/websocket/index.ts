import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import { handleLogsConnection } from './logs.handler.js';
import { handleStatsConnection } from './stats.handler.js';
import { handleExecConnection } from './exec.handler.js';

export function setupWebSocket(server: Server): WebSocketServer {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket, req) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Parse the path: /ws/containers/:id/logs|stats|exec
    const match = pathname.match(/^\/ws\/containers\/([^/]+)\/(logs|stats|exec)$/);

    if (!match) {
      ws.close(4000, 'Invalid WebSocket path');
      return;
    }

    const containerId = match[1];
    const type = match[2];

    console.log(`WebSocket connection: ${type} for container ${containerId}`);

    switch (type) {
      case 'logs':
        handleLogsConnection(ws, containerId);
        break;
      case 'stats':
        handleStatsConnection(ws, containerId);
        break;
      case 'exec':
        handleExecConnection(ws, containerId);
        break;
    }
  });

  return wss;
}
