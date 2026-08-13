import { Menu, Search, Terminal } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export default function Header() {
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const location = useLocation();

  const links = [
    { name: 'Status', path: '/status' },
    // { name: 'Validador', path: '/validator' },
    // { name: 'Spark Analyzer', path: '/spark-analyzer' },
    { name: 'Hex Generator', path: '/hex-generator' },
  ];

  return (
    <header className="fixed top-0 w-full h-16 z-50 bg-panel border-b border-panel-border flex justify-between items-center px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
          <span className="bg-primary/10 p-1 rounded">
            <Terminal className="w-6 h-6" />
          </span>
          NoxstarTools
        </Link>
      </div>

      <nav className="hidden lg:flex items-center gap-1 h-full">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`h-full flex items-center px-4 text-sm font-medium transition-colors border-b-2 ${isActive
                ? 'border-primary text-primary bg-white/5'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar herramientas..."
            className="bg-canvas border border-panel-border rounded-md py-1.5 pl-9 pr-3 text-sm text-gray-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 w-64 transition-all"
          />
        </div>
      </div>
    </header>
  );
}
