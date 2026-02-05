export interface ContainerInfo {
  id: string;
  names: string[];
  image: string;
  imageId: string;
  command: string;
  created: number;
  state: string;
  status: string;
  ports: PortBinding[];
  labels: Record<string, string>;
  networkMode: string;
  mounts: MountInfo[];
}

export interface PortBinding {
  ip?: string;
  privatePort: number;
  publicPort?: number;
  type: string;
}

export interface MountInfo {
  type: string;
  name?: string;
  source: string;
  destination: string;
  mode: string;
  rw: boolean;
}

export interface ContainerDetails extends ContainerInfo {
  config: {
    env: string[];
    cmd: string[];
    workingDir: string;
    entrypoint: string[];
  };
  networkSettings: {
    networks: Record<string, NetworkInfo>;
  };
  hostConfig: {
    memory: number;
    cpuShares: number;
    restartPolicy: {
      name: string;
      maximumRetryCount: number;
    };
  };
}

export interface NetworkInfo {
  networkId: string;
  ipAddress: string;
  gateway: string;
  macAddress: string;
}

export interface ImageInfo {
  id: string;
  repoTags: string[];
  repoDigests: string[];
  created: number;
  size: number;
  virtualSize: number;
  labels: Record<string, string>;
}

export interface VolumeInfo {
  name: string;
  driver: string;
  mountpoint: string;
  createdAt: string;
  labels: Record<string, string>;
  scope: string;
  options: Record<string, string>;
}

export interface NetworkDetails {
  id: string;
  name: string;
  driver: string;
  scope: string;
  ipam: {
    driver: string;
    config: Array<{
      subnet?: string;
      gateway?: string;
    }>;
  };
  internal: boolean;
  attachable: boolean;
  containers: Record<string, {
    name: string;
    endpointId: string;
    macAddress: string;
    ipv4Address: string;
    ipv6Address: string;
  }>;
  labels: Record<string, string>;
}

export interface SystemInfo {
  id: string;
  containers: number;
  containersRunning: number;
  containersPaused: number;
  containersStopped: number;
  images: number;
  driver: string;
  memoryLimit: boolean;
  swapLimit: boolean;
  cpuCfsPeriod: boolean;
  cpuCfsQuota: boolean;
  cpuShares: boolean;
  cpuSet: boolean;
  oomKillDisable: boolean;
  operatingSystem: string;
  osType: string;
  architecture: string;
  ncpu: number;
  memTotal: number;
  dockerRootDir: string;
  name: string;
  serverVersion: string;
}

export interface DockerVersion {
  version: string;
  apiVersion: string;
  minAPIVersion: string;
  gitCommit: string;
  goVersion: string;
  os: string;
  arch: string;
  kernelVersion: string;
  buildTime: string;
}

export interface ContainerStats {
  read: string;
  cpu: {
    usage: number;
    systemUsage: number;
    percent: number;
  };
  memory: {
    usage: number;
    limit: number;
    percent: number;
  };
  network: {
    rx_bytes: number;
    tx_bytes: number;
  };
  blockIO: {
    read: number;
    write: number;
  };
}

export interface PullProgress {
  status: string;
  progress?: string;
  progressDetail?: {
    current?: number;
    total?: number;
  };
  id?: string;
}
