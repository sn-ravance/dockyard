import { Box, Layers, HardDrive, Network, Cpu, Server } from 'lucide-react';
import { useSystemInfo, useDockerVersion } from '../hooks/useSystem';
import { useContainers } from '../hooks/useContainers';
import { useImages } from '../hooks/useImages';
import { useVolumes } from '../hooks/useVolumes';
import { useNetworks } from '../hooks/useNetworks';
import { Card, CardHeader, CardTitle, Spinner } from '../components/ui';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

interface StatCardProps {
  icon: typeof Box;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
}

function StatCard({ icon: Icon, label, value, subValue, color }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-100 mt-1">{value}</p>
          {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
}

export function Dashboard() {
  const { data: systemInfo, isLoading: systemLoading } = useSystemInfo();
  const { data: version } = useDockerVersion();
  const { data: containers } = useContainers();
  const { data: images } = useImages();
  const { data: volumes } = useVolumes();
  const { data: networks } = useNetworks();

  if (systemLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const runningContainers = containers?.filter((c) => c.state === 'running').length || 0;
  const totalContainers = containers?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of your Docker environment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Box}
          label="Containers"
          value={totalContainers}
          subValue={`${runningContainers} running`}
          color="bg-blue-600"
        />
        <StatCard
          icon={Layers}
          label="Images"
          value={images?.length || 0}
          color="bg-green-600"
        />
        <StatCard
          icon={HardDrive}
          label="Volumes"
          value={volumes?.length || 0}
          color="bg-purple-600"
        />
        <StatCard
          icon={Network}
          label="Networks"
          value={networks?.length || 0}
          color="bg-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Host</p>
                <p className="text-gray-100">{systemInfo?.name || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">CPUs / Memory</p>
                <p className="text-gray-100">
                  {systemInfo?.ncpu || 0} CPUs / {formatBytes(systemInfo?.memTotal || 0)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-sm text-gray-400">Operating System</p>
                <p className="text-gray-100 text-sm">{systemInfo?.operatingSystem || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Architecture</p>
                <p className="text-gray-100 text-sm">{systemInfo?.architecture || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Storage Driver</p>
                <p className="text-gray-100 text-sm">{systemInfo?.driver || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Docker Root</p>
                <p className="text-gray-100 text-sm truncate">{systemInfo?.dockerRootDir || '-'}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Docker Version</CardTitle>
          </CardHeader>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Version</p>
              <p className="text-gray-100">{version?.version || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">API Version</p>
              <p className="text-gray-100">{version?.apiVersion || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Go Version</p>
              <p className="text-gray-100">{version?.goVersion || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Git Commit</p>
              <p className="text-gray-100 font-mono text-sm">{version?.gitCommit?.substring(0, 12) || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">OS/Arch</p>
              <p className="text-gray-100">{version?.os}/{version?.arch}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Kernel Version</p>
              <p className="text-gray-100 text-sm truncate">{version?.kernelVersion || '-'}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
