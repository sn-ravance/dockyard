import { useState } from 'react';
import { Play, Square, RotateCw, Trash2, Terminal, Activity, MoreVertical } from 'lucide-react';
import { useContainers, useContainerActions } from '../../hooks/useContainers';
import { useUIStore } from '../../stores/ui.store';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Badge, Spinner } from '../ui';
import { ContainerLogsModal } from './ContainerLogsModal';
import { ContainerStatsModal } from './ContainerStatsModal';
import type { ContainerInfo } from '../../types';

function getStateVariant(state: string): 'success' | 'warning' | 'error' | 'default' {
  switch (state) {
    case 'running':
      return 'success';
    case 'paused':
      return 'warning';
    case 'exited':
    case 'dead':
      return 'error';
    default:
      return 'default';
  }
}

function formatPorts(ports: ContainerInfo['ports']): string {
  return ports
    .filter((p) => p.publicPort)
    .map((p) => `${p.publicPort}:${p.privatePort}`)
    .join(', ') || '-';
}

export function ContainerList() {
  const { data: containers, isLoading, error } = useContainers();
  const { start, stop, restart, remove } = useContainerActions();
  const { searchQuery } = useUIStore();

  const [logsContainer, setLogsContainer] = useState<ContainerInfo | null>(null);
  const [statsContainer, setStatsContainer] = useState<ContainerInfo | null>(null);
  const [actionsOpen, setActionsOpen] = useState<string | null>(null);

  const filteredContainers = containers?.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.names.some((n) => n.toLowerCase().includes(query)) ||
      c.image.toLowerCase().includes(query) ||
      c.id.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4">
        Error loading containers: {(error as Error).message}
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ports</TableHead>
            <TableHead className="w-48">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContainers?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                No containers found
              </TableCell>
            </TableRow>
          ) : (
            filteredContainers?.map((container) => (
              <TableRow key={container.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-100">{container.names[0]}</div>
                    <div className="text-xs text-gray-500">{container.id.substring(0, 12)}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-gray-300">{container.image}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={getStateVariant(container.state)}>
                    {container.state}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-gray-400">{formatPorts(container.ports)}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {container.state === 'running' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => stop.mutate(container.id)}
                        disabled={stop.isPending}
                        title="Stop"
                      >
                        <Square className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => start.mutate(container.id)}
                        disabled={start.isPending}
                        title="Start"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => restart.mutate(container.id)}
                      disabled={restart.isPending}
                      title="Restart"
                    >
                      <RotateCw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLogsContainer(container)}
                      title="Logs"
                    >
                      <Terminal className="w-4 h-4" />
                    </Button>
                    {container.state === 'running' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStatsContainer(container)}
                        title="Stats"
                      >
                        <Activity className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActionsOpen(actionsOpen === container.id ? null : container.id)}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      {actionsOpen === container.id && (
                        <div className="absolute right-0 top-full mt-1 bg-gray-700 rounded-lg shadow-lg border border-gray-600 py-1 z-10 min-w-32">
                          <button
                            className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-600 flex items-center gap-2"
                            onClick={() => {
                              remove.mutate({ id: container.id, force: true });
                              setActionsOpen(null);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {logsContainer && (
        <ContainerLogsModal
          container={logsContainer}
          onClose={() => setLogsContainer(null)}
        />
      )}

      {statsContainer && (
        <ContainerStatsModal
          container={statsContainer}
          onClose={() => setStatsContainer(null)}
        />
      )}
    </>
  );
}
