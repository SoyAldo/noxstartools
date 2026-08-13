import { Star, Gift, Crown, ExternalLink, Server, LayoutTemplate } from 'lucide-react';
import SEO from '../components/SEO';

export default function Sponsors() {
  return (
    <>
      <SEO 
        title="Patrocinadores | Apoya a NoxstarTools" 
        description="Descubre cómo apoyar el desarrollo de NoxstarTools y conoce a nuestros patrocinadores principales como NoxstarStudios y NatublockHost."
      />
      <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500">
      
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold mb-6 uppercase tracking-widest">
          Patrocinadores
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight leading-tight">
          Apoya el <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Desarrollo</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          NoxstarTools se mantiene gracias al increíble apoyo de la comunidad y patrocinadores. 
        </p>
      </div>

      {/* Featured Sponsors Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Patrocinadores Principales</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NoxstarStudios */}
          <div className="bg-panel border border-primary/50 hover:border-primary rounded-xl p-8 flex flex-col items-center text-center transition-colors group">
            <div className="w-16 h-16 bg-black rounded-2xl border border-panel-border flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <LayoutTemplate className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">NoxstarStudios</h3>
            <p className="text-gray-400 text-sm mb-6 flex-1">
              Estudio dedicado a la creación de plugins premium, configuraciones profesionales, mapas exclusivos y servicios integrales para llevar tu servidor de Minecraft al siguiente nivel.
            </p>
            <a href="https://noxstarstudios.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:text-white transition-colors text-sm font-semibold">
              Visitar sitio web <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* NatublockHost */}
          <div className="bg-panel border border-secondary/50 hover:border-secondary rounded-xl p-8 flex flex-col items-center text-center transition-colors group">
            <div className="w-16 h-16 bg-black rounded-2xl border border-panel-border flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Server className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">NatublockHost</h3>
            <p className="text-gray-400 text-sm mb-6 flex-1">
              Alojamiento de servidores de Minecraft de alto rendimiento. Hardware de última generación, baja latencia garantizada y soporte técnico experto para tu comunidad.
            </p>
            <a href="https://natublockhost.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-secondary hover:text-white transition-colors text-sm font-semibold">
              Visitar sitio web <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Sponsors Tiers */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Donaciones Comunitarias</h2>
        <p className="text-gray-500 text-center mb-8 max-w-xl mx-auto">
          Estas donaciones son puramente para apoyar los costos del servidor y el mantenimiento. No otorgan ventajas exclusivas, ¡solo nuestro enorme agradecimiento!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* Tier 1 */}
          <div className="bg-panel border border-panel-border rounded-xl p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-1 bg-gray-600"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Café</h3>
              <Star className="w-6 h-6 text-gray-400" />
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">$1</span>
              <span className="text-gray-500 text-sm">/mes</span>
            </div>
            <p className="text-sm text-gray-400 mb-8 flex-1 leading-relaxed">
              Una pequeña ayuda simbólica. Nos motiva a seguir programando e invitarnos a un café virtual. ¡Muchas gracias por tu apoyo desinteresado!
            </p>
            <button className="w-full bg-canvas border border-panel-border hover:bg-white/5 text-white font-semibold py-2.5 rounded-lg transition-colors">
              Apoyar
            </button>
          </div>

          {/* Tier 2 */}
          <div className="bg-panel border border-yellow-500/50 rounded-xl p-8 flex flex-col relative overflow-hidden group transform md:-translate-y-4 shadow-2xl shadow-yellow-500/10">
            <div className="absolute top-0 inset-x-0 h-1 bg-yellow-500"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Pizza</h3>
              <Crown className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">$5</span>
              <span className="text-gray-500 text-sm">/mes</span>
            </div>
            <p className="text-sm text-gray-300 mb-8 flex-1 leading-relaxed">
              ¡Wow! Esto nos ayuda significativamente a pagar los servidores mensuales. No hay ventajas especiales, pero tu contribución es fundamental para que sigamos en línea.
            </p>
            <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2.5 rounded-lg transition-colors">
              Apoyar
            </button>
          </div>

          {/* Tier 3 */}
          <div className="bg-panel border border-panel-border rounded-xl p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-1 bg-primary"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Héroe</h3>
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">$10</span>
              <span className="text-gray-500 text-sm">/mes</span>
            </div>
            <p className="text-sm text-gray-400 mb-8 flex-1 leading-relaxed">
              Un apoyo enorme. Sabiendo que hay gente dispuesta a donar esta cantidad de manera desinteresada, nos da la tranquilidad para enfocarnos solo en crear buenas herramientas.
            </p>
            <button className="w-full bg-canvas border border-panel-border hover:bg-white/5 text-white font-semibold py-2.5 rounded-lg transition-colors">
              Apoyar
            </button>
          </div>

        </div>
      </div>

    </div>
    </>
  );
}
