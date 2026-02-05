import { Modal, Badge } from '../ui';
import { useContainerStats } from '../../hooks/useWebSocket';
import { Cpu, HardDrive, Network, Database } from 'lucide-react';
import type { ContainerInfo, ContainerStats } from '../../types';

interface ContainerStatsModalProps {
  container: ContainerInfo;
  onClose: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: typeof Cpu;
  label: string;
  value: string;
  subValue?: string;
  color: string;
}) {
  return (
    <div className="bg-gray-700/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-100">{value}</div>
      {subValue && <div className="text-sm text-gray-500 mt-1">{subValue}</div>}
    </div>
  );
}

export function ContainerStatsModal({ container, onClose }: ContainerStatsModalProps) {
  const { stats, isConnected } = useContainerStats(container.id);
  const typedStats = stats as ContainerStats | null;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Stats: ${container.names[0]}`}
      size="lg"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Status:</span>
          <Badge variant={isConnected ? 'success' : 'error'}>
            {isConnected ? 'Live' : 'Disconnected'}
          </Badge>
        </div>

        {typedStats ? (
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={Cpu}
              label="CPU Usage"
              value={`${typedStats.cpu.percent.toFixed(2)}%`}
              color="text-blue-400"
            />
            <StatCard
              icon={HardDrive}
              label="Memory Usage"
              value={`${typedStats.memory.percent.toFixed(2)}%`}
              subValue={`${formatBytes(typedStats.memory.usage)} / ${formatBytes(typedStats.memory.limit)}`}
              color="text-green-400"
            />
            <StatCard
              icon={Network}
              label="Network I/O"
              value={`${formatBytes(typedStats.network.rx_bytes)} / ${formatBytes(typedStats.network.tx_bytes)}`}
              subValue="RX / TX"
              color="text-purple-400"
            />
            <StatCard
              icon={Database}
              label="Block I/O"
              value={`${formatBytes(typedStats.blockIO.read)} / ${formatBytes(typedStats.blockIO.write)}`}
              subValue="Read / Write"
              color="text-orange-400"
            />
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            Waiting for stats...
          </div>
        )}
      </div>
    </Modal>
  );
}
