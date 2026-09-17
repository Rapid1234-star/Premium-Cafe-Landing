import { useEffect, useRef, useState, useCallback } from 'react';
import type { DeviceTier } from './useDevicePerformance';
import { getScrollFrameConfig } from '../config/scrollFrames';

export function useFramePreloader(tier: Exclude<DeviceTier, 'low'>) {
  const config = getScrollFrameConfig(tier);
  const { totalFrames, basePath, concurrency } = config;

  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const loadedFramesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const abortRef = useRef(false);

  const getFrameUrl = useCallback(
    (index: number) => {
      return `${basePath}/frame-${String(index + 1).padStart(3, '0')}.webp`;
    },
    [basePath]
  );

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
    abortRef.current = false;
    loadedFramesRef.current = new Map();
    setProgress(0);
    setIsReady(false);
    setLoadedCount(0);

    let completed = 0;
    let successful = 0;

    const updateProgress = (ok: boolean) => {
      completed += 1;
      if (ok) successful += 1;
      setLoadedCount(successful);
      setProgress(completed / totalFrames);
      if (completed >= totalFrames) {
        setIsReady(successful > 0);
      }
    };

    const run = async () => {
      let nextIndex = 0;

      const worker = async () => {
        while (!abortRef.current) {
          const index = nextIndex;
          nextIndex += 1;
          if (index >= totalFrames) return;
          const result = await loadFrame(index);
          if (!abortRef.current) updateProgress(result !== null);
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
  }, [tier, totalFrames, concurrency, loadFrame]);

  return {
    loadedFrames: loadedFramesRef,
    progress,
    isReady,
    loadedCount,
    totalFrames,
    config,
  };
}
