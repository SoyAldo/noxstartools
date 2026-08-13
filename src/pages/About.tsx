import { Terminal, Code, Users, Heart, Shield, Cpu } from 'lucide-react';
import SEO from '../components/SEO';

export default function About() {
  return (
    <>
      <SEO 
        title="Acerca de NoxstarTools | Herramientas para Servidores Minecraft" 
        description="NoxstarTools es la suite definitiva para administradores de servidores de Minecraft, diseñada para optimizar y gestionar tu servidor con precisión."
      />
      <div className="w-full max-w-5xl mx-auto px-4 py-12 md:py-24 animate-in fade-in duration-500">
      
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 uppercase tracking-widest">
          Acerca de Nosotros
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight leading-tight">
          Redefiniendo la <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Gestión de Servidores</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          NoxstarTools nace con la misión de proporcionar herramientas de nivel profesional, rápidas y fiables para administradores de servidores de Minecraft en todo el mundo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <div className="bg-panel border border-panel-border rounded-xl p-6 hover:border-primary/50 transition-colors group">
          <div className="w-12 h-12 bg-black rounded-lg border border-panel-border flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
            <Cpu className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Tecnología de Punta</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Nuestras herramientas están construidas sobre una pila tecnológica moderna (React, Vite, TailwindCSS) garantizando una velocidad asombrosa y una experiencia de usuario fluida sin recargas.
          </p>
        </div>

        <div className="bg-panel border border-panel-border rounded-xl p-6 hover:border-secondary/50 transition-colors group">
          <div className="w-12 h-12 bg-black rounded-lg border border-panel-border flex items-center justify-center mb-6 group-hover:bg-secondary/10 transition-colors">
            <Shield className="w-6 h-6 text-secondary" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Confiabilidad</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Sabemos que el tiempo es crítico. Por eso, nuestros validadores, generadores y analizadores procesan tus datos con total precisión, minimizando los errores en producción.
          </p>
        </div>

        <div className="bg-panel border border-panel-border rounded-xl p-6 hover:border-green-500/50 transition-colors group">
          <div className="w-12 h-12 bg-black rounded-lg border border-panel-border flex items-center justify-center mb-6 group-hover:bg-green-500/10 transition-colors">
            <Users className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Para la Comunidad</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Diseñado desde cero para satisfacer las necesidades reales de los dueños de servidores, desarrolladores de plugins y administradores de comunidades.
          </p>
        </div>
      </div>

      <div className="bg-panel border border-panel-border rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-white mb-4">La Visión</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Nuestro objetivo es centralizar todas las utilidades esenciales en un solo lugar. Queremos eliminar la necesidad de depender de scripts desactualizados o páginas web lentas llenas de publicidad.
          </p>
          <div className="flex items-center gap-3 text-sm font-bold text-primary">
            <Heart className="w-5 h-5 fill-primary" /> Hecho con pasión por NoxstarTools
          </div>
        </div>
        <div className="md:w-1/2 bg-black/50 border-t md:border-t-0 md:border-l border-panel-border p-8 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <Terminal className="w-32 h-32 text-gray-800 relative z-10" />
        </div>
      </div>

    </div>
    </>
  );
}
