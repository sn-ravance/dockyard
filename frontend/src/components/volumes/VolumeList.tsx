import { useState } from 'react';
import { Trash2, Plus, Eraser } from 'lucide-react';
import { useVolumes, useVolumeActions } from '../../hooks/useVolumes';
import { useUIStore } from '../../stores/ui.store';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Spinner } from '../ui';
import { CreateVolumeModal } from './CreateVolumeModal';

function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function VolumeList() {
  const { data: volumes, isLoading, error } = useVolumes();
  const { remove, prune } = useVolumeActions();
  const { searchQuery } = useUIStore();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredVolumes = volumes?.filter((vol) => {
    const query = searchQuery.toLowerCase();
    return vol.name.toLowerCase().includes(query);
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
        Error loading volumes: {(error as Error).message}
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
          Create Volume
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Mountpoint</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredVolumes?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                No volumes found
              </TableCell>
            </TableRow>
          ) : (
            filteredVolumes?.map((volume) => (
              <TableRow key={volume.name}>
                <TableCell>
                  <span className="font-medium text-gray-100">{volume.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-400">{volume.driver}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-gray-500 font-mono truncate block max-w-xs">
                    {volume.mountpoint}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-400">{formatDate(volume.createdAt)}</span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove.mutate({ name: volume.name })}
                    disabled={remove.isPending}
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {showCreateModal && <CreateVolumeModal onClose={() => setShowCreateModal(false)} />}
    </>
  );
}
