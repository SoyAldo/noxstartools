import { Settings, Activity, Palette, Gauge } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useAppStore();
  const location = useLocation();

  const links = [
    { name: 'Status', path: '/status', icon: Activity },
    { name: 'Validador', path: '/validator', icon: Settings },
    { name: 'Spark Analyzer', path: '/spark-analyzer', icon: Gauge },
    { name: 'Hex Generator', path: '/hex-generator', icon: Palette },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
      <aside className={cn(
        "fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-panel border-r border-panel-border z-40 transition-transform duration-200 lg:translate-x-0 flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 pb-2">
          <h2 className="text-lg font-bold text-gray-100 mb-1">Herramientas</h2>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Categorías</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => toggleSidebar()}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm",
                  isActive
                    ? "bg-primary/10 text-primary font-medium border border-primary/20"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                )}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-panel-border mt-auto shrink-0 bg-panel">
          <div className="flex flex-col items-center justify-center space-y-1">
            <p className="text-xs text-gray-500 font-medium">
              &copy; {new Date().getFullYear()} NoxstarTools
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1">
              Powered by <span className="text-gray-300"><Link to="https://noxstarstudios.com" target="_blank" rel="noopener noreferrer">Noxstar Studios</Link></span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
