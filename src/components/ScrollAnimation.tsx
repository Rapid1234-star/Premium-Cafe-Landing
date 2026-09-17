'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { useDevicePerformance } from '../hooks/useDevicePerformance';
import { useFramePreloader } from '../hooks/useFramePreloader';
import LoadingScreen from './LoadingScreen';

const TOTAL_FRAMES = 140;
const SCROLL_HEIGHT_VH = 300;
const MAX_DPR = 1.5;

function ScrollAnimationContent({
  tier,
}: {
  tier: Exclude<ReturnType<typeof useDevicePerformance>, 'low'>;
}) {
  const { loadedFrames, progress, isReady, loadedCount } = useFramePreloader(TOTAL_FRAMES, tier);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasParentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIndexRef = useRef(0);
  const pendingFrameRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const canvasSizeRef = useRef({ width: 0, height: 0 });

  const resolutionScale = tier === 'high' ? 1 : 0.75;

  const findNearestFrame = useCallback((frameIndex: number): HTMLImageElement | null => {
    const frames = loadedFrames.current;
    const exact = frames.get(frameIndex);
    if (exact) return exact;

    for (let distance = 1; distance < TOTAL_FRAMES; distance += 1) {
      const prev = frames.get(frameIndex - distance);
      if (prev) return prev;
      const next = frames.get(frameIndex + distance);
      if (next) return next;
    }

    return null;
  }, [loadedFrames]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const parent = canvasParentRef.current;
    if (!canvas || !parent) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR) * resolutionScale;
    const rect = parent.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return false;

    const newWidth = Math.floor(rect.width * dpr);
    const newHeight = Math.floor(rect.height * dpr);

    if (canvasSizeRef.current.width !== newWidth || canvasSizeRef.current.height !== newHeight) {
      canvas.width = newWidth;
      canvas.height = newHeight;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      canvasSizeRef.current = { width: newWidth, height: newHeight };
    }

    return true;
  }, [resolutionScale]);

  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const frame = findNearestFrame(frameIndex);
      if (!frame) return;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const { width, height } = canvasSizeRef.current;
      if (width === 0 || height === 0) return;

      const imgAspect = frame.naturalWidth / frame.naturalHeight;
      const canvasAspect = width / height;

      let drawWidth: number;
      let drawHeight: number;
      let offsetX: number;
      let offsetY: number;

      if (imgAspect > canvasAspect) {
        drawHeight = height;
        drawWidth = height * imgAspect;
        offsetX = (width - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = width;
        drawHeight = width / imgAspect;
        offsetX = 0;
        offsetY = (height - drawHeight) / 2;
      }

      ctx.fillStyle = '#2B1D14';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(frame, offsetX, offsetY, drawWidth, drawHeight);
      frameIndexRef.current = frameIndex;
    },
    [findNearestFrame]
  );

  const scheduleDraw = useCallback(
    (frameIndex: number) => {
      pendingFrameRef.current = frameIndex;
      if (rafIdRef.current !== null) return;

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const next = pendingFrameRef.current;
        pendingFrameRef.current = null;
        if (next !== null) drawFrame(next);
      });
    },
    [drawFrame]
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const frameProgress = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  useMotionValueEvent(frameProgress, 'change', (latest) => {
    const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(latest)));
    if (frameIndex !== frameIndexRef.current) {
      scheduleDraw(frameIndex);
    }
  });

  useEffect(() => {
    let mounted = true;

    const sync = () => {
      if (!mounted) return;
      if (resizeCanvas()) {
        drawFrame(frameIndexRef.current);
      }
    };

    const handleResize = () => sync();

    window.addEventListener('resize', handleResize);
    sync();

    const raf = requestAnimationFrame(sync);

    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [resizeCanvas, drawFrame]);

  useEffect(() => {
    if (!isReady || loadedCount === 0) return;
    if (resizeCanvas()) {
      drawFrame(frameIndexRef.current);
    }
  }, [isReady, loadedCount, resizeCanvas, drawFrame]);

  return (
    <section className="relative w-screen -ml-[calc(50%-50vw)]" aria-label="Coffee crafting animation">
      <LoadingScreen
        progress={progress}
        isReady={isReady}
        onComplete={() => {
          /* LoadingScreen unmounts itself when ready */
        }}
      />

      <div
        ref={containerRef}
        className="relative bg-espresso"
        style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
        aria-hidden="true"
      >
        <div
          ref={canvasParentRef}
          className="sticky top-0 left-0 w-full h-screen flex items-center justify-center bg-espresso overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
            style={{ width: '100%', height: '100%' }}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isReady ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(43,29,20,0.4) 100%)' }}
          >
            <div className="px-8 text-center">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 20 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="font-serif text-2xl md:text-4xl lg:text-5xl text-ivory/90 leading-tight"
              >
                Every cup tells a story.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 20 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-ivory/60 text-lg md:text-xl mt-4 max-w-lg mx-auto"
              >
                From bean to cup, crafted with patience you can taste.
              </motion.p>
            </div>
          </motion.div>

          <div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 text-ivory/70 text-sm font-medium z-10"
            style={{ pointerEvents: 'none' }}
          >
            <motion.svg
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </motion.svg>
            <span className="hidden md:inline">Scroll to explore</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ScrollAnimation() {
  const tier = useDevicePerformance();

  if (tier === 'low') {
    return null;
  }

  return <ScrollAnimationContent tier={tier} />;
}
