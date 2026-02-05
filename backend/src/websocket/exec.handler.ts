import type { WebSocket } from 'ws';
import { getDocker } from '../services/docker.service.js';

export function handleExecConnection(ws: WebSocket, containerId: string): void {
  const docker = getDocker();
  const container = docker.getContainer(containerId);

  let execStream: NodeJS.ReadWriteStream | null = null;

  const startExec = async () => {
    try {
      const exec = await container.exec({
        Cmd: ['/bin/sh'],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
      });

      const stream = await exec.start({
        hijack: true,
        stdin: true,
        Tty: true,
      });

      execStream = stream;

      stream.on('data', (chunk: Buffer) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ type: 'output', data: chunk.toString('utf-8') }));
        }
      });

      stream.on('end', () => {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ type: 'exit' }));
        }
      });

      stream.on('error', (error: Error) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ type: 'error', message: error.message }));
        }
      });

      ws.send(JSON.stringify({ type: 'connected' }));
    } catch (error) {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: 'error', message: (error as Error).message }));
      }
    }
  };

  startExec();

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'input' && execStream) {
        execStream.write(data.data);
      } else if (data.type === 'resize' && execStream) {
        // Handle terminal resize if needed
        // Note: This would require additional Docker API calls
      }
    } catch {
      // Ignore invalid messages
    }
  });

  ws.on('close', () => {
    if (execStream) {
      execStream.end();
    }
  });

  ws.on('error', () => {
    if (execStream) {
      execStream.end();
    }
  });
}
