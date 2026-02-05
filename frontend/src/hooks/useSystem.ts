import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import type { SystemInfo, DockerVersion, HealthStatus } from '../types';

export function useHealth() {
  return useQuery<HealthStatus>({
    queryKey: ['health'],
    queryFn: () => api.getHealth() as Promise<HealthStatus>,
    refetchInterval: 10000,
  });
}

export function useSystemInfo() {
  return useQuery<SystemInfo>({
    queryKey: ['system', 'info'],
    queryFn: () => api.getSystemInfo() as Promise<SystemInfo>,
    refetchInterval: 30000,
  });
}

export function useDockerVersion() {
  return useQuery<DockerVersion>({
    queryKey: ['system', 'version'],
    queryFn: () => api.getVersion() as Promise<DockerVersion>,
    staleTime: Infinity,
  });
}
