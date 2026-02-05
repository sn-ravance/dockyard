import { Search, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useHealth } from '../../hooks/useSystem';
import { useUIStore } from '../../stores/ui.store';
import { Badge } from '../ui/Badge';

export function Header() {
  const { data: health } = useHealth();
  const { searchQuery, setSearchQuery } = useUIStore();
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  return (
    <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-docker-blue"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleRefresh}
          className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Docker:</span>
          <Badge variant={health?.docker === 'connected' ? 'success' : 'error'}>
            {health?.docker || 'Unknown'}
          </Badge>
        </div>
      </div>
    </header>
  );
}
