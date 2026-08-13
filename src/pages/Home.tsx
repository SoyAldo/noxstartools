import { Terminal, Code, MessageSquare, Box, Map, Layout, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-24">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-panel border border-panel-border text-primary text-xs font-mono mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          System Suite Online v2.4.1
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight leading-tight">
          La suite definitiva para <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">administradores de servidores</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10">
          Optimiza, configura y gestiona tu servidor con herramientas visuales de alta precisión. Desde ajustes del sistema hasta formatos in-game.
        </p>
        <div className="flex gap-4 justify-center">
           <Link to="/validator" className="bg-primary text-gray-950 px-6 py-2.5 rounded-md font-semibold hover:bg-primary/90 transition-colors">
              Empezar ahora
           </Link>
           <Link to="/hex-generator" className="bg-transparent border border-panel-border text-gray-300 px-6 py-2.5 rounded-md font-semibold hover:bg-white/5 transition-colors">
              Hex Generator
           </Link>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Link to="/validator" className="col-span-1 md:col-span-8 bg-panel border border-panel-border rounded-xl p-6 md:p-8 hover:border-primary/50 transition-all hover:-translate-y-1 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full group-hover:bg-primary/10 transition-colors"></div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-black rounded-lg text-primary border border-panel-border">
              <Terminal className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-100">Validador de Archivos</h2>
          </div>
          <p className="text-gray-400 text-sm mb-8 relative z-10 max-w-md">Valida archivos YAML, JSON o TOML sin salir del panel. Encuentra errores de sintaxis antes de reiniciar tu servidor.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 relative z-10">
            {['YAML', 'JSON', 'TOML'].map(t => (
              <div key={t} className="bg-canvas border border-panel-border rounded p-3 text-center text-xs font-mono text-gray-300 shadow-sm">
                {t}
              </div>
            ))}
          </div>
        </Link>
        
        <Link to="/in-game" className="col-span-1 md:col-span-4 bg-panel border border-panel-border rounded-xl p-6 hover:border-secondary/50 transition-all hover:-translate-y-1 flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-black rounded-lg text-secondary border border-panel-border">
                <Code className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-100">Comandos In-Game</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">Generadores visuales de comandos complejos JSON y NBT.</p>
          </div>
          <div className="flex flex-wrap gap-2">
             <span className="px-2.5 py-1.5 bg-canvas border border-panel-border rounded text-xs text-gray-300 font-mono">/tellraw</span>
             <span className="px-2.5 py-1.5 bg-canvas border border-panel-border rounded text-xs text-gray-300 font-mono">Mobs</span>
             <span className="px-2.5 py-1.5 bg-canvas border border-panel-border rounded text-xs text-gray-300 font-mono">Items</span>
          </div>
        </Link>
                <Link to="/plugins" className="col-span-1 md:col-span-6 bg-panel border border-panel-border rounded-xl p-6 hover:border-primary/50 transition-all hover:-translate-y-1">
           <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-black rounded-lg text-primary border border-panel-border">
              <Box className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-100">Plugins Comunes</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">Plantillas para menús GUI, hologramas, y sistemas de economía.</p>
        </Link>
        
        <Link to="/status" className="col-span-1 md:col-span-6 bg-panel border border-panel-border rounded-xl p-6 hover:border-primary/50 transition-all hover:-translate-y-1 group flex items-center justify-between">
           <div>
             <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-black rounded-lg text-primary border border-panel-border">
                <Activity className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-100">Monitor de Servidor</h2>
            </div>
            <p className="text-gray-400 text-sm">Consulta en vivo el estado, jugadores y MOTD de cualquier servidor IP.</p>
           </div>
           <div className="hidden md:flex bg-canvas border border-panel-border px-4 py-2 rounded-lg items-center gap-3 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="font-mono text-sm text-gray-300">mc.hypixel.net</span>
           </div>
        </Link>
      </div>
    </div>
  );
}
