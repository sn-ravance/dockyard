import { Card, CardHeader, CardTitle } from '../components/ui';
import { ImageList } from '../components/images/ImageList';

export function ImagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Images</h1>
        <p className="text-gray-400 mt-1">Manage your Docker images</p>
      </div>

      <Card padding="none">
        <CardHeader className="px-4 py-3">
          <CardTitle>All Images</CardTitle>
        </CardHeader>
        <ImageList />
      </Card>
    </div>
  );
}
