import { Modal, Terminal, Button } from '../ui';
import { useContainerLogs } from '../../hooks/useWebSocket';
import { Trash2, Wifi, WifiOff } from 'lucide-react';
import type { ContainerInfo } from '../../types';

interface ContainerLogsModalProps {
  container: ContainerInfo;
  onClose: () => void;
}

export function ContainerLogsModal({ container, onClose }: ContainerLogsModalProps) {
  const { logs, isConnected, clearLogs } = useContainerLogs(container.id);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Logs: ${container.names[0]}`}
      size="xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-400" />
                <span className="text-red-400">Disconnected</span>
              </>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={clearLogs}>
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
        </div>
        <Terminal logs={logs} className="h-96" />
      </div>
    </Modal>
  );
}
