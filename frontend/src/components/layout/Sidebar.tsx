import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Layers,
  HardDrive,
  Network,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUIStore } from '../../stores/ui.store';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/containers', icon: Box, label: 'Containers' },
  { to: '/images', icon: Layers, label: 'Images' },
  { to: '/volumes', icon: HardDrive, label: 'Volumes' },
  { to: '/networks', icon: Network, label: 'Networks' },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 transition-all duration-300 z-40 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#0db7ed">
              <path d="M13 8h-1.5v1.5H13V8zm0-2.5h-1.5v1.5H13V5.5zm0 5h-1.5v1.5H13v-1.5zm-2.5-5H9v1.5h1.5V5.5zm0 2.5H9v1.5h1.5V8zm0 2.5H9v1.5h1.5v-1.5zM8 8H6.5v1.5H8V8zm0 2.5H6.5v1.5H8v-1.5zm12.5 0c-.5-2.5-3-3-5.5-3h-1v3H5.5c-.3 0-.5.2-.5.5v4c0 1.4 1.1 2.5 2.5 2.5h10c2.2 0 4-1.8 4-4 0-.8-.2-1.5-.5-2.1.3-.3.5-.6.5-.9zM15.5 8H14v1.5h1.5V8z" />
            </svg>
            <span className="text-xl font-bold text-docker-blue">Dockyard</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="p-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-docker-blue/10 text-docker-blue'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
