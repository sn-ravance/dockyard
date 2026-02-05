import Docker from 'dockerode';
import { config } from '../config.js';

let dockerInstance: Docker | null = null;

export function getDocker(): Docker {
  if (!dockerInstance) {
    dockerInstance = new Docker({ socketPath: config.dockerSocket });
  }
  return dockerInstance;
}

export async function testConnection(): Promise<boolean> {
  try {
    const docker = getDocker();
    await docker.ping();
    return true;
  } catch (error) {
    console.error('Docker connection failed:', error);
    return false;
  }
}
