import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type { ContainerInfo, ContainerDetails } from '../types';

export function useContainers(all = true) {
  return useQuery<ContainerInfo[]>({
    queryKey: ['containers', all],
    queryFn: () => api.getContainers(all) as Promise<ContainerInfo[]>,
    refetchInterval: 5000,
  });
}

export function useContainer(id: string) {
  return useQuery<ContainerDetails>({
    queryKey: ['container', id],
    queryFn: () => api.getContainer(id) as Promise<ContainerDetails>,
    enabled: !!id,
  });
}

export function useContainerActions() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['containers'] });
  };

  const start = useMutation({
    mutationFn: (id: string) => api.startContainer(id),
    onSuccess: invalidate,
  });

  const stop = useMutation({
    mutationFn: (id: string) => api.stopContainer(id),
    onSuccess: invalidate,
  });

  const restart = useMutation({
    mutationFn: (id: string) => api.restartContainer(id),
    onSuccess: invalidate,
  });

  const kill = useMutation({
    mutationFn: (id: string) => api.killContainer(id),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: ({ id, force = false }: { id: string; force?: boolean }) =>
      api.removeContainer(id, force),
    onSuccess: invalidate,
  });

  return { start, stop, restart, kill, remove };
}
