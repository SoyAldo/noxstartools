import SEO from '../components/SEO';

export default function Legal() {
  return (
    <>
      <SEO 
        title="Aviso Legal y Privacidad | NoxstarTools" 
        description="Información legal, términos de servicio y políticas de privacidad de NoxstarTools."
      />
      <div className="w-full max-w-4xl mx-auto px-4 py-12 md:py-24">
        <div className="bg-panel p-8 md:p-12 rounded-xl border border-panel-border">
          <header className="mb-12 border-b border-panel-border pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Términos de Servicio</h1>
            <p className="text-gray-400">Última actualización: Octubre 2024</p>
          </header>
          
          <div className="prose prose-invert prose-emerald max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-100 mb-4">1. Aceptación de los Términos</h2>
              <p className="text-gray-300 leading-relaxed">
                Al acceder o utilizar los servicios proporcionados por NoxstarTools ("el Servicio"), usted acepta estar sujeto a estos Términos de Servicio. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al Servicio.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-100 mb-4">2. Descripción del Servicio</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                NoxstarTools proporciona un panel de administración avanzado para servidores de juegos, ofreciendo herramientas para configuración, monitoreo y gestión de plugins.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Gestión de archivos In-Game</li>
                <li>Configuración de Mundo</li>
                <li>Gestión de Estilos TAB</li>
                <li>Generadores de configuración</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-100 mb-4">3. Privacidad y Datos</h2>
              <div className="bg-canvas p-6 rounded-lg border border-panel-border">
                <p className="text-gray-300 leading-relaxed">
                  Su privacidad es importante para nosotros. Recopilamos y utilizamos información de acuerdo con nuestra Política de Privacidad. El uso de NoxstarTools implica su consentimiento para tal procesamiento de datos. Como herramienta pública sin login, no almacenamos información de identidad personal.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
