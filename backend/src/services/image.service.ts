import { getDocker } from './docker.service.js';
import type { ImageInfo, PullProgress } from '../types/docker.types.js';

export async function listImages(): Promise<ImageInfo[]> {
  const docker = getDocker();
  const images = await docker.listImages();

  if (!images || !Array.isArray(images)) {
    return [];
  }

  return images.map((img) => ({
    id: img.Id,
    repoTags: img.RepoTags || [],
    repoDigests: img.RepoDigests || [],
    created: img.Created,
    size: img.Size,
    virtualSize: img.VirtualSize || img.Size,
    labels: img.Labels || {},
  }));
}

export async function getImage(id: string): Promise<ImageInfo> {
  const docker = getDocker();
  const image = docker.getImage(id);
  const info = await image.inspect();

  return {
    id: info.Id,
    repoTags: info.RepoTags || [],
    repoDigests: info.RepoDigests || [],
    created: new Date(info.Created).getTime() / 1000,
    size: info.Size,
    virtualSize: info.VirtualSize || info.Size,
    labels: info.Config?.Labels || {},
  };
}

export async function pullImage(
  imageName: string,
  onProgress: (progress: PullProgress) => void
): Promise<void> {
  const docker = getDocker();

  return new Promise((resolve, reject) => {
    docker.pull(imageName, (err: Error | null, stream: NodeJS.ReadableStream) => {
      if (err) {
        reject(err);
        return;
      }

      docker.modem.followProgress(
        stream,
        (err: Error | null) => {
          if (err) reject(err);
          else resolve();
        },
        (event: PullProgress) => {
          onProgress(event);
        }
      );
    });
  });
}

export async function removeImage(id: string, force = false): Promise<void> {
  const docker = getDocker();
  const image = docker.getImage(id);
  await image.remove({ force });
}

export async function pruneImages(): Promise<{ deleted: string[]; spaceReclaimed: number }> {
  const docker = getDocker();
  const result = await docker.pruneImages({ filters: { dangling: { false: true } } });

  return {
    deleted: result.ImagesDeleted?.map((img) => img.Deleted || img.Untagged || '') || [],
    spaceReclaimed: result.SpaceReclaimed || 0,
  };
}

export async function tagImage(id: string, repo: string, tag: string): Promise<void> {
  const docker = getDocker();
  const image = docker.getImage(id);
  await image.tag({ repo, tag });
}
