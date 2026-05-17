'use client';

import { useEffect, useRef } from 'react';

export const InteractiveGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const context = ctx;

    frameRef.current = 0;

    let width = 0;
    let height = 0;
    let resizeFrame = 0;
    const gap = 44;
    const dotRadius = 0.9;
    const mouseRadius = 150;
    const trailRadius = 220;

    // Smooth mouse tracking
    const mouse = { x: -9999, y: -9999 };
    const smoothMouse = { x: -9999, y: -9999 };
    let mouseActive = false;
    let mouseFade = 0;

    // Trail history for fluid ribbon effect
    const trail: { x: number; y: number }[] = [];
    const maxTrail = 8;

    // Wave animation state
    let time = 0;
    let lastFrameAt = 0;
    let isVisible = !document.hidden;
    const ambientFrameMs = 1000 / 28;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const nextWidth = Math.round(rect.width);
      const nextHeight = Math.round(rect.height);

      if (nextWidth <= 0 || nextHeight <= 0) {
        requestResize();
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      requestDraw();
    };

    function requestResize() {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        resize();
      });
    }

    const parent = canvas.parentElement;
    const resizeObserver = parent ? new ResizeObserver(requestResize) : null;

    requestResize();
    window.addEventListener('resize', requestResize);
    resizeObserver?.observe(parent as Element);

    const isOverContent = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof HTMLElement)) return false;
      return target.closest(
        'button, a, input, textarea, select, [role="button"], [data-grid-ignore]'
      ) !== null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (isOverContent(e.target)) {
        mouseActive = false;
      } else {
        mouse.x = x;
        mouse.y = y;
        mouseActive = true;
      }

      requestDraw();
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
      mouseActive = true;
      requestDraw();
    };

    const handleLeave = () => {
      mouseActive = false;
      requestDraw();
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;

      if (isVisible) {
        requestDraw();
      } else if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function requestDraw() {
      if (!isVisible || frameRef.current) return;
      frameRef.current = requestAnimationFrame(draw);
    }

    function draw(timestamp = performance.now()) {
      frameRef.current = 0;

      if (width <= 0 || height <= 0) {
        requestResize();
        return;
      }

      const isInteractionActive = mouseActive || mouseFade > 0.006 || trail.length > 0;

      if (
        !prefersReducedMotion &&
        !isInteractionActive &&
        timestamp - lastFrameAt < ambientFrameMs
      ) {
        requestDraw();
        return;
      }

      lastFrameAt = timestamp;
      context.clearRect(0, 0, width, height);

      if (!prefersReducedMotion) {
        time += isInteractionActive ? 0.012 : 0.006;
      }

      // Smoothly follow mouse
      const smoothing = 0.12;
      if (mouseActive) {
        smoothMouse.x = lerp(smoothMouse.x, mouse.x, smoothing);
        smoothMouse.y = lerp(smoothMouse.y, mouse.y, smoothing);
        mouseFade = lerp(mouseFade, 1, 0.06);
        trail.push({ x: smoothMouse.x, y: smoothMouse.y });
        if (trail.length > maxTrail) trail.shift();
      } else {
        mouseFade = lerp(mouseFade, 0, 0.04);
        if (mouseFade < 0.005) {
          smoothMouse.x = -9999;
          smoothMouse.y = -9999;
        }
        if (trail.length > 0) trail.shift();
      }

      const mx = smoothMouse.x;
      const my = smoothMouse.y;
      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;

      const nearby: { x: number; y: number; proximity: number }[] = [];

      // Draw aurora glow layer BEHIND dots — soft colored blobs that follow the wave
      for (let ai = 0; ai < cols; ai += 4) {
        for (let aj = 0; aj < rows; aj += 4) {
          const ax = ai * gap;
          const ay = aj * gap;

          const aw1 = Math.sin(ai * 0.22 + time * 1.4) * Math.cos(aj * 0.18 + time * 1.0);
          const aw2 = Math.sin((ai + aj) * 0.12 + time * 1.1) * 0.6;
          const aw3 = Math.cos(ai * 0.08 - time * 0.7) * Math.sin(aj * 0.15 + time * 0.6) * 0.4;
          const aw = (aw1 + aw2 + aw3) * 0.38 + 0.5;

          if (aw > 0.6) {
            const intensity = (aw - 0.6) / 0.4; // 0..1 for top portion
            const hueT = (Math.sin(ai * 0.06 + time * 0.4) * 0.5 + 0.5);
            // violet → blue → teal
            const ar = Math.round(124 * (1 - hueT) + 56 * hueT);
            const ag = Math.round(58 * (1 - hueT) + 189 * hueT);
            const ab = Math.round(237 * (1 - hueT) + 248 * hueT);

            const glowR = gap * 3.5;
            const grad = context.createRadialGradient(ax, ay, 0, ax, ay, glowR);
            grad.addColorStop(0, `rgba(${ar}, ${ag}, ${ab}, ${intensity * 0.06})`);
            grad.addColorStop(0.5, `rgba(${ar}, ${ag}, ${ab}, ${intensity * 0.025})`);
            grad.addColorStop(1, `rgba(${ar}, ${ag}, ${ab}, 0)`);
            context.fillStyle = grad;
            context.beginPath();
            context.arc(ax, ay, glowR, 0, Math.PI * 2);
            context.fill();
          }
        }
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gap;
          const y = j * gap;

          // Wave displacement — two overlapping sine waves
          const wave1 = Math.sin(i * 0.22 + time * 1.4) * Math.cos(j * 0.18 + time * 1.0);
          const wave2 = Math.sin((i + j) * 0.12 + time * 1.1) * 0.6;
          const wave3 = Math.cos(i * 0.08 - time * 0.7) * Math.sin(j * 0.15 + time * 0.6) * 0.4;
          const waveStrength = (wave1 + wave2 + wave3) * 0.38 + 0.5; // normalize ~0..1
          const waveAlpha = waveStrength * 0.32; // wave brightness contribution
          const waveScale = waveStrength * 1.4; // wave size pulse

          // Mouse proximity
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let alpha: number;
          let r: number;

          const baseAlpha = 0.06; // faint base
          const baseR = dotRadius + waveScale;

          if (dist < mouseRadius && mouseFade > 0.01) {
            const proximity = 1 - dist / mouseRadius;
            const eased = proximity * proximity * (3 - 2 * proximity);
            const mf = mouseFade;
            alpha = baseAlpha + waveAlpha + eased * 0.3 * mf;
            r = baseR + eased * 1.6 * mf;
            nearby.push({ x, y, proximity: eased * mf });
          } else {
            alpha = baseAlpha + waveAlpha;
            r = baseR;
          }

          // Trail influence
          if (trail.length > 1 && mouseFade > 0.01) {
            for (let t = 0; t < trail.length; t++) {
              const tp = trail[t];
              const tdx = x - tp.x;
              const tdy = y - tp.y;
              const tdist = Math.sqrt(tdx * tdx + tdy * tdy);
              if (tdist < trailRadius) {
                const trailProx = (1 - tdist / trailRadius) * (t / trail.length) * mouseFade;
                const tpEased = trailProx * trailProx;
                alpha = Math.min(alpha + tpEased * 0.12, 0.42);
                r = Math.max(r, dotRadius + tpEased * 1.5);
              }
            }
          }

          context.beginPath();
          context.arc(x, y, r, 0, Math.PI * 2);
          context.fillStyle = `rgba(37, 99, 235, ${alpha})`;
          context.fill();
        }
      }

      // Soft radial glow at mouse center
      if (nearby.length > 0 && mouseFade > 0.05) {
        const glowRadius = mouseRadius * 0.7;
        const glowGrad = context.createRadialGradient(mx, my, 0, mx, my, glowRadius);
        glowGrad.addColorStop(0, `rgba(37, 99, 235, ${0.035 * mouseFade})`);
        glowGrad.addColorStop(0.5, `rgba(37, 99, 235, ${0.015 * mouseFade})`);
        glowGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');
        context.fillStyle = glowGrad;
        context.beginPath();
        context.arc(mx, my, glowRadius, 0, Math.PI * 2);
        context.fill();
      }

      const shouldContinue = isVisible && !prefersReducedMotion;

      if (shouldContinue) {
        requestDraw();
      }
    }

    requestDraw();

    return () => {
      window.removeEventListener('resize', requestResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resizeObserver?.disconnect();
      if (resizeFrame) {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = 0;
      }
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
    />
  );
};
