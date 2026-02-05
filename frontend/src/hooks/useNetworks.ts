import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type { NetworkDetails } from '../types';

export function useNetworks() {
  return useQuery<NetworkDetails[]>({
    queryKey: ['networks'],
    queryFn: () => api.getNetworks() as Promise<NetworkDetails[]>,
    refetchInterval: 10000,
  });
}

export function useNetwork(id: string) {
  return useQuery<NetworkDetails>({
    queryKey: ['network', id],
    queryFn: () => api.getNetwork(id) as Promise<NetworkDetails>,
    enabled: !!id,
  });
}

export function useNetworkActions() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['networks'] });
  };

  const create = useMutation({
    mutationFn: ({
      name,
      driver,
      internal,
      attachable,
      labels,
      subnet,
      gateway,
    }: {
      name: string;
      driver?: string;
      internal?: boolean;
      attachable?: boolean;
      labels?: Record<string, string>;
      subnet?: string;
      gateway?: string;
    }) => api.createNetwork(name, { driver, internal, attachable, labels, subnet, gateway }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.removeNetwork(id),
    onSuccess: invalidate,
  });

  const connect = useMutation({
    mutationFn: ({ networkId, containerId }: { networkId: string; containerId: string }) =>
      api.connectContainer(networkId, containerId),
    onSuccess: invalidate,
  });

  const disconnect = useMutation({
    mutationFn: ({ networkId, containerId, force = false }: { networkId: string; containerId: string; force?: boolean }) =>
      api.disconnectContainer(networkId, containerId, force),
    onSuccess: invalidate,
  });

  const prune = useMutation({
    mutationFn: () => api.pruneNetworks(),
    onSuccess: invalidate,
  });

  return { create, remove, connect, disconnect, prune };
}
