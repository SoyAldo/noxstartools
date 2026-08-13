import { useState } from 'react';
import { Activity, Search, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AnalysisResult {
  title: string;
  type: 'danger' | 'warning' | 'success' | 'info';
  description: string;
}

export default function SparkAnalyzer() {
  const [inputData, setInputData] = useState('');
  const [results, setResults] = useState<AnalysisResult[] | null>(null);

  const analyzeTimings = () => {
    if (!inputData.trim()) return;

    const data = inputData.toLowerCase();
    const newResults: AnalysisResult[] = [];

    // Basic heuristic analysis based on common Spark timings output text
    
    // Check TPS
    const tpsMatch = data.match(/tps[:\s]*(\d+\.?\d*)/);
    if (tpsMatch) {
      const tps = parseFloat(tpsMatch[1]);
      if (tps < 15) {
        newResults.push({
          title: `TPS Crítico (${tps})`,
          type: 'danger',
          description: 'El servidor está experimentando caídas severas de TPS. El rendimiento general es bajo, causando lag visible para los jugadores.'
        });
      } else if (tps < 19) {
        newResults.push({
          title: `TPS Bajo (${tps})`,
          type: 'warning',
          description: 'El servidor tiene ligeras caídas de TPS. Podrían notarse retrasos menores.'
        });
      } else {
        newResults.push({
          title: `TPS Estable (${tps})`,
          type: 'success',
          description: 'El servidor está manteniendo un TPS óptimo.'
        });
      }
    }

    // Check Entities
    if (data.includes('tickentities') || data.includes('minecraft:tick') || data.includes('entitytick')) {
      newResults.push({
        title: 'Carga de Entidades',
        type: 'warning',
        description: 'Se detecta uso intensivo en el procesamiento de entidades. Considera reducir el límite de entidades o granjas (mob caps) en tus archivos de configuración (bukkit.yml / spigot.yml / paper.yml).'
      });
    }

    // Check GC / Garbage Collection
    if (data.includes('garbage collector') || data.includes('g1 young generation') || data.includes('gc')) {
      newResults.push({
        title: 'Garbage Collector (Memoria)',
        type: 'warning',
        description: 'La recolección de basura (GC) está consumiendo tiempo de CPU. Esto suele indicar que el servidor necesita más memoria o tiene fugas de memoria (memory leaks). Revisa tus banderas de inicio de Java (Aikar flags).'
      });
    }

    // Check Hoppers / Redstone
    if (data.includes('hopper') || data.includes('blockentitytick')) {
      newResults.push({
        title: 'Tolvas y Redstone',
        type: 'warning',
        description: 'Las tolvas o mecanismos de redstone están causando impacto en el rendimiento. Ajusta los ticks de hopper en paper.yml para aliviar la carga.'
      });
    }

    // Check Network I/O / Web Requests
    if (data.includes('java.net') || data.includes('urlconnection')) {
      newResults.push({
        title: 'Peticiones Web Bloqueantes',
        type: 'danger',
        description: 'Un plugin está realizando peticiones web en el hilo principal del servidor. Esto congela el servidor por completo hasta que responde la conexión. Contacta al autor del plugin responsable.'
      });
    }
    
    // Chunk generation
    if (data.includes('chunkprovider') || data.includes('worldgen')) {
      newResults.push({
        title: 'Generación de Chunks',
        type: 'warning',
        description: 'Se está generando terreno de forma sincrónica. Pre-generar el mapa (usando plugins como Chunky) mejorará drásticamente el rendimiento cuando los jugadores exploren.'
      });
    }

    if (newResults.length === 0) {
      newResults.push({
        title: 'Sin problemas detectados',
        type: 'info',
        description: 'No se encontraron patrones de lag conocidos en el fragmento proporcionado. Intenta pegar una sección más detallada del árbol de llamadas de Spark.'
      });
    }

    setResults(newResults);
  };

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen flex flex-col p-4 lg:p-8 gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-center gap-3">
             <Activity className="w-8 h-8 text-primary" />
             <h1 className="text-3xl font-bold text-white">Analizador de Spark Timings</h1>
          </div>
          <p className="text-gray-400 max-w-2xl">
            Pega el reporte textual de tu perfil de Spark para descubrir problemas de rendimiento (Lag).
          </p>
        </div>
      </div>

      {/* Main Workspace Box */}
      <div className="bg-panel border border-panel-border rounded-xl shadow-lg p-5 flex flex-col gap-4">
        <label className="text-sm font-semibold text-gray-300">Reporte o resumen de Spark</label>
        <textarea
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder="Pega aquí el texto de tu árbol de Spark o las métricas principales (ej. TPS: 14.5, Garbage Collector, EntityTick...)"
          className="w-full h-48 bg-canvas border border-panel-border rounded-lg p-4 text-sm text-gray-200 focus:outline-none focus:border-primary resize-y font-mono"
        />
        <div className="flex justify-end">
          <button
            onClick={analyzeTimings}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dim text-canvas font-bold px-6 py-2.5 rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
            Analizar Timings
          </button>
        </div>
      </div>

      {results && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-100 mt-6 mb-2">Resultados del Análisis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((result, i) => {
              let Icon = Info;
              let bgClass = 'bg-blue-500/10 border-blue-500/20 text-blue-400';
              
              if (result.type === 'danger') {
                Icon = AlertTriangle;
                bgClass = 'bg-red-500/10 border-red-500/20 text-red-400';
              } else if (result.type === 'warning') {
                Icon = AlertTriangle;
                bgClass = 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
              } else if (result.type === 'success') {
                Icon = CheckCircle;
                bgClass = 'bg-green-500/10 border-green-500/20 text-green-400';
              }

              return (
                <div key={i} className={`p-4 rounded-xl border ${bgClass} flex gap-4`}>
                  <Icon className="w-6 h-6 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-sm uppercase tracking-wide">{result.title}</h3>
                    <p className="text-sm opacity-90 leading-relaxed">{result.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="bg-canvas border border-panel-border rounded-xl p-5 text-sm text-gray-400">
        <h4 className="font-bold text-gray-200 mb-2">¿Cómo usar esto?</h4>
        <p className="mb-2">1. Genera un reporte usando el comando <code className="bg-panel px-1.5 py-0.5 rounded text-gray-300">/spark profiler</code> en tu servidor de Minecraft.</p>
        <p className="mb-2">2. Abre el link generado en tu navegador.</p>
        <p>3. Selecciona la pestaña "Botton-up" o el árbol principal, copia el texto de las entradas que más porcentaje consumen y pégalas aquí para identificar su causa común.</p>
      </div>
    </div>
  );
}
