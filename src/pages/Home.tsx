import { Terminal, Code, MessageSquare, Box, Map, Layout, Activity, Palette } from 'lucide-react';
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
          La suite definitiva para <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">administradores de servidores</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10">
          Optimiza, configura y gestiona tu servidor con herramientas visuales de alta precisión. Desde ajustes del sistema hasta formatos in-game.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/status" className="bg-primary text-gray-950 px-6 py-2.5 rounded-md font-semibold hover:bg-primary/90 transition-colors">
            Monitor de Servidor
          </Link>
          <Link to="/hex-generator" className="bg-transparent border border-panel-border text-gray-300 px-6 py-2.5 rounded-md font-semibold hover:bg-white/5 transition-colors">
            Hex Generator
          </Link>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* ACTIVE TOOLS */}
        <Link to="/status" className="col-span-1 md:col-span-6 bg-panel border border-primary/30 rounded-xl p-6 hover:border-primary transition-all hover:-translate-y-1 group flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full group-hover:bg-primary/10 transition-colors"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-black rounded-lg text-primary border border-panel-border">
                <Activity className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-100">Monitor de Servidor</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">Consulta en vivo el estado, jugadores y MOTD de cualquier servidor IP de Java o Bedrock.</p>
          </div>
          <div className="flex bg-canvas border border-panel-border px-4 py-2 rounded-lg items-center gap-3 shadow-inner w-fit">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-mono text-sm text-gray-300">mc.hypixel.net</span>
          </div>
        </Link>

        <Link to="/hex-generator" className="col-span-1 md:col-span-6 bg-panel border border-primary/30 rounded-xl p-6 hover:border-primary transition-all hover:-translate-y-1 group flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full group-hover:bg-secondary/10 transition-colors"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-black rounded-lg text-primary border border-panel-border">
                <Palette className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-100">Generador Hexadecimal</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">Crea gradientes y textos a color para plugins como MiniMessage o Legacy de forma visual.</p>
          </div>
          <div className="flex bg-canvas border border-panel-border px-4 py-2 rounded-lg items-center gap-2 shadow-inner w-fit">
            <span className="font-mono text-sm font-bold" style={{ backgroundImage: 'linear-gradient(to right, #54daf4, #ffffff)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Texto en Gradiente</span>
          </div>
        </Link>

        {/* INACTIVE TOOLS (PRÓXIMAMENTE) */}
        <div className="col-span-1 md:col-span-4 bg-panel/40 border border-panel-border rounded-xl p-6 opacity-60 flex flex-col justify-start">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-black/50 rounded-lg text-gray-500 border border-panel-border">
              <Terminal className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-400">Validador</h2>
          </div>
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-wider mb-3 w-fit">Próximamente</span>
          <p className="text-gray-500 text-sm">Valida archivos YAML, JSON o TOML sin salir del panel. Previene errores de sintaxis.</p>
        </div>

        <div className="col-span-1 md:col-span-4 bg-panel/40 border border-panel-border rounded-xl p-6 opacity-60 flex flex-col justify-start">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-black/50 rounded-lg text-gray-500 border border-panel-border">
              <Map className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-400">Spark Analyzer</h2>
          </div>
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-wider mb-3 w-fit">Próximamente</span>
          <p className="text-gray-500 text-sm">Analiza reportes de Spark Profiler de forma mucho más intuitiva y rápida.</p>
        </div>

        <div className="col-span-1 md:col-span-4 bg-panel/40 border border-panel-border rounded-xl p-6 opacity-60 flex flex-col justify-start">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-black/50 rounded-lg text-gray-500 border border-panel-border">
              <Box className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-400">Plugins</h2>
          </div>
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-wider mb-3 w-fit">Próximamente</span>
          <p className="text-gray-500 text-sm">Directorio de plugins y configuraciones base esenciales para tu servidor.</p>
        </div>

      </div>
    </div>
  );
}
