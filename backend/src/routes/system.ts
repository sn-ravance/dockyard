import { Router } from 'express';
import { getDocker } from '../services/docker.service.js';
import type { SystemInfo, DockerVersion } from '../types/docker.types.js';

const router = Router();

router.get('/info', async (_req, res, next) => {
  try {
    const docker = getDocker();
    const info = await docker.info();

    const systemInfo: SystemInfo = {
      id: info.ID,
      containers: info.Containers,
      containersRunning: info.ContainersRunning,
      containersPaused: info.ContainersPaused,
      containersStopped: info.ContainersStopped,
      images: info.Images,
      driver: info.Driver,
      memoryLimit: info.MemoryLimit,
      swapLimit: info.SwapLimit,
      cpuCfsPeriod: info.CpuCfsPeriod,
      cpuCfsQuota: info.CpuCfsQuota,
      cpuShares: info.CPUShares,
      cpuSet: info.CPUSet,
      oomKillDisable: info.OomKillDisable,
      operatingSystem: info.OperatingSystem,
      osType: info.OSType,
      architecture: info.Architecture,
      ncpu: info.NCPU,
      memTotal: info.MemTotal,
      dockerRootDir: info.DockerRootDir,
      name: info.Name,
      serverVersion: info.ServerVersion,
    };

    res.json(systemInfo);
  } catch (err) {
    next(err);
  }
});

router.get('/version', async (_req, res, next) => {
  try {
    const docker = getDocker();
    const version = await docker.version();

    const dockerVersion: DockerVersion = {
      version: version.Version,
      apiVersion: version.ApiVersion,
      minAPIVersion: version.MinAPIVersion,
      gitCommit: version.GitCommit,
      goVersion: version.GoVersion,
      os: version.Os,
      arch: version.Arch,
      kernelVersion: version.KernelVersion,
      buildTime: String(version.BuildTime),
    };

    res.json(dockerVersion);
  } catch (err) {
    next(err);
  }
});

export default router;
