import { Card, CardHeader, CardTitle } from '../components/ui';
import { NetworkList } from '../components/networks/NetworkList';

export function NetworksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Networks</h1>
        <p className="text-gray-400 mt-1">Manage your Docker networks</p>
      </div>

      <Card padding="none">
        <CardHeader className="px-4 py-3">
          <CardTitle>All Networks</CardTitle>
        </CardHeader>
        <NetworkList />
      </Card>
    </div>
  );
}
