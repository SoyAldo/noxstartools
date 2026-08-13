import React, { ErrorInfo, ReactNode, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Activity, Server, Users, Info, RefreshCw, FileJson, X,
  Copy, Check, Gamepad2, ShieldAlert, Layers, MapPin, Cpu
} from 'lucide-react';

type Edition = 'java' | 'bedrock';

// Error Boundary Component to prevent full page unmounting / black screen
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ServerStatusErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  props: ErrorBoundaryProps;
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };
  declare setState: React.Component<ErrorBoundaryProps, ErrorBoundaryState>['setState'];

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ServerStatus error caught:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-panel border border-red-500/30 rounded-xl my-6">
          <ShieldAlert className="w-12 h-12 text-red-500 mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Error inesperado al procesar los datos</h3>
          <p className="text-gray-400 text-sm max-w-md mb-4">
            Ocurrió un error al renderizar la información de este servidor.
          </p>
          <pre className="bg-black/60 p-3 rounded text-xs text-red-400 font-mono mb-4 text-left max-w-lg overflow-x-auto">
            {this.state.error?.message || 'Error desconocido'}
          </pre>
          <button
            onClick={this.handleReset}
            className="bg-primary text-gray-950 font-bold py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const fetchServerStatus = async (edition: Edition, address: string) => {
  if (!address || !address.trim()) return null;
  const cleanAddress = address.trim();
  const endpoint = edition === 'bedrock'
    ? `https://api.mcsrvstat.us/bedrock/3/${cleanAddress}`
    : `https://api.mcsrvstat.us/3/${cleanAddress}`;

  const { data } = await axios.get(endpoint, {
    headers: {
      'User-Agent': 'NoxstarTools/1.0 (https://noxstartools.com)',
    },
  });
  return data;
};

export default function ServerStatus() {
  return (
    <ServerStatusErrorBoundary>
      <ServerStatusContent />
    </ServerStatusErrorBoundary>
  );
}

function ServerStatusContent() {
  const [edition, setEdition] = useState<Edition>('java');
  const [addressInput, setAddressInput] = useState('');
  const [activeQuery, setActiveQuery] = useState<{ edition: Edition; address: string } | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showRawModal, setShowRawModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedRawJson, setCopiedRawJson] = useState(false);

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['serverStatus', activeQuery?.edition, activeQuery?.address],
    queryFn: () => activeQuery ? fetchServerStatus(activeQuery.edition, activeQuery.address) : null,
    enabled: !!activeQuery?.address,
    refetchInterval: autoRefresh ? 30000 : false,
    retry: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressInput.trim()) {
      setActiveQuery({ edition, address: addressInput.trim() });
    }
  };

  const handleSelectPreset = (presetAddress: string, presetEdition: Edition) => {
    setEdition(presetEdition);
    setAddressInput(presetAddress);
    setActiveQuery({ edition: presetEdition, address: presetAddress });
  };

  const handleCopyIpPort = (ip: string, port: number) => {
    const fullIp = port && port !== (edition === 'java' ? 25565 : 19132) ? `${ip}:${port}` : ip;
    navigator.clipboard.writeText(fullIp);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyRawJson = () => {
    if (data) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopiedRawJson(true);
      setTimeout(() => setCopiedRawJson(false), 2000);
    }
  };

  // Safe helper to render MOTD HTML / Clean text
  const renderMotd = (motd: any) => {
    if (!motd) {
      return <p className="text-gray-400 font-mono text-sm bg-black/60 p-3 rounded border border-panel-border">Sin MOTD</p>;
    }

    if (Array.isArray(motd.html) && motd.html.length > 0) {
      return (
        <div
          className="font-minecraft text-sm bg-black/60 p-3 rounded border border-panel-border whitespace-pre-wrap break-words leading-relaxed overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: motd.html.join('<br>') }}
        />
      );
    }

    if (Array.isArray(motd.clean) && motd.clean.length > 0) {
      return (
        <div className="font-mono text-sm bg-black/60 p-3 rounded border border-panel-border whitespace-pre-wrap break-words text-gray-200 leading-relaxed">
          {motd.clean.join('\n')}
        </div>
      );
    }

    if (Array.isArray(motd.raw) && motd.raw.length > 0) {
      return (
        <div className="font-mono text-sm bg-black/60 p-3 rounded border border-panel-border whitespace-pre-wrap break-words text-gray-200 leading-relaxed">
          {motd.raw.join('\n')}
        </div>
      );
    }

    if (typeof motd === 'string') {
      return (
        <div className="font-mono text-sm bg-black/60 p-3 rounded border border-panel-border whitespace-pre-wrap break-words text-gray-200">
          {motd}
        </div>
      );
    }

    return <p className="text-gray-400 font-mono text-sm bg-black/60 p-3 rounded border border-panel-border">Sin MOTD</p>;
  };

  // Safe helper for player list
  const playerList: Array<{ name: string; uuid?: string }> = React.useMemo(() => {
    if (!data?.players?.list || !Array.isArray(data.players.list)) return [];
    return data.players.list.map((item: any) => {
      if (typeof item === 'string') {
        return { name: item };
      }
      if (item && typeof item === 'object') {
        return {
          name: item.name || 'Desconocido',
          uuid: item.uuid || undefined,
        };
      }
      return { name: String(item) };
    });
  }, [data]);

  // Safe helper for Bedrock map name
  const bedrockMap = React.useMemo(() => {
    if (!data?.map) return null;
    if (typeof data.map === 'object') {
      return data.map.clean || data.map.raw || null;
    }
    return String(data.map);
  }, [data]);

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen flex flex-col p-4 pb-12 lg:p-8 lg:pb-24 gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-white">Estado del Servidor</h1>
          </div>
          <p className="text-gray-400 max-w-2xl">
            Verifica el estado en tiempo real de cualquier servidor de Minecraft (Java Edition o Bedrock Edition).
          </p>
        </div>
      </div>

      {/* Main Workspace Box */}
      <div className="flex-1 flex flex-col gap-6 pb-12 md:pb-24">
        {/* Form Box */}
        <div className="bg-panel border border-panel-border rounded-xl p-6 flex flex-col gap-5 shadow-md">
          {/* Edition Switcher Tabs */}
          <div className="flex items-center gap-3 border-b border-panel-border pb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Edición:</span>
            <div className="flex items-center bg-canvas p-1 rounded-lg border border-panel-border">
              <button
                type="button"
                onClick={() => setEdition('java')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-colors ${edition === 'java'
                    ? 'bg-primary text-gray-950 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Server className="w-4 h-4" />
                Java Edition
              </button>
              <button
                type="button"
                onClick={() => setEdition('bedrock')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-colors ${edition === 'bedrock'
                    ? 'bg-secondary text-gray-950 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Gamepad2 className="w-4 h-4" />
                Bedrock Edition
              </button>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2 block">
                Dirección del Servidor ({edition === 'java' ? 'Java' : 'Bedrock'})
              </label>
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder={edition === 'java' ? "ej. mc.hypixel.net o play.cubecraft.net:25565" : "ej. geo.hivebedrock.network o play.nethergames.org:19132"}
                className="bg-canvas border border-panel-border rounded-lg p-3 w-full text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={!addressInput.trim() || (isLoading && !isRefetching)}
              className="w-full md:w-auto bg-primary text-gray-950 font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
            >
              {(isLoading && !isRefetching) ? 'Consultando...' : 'Consultar Estado'}
            </button>
            {activeQuery && (
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isLoading || isRefetching}
                className="w-full md:w-auto bg-black border border-panel-border text-white font-bold py-3 px-6 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${(isLoading || isRefetching) ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            )}
          </form>

          {/* Presets Suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-400">
            <span className="font-medium">Servidores de prueba:</span>
            {edition === 'java' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSelectPreset('mc.hypixel.net', 'java')}
                  className="bg-canvas border border-panel-border hover:border-primary/50 text-gray-300 hover:text-primary px-2.5 py-1 rounded transition-colors font-mono"
                >
                  mc.hypixel.net
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPreset('play.cubecraft.net', 'java')}
                  className="bg-canvas border border-panel-border hover:border-primary/50 text-gray-300 hover:text-primary px-2.5 py-1 rounded transition-colors font-mono"
                >
                  play.cubecraft.net
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleSelectPreset('geo.hivebedrock.network', 'bedrock')}
                  className="bg-canvas border border-panel-border hover:border-secondary/50 text-gray-300 hover:text-secondary px-2.5 py-1 rounded transition-colors font-mono"
                >
                  geo.hivebedrock.network
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPreset('play.nethergames.org', 'bedrock')}
                  className="bg-canvas border border-panel-border hover:border-secondary/50 text-gray-300 hover:text-secondary px-2.5 py-1 rounded transition-colors font-mono"
                >
                  play.nethergames.org
                </button>
              </>
            )}
          </div>
        </div>

        {/* Results Area */}
        {!activeQuery && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-sm gap-4 py-16">
            <Server className="w-12 h-12 opacity-20" />
            <p>Ingresa una IP o selecciona un servidor de prueba para consultar su estado.</p>
          </div>
        )}

        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3 text-gray-400 text-sm">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p>Consultando API ({activeQuery?.edition === 'bedrock' ? 'Bedrock' : 'Java'})...</p>
          </div>
        )}

        {isError && (
          <div className="flex-1 flex flex-col items-center justify-center text-red-400 text-sm py-16 gap-2">
            <ShieldAlert className="w-8 h-8 text-red-500" />
            <p>Error al realizar la petición HTTP. Verifica tu conexión a internet o la dirección del servidor.</p>
          </div>
        )}

        {data && data.online && (
          <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
            {/* Server Card */}
            <div className="bg-panel border border-panel-border rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={() => setShowRawModal(true)}
                  className="flex items-center gap-2 bg-black/40 hover:bg-black/60 border border-panel-border px-3 py-1.5 rounded transition-colors"
                >
                  <FileJson className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono text-gray-300">
                    Debug {data.debug?.ping ? `(${data.debug.ping}ms)` : ''}
                  </span>
                </button>
              </div>

              {data.icon ? (
                <img
                  src={data.icon}
                  alt="Server Icon"
                  className="w-24 h-24 rounded-lg bg-black border border-panel-border shrink-0 object-contain"
                  style={{ imageRendering: 'pixelated' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-black border border-panel-border flex items-center justify-center shrink-0">
                  {activeQuery?.edition === 'bedrock' ? (
                    <Gamepad2 className="w-10 h-10 text-secondary/60" />
                  ) : (
                    <Server className="w-10 h-10 text-primary/60" />
                  )}
                </div>
              )}

              <div className="flex-1 min-w-0 w-full pt-2 md:pt-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="bg-green-500/10 border border-green-500/20 rounded px-3 py-1.5 flex items-center gap-2 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,1)]"></span>
                    <span className="text-xs text-green-400 font-bold uppercase tracking-wider">Online</span>
                  </div>

                  <div className={`border rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider shrink-0 ${activeQuery?.edition === 'bedrock'
                      ? 'bg-secondary/10 border-secondary/30 text-secondary'
                      : 'bg-primary/10 border-primary/30 text-primary'
                    }`}>
                    {activeQuery?.edition === 'bedrock' ? 'Bedrock Edition' : 'Java Edition'}
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-white truncate max-w-md">
                    {data.hostname || activeQuery?.address}
                  </h3>
                </div>

                {renderMotd(data.motd)}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Detalles del Servidor */}
              <div className="lg:col-span-2 bg-panel border border-panel-border rounded-xl p-6 shadow-lg flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Info className="w-4 h-4 text-primary" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Detalles Técnicos</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-gray-400 font-medium">Auto-refresh (30s)</label>
                    <button
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${autoRefresh ? 'bg-primary' : 'bg-gray-600'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${autoRefresh ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Jugadores */}
                  <div className="bg-canvas border border-panel-border rounded-lg p-4 flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Jugadores</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-5 h-5 text-secondary" />
                      <span className="text-lg font-bold text-white">
                        {data.players?.online ?? 0} <span className="text-gray-500 font-normal">/ {data.players?.max ?? 0}</span>
                      </span>
                    </div>
                  </div>

                  {/* Versión */}
                  <div className="bg-canvas border border-panel-border rounded-lg p-4 flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Versión Requerida</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Info className="w-5 h-5 text-primary" />
                      <span className="text-sm text-gray-200 font-mono truncate">
                        {typeof data.version === 'string' ? data.version : (data.version?.name || data.version?.version || (data.protocol?.name ? String(data.protocol.name) : 'Desconocida'))}
                      </span>
                    </div>
                  </div>

                  {/* IP y Puerto */}
                  <div className="bg-canvas border border-panel-border rounded-lg p-4 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dirección IP</span>
                      <button
                        onClick={() => handleCopyIpPort(data.ip || activeQuery?.address || '', data.port)}
                        className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1 font-sans"
                      >
                        {copiedAddress ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedAddress ? '¡Copiado!' : 'Copiar'}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Server className="w-5 h-5 text-purple-400" />
                      <span className="text-sm text-gray-200 font-mono truncate">
                        {data.ip || activeQuery?.address}
                        {data.port && data.port !== (activeQuery?.edition === 'java' ? 25565 : 19132) ? `:${data.port}` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Software / Modo / Gamemode */}
                  <div className="bg-canvas border border-panel-border rounded-lg p-4 flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {activeQuery?.edition === 'bedrock' ? 'Modo de Juego / Servidor' : 'Software / Proxy'}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {activeQuery?.edition === 'bedrock' ? (
                        <>
                          {data.gamemode && (
                            <span className="text-sm text-gray-200 font-mono bg-panel px-2 py-0.5 rounded border border-panel-border">
                              {typeof data.gamemode === 'string' ? data.gamemode : String(data.gamemode)}
                            </span>
                          )}
                          <span className="text-sm text-gray-200 font-bold bg-panel px-2 py-0.5 rounded border border-panel-border">
                            Bedrock Protocol {typeof data.protocol === 'object' && data.protocol !== null ? (data.protocol.version || data.protocol.name || '') : (data.protocol || '')}
                          </span>
                        </>
                      ) : (
                        <>
                          {data.software && (
                            <span className="text-sm text-gray-200 font-mono truncate bg-panel px-2 py-0.5 rounded border border-panel-border">
                              {data.software}
                            </span>
                          )}
                          <span className="text-sm text-gray-200 font-bold bg-panel px-2 py-0.5 rounded border border-panel-border">
                            {data.software?.toLowerCase().includes('bungee') || data.software?.toLowerCase().includes('waterfall') || data.software?.toLowerCase().includes('velocity') ? 'Proxy / Bungee' : 'Estándar'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bedrock specific: Map & ServerID */}
                  {activeQuery?.edition === 'bedrock' && (bedrockMap || data.serverid) && (
                    <div className="bg-canvas border border-panel-border rounded-lg p-4 flex flex-col gap-1 sm:col-span-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Información de Bedrock</span>
                      <div className="flex flex-wrap items-center gap-4 mt-1">
                        {bedrockMap && (
                          <div className="flex items-center gap-2 text-sm text-gray-300 font-mono bg-panel px-3 py-1 rounded border border-panel-border">
                            <MapPin className="w-4 h-4 text-secondary" />
                            <span>Mapa: {bedrockMap}</span>
                          </div>
                        )}
                        {data.serverid && (
                          <div className="flex items-center gap-2 text-sm text-gray-300 font-mono bg-panel px-3 py-1 rounded border border-panel-border">
                            <Cpu className="w-4 h-4 text-purple-400" />
                            <span>Server ID: {data.serverid}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Java specific: SRV & EULA */}
                  {activeQuery?.edition === 'java' && (data.debug?.srv !== undefined || data.eula_blocked !== undefined) && (
                    <div className="bg-canvas border border-panel-border rounded-lg p-4 flex flex-col gap-1 sm:col-span-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estado de Red y EULA</span>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        {data.debug?.srv ? (
                          <div className="flex items-center gap-1.5 text-green-400 font-bold text-sm bg-panel px-2.5 py-1 rounded border border-green-500/20">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> SRV Activo
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-gray-400 font-bold text-sm bg-panel px-2.5 py-1 rounded border border-panel-border">
                            <span className="w-2 h-2 rounded-full bg-gray-500"></span> Sin SRV
                          </div>
                        )}

                        {data.eula_blocked !== undefined && (
                          <div className={`flex items-center gap-1.5 font-bold text-sm bg-panel px-2.5 py-1 rounded border ${data.eula_blocked ? 'text-red-400 border-red-500/20' : 'text-green-400 border-green-500/20'}`}>
                            <span className={`w-2 h-2 rounded-full ${data.eula_blocked ? 'bg-red-500' : 'bg-green-500'}`}></span>
                            {data.eula_blocked ? 'EULA Bloqueado por Mojang' : 'EULA Conforme'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Plugins / Mods section if available */}
                {((data.plugins && Array.isArray(data.plugins) && data.plugins.length > 0) ||
                  (data.mods && Array.isArray(data.mods) && data.mods.length > 0)) && (
                    <div className="mt-6 pt-6 border-t border-panel-border flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Layers className="w-4 h-4 text-primary" />
                        <h4 className="text-xs font-bold uppercase tracking-widest">
                          {data.plugins?.length ? `Plugins Detectados (${data.plugins.length})` : `Mods Detectados (${data.mods?.length || 0})`}
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto custom-scrollbar p-1">
                        {(data.plugins || data.mods || []).map((mod: any, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs font-mono bg-canvas border border-panel-border px-2.5 py-1 rounded text-gray-300"
                          >
                            {typeof mod === 'string' ? mod : `${mod.name}${mod.version ? ` v${mod.version}` : ''}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Additional Info / Players list */}
              <div className="bg-panel border border-panel-border rounded-xl p-6 shadow-lg flex flex-col lg:col-span-1">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Jugadores Online ({data.players?.online ?? 0})
                </h4>
                {playerList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                    {playerList.map((player, idx) => (
                      <div
                        key={player.uuid || `${player.name}-${idx}`}
                        className="bg-canvas border border-panel-border rounded p-2 flex items-center gap-3 hover:border-primary/30 transition-colors"
                      >
                        <img
                          src={player.uuid
                            ? `https://crafatar.com/avatars/${player.uuid}?size=24&overlay=true`
                            : `https://crafatar.com/avatars/8667ba71-b85a-4004-af54-457a9734eed7?size=24&overlay=true`
                          }
                          alt={player.name}
                          className="w-6 h-6 rounded-sm bg-gray-800 border border-gray-700 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://crafatar.com/avatars/8667ba71-b85a-4004-af54-457a9734eed7?size=24&overlay=true`;
                          }}
                        />
                        <span className="text-sm font-minecraft text-gray-300 truncate" title={player.name}>
                          {player.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-sm italic py-12 gap-2 text-center">
                    <Users className="w-8 h-8 opacity-20" />
                    <p>
                      {data.players?.online && data.players.online > 0
                        ? 'El servidor no comparte la lista pública de nombres.'
                        : 'No hay jugadores conectados en este momento.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {data && !data.online && (
          <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center gap-4 py-16 animate-in fade-in">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-2 border border-red-500/20">
              <Server className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Servidor Inaccesible u Offline</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              No pudimos conectar con <strong className="text-gray-200">{activeQuery?.address}</strong> en la edición{' '}
              <strong className="text-primary">{activeQuery?.edition === 'bedrock' ? 'Bedrock' : 'Java'}</strong>.
            </p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Verifica que la IP y el puerto sean correctos, que hayas seleccionado la edición adecuada y que el servidor esté encendido.
            </p>
            {data.debug?.error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded p-3 w-full text-left">
                <p className="text-xs font-mono text-red-400 break-all">
                  Debug Error: {typeof data.debug.error === 'object' ? JSON.stringify(data.debug.error) : String(data.debug.error)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Debug / Raw JSON */}
      {showRawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-panel border border-panel-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-panel-border bg-black/40">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileJson className="w-5 h-5 text-primary" />
                Raw Data ({activeQuery?.edition}) - {data?.hostname || activeQuery?.address}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyRawJson}
                  className="flex items-center gap-1.5 bg-black/40 hover:bg-black/60 border border-panel-border px-3 py-1.5 rounded text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                >
                  {copiedRawJson ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copiedRawJson ? '¡Copiado!' : 'Copiar JSON'}
                </button>
                <button
                  onClick={() => setShowRawModal(false)}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-[#141414]">
              <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap break-all">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

