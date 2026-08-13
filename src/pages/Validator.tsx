import { useState, useEffect } from 'react';
import { FileCheck, AlertCircle, CheckCircle2, Copy, Trash2, Wand2, Check, Minimize2 } from 'lucide-react';
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';
import { parse as tomlParse } from 'toml';
import Editor, { useMonaco, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import SEO from '../components/SEO';

// Prevenir problemas de CDN cargando Monaco de forma local
loader.config({ monaco });

export default function Validator() {
  const [format, setFormat] = useState('yaml');
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [errorDetails, setErrorDetails] = useState<{message: string, line?: number, column?: number, snippet?: string} | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastLength, setLastLength] = useState(0);
  
  const monaco = useMonaco();

  // Format Auto-Detection
  useEffect(() => {
    if (input.length > 10 && (Math.abs(input.length - lastLength) > 5)) {
      const trimmed = input.trim();
      
      // Try JSON
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
          (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
          JSON.parse(input);
          if (format !== 'json') setFormat('json');
          setLastLength(input.length);
          return;
        } catch(e) {}
      }
      
      // Try TOML
      if (trimmed.includes('=') && (trimmed.startsWith('[') || /^[a-zA-Z0-9_-]+\s*=/.test(trimmed))) {
         try {
           tomlParse(input);
           if (format !== 'toml') setFormat('toml');
           setLastLength(input.length);
           return;
         } catch(e) {}
      }
      
      // Try YAML
      try {
         const parsed = yamlLoad(input);
         if (parsed && typeof parsed === 'object' && !trimmed.startsWith('{') && !trimmed.startsWith('[')) {
           if (format !== 'yaml') setFormat('yaml');
           setLastLength(input.length);
           return;
         }
      } catch(e) {}
    }
    setLastLength(input.length);
  }, [input, format, lastLength]);

  useEffect(() => {
    if (!input.trim()) {
      setStatus('idle');
      setErrorDetails(null);
      return;
    }

    try {
      if (format === 'json') {
        JSON.parse(input);
      } else if (format === 'yaml') {
        yamlLoad(input);
      } else if (format === 'toml') {
        tomlParse(input);
      }
      setStatus('valid');
      setErrorDetails(null);
    } catch (e: any) {
      setStatus('invalid');
      
      let detail = { message: e.message || 'Error de sintaxis', line: undefined as number | undefined, column: undefined as number | undefined, snippet: undefined as string | undefined };
      
      if (format === 'yaml' && e.mark) {
        detail.line = e.mark.line + 1;
        detail.column = e.mark.column + 1;
        detail.snippet = e.mark.snippet;
        detail.message = e.reason || e.message;
      } else if (format === 'toml' && e.line) {
        detail.line = e.line;
        detail.column = e.column;
      } else if (format === 'json') {
        // try to extract line/column from JSON error if possible
        const match = e.message.match(/at line (\d+) column (\d+)/);
        if (match) {
           detail.line = parseInt(match[1]);
           detail.column = parseInt(match[2]);
        }
      }
      
      setErrorDetails(detail);
    }
  }, [input, format]);

  useEffect(() => {
    if (!monaco) return;
    const model = monaco.editor.getModels()[0];
    if (!model) return;

    if (status === 'invalid' && errorDetails) {
      const line = errorDetails.line || 1;
      const column = errorDetails.column || 1;
      monaco.editor.setModelMarkers(model, 'validator', [{
        startLineNumber: line,
        startColumn: column,
        endLineNumber: line,
        endColumn: model.getLineMaxColumn(line) || column + 1,
        message: errorDetails.message,
        severity: monaco.MarkerSeverity.Error,
      }]);
    } else {
      monaco.editor.setModelMarkers(model, 'validator', []);
    }
  }, [monaco, status, errorDetails, format]);

  const handleCopy = () => {
    if (!input) return;
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
  };

  const handleFormat = () => {
    if (!input.trim() || status !== 'valid') return;
    try {
      if (format === 'json') {
        setInput(JSON.stringify(JSON.parse(input), null, 2));
      } else if (format === 'yaml') {
        setInput(yamlDump(yamlLoad(input)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMinify = () => {
    if (format !== 'json' || status !== 'valid' || !input.trim()) return;
    try {
      setInput(JSON.stringify(JSON.parse(input)));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <SEO 
        title="Validador de Configuración (YAML/JSON) | NoxstarTools" 
        description="Verifica y valida archivos YAML y JSON para evitar errores en la configuración de tus plugins de Minecraft."
      />
      <div className="w-full max-w-7xl mx-auto min-h-screen flex flex-col p-4 lg:p-8 gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-center gap-3">
             <FileCheck className="w-8 h-8 text-primary" />
             <h1 className="text-3xl font-bold text-white">Validador de Archivos</h1>
          </div>
          <p className="text-gray-400 max-w-2xl">
            Verifica la sintaxis en tiempo real para JSON, YAML y TOML.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
            {/* Status indicator */}
            <div className="flex-1 sm:flex-none flex justify-end">
              {status === 'idle' && (
                <span className="flex items-center gap-2 text-gray-500 text-sm px-3 py-1.5 bg-canvas rounded-lg border border-panel-border shadow-inner font-medium">
                  <AlertCircle className="w-4 h-4" />
                  Esperando
                </span>
              )}
              {status === 'valid' && (
                <span className="flex items-center gap-2 text-green-400 text-sm px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/20 font-bold tracking-wide shadow-sm shadow-green-500/10">
                  <CheckCircle2 className="w-4 h-4" />
                  Válido
                </span>
              )}
              {status === 'invalid' && (
                <span className="flex items-center gap-2 text-red-400 text-sm px-3 py-1.5 bg-red-500/10 rounded-lg border border-red-500/20 font-bold tracking-wide shadow-sm shadow-red-500/10" title={errorDetails?.message}>
                  <AlertCircle className="w-4 h-4" />
                  Error{errorDetails?.line ? ` (Línea ${errorDetails.line})` : ''}
                </span>
              )}
            </div>
            
            <div className="h-8 w-px bg-panel-border hidden sm:block"></div>
            
            <select 
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="bg-canvas border border-panel-border rounded-lg px-4 py-2 text-white text-sm font-bold focus:outline-none focus:border-primary transition-all cursor-pointer uppercase tracking-wider"
            >
              <option value="yaml">YAML</option>
              <option value="json">JSON</option>
              <option value="toml">TOML</option>
            </select>
        </div>
      </div>

      {/* Main Workspace Box */}
      <div className="bg-panel border border-panel-border rounded-xl shadow-lg flex flex-col overflow-hidden flex-1 min-h-[500px]">
        {/* Editor Body */}
        <div className="flex-1 relative flex flex-col min-h-0 bg-[#1e1e1e]">
           {/* Top macos-like bar */}
           <div className="bg-[#252526] px-4 py-2.5 border-b border-[#333] flex flex-wrap justify-between items-center shrink-0 gap-3">
             <div className="flex items-center gap-4">
               <div className="flex gap-2 hidden sm:flex">
                 <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500/50"></div>
               </div>
               <span className="font-mono text-xs text-gray-500 uppercase tracking-widest font-semibold">editor.{format}</span>
             </div>
             
             <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleFormat}
                  disabled={status !== 'valid' || !input.trim() || format === 'toml'}
                  title={format === 'toml' ? "Formato no disponible para TOML" : "Dar formato"}
                  className="flex items-center justify-center p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Wand2 className="w-4 h-4" />
                </button>
                {format === 'json' && (
                  <button
                    onClick={handleMinify}
                    disabled={status !== 'valid' || !input.trim()}
                    title="Minificar JSON"
                    className="flex items-center justify-center p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleCopy}
                  disabled={!input.trim()}
                  title="Copiar contenido"
                  className="flex items-center justify-center p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <div className="w-px h-4 bg-gray-700 mx-1"></div>
                <button
                  onClick={handleClear}
                  disabled={!input}
                  title="Limpiar"
                  className="flex items-center justify-center p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
             </div>
           </div>
           <div className="flex-1 overflow-hidden relative min-h-0 w-full flex flex-col">
              {input.length === 0 && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-gray-500/50 z-10" style={{ paddingBottom: '10%' }}>
                  <p className="font-mono text-sm">Pega aquí tu código {format.toUpperCase()}...</p>
                </div>
              )}
              <div className="absolute inset-0">
                <Editor
                  loading={<div className="flex h-full items-center justify-center text-gray-500 font-mono text-sm">Cargando editor...</div>}
                  height="100%"
                  language={format === 'toml' ? 'ini' : format}
                  theme="vs-dark"
                  value={input}
                  onChange={(value) => setInput(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    wordWrap: 'on',
                    lineNumbersMinChars: 4,
                    padding: { top: 16, bottom: 16 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",
                    formatOnPaste: true,
                    renderLineHighlight: "all",
                  }}
                />
              </div>
           </div>
           
           {/* Bottom error pane if invalid */}
           {status === 'invalid' && errorDetails && (
              <div className="shrink-0 bg-[#1e1e1e] border-t border-red-900/30 p-4 max-h-48 overflow-y-auto">
                 <div className="flex items-start gap-3 text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="w-full min-w-0">
                      <p className="font-bold text-red-300">Error de Sintaxis</p>
                      <p className="mt-1 font-medium">{errorDetails.message}</p>
                      
                      {(errorDetails.line !== undefined || errorDetails.column !== undefined) && (
                        <div className="mt-3 flex gap-4 text-xs font-mono text-red-300/80 bg-black/40 px-3 py-1.5 rounded w-fit border border-red-500/10">
                          {errorDetails.line !== undefined && <span>Línea: {errorDetails.line}</span>}
                          {errorDetails.column !== undefined && <span>Columna: {errorDetails.column}</span>}
                        </div>
                      )}
                    </div>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
    </>
  );
}
