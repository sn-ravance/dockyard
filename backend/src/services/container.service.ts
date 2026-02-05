import { getDocker } from './docker.service.js';
import type { ContainerInfo, ContainerDetails, ContainerStats } from '../types/docker.types.js';

export async function listContainers(all = true): Promise<ContainerInfo[]> {
  const docker = getDocker();
  const containers = await docker.listContainers({ all });

  if (!containers || !Array.isArray(containers)) {
    return [];
  }

  return containers.map((c) => ({
    id: c.Id,
    names: (c.Names || []).map((n) => n.replace(/^\//, '')),
    image: c.Image,
    imageId: c.ImageID,
    command: c.Command,
    created: c.Created,
    state: c.State,
    status: c.Status,
    ports: (c.Ports || []).map((p) => ({
      ip: p.IP,
      privatePort: p.PrivatePort,
      publicPort: p.PublicPort,
      type: p.Type,
    })),
    labels: c.Labels || {},
    networkMode: c.HostConfig?.NetworkMode || 'default',
    mounts: (c.Mounts || []).map((m) => ({
      type: m.Type,
      name: m.Name,
      source: m.Source,
      destination: m.Destination,
      mode: m.Mode,
      rw: m.RW,
    })),
  }));
}

export async function getContainer(id: string): Promise<ContainerDetails> {
  const docker = getDocker();
  const container = docker.getContainer(id);
  const info = await container.inspect();

  return {
    id: info.Id,
    names: [info.Name.replace(/^\//, '')],
    image: info.Config.Image,
    imageId: info.Image,
    command: info.Config.Cmd?.join(' ') || '',
    created: new Date(info.Created).getTime() / 1000,
    state: info.State.Status,
    status: info.State.Status,
    ports: Object.entries(info.NetworkSettings.Ports || {}).flatMap(([port, bindings]) => {
      const [privatePort, type] = port.split('/');
      if (!bindings) {
        return [{ privatePort: parseInt(privatePort), type }];
      }
      return bindings.map((b) => ({
        ip: b.HostIp,
        privatePort: parseInt(privatePort),
        publicPort: parseInt(b.HostPort),
        type,
      }));
    }),
    labels: info.Config.Labels || {},
    networkMode: info.HostConfig.NetworkMode || 'default',
    mounts: info.Mounts.map((m) => ({
      type: m.Type,
      name: m.Name,
      source: m.Source,
      destination: m.Destination,
      mode: m.Mode,
      rw: m.RW,
    })),
    config: {
      env: info.Config.Env || [],
      cmd: info.Config.Cmd || [],
      workingDir: info.Config.WorkingDir,
      entrypoint: Array.isArray(info.Config.Entrypoint) ? info.Config.Entrypoint : [],
    },
    networkSettings: {
      networks: Object.fromEntries(
        Object.entries(info.NetworkSettings.Networks || {}).map(([name, net]) => [
          name,
          {
            networkId: net.NetworkID,
            ipAddress: net.IPAddress,
            gateway: net.Gateway,
            macAddress: net.MacAddress,
          },
        ])
      ),
    },
    hostConfig: {
      memory: info.HostConfig.Memory || 0,
      cpuShares: info.HostConfig.CpuShares || 0,
      restartPolicy: {
        name: info.HostConfig.RestartPolicy?.Name || 'no',
        maximumRetryCount: info.HostConfig.RestartPolicy?.MaximumRetryCount || 0,
      },
    },
  };
}

export async function startContainer(id: string): Promise<void> {
  const docker = getDocker();
  const container = docker.getContainer(id);
  await container.start();
}

export async function stopContainer(id: string): Promise<void> {
  const docker = getDocker();
  const container = docker.getContainer(id);
  await container.stop();
}

export async function restartContainer(id: string): Promise<void> {
  const docker = getDocker();
  const container = docker.getContainer(id);
  await container.restart();
}

export async function killContainer(id: string): Promise<void> {
  const docker = getDocker();
  const container = docker.getContainer(id);
  await container.kill();
}

export async function removeContainer(id: string, force = false): Promise<void> {
  const docker = getDocker();
  const container = docker.getContainer(id);
  await container.remove({ force });
}

export async function getContainerLogs(
  id: string,
  options: { tail?: number; since?: number; timestamps?: boolean } = {}
): Promise<string> {
  const docker = getDocker();
  const container = docker.getContainer(id);

  const logs = await container.logs({
    stdout: true,
    stderr: true,
    tail: options.tail || 100,
    since: options.since || 0,
    timestamps: options.timestamps ?? true,
  });

  return logs.toString('utf-8');
}

export function streamContainerLogs(
  id: string,
  onData: (data: string) => void,
  onError: (error: Error) => void
): () => void {
  const docker = getDocker();
  const container = docker.getContainer(id);

  let stream: NodeJS.ReadableStream | null = null;
  let aborted = false;

  container
    .logs({
      stdout: true,
      stderr: true,
      follow: true,
      tail: 100,
      timestamps: true,
    })
    .then((logStream) => {
      if (aborted) return;
      stream = logStream;

      logStream.on('data', (chunk: Buffer) => {
        // Docker stream has 8-byte header for each frame
        // We need to strip it for multiplexed streams
        const data = chunk.toString('utf-8');
        onData(data);
      });

      logStream.on('error', onError);
    })
    .catch(onError);

  return () => {
    aborted = true;
    if (stream && 'destroy' in stream) {
      (stream as NodeJS.ReadableStream & { destroy: () => void }).destroy();
    }
  };
}

export function streamContainerStats(
  id: string,
  onData: (stats: ContainerStats) => void,
  onError: (error: Error) => void
): () => void {
  const docker = getDocker();
  const container = docker.getContainer(id);

  let stream: NodeJS.ReadableStream | null = null;
  let aborted = false;

  container.stats({ stream: true }).then((statsStream) => {
    if (aborted) return;
    stream = statsStream;

    let buffer = '';

    statsStream.on('data', (chunk: Buffer) => {
      buffer += chunk.toString('utf-8');
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const raw = JSON.parse(line);
          const stats = parseStats(raw);
          onData(stats);
        } catch {
          // Ignore parse errors
        }
      }
    });

    statsStream.on('error', onError);
  }).catch(onError);

  return () => {
    aborted = true;
    if (stream && 'destroy' in stream) {
      (stream as NodeJS.ReadableStream & { destroy: () => void }).destroy();
    }
  };
}

function parseStats(raw: Record<string, unknown>): ContainerStats {
  const cpuDelta =
    ((raw.cpu_stats as Record<string, unknown>)?.cpu_usage as Record<string, number>)?.total_usage -
    ((raw.precpu_stats as Record<string, unknown>)?.cpu_usage as Record<string, number>)?.total_usage;
  const systemDelta =
    (raw.cpu_stats as Record<string, number>)?.system_cpu_usage -
    (raw.precpu_stats as Record<string, number>)?.system_cpu_usage;
  const cpuCount = ((raw.cpu_stats as Record<string, unknown>)?.cpu_usage as Record<string, number[]>)?.percpu_usage?.length || 1;
  const cpuPercent = systemDelta > 0 ? (cpuDelta / systemDelta) * cpuCount * 100 : 0;

  const memoryUsage = (raw.memory_stats as Record<string, number>)?.usage || 0;
  const memoryLimit = (raw.memory_stats as Record<string, number>)?.limit || 1;
  const memoryPercent = (memoryUsage / memoryLimit) * 100;

  const networks = raw.networks as Record<string, { rx_bytes: number; tx_bytes: number }> | undefined;
  let rxBytes = 0;
  let txBytes = 0;
  if (networks) {
    for (const net of Object.values(networks)) {
      rxBytes += net.rx_bytes || 0;
      txBytes += net.tx_bytes || 0;
    }
  }

  const blkioStats = raw.blkio_stats as Record<string, Array<{ op: string; value: number }>> | undefined;
  let blkRead = 0;
  let blkWrite = 0;
  if (blkioStats?.io_service_bytes_recursive) {
    for (const entry of blkioStats.io_service_bytes_recursive) {
      if (entry.op === 'Read') blkRead += entry.value;
      if (entry.op === 'Write') blkWrite += entry.value;
    }
  }

  return {
    read: raw.read as string,
    cpu: {
      usage: cpuDelta,
      systemUsage: systemDelta,
      percent: cpuPercent,
    },
    memory: {
      usage: memoryUsage,
      limit: memoryLimit,
      percent: memoryPercent,
    },
    network: {
      rx_bytes: rxBytes,
      tx_bytes: txBytes,
    },
    blockIO: {
      read: blkRead,
      write: blkWrite,
    },
  };
}
