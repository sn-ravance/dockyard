import { getDocker } from './docker.service.js';
import type { VolumeInfo } from '../types/docker.types.js';

export async function listVolumes(): Promise<VolumeInfo[]> {
  const docker = getDocker();
  const result = await docker.listVolumes();

  return (result.Volumes || []).map((vol) => ({
    name: vol.Name,
    driver: vol.Driver,
    mountpoint: vol.Mountpoint,
    createdAt: (vol as unknown as { CreatedAt?: string }).CreatedAt || '',
    labels: vol.Labels || {},
    scope: vol.Scope,
    options: vol.Options || {},
  }));
}

export async function getVolume(name: string): Promise<VolumeInfo> {
  const docker = getDocker();
  const volume = docker.getVolume(name);
  const info = await volume.inspect();

  return {
    name: info.Name,
    driver: info.Driver,
    mountpoint: info.Mountpoint,
    createdAt: (info as unknown as { CreatedAt?: string }).CreatedAt || '',
    labels: info.Labels || {},
    scope: info.Scope,
    options: info.Options || {},
  };
}

export async function createVolume(
  name: string,
  options?: { driver?: string; labels?: Record<string, string> }
): Promise<VolumeInfo> {
  const docker = getDocker();
  await docker.createVolume({
    Name: name,
    Driver: options?.driver || 'local',
    Labels: options?.labels || {},
  });

  // Fetch the created volume to get full details
  return getVolume(name);
}

export async function removeVolume(name: string, force = false): Promise<void> {
  const docker = getDocker();
  const volume = docker.getVolume(name);
  await volume.remove({ force });
}

export async function pruneVolumes(): Promise<{ deleted: string[]; spaceReclaimed: number }> {
  const docker = getDocker();
  const result = await docker.pruneVolumes();

  return {
    deleted: result.VolumesDeleted || [],
    spaceReclaimed: result.SpaceReclaimed || 0,
  };
}
