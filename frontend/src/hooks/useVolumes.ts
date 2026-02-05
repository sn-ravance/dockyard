import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type { VolumeInfo } from '../types';

export function useVolumes() {
  return useQuery<VolumeInfo[]>({
    queryKey: ['volumes'],
    queryFn: () => api.getVolumes() as Promise<VolumeInfo[]>,
    refetchInterval: 10000,
  });
}

export function useVolume(name: string) {
  return useQuery<VolumeInfo>({
    queryKey: ['volume', name],
    queryFn: () => api.getVolume(name) as Promise<VolumeInfo>,
    enabled: !!name,
  });
}

export function useVolumeActions() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['volumes'] });
  };

  const create = useMutation({
    mutationFn: ({ name, driver, labels }: { name: string; driver?: string; labels?: Record<string, string> }) =>
      api.createVolume(name, { driver, labels }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: ({ name, force = false }: { name: string; force?: boolean }) =>
      api.removeVolume(name, force),
    onSuccess: invalidate,
  });

  const prune = useMutation({
    mutationFn: () => api.pruneVolumes(),
    onSuccess: invalidate,
  });

  return { create, remove, prune };
}
