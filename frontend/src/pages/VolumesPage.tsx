import { Card, CardHeader, CardTitle } from '../components/ui';
import { VolumeList } from '../components/volumes/VolumeList';

export function VolumesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Volumes</h1>
        <p className="text-gray-400 mt-1">Manage your Docker volumes</p>
      </div>

      <Card padding="none">
        <CardHeader className="px-4 py-3">
          <CardTitle>All Volumes</CardTitle>
        </CardHeader>
        <VolumeList />
      </Card>
    </div>
  );
}
