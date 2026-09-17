import { useEffect, useRef, useState, useCallback } from 'react';
import type { DeviceTier } from './useDevicePerformance';

const CONCURRENCY: Record<DeviceTier, number> = {
  high: 12,
  mid: 8,
  low: 0,
};

export function useFramePreloader(totalFrames: number, tier: DeviceTier) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const loadedFramesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const abortRef = useRef(false);

  const getFrameUrl = useCallback((index: number) => {
    return `/frames/frame-${String(index + 1).padStart(3, '0')}.webp`;
  }, []);

  const loadFrame = useCallback(
    (index: number): Promise<HTMLImageElement | null> => {
      if (loadedFramesRef.current.has(index)) {
        return Promise.resolve(loadedFramesRef.current.get(index) || null);
      }

      return new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';

        const finish = (result: HTMLImageElement | null) => {
          if (result) {
            loadedFramesRef.current.set(index, result);
          }
          resolve(result);
        };

        img.onload = () => {
          if (typeof img.decode === 'function') {
            img
              .decode()
              .then(() => finish(img))
              .catch(() => finish(img));
          } else {
            finish(img);
          }
        };
        img.onerror = () => finish(null);
        img.src = getFrameUrl(index);
      });
    },
    [getFrameUrl]
  );

  useEffect(() => {
    if (tier === 'low') {
      setIsReady(false);
      setProgress(0);
      setLoadedCount(0);
      return;
    }

    abortRef.current = false;
    loadedFramesRef.current = new Map();
    setProgress(0);
    setIsReady(false);
    setLoadedCount(0);

    let completed = 0;
    const concurrency = CONCURRENCY[tier];

    const updateProgress = () => {
      completed += 1;
      setLoadedCount(completed);
      setProgress(completed / totalFrames);
      if (completed >= totalFrames) {
        setIsReady(true);
      }
    };

    const run = async () => {
      let nextIndex = 0;

      const worker = async () => {
        while (!abortRef.current) {
          const index = nextIndex;
          nextIndex += 1;
          if (index >= totalFrames) return;
          await loadFrame(index);
          if (!abortRef.current) updateProgress();
        }
      };

      await Promise.all(
        Array.from({ length: Math.min(concurrency, totalFrames) }, () => worker())
      );
    };

    void run();

    return () => {
      abortRef.current = true;
    };
  }, [tier, totalFrames, loadFrame]);

  return {
    loadedFrames: loadedFramesRef,
    progress,
    isReady,
    loadedCount,
  };
}
