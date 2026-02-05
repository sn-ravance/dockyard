import { useState } from 'react';
import { Trash2, Download, Eraser } from 'lucide-react';
import { useImages, useImageActions } from '../../hooks/useImages';
import { useUIStore } from '../../stores/ui.store';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Spinner } from '../ui';
import { PullImageModal } from './PullImageModal';
import type { ImageInfo } from '../../types';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getImageName(image: ImageInfo): string {
  if (image.repoTags && image.repoTags.length > 0 && image.repoTags[0] !== '<none>:<none>') {
    return image.repoTags[0];
  }
  return image.id.substring(7, 19);
}

export function ImageList() {
  const { data: images, isLoading, error } = useImages();
  const { remove, prune } = useImageActions();
  const { searchQuery } = useUIStore();

  const [showPullModal, setShowPullModal] = useState(false);

  const filteredImages = images?.filter((img) => {
    const query = searchQuery.toLowerCase();
    return (
      img.repoTags?.some((t) => t.toLowerCase().includes(query)) ||
      img.id.toLowerCase().includes(query)
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
        Error loading images: {(error as Error).message}
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
        <Button variant="primary" onClick={() => setShowPullModal(true)}>
          <Download className="w-4 h-4" />
          Pull Image
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Repository</TableHead>
            <TableHead>Tag</TableHead>
            <TableHead>Image ID</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredImages?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                No images found
              </TableCell>
            </TableRow>
          ) : (
            filteredImages?.map((image) => {
              const name = getImageName(image);
              const [repo, tag] = name.includes(':') ? name.split(':') : [name, 'latest'];
              return (
                <TableRow key={image.id}>
                  <TableCell>
                    <span className="font-medium text-gray-100">{repo}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-400">{tag}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-500 font-mono">
                      {image.id.substring(7, 19)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-400">{formatDate(image.created)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-400">{formatBytes(image.size)}</span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => remove.mutate({ id: image.id, force: true })}
                      disabled={remove.isPending}
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {showPullModal && <PullImageModal onClose={() => setShowPullModal(false)} />}
    </>
  );
}
