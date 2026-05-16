'use client';

import React, { useEffect, useRef, useState, useId, useCallback } from 'react';

interface MermaidDiagramProps {
  content: string;
  id: string;
}

const BASE_SCALE = 1.6;
const MIN_SCALE = 0.3;
const MAX_SCALE = 6.4;
const ZOOM_STEP = 0.2;

interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  size: number;
}

interface Note {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

type Tool = 'select' | 'pen' | 'note';

const PEN_COLORS = [
  { value: '#7C3AED', label: 'Violet' },
  { value: '#DC2626', label: 'Red' },
  { value: '#2563EB', label: 'Blue' },
  { value: '#059669', label: 'Green' },
  { value: '#D97706', label: 'Amber' },
  { value: '#0F172A', label: 'Black' },
];

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ content, id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const annoCanvasRef = useRef<HTMLCanvasElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRenderingRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [renderNonce, setRenderNonce] = useState(0);
  const stableId = useId();

  // Pan/zoom
  const [scale, setScale] = useState(BASE_SCALE);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const translateStart = useRef({ x: 0, y: 0 });

  // Fullscreen + annotation
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [penColor, setPenColor] = useState('#7C3AED');
  const [penSize, setPenSize] = useState(2);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [draggingNote, setDraggingNote] = useState<string | null>(null);
  const noteDragStart = useRef({ x: 0, y: 0, noteX: 0, noteY: 0 });
  const isDrawingRef = useRef(false);

  // Coord conversion: screen ↔ diagram
  const screenToDiagram = useCallback((sx: number, sy: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (sx - rect.left - rect.width / 2 - translate.x) / scale,
      y: (sy - rect.top - rect.height / 2 - translate.y) / scale,
    };
  }, [scale, translate]);

  const diagramToScreen = useCallback((dx: number, dy: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: dx * scale + translate.x + rect.width / 2,
      y: dy * scale + translate.y + rect.height / 2,
    };
  }, [scale, translate]);

  // Render annotation strokes on canvas
  useEffect(() => {
    const canvas = annoCanvasRef.current;
    if (!canvas) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes;
    for (const stroke of allStrokes) {
      if (stroke.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size * Math.max(scale / BASE_SCALE, 0.5);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let i = 0; i < stroke.points.length; i++) {
        const { x: sx, y: sy } = diagramToScreen(stroke.points[i].x, stroke.points[i].y);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }
  }, [strokes, currentStroke, scale, translate, diagramToScreen, isFullscreen]);

  const resetView = useCallback(() => {
    setScale(BASE_SCALE);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const zoomIn = useCallback(() => setScale(s => Math.min(s + ZOOM_STEP, MAX_SCALE)), []);
  const zoomOut = useCallback(() => setScale(s => Math.max(s - ZOOM_STEP, MIN_SCALE)), []);

  // Block page scroll when hovering canvas, handle zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blockScroll = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      setScale(prevScale => {
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        const newScale = Math.min(Math.max(prevScale + delta, MIN_SCALE), MAX_SCALE);
        const ratio = newScale / prevScale;
        setTranslate(prev => ({ x: mx - ratio * (mx - prev.x), y: my - ratio * (my - prev.y) }));
        return newScale;
      });
    };
    canvas.addEventListener('wheel', blockScroll, { passive: false });
    return () => canvas.removeEventListener('wheel', blockScroll);
  }, [isFullscreen]);

  // Pan handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (activeTool !== 'select' && isFullscreen) return;
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    translateStart.current = { ...translate };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [translate, activeTool, isFullscreen]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setTranslate({
      x: translateStart.current.x + (e.clientX - dragStart.current.x),
      y: translateStart.current.y + (e.clientY - dragStart.current.y),
    });
  }, [isDragging]);

  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  // Drawing handlers
  const handleAnnoPointerDown = useCallback((e: React.PointerEvent) => {
    if (activeTool === 'pen') {
      isDrawingRef.current = true;
      const pt = screenToDiagram(e.clientX, e.clientY);
      setCurrentStroke({ points: [pt], color: penColor, size: penSize });
    } else if (activeTool === 'note') {
      const pt = screenToDiagram(e.clientX, e.clientY);
      const newNote: Note = {
        id: `note-${Date.now()}`,
        x: pt.x,
        y: pt.y,
        text: '',
        color: penColor,
      };
      setNotes(prev => [...prev, newNote]);
      setEditingNote(newNote.id);
      setActiveTool('select');
    }
  }, [activeTool, penColor, penSize, screenToDiagram]);

  const handleAnnoPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDrawingRef.current || !currentStroke) return;
    const pt = screenToDiagram(e.clientX, e.clientY);
    setCurrentStroke(prev => prev ? { ...prev, points: [...prev.points, pt] } : null);
  }, [currentStroke, screenToDiagram]);

  const handleAnnoPointerUp = useCallback(() => {
    if (currentStroke && currentStroke.points.length >= 2) {
      setStrokes(prev => [...prev, currentStroke]);
    }
    setCurrentStroke(null);
    isDrawingRef.current = false;
  }, [currentStroke]);

  // Save as image — capture exactly what's on screen
  const handleSaveImage = useCallback(async () => {
    const svgEl = containerRef.current?.querySelector('svg');
    const wbEl = canvasRef.current;
    if (!svgEl || !wbEl) return;

    const wbRect = wbEl.getBoundingClientRect();
    const svgRect = svgEl.getBoundingClientRect();

    // SVG position relative to whiteboard viewport
    const svgLeft = svgRect.left - wbRect.left;
    const svgTop = svgRect.top - wbRect.top;

    const dpr = 2;
    const offscreen = document.createElement('canvas');
    offscreen.width = wbRect.width * dpr;
    offscreen.height = wbRect.height * dpr;
    const ctx = offscreen.getContext('2d')!;
    ctx.scale(dpr, dpr);

    // White background
    ctx.fillStyle = '#FAFBFF';
    ctx.fillRect(0, 0, wbRect.width, wbRect.height);

    // Draw dot grid
    ctx.fillStyle = 'rgba(148,163,184,0.15)';
    for (let gx = 0; gx < wbRect.width; gx += 20) {
      for (let gy = 0; gy < wbRect.height; gy += 20) {
        ctx.beginPath();
        ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw SVG at its screen position
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const encoded = btoa(unescape(encodeURIComponent(svgData)));
    const dataUrl = `data:image/svg+xml;base64,${encoded}`;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, svgLeft, svgTop, svgRect.width, svgRect.height);

      // Draw strokes in screen coordinates
      const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes;
      for (const stroke of allStrokes) {
        if (stroke.points.length < 2) continue;
        ctx.beginPath();
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size * Math.max(scale / BASE_SCALE, 0.5);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 0; i < stroke.points.length; i++) {
          const scr = diagramToScreen(stroke.points[i].x, stroke.points[i].y);
          const sx = scr.x;
          const sy = scr.y;
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }

      // Draw notes in screen coordinates
      for (const note of notes) {
        const scr = diagramToScreen(note.x, note.y);
        const nx = scr.x;
        const ny = scr.y;

        ctx.fillStyle = note.color + '15';
        ctx.strokeStyle = note.color + '40';
        ctx.lineWidth = 1;
        const nw = 140;
        const nh = 52;
        ctx.beginPath();
        ctx.roundRect(nx, ny, nw, nh, 6);
        ctx.fill();
        ctx.stroke();

        // Note dot
        ctx.fillStyle = note.color;
        ctx.beginPath();
        ctx.arc(nx + 8, ny + 10, 3, 0, Math.PI * 2);
        ctx.fill();

        // Note text
        ctx.fillStyle = '#0F172A';
        ctx.font = '11px sans-serif';
        const lines = note.text.split('\n');
        lines.forEach((line, i) => {
          if (line) ctx.fillText(line, nx + 16, ny + 14 + i * 14, nw - 20);
        });
      }

      offscreen.toBlob(blob => {
        if (!blob) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `diagram-${id}.png`;
        a.click();
        URL.revokeObjectURL(a.href);
      }, 'image/png');
    };
    img.src = dataUrl;
  }, [scale, strokes, currentStroke, notes, id, diagramToScreen]);

  // Render mermaid
  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      if (!content?.trim()) { setError('Diagram content is empty'); setIsRendering(false); isRenderingRef.current = false; return; }
      if (isRenderingRef.current) return;
      isRenderingRef.current = true;
      setIsRendering(true);
      setError(null);
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
      timeoutRef.current = setTimeout(() => {
        if (isMounted && isRenderingRef.current) { setError('Rendering timed out.'); setIsRendering(false); isRenderingRef.current = false; }
      }, 15000);
      try {
        const mermaid = (await import('mermaid')).default;
        if (!isMounted) { isRenderingRef.current = false; return; }
        mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose', fontFamily: 'inherit' });
        const diagramId = `mermaid-${id.replace(/[^a-zA-Z0-9-]/g, '-')}-${stableId.replace(/:/g, '-')}`;
        if (containerRef.current) containerRef.current.innerHTML = '';
        const { svg } = await mermaid.render(diagramId, content);
        if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
        if (isMounted && containerRef.current) { containerRef.current.innerHTML = svg; setIsRendering(false); isRenderingRef.current = false; }
      } catch (err) {
        if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
        if (isMounted) { setError(err instanceof Error ? err.message : 'Failed to render'); setIsRendering(false); isRenderingRef.current = false; }
      }
    };
    renderDiagram();
    return () => { isMounted = false; isRenderingRef.current = false; if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; } };
  }, [content, id, stableId, renderNonce, isFullscreen]);

  const handleRetry = () => setRenderNonce(prev => prev + 1);
  const displayPercent = Math.round((scale / BASE_SCALE) * 100);
  const showAnnoLayer = isFullscreen && activeTool !== 'select';

  const whiteboard = (
    <div
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="mermaid-container relative overflow-hidden rounded-xl border border-border shadow-inner shadow-black/[0.02]"
      style={{
        minHeight: isFullscreen ? 'calc(100vh - 56px)' : '400px',
        cursor: isDragging ? 'grabbing' : showAnnoLayer ? 'crosshair' : 'grab',
        backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.15) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        backgroundColor: '#FAFBFF',
      }}
    >
      <div
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          opacity: isRendering ? 0.3 : 1,
        }}
        className="flex items-center justify-center p-8"
      >
        <div ref={containerRef} />
      </div>

      {/* Annotation overlay canvas */}
      {isFullscreen && (
        <canvas
          ref={annoCanvasRef}
          onPointerDown={handleAnnoPointerDown}
          onPointerMove={handleAnnoPointerMove}
          onPointerUp={handleAnnoPointerUp}
          className="absolute inset-0 z-10"
          style={{ pointerEvents: showAnnoLayer ? 'auto' : 'none' }}
        />
      )}

      {/* Notes */}
      {isFullscreen && notes.map(note => {
        const screen = diagramToScreen(note.x, note.y);
        return (
          <div
            key={note.id}
            className="absolute z-20 min-w-[140px] max-w-[240px] rounded-lg border px-3 py-2 shadow-sm"
            style={{
              left: screen.x,
              top: screen.y,
              borderColor: note.color + '40',
              backgroundColor: note.color + '10',
              cursor: draggingNote === note.id ? 'grabbing' : 'grab',
            }}
            onPointerDown={(e) => {
              if (editingNote === note.id) return;
              e.stopPropagation();
              setDraggingNote(note.id);
              noteDragStart.current = { x: e.clientX, y: e.clientY, noteX: note.x, noteY: note.y };
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (draggingNote !== note.id) return;
              const dx = e.clientX - noteDragStart.current.x;
              const dy = e.clientY - noteDragStart.current.y;
              const newX = noteDragStart.current.noteX + dx / scale;
              const newY = noteDragStart.current.noteY + dy / scale;
              setNotes(prev => prev.map(n => n.id === note.id ? { ...n, x: newX, y: newY } : n));
            }}
            onPointerUp={() => setDraggingNote(null)}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: note.color }} />
                <span className="text-[9px] font-medium text-ink-faint select-none">DRAG</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setNotes(prev => prev.filter(n => n.id !== note.id)); }}
                className="h-4 w-4 flex items-center justify-center rounded text-ink-faint hover:text-error hover:bg-error-soft transition-colors"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {editingNote === note.id ? (
              <textarea
                autoFocus
                value={note.text}
                onChange={e => setNotes(prev => prev.map(n => n.id === note.id ? { ...n, text: e.target.value } : n))}
                onBlur={() => setEditingNote(null)}
                onClick={e => e.stopPropagation()}
                onPointerDown={e => e.stopPropagation()}
                className="w-full resize-none border-0 bg-transparent text-xs text-ink outline-none placeholder:text-ink-faint"
                rows={2}
                placeholder="Type a note..."
              />
            ) : (
              <p
                onClick={(e) => { e.stopPropagation(); setEditingNote(note.id); }}
                className="cursor-text text-xs text-ink/80 whitespace-pre-wrap break-words min-h-[1.5em]"
              >
                {note.text || <span className="text-ink-faint italic">Click to edit...</span>}
              </p>
            )}
          </div>
        );
      })}

      {/* Loading overlay */}
      {isRendering && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-surface/90 backdrop-blur-sm rounded-xl">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-accent mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm text-ink-muted">Rendering diagram...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-error-soft/95 p-6">
          <div className="max-w-md w-full space-y-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-error mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-error mb-1">Rendering Error</h4>
                <p className="text-sm text-error mb-3">{error}</p>
                <button onClick={handleRetry} className="px-4 py-2 bg-error text-white text-sm rounded-lg hover:bg-error/90 transition-colors">Retry</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const zoomControls = (
    <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 rounded-lg border border-border bg-surface-raised/90 px-1 py-1 shadow-lg shadow-black/[0.06] backdrop-blur-sm">
      <button onClick={zoomOut} disabled={scale <= MIN_SCALE} className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed" title="Zoom out">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
      </button>
      <span className="flex h-7 min-w-[3rem] items-center justify-center px-1.5 text-xs font-medium text-ink-muted select-none">{displayPercent}%</span>
      <button onClick={zoomIn} disabled={scale >= MAX_SCALE} className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed" title="Zoom in">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
      </button>
      <div className="mx-0.5 h-4 w-px bg-border" />
      <button onClick={resetView} className="flex h-7 items-center justify-center gap-1 rounded-md px-2 text-xs font-medium text-ink-muted transition-colors hover:bg-surface hover:text-ink" title="Reset to center">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        Reset
      </button>
    </div>
  );

  const hintBadge = (
    <div className="absolute top-3 left-3 z-20 rounded-md bg-surface-raised/80 px-2.5 py-1 text-[10px] font-medium text-ink-faint ring-1 ring-border/60 backdrop-blur-sm select-none">
      Drag to pan &middot; Scroll to zoom
    </div>
  );

  // ── INLINE VIEW ──
  if (!isFullscreen) {
    return (
      <div className="relative">
        {whiteboard}
        {zoomControls}
        {hintBadge}

        {/* Expand button */}
        <button
          onClick={() => {
            setStrokes([]);
            setNotes([]);
            setCurrentStroke(null);
            setScale(BASE_SCALE);
            setTranslate({ x: 0, y: 0 });
            setIsFullscreen(true);
          }}
          className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-raised/90 text-ink-muted shadow-lg shadow-black/[0.06] backdrop-blur-sm transition-all hover:bg-surface hover:text-accent hover:ring-1 hover:ring-accent/20"
          title="Open in fullscreen"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
    );
  }

  // ── FULLSCREEN VIEW ──
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-surface">
      {/* Toolbar */}
      <div className="flex-shrink-0 flex items-center gap-1 border-b border-border bg-surface-raised px-3 py-2">
        {/* Tool buttons */}
        <div className="flex items-center gap-1 rounded-lg bg-surface p-1 ring-1 ring-border/50">
          <button
            onClick={() => setActiveTool('select')}
            className={`flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors ${activeTool === 'select' ? 'bg-accent text-white shadow-sm' : 'text-ink-muted hover:text-ink hover:bg-surface-raised'}`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
            Select
          </button>
          <button
            onClick={() => setActiveTool('pen')}
            className={`flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors ${activeTool === 'pen' ? 'bg-accent text-white shadow-sm' : 'text-ink-muted hover:text-ink hover:bg-surface-raised'}`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Draw
          </button>
          <button
            onClick={() => setActiveTool('note')}
            className={`flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors ${activeTool === 'note' ? 'bg-accent text-white shadow-sm' : 'text-ink-muted hover:text-ink hover:bg-surface-raised'}`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Note
          </button>
        </div>

        {/* Color picker for pen and note */}
        {(activeTool === 'pen' || activeTool === 'note') && (
          <div className="flex items-center gap-1 ml-2">
            {PEN_COLORS.map(c => (
              <button
                key={c.value}
                onClick={() => setPenColor(c.value)}
                className={`h-6 w-6 rounded-full ring-2 transition-all ${penColor === c.value ? 'ring-ink scale-110' : 'ring-transparent hover:scale-105'}`}
                style={{ backgroundColor: c.value }}
                title={c.label}
              />
            ))}
            {activeTool === 'pen' && (
              <div className="ml-1 flex items-center gap-1 rounded-md bg-surface px-2 py-1 ring-1 ring-border/50">
                <span className="text-[10px] text-ink-faint">Size</span>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={penSize}
                  onChange={e => setPenSize(Number(e.target.value))}
                  className="h-1 w-14 accent-accent"
                />
              </div>
            )}
          </div>
        )}

        <div className="flex-1" />

        {/* Undo last stroke */}
        {strokes.length > 0 && (
          <button
            onClick={() => setStrokes(prev => prev.slice(0, -1))}
            className="flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-ink-muted transition-colors hover:bg-surface hover:text-ink"
            title="Undo"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 015 5v2M3 10l4-4m-4 4l4 4" /></svg>
            Undo
          </button>
        )}

        {/* Clear all annotations */}
        {(strokes.length > 0 || notes.length > 0) && (
          <button
            onClick={() => { setStrokes([]); setNotes([]); setCurrentStroke(null); }}
            className="flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-ink-muted transition-colors hover:bg-error-soft hover:text-error"
            title="Clear all"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Clear
          </button>
        )}

        {/* Save as image */}
        <button
          onClick={handleSaveImage}
          className="flex h-8 items-center gap-1.5 rounded-md bg-accent px-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-accent-hover"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Save PNG
        </button>

        {/* Close fullscreen */}
        <button
          onClick={() => {
            setStrokes([]);
            setNotes([]);
            setCurrentStroke(null);
            setActiveTool('select');
            setIsFullscreen(false);
          }}
          className="ml-1 flex h-8 w-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface hover:text-ink"
          title="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Whiteboard */}
      <div className="relative flex-1 overflow-hidden">
        {whiteboard}
        {zoomControls}
      </div>
    </div>
  );
};
