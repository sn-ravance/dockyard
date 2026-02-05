import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { ContainersPage } from './pages/ContainersPage';
import { ImagesPage } from './pages/ImagesPage';
import { VolumesPage } from './pages/VolumesPage';
import { NetworksPage } from './pages/NetworksPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/containers" element={<ContainersPage />} />
            <Route path="/images" element={<ImagesPage />} />
            <Route path="/volumes" element={<VolumesPage />} />
            <Route path="/networks" element={<NetworksPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
