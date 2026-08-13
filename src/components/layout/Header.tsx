import { Menu, Search, Terminal, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export default function Header() {
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const location = useLocation();

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
        {/* Dropdown Herramientas */}
        <div className="relative h-full flex items-center group">
          <button className={`h-full flex items-center gap-1 px-4 text-sm font-medium transition-colors border-b-2 ${
            ['/status', '/hex-generator', '/validator'].includes(location.pathname) 
              ? 'border-primary text-primary bg-white/5' 
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
          }`}>
            Herramientas <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:-rotate-180" />
          </button>
          
          <div className="absolute top-full left-0 mt-0 w-56 bg-panel border-x border-b border-panel-border rounded-b-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-2 transform origin-top-left">
            <Link to="/status" className={`px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${location.pathname === '/status' ? 'text-primary font-bold' : 'text-gray-300'}`}>
              Monitor de Servidor
            </Link>
            <Link to="/validator" className={`px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${location.pathname === '/validator' ? 'text-primary font-bold' : 'text-gray-300'}`}>
              Validador de Archivos
            </Link>
            <Link to="/hex-generator" className={`px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${location.pathname === '/hex-generator' ? 'text-primary font-bold' : 'text-gray-300'}`}>
              Generador Hex
            </Link>
          </div>
        </div>

        {/* Regular links */}
        {[
          { name: 'Acerca de', path: '/about' },
          { name: 'Sponsors', path: '/sponsors' },
        ].map((link) => {
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
