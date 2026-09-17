'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useDevicePerformance } from '../hooks/useDevicePerformance';
import { useFramePreloader } from '../hooks/useFramePreloader';
import LoadingScreen from './LoadingScreen';

const MAX_DPR = 1.5;

function ScrollAnimationContent({
  tier,
}: {
  tier: Exclude<ReturnType<typeof useDevicePerformance>, 'low'>;
}) {
  const { loadedFrames, progress, isReady, loadedCount, totalFrames, config } =
    useFramePreloader(tier);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasParentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIndexRef = useRef(0);
  const pendingFrameRef = useRef<number | null>(null);
  const drawRafRef = useRef<number | null>(null);
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const totalFramesRef = useRef(totalFrames);
  const loadedFramesRef = useRef(loadedFrames);
  const resolutionScaleRef = useRef(config.resolutionScale);

  totalFramesRef.current = totalFrames;
  loadedFramesRef.current = loadedFrames;
  resolutionScaleRef.current = config.resolutionScale;

  const { scrollHeightVh } = config;

  const findNearestFrame = useCallback((frameIndex: number): HTMLImageElement | null => {
    const frames = loadedFramesRef.current.current;
    const exact = frames.get(frameIndex);
    if (exact) return exact;

    const total = totalFramesRef.current;
    for (let distance = 1; distance < total; distance += 1) {
      const prev = frames.get(frameIndex - distance);
      if (prev) return prev;
      const next = frames.get(frameIndex + distance);
      if (next) return next;
    }

    return null;
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const parent = canvasParentRef.current;
    if (!canvas || !parent) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR) * resolutionScaleRef.current;
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
  }, []);

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
      if (drawRafRef.current !== null) return;

      drawRafRef.current = requestAnimationFrame(() => {
        drawRafRef.current = null;
        const next = pendingFrameRef.current;
        pendingFrameRef.current = null;
        if (next !== null) drawFrame(next);
      });
    },
    [drawFrame]
  );

  const drawFrameRef = useRef(drawFrame);
  const scheduleDrawRef = useRef(scheduleDraw);
  drawFrameRef.current = drawFrame;
  scheduleDrawRef.current = scheduleDraw;

  // Stable scroll scrub listener (refs avoid stale closures / effect churn)
  useEffect(() => {
    const updateFromScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const total = container.offsetHeight - window.innerHeight;
      if (total <= 0) return;

      const progress = Math.min(1, Math.max(0, -container.getBoundingClientRect().top / total));
      const maxIndex = totalFramesRef.current - 1;
      const frameIndex = Math.min(maxIndex, Math.max(0, Math.round(progress * maxIndex)));

      if (frameIndex !== frameIndexRef.current) {
        scheduleDrawRef.current(frameIndex);
      }
    };

    window.addEventListener('scroll', updateFromScroll, { passive: true });
    document.addEventListener('scroll', updateFromScroll, { passive: true, capture: true });
    updateFromScroll();

    return () => {
      window.removeEventListener('scroll', updateFromScroll);
      document.removeEventListener('scroll', updateFromScroll, true);
    };
  }, []);

  useEffect(() => {
    const sync = () => {
      if (resizeCanvas()) {
        drawFrameRef.current(frameIndexRef.current);
      }
    };

    window.addEventListener('resize', sync);
    sync();
    const raf = requestAnimationFrame(sync);

    return () => {
      window.removeEventListener('resize', sync);
      cancelAnimationFrame(raf);
    };
  }, [resizeCanvas]);

  useEffect(() => {
    if (!isReady || loadedCount === 0) return;
    if (resizeCanvas()) {
      // Re-sync to current scroll position once frames are ready
      const container = containerRef.current;
      if (container) {
        const total = container.offsetHeight - window.innerHeight;
        if (total > 0) {
          const progress = Math.min(1, Math.max(0, -container.getBoundingClientRect().top / total));
          const maxIndex = totalFramesRef.current - 1;
          const frameIndex = Math.min(maxIndex, Math.max(0, Math.round(progress * maxIndex)));
          drawFrame(frameIndex);
          return;
        }
      }
      drawFrame(frameIndexRef.current);
    }
  }, [isReady, loadedCount, resizeCanvas, drawFrame]);

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    return () => {
      root.style.scrollBehavior = previous;
    };
  }, []);

  return (
    <section
      className="relative w-screen -ml-[calc(50%-50vw)]"
      aria-label="Coffee crafting animation"
    >
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
        style={{ height: `${scrollHeightVh}vh` }}
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
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4 sm:px-8"
            style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(43,29,20,0.4) 100%)' }}
          >
            <div className="text-center max-w-2xl mx-auto">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 20 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-ivory/90 leading-tight"
              >
                Every cup tells a story.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 20 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-ivory/60 text-base sm:text-lg md:text-xl mt-3 sm:mt-4 max-w-lg mx-auto"
              >
                From bean to cup, crafted with patience you can taste.
              </motion.p>
            </div>
          </motion.div>

          <div
            className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 text-ivory/70 text-sm font-medium z-10"
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
