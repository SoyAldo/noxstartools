import React from 'react';
import { Box } from 'lucide-react';
import SEO from '../components/SEO';

export default function Plugins() {
  return (
    <>
      <SEO 
        title="Plantillas de Plugins | NoxstarTools" 
        description="Encuentra plantillas y configuraciones para menús GUI, hologramas y sistemas de economía de servidores de Minecraft."
      />
      <div className="w-full max-w-7xl mx-auto min-h-screen flex flex-col p-4 lg:p-8 gap-6 animate-in fade-in duration-500">
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-center gap-3">
            <Box className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-white">Plugins Comunes</h1>
          </div>
          <p className="text-gray-400 max-w-2xl">
            Plantillas y configuraciones para menús GUI, hologramas y sistemas de economía.
          </p>
        </div>

        <div className="flex-1 bg-panel border border-panel-border rounded-xl p-12 flex flex-col items-center justify-center text-center gap-4">
          <Box className="w-16 h-16 text-primary/40" />
          <h3 className="text-xl font-bold text-white">Próximamente</h3>
          <p className="text-gray-400 text-sm max-w-md">
            Esta sección se encuentra en desarrollo. Pronto podrás consultar plantillas de plugins populares.
          </p>
        </div>
      </div>
    </>
  );
}
