import { useState } from 'react';
import { Trash2, Plus, Eraser } from 'lucide-react';
import { useNetworks, useNetworkActions } from '../../hooks/useNetworks';
import { useUIStore } from '../../stores/ui.store';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Badge, Spinner } from '../ui';
import { CreateNetworkModal } from './CreateNetworkModal';

export function NetworkList() {
  const { data: networks, isLoading, error } = useNetworks();
  const { remove, prune } = useNetworkActions();
  const { searchQuery } = useUIStore();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredNetworks = networks?.filter((net) => {
    const query = searchQuery.toLowerCase();
    return (
      net.name.toLowerCase().includes(query) ||
      net.driver.toLowerCase().includes(query)
    );
  });

  // System networks that cannot be removed
  const systemNetworks = ['bridge', 'host', 'none'];

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
        Error loading networks: {(error as Error).message}
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="secondary" onClick={() => prune.mutate()} disabled={prune.isPending}>
          <Eraser className="w-4 h-4" />
          Prune Unused
        </Button>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          Create Network
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Scope</TableHead>
            <TableHead>Subnet</TableHead>
            <TableHead>Containers</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredNetworks?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                No networks found
              </TableCell>
            </TableRow>
          ) : (
            filteredNetworks?.map((network) => {
              const isSystem = systemNetworks.includes(network.name);
              const subnet = network.ipam.config?.[0]?.subnet || '-';
              const containerCount = Object.keys(network.containers || {}).length;

              return (
                <TableRow key={network.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-100">{network.name}</span>
                      {isSystem && (
                        <Badge variant="default">System</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-400">{network.driver}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-400">{network.scope}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-500 font-mono">{subnet}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-400">{containerCount}</span>
                  </TableCell>
                  <TableCell>
                    {!isSystem && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => remove.mutate(network.id)}
                        disabled={remove.isPending}
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {showCreateModal && <CreateNetworkModal onClose={() => setShowCreateModal(false)} />}
    </>
  );
}
