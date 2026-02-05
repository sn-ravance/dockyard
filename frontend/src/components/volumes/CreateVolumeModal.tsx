import { useState } from 'react';
import { Modal, Input, Button } from '../ui';
import { useVolumeActions } from '../../hooks/useVolumes';

interface CreateVolumeModalProps {
  onClose: () => void;
}

export function CreateVolumeModal({ onClose }: CreateVolumeModalProps) {
  const [name, setName] = useState('');
  const [driver, setDriver] = useState('local');
  const [error, setError] = useState<string | null>(null);

  const { create } = useVolumeActions();

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Volume name is required');
      return;
    }

    try {
      await create.mutateAsync({ name: name.trim(), driver });
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create Volume" size="md">
      <div className="space-y-4">
        <Input
          label="Volume Name"
          placeholder="my-volume"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error || undefined}
        />

        <Input
          label="Driver"
          placeholder="local"
          value={driver}
          onChange={(e) => setDriver(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate} disabled={create.isPending}>
            {create.isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
