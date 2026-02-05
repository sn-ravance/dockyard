import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type { ImageInfo } from '../types';

export function useImages() {
  return useQuery<ImageInfo[]>({
    queryKey: ['images'],
    queryFn: () => api.getImages() as Promise<ImageInfo[]>,
    refetchInterval: 10000,
  });
}

export function useImage(id: string) {
  return useQuery<ImageInfo>({
    queryKey: ['image', id],
    queryFn: () => api.getImage(id) as Promise<ImageInfo>,
    enabled: !!id,
  });
}

export function useImageActions() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['images'] });
  };

  const remove = useMutation({
    mutationFn: ({ id, force = false }: { id: string; force?: boolean }) =>
      api.removeImage(id, force),
    onSuccess: invalidate,
  });

  const prune = useMutation({
    mutationFn: () => api.pruneImages(),
    onSuccess: invalidate,
  });

  return { remove, prune };
}
