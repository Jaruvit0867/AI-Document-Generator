'use client';

import React, { useEffect, useRef, useState, useId } from 'react';

interface MermaidDiagramProps {
  content: string;
  id: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ content, id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRenderingRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [renderNonce, setRenderNonce] = useState(0);
  const stableId = useId();

  useEffect(() => {
    let isMounted = true;

    const renderDiagram = async () => {
      // Validate content first
      if (!content || !content.trim()) {
        setError('Diagram content is empty');
        setIsRendering(false);
        isRenderingRef.current = false;
        return;
      }

      // Prevent concurrent renders
      if (isRenderingRef.current) {
        return;
      }

      isRenderingRef.current = true;
      setIsRendering(true);
      setError(null);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Set timeout - 15 seconds for complex diagrams
      timeoutRef.current = setTimeout(() => {
        if (isMounted && isRenderingRef.current) {
          setError('Diagram rendering timed out after 15 seconds. The syntax may be invalid or too complex.');
          setIsRendering(false);
          isRenderingRef.current = false;
        }
      }, 15000);

      try {
        // Dynamically import mermaid to avoid SSR issues
        const mermaid = (await import('mermaid')).default;

        if (!isMounted) {
          isRenderingRef.current = false;
          return;
        }

        // Initialize mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'inherit',
        });

        // Create stable diagram ID
        const diagramId = `mermaid-${id.replace(/[^a-zA-Z0-9-]/g, '-')}-${stableId.replace(/:/g, '-')}`;

        // Clear container before rendering
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // Render the diagram
        const { svg } = await mermaid.render(diagramId, content);

        // Clear timeout on success
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        if (isMounted && containerRef.current) {
          // Insert SVG
          containerRef.current.innerHTML = svg;
          setIsRendering(false);
          isRenderingRef.current = false;
        }
      } catch (err) {
        // Clear timeout on error
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to render diagram';
          setError(errorMessage);
          setIsRendering(false);
          isRenderingRef.current = false;
        }
      }
    };

    renderDiagram();

    // Cleanup function
    return () => {
      isMounted = false;
      isRenderingRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [content, id, stableId, renderNonce]);

  const handleRetry = () => {
    setRenderNonce(prev => prev + 1);
  };

  return (
    <div className="relative">
      {/* Always render the container - this is critical */}
      <div
        ref={containerRef}
          className="mermaid-container flex items-center justify-center overflow-auto rounded-xl border border-border bg-surface-raised p-6 shadow-inner shadow-black/[0.02]"
        style={{
          minHeight: '300px',
          opacity: isRendering ? 0.3 : 1,
          transition: 'opacity 0.2s'
        }}
      />

      {/* Loading overlay */}
      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-surface/90 backdrop-blur-sm">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-accent mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm text-ink-muted">Rendering diagram...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-error-soft/95 p-6">
          <div className="max-w-md w-full space-y-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-error mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-error mb-1">Diagram Rendering Error</h4>
                <p className="text-sm text-error mb-3">{error}</p>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-error text-white text-sm rounded-lg hover:bg-error/90 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
            <details className="bg-surface-raised rounded-lg border border-error/30">
              <summary className="px-3 py-2 cursor-pointer text-sm font-medium text-error hover:bg-error-soft transition-colors">
                View Raw Mermaid Code
              </summary>
              <div className="px-3 py-2 border-t border-error/30">
                <pre className="bg-ink text-ink-faint p-3 rounded text-xs overflow-x-auto">
                  <code>{content}</code>
                </pre>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};
