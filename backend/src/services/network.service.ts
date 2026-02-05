import { getDocker } from './docker.service.js';
import type { NetworkDetails } from '../types/docker.types.js';

export async function listNetworks(): Promise<NetworkDetails[]> {
  const docker = getDocker();
  const networks = await docker.listNetworks();

  if (!networks || !Array.isArray(networks)) {
    return [];
  }

  return networks.map((net) => ({
    id: net.Id,
    name: net.Name,
    driver: net.Driver || 'bridge',
    scope: net.Scope,
    ipam: {
      driver: net.IPAM?.Driver || 'default',
      config: (net.IPAM?.Config || []).map((c) => ({ subnet: c.Subnet, gateway: c.Gateway })),
    },
    internal: net.Internal || false,
    attachable: net.Attachable || false,
    containers: Object.fromEntries(
      Object.entries(net.Containers || {}).map(([id, container]) => [
        id,
        {
          name: container.Name,
          endpointId: container.EndpointID,
          macAddress: container.MacAddress,
          ipv4Address: container.IPv4Address,
          ipv6Address: container.IPv6Address,
        },
      ])
    ),
    labels: net.Labels || {},
  }));
}

export async function getNetwork(id: string): Promise<NetworkDetails> {
  const docker = getDocker();
  const network = docker.getNetwork(id);
  const info = await network.inspect();

  return {
    id: info.Id,
    name: info.Name,
    driver: info.Driver,
    scope: info.Scope,
    ipam: {
      driver: info.IPAM?.Driver || 'default',
      config: (info.IPAM?.Config || []).map((c) => ({ subnet: c.Subnet, gateway: c.Gateway })),
    },
    internal: info.Internal || false,
    attachable: info.Attachable || false,
    containers: Object.fromEntries(
      Object.entries(info.Containers || {}).map(([id, container]) => [
        id,
        {
          name: container.Name,
          endpointId: container.EndpointID,
          macAddress: container.MacAddress,
          ipv4Address: container.IPv4Address,
          ipv6Address: container.IPv6Address,
        },
      ])
    ),
    labels: info.Labels || {},
  };
}

export async function createNetwork(
  name: string,
  options?: {
    driver?: string;
    internal?: boolean;
    attachable?: boolean;
    labels?: Record<string, string>;
    subnet?: string;
    gateway?: string;
  }
): Promise<NetworkDetails> {
  const docker = getDocker();

  const ipamConfig: Array<{ Subnet?: string; Gateway?: string }> = [];
  if (options?.subnet || options?.gateway) {
    ipamConfig.push({
      Subnet: options.subnet,
      Gateway: options.gateway,
    });
  }

  const network = await docker.createNetwork({
    Name: name,
    Driver: options?.driver || 'bridge',
    Internal: options?.internal || false,
    Attachable: options?.attachable ?? true,
    Labels: options?.labels || {},
    IPAM: ipamConfig.length > 0 ? { Config: ipamConfig } : undefined,
  });

  const info = await network.inspect();

  return {
    id: info.Id,
    name: info.Name,
    driver: info.Driver,
    scope: info.Scope,
    ipam: {
      driver: info.IPAM?.Driver || 'default',
      config: (info.IPAM?.Config || []).map((c) => ({ subnet: c.Subnet, gateway: c.Gateway })),
    },
    internal: info.Internal || false,
    attachable: info.Attachable || false,
    containers: {},
    labels: info.Labels || {},
  };
}

export async function removeNetwork(id: string): Promise<void> {
  const docker = getDocker();
  const network = docker.getNetwork(id);
  await network.remove();
}

export async function connectContainer(networkId: string, containerId: string): Promise<void> {
  const docker = getDocker();
  const network = docker.getNetwork(networkId);
  await network.connect({ Container: containerId });
}

export async function disconnectContainer(
  networkId: string,
  containerId: string,
  force = false
): Promise<void> {
  const docker = getDocker();
  const network = docker.getNetwork(networkId);
  await network.disconnect({ Container: containerId, Force: force });
}

export async function pruneNetworks(): Promise<{ deleted: string[] }> {
  const docker = getDocker();
  const result = await docker.pruneNetworks();

  return {
    deleted: result.NetworksDeleted || [],
  };
}
