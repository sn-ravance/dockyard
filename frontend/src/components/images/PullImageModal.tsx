import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Modal, Input, Button } from '../ui';
import { api } from '../../api/client';
import type { PullProgress } from '../../types';

interface PullImageModalProps {
  onClose: () => void;
}

export function PullImageModal({ onClose }: PullImageModalProps) {
  const [imageName, setImageName] = useState('');
  const [isPulling, setIsPulling] = useState(false);
  const [progress, setProgress] = useState<PullProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const queryClient = useQueryClient();

  const handlePull = async () => {
    if (!imageName.trim()) return;

    setIsPulling(true);
    setError(null);
    setProgress([]);
    setIsComplete(false);

    try {
      await api.pullImage(imageName, (prog) => {
        const p = prog as PullProgress;
        if (p.error) {
          setError(p.error);
        } else if (p.status === 'complete') {
          setIsComplete(true);
          queryClient.invalidateQueries({ queryKey: ['images'] });
        } else {
          setProgress((prev) => {
            // Update existing layer progress or add new
            if (p.id) {
              const existing = prev.findIndex((x) => x.id === p.id);
              if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = p;
                return updated;
              }
            }
            return [...prev, p].slice(-20);
          });
        }
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsPulling(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Pull Image" size="lg">
      <div className="space-y-4">
        <Input
          label="Image Name"
          placeholder="e.g., nginx:alpine, ubuntu:22.04"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
          disabled={isPulling}
        />

        {error && (
          <div className="p-3 bg-red-600/20 border border-red-600/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {isComplete && (
          <div className="p-3 bg-green-600/20 border border-green-600/30 rounded-lg text-green-400 text-sm">
            Image pulled successfully!
          </div>
        )}

        {progress.length > 0 && (
          <div className="bg-gray-700/50 rounded-lg p-3 max-h-64 overflow-y-auto font-mono text-xs">
            {progress.map((p, i) => (
              <div key={`${p.id || i}`} className="text-gray-400">
                {p.id && <span className="text-gray-500">{p.id}: </span>}
                {p.status}
                {p.progress && <span className="text-docker-blue ml-2">{p.progress}</span>}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={isPulling}>
            {isComplete ? 'Close' : 'Cancel'}
          </Button>
          {!isComplete && (
            <Button variant="primary" onClick={handlePull} disabled={isPulling || !imageName.trim()}>
              {isPulling ? 'Pulling...' : 'Pull'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
