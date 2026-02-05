import { Card, CardHeader, CardTitle } from '../components/ui';
import { ContainerList } from '../components/containers/ContainerList';

export function ContainersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Containers</h1>
        <p className="text-gray-400 mt-1">Manage your Docker containers</p>
      </div>

      <Card padding="none">
        <CardHeader className="px-4 py-3">
          <CardTitle>All Containers</CardTitle>
        </CardHeader>
        <ContainerList />
      </Card>
    </div>
  );
}
