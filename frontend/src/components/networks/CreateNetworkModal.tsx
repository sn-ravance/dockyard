import { useState } from 'react';
import { Modal, Input, Button } from '../ui';
import { useNetworkActions } from '../../hooks/useNetworks';

interface CreateNetworkModalProps {
  onClose: () => void;
}

export function CreateNetworkModal({ onClose }: CreateNetworkModalProps) {
  const [name, setName] = useState('');
  const [driver, setDriver] = useState('bridge');
  const [subnet, setSubnet] = useState('');
  const [gateway, setGateway] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { create } = useNetworkActions();

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Network name is required');
      return;
    }

    try {
      await create.mutateAsync({
        name: name.trim(),
        driver,
        subnet: subnet.trim() || undefined,
        gateway: gateway.trim() || undefined,
      });
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create Network" size="md">
      <div className="space-y-4">
        <Input
          label="Network Name"
          placeholder="my-network"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error || undefined}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">Driver</label>
          <select
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-docker-blue"
          >
            <option value="bridge">bridge</option>
            <option value="host">host</option>
            <option value="overlay">overlay</option>
            <option value="macvlan">macvlan</option>
            <option value="none">none</option>
          </select>
        </div>

        <Input
          label="Subnet (optional)"
          placeholder="172.28.0.0/16"
          value={subnet}
          onChange={(e) => setSubnet(e.target.value)}
        />

        <Input
          label="Gateway (optional)"
          placeholder="172.28.0.1"
          value={gateway}
          onChange={(e) => setGateway(e.target.value)}
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
