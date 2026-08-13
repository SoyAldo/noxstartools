import React, { useState, useRef, useEffect } from 'react';
import { Palette, Copy, Plus, Trash2, Code, Download, Upload, GripVertical } from 'lucide-react';
import SEO from '../components/SEO';

type FormatType = 'minimessage' | 'legacy-ampersand' | 'legacy' | 'bbcode';

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

function interpolateColor(color1: string, color2: string, factor: number) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  if (!c1 || !c2) return color1;
  const result = {
    r: Math.round(c1.r + factor * (c2.r - c1.r)),
    g: Math.round(c1.g + factor * (c2.g - c1.g)),
    b: Math.round(c1.b + factor * (c2.b - c1.b))
  };
  return rgbToHex(result.r, result.g, result.b);
}

function getInterpolatedColor(sortedStops: ColorStop[], position: number) {
  if (sortedStops.length === 0) return '#ffffff';
  if (sortedStops.length === 1) return sortedStops[0].color;

  if (position <= sortedStops[0].position) return sortedStops[0].color;
  if (position >= sortedStops[sortedStops.length - 1].position) return sortedStops[sortedStops.length - 1].color;

  for (let i = 0; i < sortedStops.length - 1; i++) {
    const s1 = sortedStops[i];
    const s2 = sortedStops[i + 1];

    if (position >= s1.position && position <= s2.position) {
      const range = s2.position - s1.position;
      if (range === 0) return s1.color;
      const factor = (position - s1.position) / range;
      return interpolateColor(s1.color, s2.color, factor);
    }
  }
  return '#ffffff';
}

function generateGradientColors(stops: ColorStop[], count: number) {
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  if (count <= 1) return [getInterpolatedColor(sortedStops, 0)];

  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const position = (i / (count - 1)) * 100;
    result.push(getInterpolatedColor(sortedStops, position));
  }
  return result;
}

export default function HexGenerator() {
  const [text, setText] = useState('NoxstarTools.com');
  const [stops, setStops] = useState<ColorStop[]>([
    { id: '1', color: '#54daf4', position: 0 },
    { id: '2', color: '#545eb6', position: 100 }
  ]);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const [format, setFormat] = useState<FormatType>('minimessage');

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [draggedListId, setDraggedListId] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!draggingId) return;

    const handleMove = (clientX: number) => {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      let newPos = ((clientX - rect.left) / rect.width) * 100;
      newPos = Math.max(0, Math.min(100, newPos));

      setStops(prev => prev.map(s => s.id === draggingId ? { ...s, position: newPos } : s));
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

    const handleUp = () => setDraggingId(null);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleUp);
    };
  }, [draggingId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generateOutput());
  };

  const generateOutput = () => {
    if (!text) return '';
    let output = '';
    const textChars = text.split('');
    const textColors = generateGradientColors(stops, Math.max(textChars.filter(c => c !== ' ').length, 1));

    let legacyFormatCode = '';
    if (isBold) legacyFormatCode += '&l';
    if (isItalic) legacyFormatCode += '&o';
    if (isUnderline) legacyFormatCode += '&n';
    if (isStrikethrough) legacyFormatCode += '&m';

    if (format === 'minimessage') {
      if (isBold) output += '<bold>';
      if (isItalic) output += '<italic>';
      if (isUnderline) output += '<underlined>';
      if (isStrikethrough) output += '<strikethrough>';
    }

    let colorIndex = 0;
    for (let i = 0; i < textChars.length; i++) {
      const char = textChars[i];
      if (char === ' ') {
        output += char;
        continue;
      }

      const hex = textColors[colorIndex++];
      if (format === 'minimessage') {
        output += `<${hex}>${char}`;
      } else if (format === 'legacy-ampersand') {
        output += `&#${hex.slice(1)}${legacyFormatCode}${char}`;
      } else if (format === 'legacy') {
        const hexCodes = hex.slice(1).split('').map(c => `&${c}`).join('');
        output += `&x${hexCodes}${legacyFormatCode}${char}`;
      } else if (format === 'bbcode') {
        output += `[COLOR=${hex}]${char}[/COLOR]`;
      }
    }

    if (format === 'bbcode') {
      if (isBold) output = `[B]${output}[/B]`;
      if (isItalic) output = `[I]${output}[/I]`;
      if (isUnderline) output = `[U]${output}[/U]`;
      if (isStrikethrough) output = `[S]${output}[/S]`;
    }

    return output;
  };

  const addColorStop = () => {
    if (stops.length < 10) {
      const newId = Math.random().toString(36).substr(2, 9);
      setStops([...stops, { id: newId, color: '#ffffff', position: 50 }]);
    }
  };

  const removeColorStop = (id: string) => {
    if (stops.length > 2) {
      setStops(stops.filter(s => s.id !== id));
    }
  };

  const updateColorStop = (id: string, val: string) => {
    setStops(stops.map(s => s.id === id ? { ...s, color: val } : s));
  };

  const exportPreset = () => {
    const preset = { text, stops, isBold, isItalic, isUnderline, isStrikethrough, format };
    const blob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gradient-preset.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportPreset = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.text !== undefined) setText(data.text);

        if (data.stops && Array.isArray(data.stops)) {
          setStops(data.stops);
        } else if (data.colors && Array.isArray(data.colors)) {
          setStops(data.colors.map((c: string, i: number) => ({
            id: Math.random().toString(36).substr(2, 9),
            color: c,
            position: i === 0 ? 0 : i === data.colors.length - 1 ? 100 : (i / (data.colors.length - 1)) * 100
          })));
        }

        if (data.isBold !== undefined) setIsBold(data.isBold);
        if (data.isItalic !== undefined) setIsItalic(data.isItalic);
        if (data.isUnderline !== undefined) setIsUnderline(data.isUnderline);
        if (data.isStrikethrough !== undefined) setIsStrikethrough(data.isStrikethrough);
        if (data.format !== undefined) setFormat(data.format);
      } catch (err) {
        console.error('Failed to parse preset', err);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderedPreviewChars = () => {
    const textChars = text.split('');
    const textColors = generateGradientColors(stops, Math.max(textChars.filter(c => c !== ' ').length, 1));
    let colorIndex = 0;
    return textChars.map((char, i) => {
      const isSpace = char === ' ';
      return (
        <span key={i} style={{ color: isSpace ? 'inherit' : textColors[colorIndex++] }}>
          {isSpace ? '\u00A0' : char}
        </span>
      );
    });
  };

  return (
    <>
      <SEO 
        title="Generador Hexadecimal de Gradientes - NoxstarTools" 
        description="Crea gradientes y textos a color para plugins de Minecraft como MiniMessage o Legacy de forma visual y rápida."
      />
      <div className="w-full max-w-7xl mx-auto min-h-screen flex flex-col p-4 pb-12 lg:p-8 lg:pb-24 gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-center gap-3">
            <Palette className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-white">Generador Hexadecimal</h1>
          </div>
          <p className="text-gray-400 max-w-2xl">
            Genera textos con gradientes de color hexadecimales para tu servidor de Minecraft usando diferentes formatos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".json"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImportPreset}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-canvas border border-panel-border text-gray-300 px-3 py-2 rounded-lg hover:bg-panel transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Upload className="w-4 h-4" /> Importar
          </button>
          <button
            onClick={exportPreset}
            className="bg-canvas border border-panel-border text-gray-300 px-3 py-2 rounded-lg hover:bg-panel transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>

      {/* Main Workspace Box */}
      <div className="bg-panel border border-panel-border rounded-xl shadow-lg flex flex-col overflow-hidden flex-shrink-0">

        {/* Input Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-center border-b border-panel-border p-4 gap-4 bg-black/40">
          <div className="flex items-center gap-1 bg-canvas rounded-lg p-1 border border-panel-border flex-shrink-0">
            <button onClick={() => setIsBold(!isBold)} className={`p-2 rounded transition-colors ${isBold ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'}`} title="Negrita">
              <strong className="font-serif text-lg leading-none block">B</strong>
            </button>
            <button onClick={() => setIsItalic(!isItalic)} className={`p-2 rounded transition-colors ${isItalic ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'}`} title="Cursiva">
              <em className="font-serif italic text-lg leading-none block">I</em>
            </button>
            <button onClick={() => setIsUnderline(!isUnderline)} className={`p-2 rounded transition-colors ${isUnderline ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'}`} title="Subrayado">
              <u className="font-serif text-lg leading-none block">U</u>
            </button>
            <button onClick={() => setIsStrikethrough(!isStrikethrough)} className={`p-2 rounded transition-colors ${isStrikethrough ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'}`} title="Tachado">
              <s className="font-serif text-lg leading-none block">S</s>
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="p-4 sm:p-8 relative flex items-center justify-center min-h-[160px] bg-[#1a1a1a] overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="relative z-10 w-full max-w-full flex justify-center overflow-x-auto custom-scrollbar py-4">
            <div
              className="relative inline-block min-w-[200px] text-4xl sm:text-5xl md:text-6xl text-center"
              style={{ fontFamily: "'Minecraft', sans-serif" }}
            >
              {/* Background text (Gradient) */}
              <div
                className="whitespace-pre pointer-events-none"
                style={{
                  textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal',
                  textDecoration: [isUnderline ? 'underline' : '', isStrikethrough ? 'line-through' : ''].filter(Boolean).join(' ') || 'none',
                  padding: '0.2em 0.1em',
                }}
              >
                {text ? renderedPreviewChars() : <span className="text-gray-600 opacity-50">Texto aquí...</span>}
              </div>

              {/* Overlay Input */}
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                spellCheck={false}
                className="absolute inset-0 w-full h-full bg-transparent outline-none text-center"
                style={{
                  color: 'transparent',
                  caretColor: 'white',
                  textShadow: 'none',
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal',
                  letterSpacing: 'inherit',
                  padding: '0.2em 0.1em',
                }}
              />
            </div>
          </div>
        </div>

        {/* Slider Area */}
        <div className="px-6 py-5 bg-black/40 border-t border-panel-border">
          <div
            ref={sliderRef}
            className="h-4 relative rounded-full border border-panel-border shadow-inner cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${[...stops].sort((a, b) => a.position - b.position).map(s => `${s.color} ${s.position}%`).join(', ')})`
            }}
          >
            {stops.map((stop) => (
              <div
                key={stop.id}
                onMouseDown={() => setDraggingId(stop.id)}
                onTouchStart={() => setDraggingId(stop.id)}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 bg-white cursor-grab active:cursor-grabbing shadow-lg flex items-center justify-center ${draggingId === stop.id ? 'border-primary ring-2 ring-primary/50 z-20 scale-125' : 'border-gray-300 z-10'} transition-transform`}
                style={{ left: `${stop.position}%`, backgroundColor: stop.color }}
              >
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Section: Colors & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12 md:pb-24">
        
        {/* Column 1: Colors (1 span) */}
        <div className="bg-panel border border-panel-border rounded-xl shadow-lg flex flex-col overflow-hidden lg:col-span-1">
          <div className="p-4 border-b border-panel-border bg-black/20 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-gray-400" /> Colores
            </h3>
            <button
              onClick={addColorStop}
              disabled={stops.length >= 10}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Añadir
            </button>
          </div>
          <div className="p-5 flex flex-col gap-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {[...stops].sort((a, b) => a.position - b.position).map((stop, i) => (
              <div 
                key={stop.id} 
                className={`flex items-center gap-2 p-1 -mx-1 rounded-lg transition-colors ${draggedListId === stop.id ? 'opacity-50 bg-white/5 border border-dashed border-gray-500' : 'border border-transparent'}`}
                draggable
                onDragStart={(e) => {
                  setDraggedListId(stop.id);
                  e.dataTransfer.setData('text/plain', stop.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (draggedListId && draggedListId !== stop.id) {
                    e.currentTarget.classList.add('bg-white/10');
                  }
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('bg-white/10');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('bg-white/10');
                  if (!draggedListId || draggedListId === stop.id) return;
                  const draggedStop = stops.find(s => s.id === draggedListId);
                  const targetStop = stops.find(s => s.id === stop.id);
                  if (!draggedStop || !targetStop) return;
                  setStops(prev => prev.map(s => {
                    if (s.id === draggedListId) return { ...s, position: targetStop.position };
                    if (s.id === stop.id) return { ...s, position: draggedStop.position };
                    return s;
                  }));
                  setDraggedListId(null);
                }}
                onDragEnd={() => setDraggedListId(null)}
              >
                <div className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-white transition-colors p-1">
                  <GripVertical className="w-4 h-4" />
                </div>
                <span className="text-gray-500 font-mono text-sm w-4">{i + 1}</span>
                <div className="flex-1 flex items-center gap-2 bg-canvas border border-panel-border rounded-lg p-1.5 focus-within:border-primary transition-colors">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateColorStop(stop.id, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-none p-0 bg-transparent flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={stop.color}
                    onChange={(e) => updateColorStop(stop.id, e.target.value)}
                    className="bg-transparent text-white font-mono text-sm w-full focus:outline-none uppercase"
                    maxLength={7}
                  />
                  <button
                    onClick={() => removeColorStop(stop.id)}
                    disabled={stops.length <= 2}
                    className="p-1.5 text-gray-500 hover:text-red-400 disabled:opacity-30 rounded-md hover:bg-panel transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Output (2 span) */}
        <div className="bg-panel border border-panel-border rounded-xl shadow-lg flex flex-col overflow-hidden lg:col-span-2">
          <div className="p-4 border-b border-panel-border bg-black/20 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-gray-400" /> Salida
            </h3>
            <div className="flex items-center gap-3">
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as FormatType)}
                className="bg-canvas text-white border border-panel-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
              >
                <option value="minimessage">MiniMessage</option>
                <option value="legacy-ampersand">Legacy (&amp;)</option>
                <option value="legacy">Legacy (&amp;x)</option>
                <option value="bbcode">BBCode</option>
              </select>
              <button
                onClick={handleCopy}
                className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 px-3 py-1.5 rounded transition-colors flex items-center gap-2 text-sm font-semibold"
              >
                <Copy className="w-4 h-4" /> Copiar
              </button>
            </div>
          </div>
          <div className="p-4 flex-1 bg-canvas relative min-h-[200px]">
            <textarea
              value={generateOutput()}
              readOnly
              className="w-full h-full min-h-[150px] bg-transparent text-gray-300 font-mono text-sm resize-none focus:outline-none custom-scrollbar break-all whitespace-pre-wrap"
            />
          </div>
        </div>

      </div>
    </div>
    </>
  );
}
