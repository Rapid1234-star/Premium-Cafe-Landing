import { useEffect, useState } from 'react';

export type DeviceTier = 'high' | 'mid' | 'low';

type NetworkInformationLike = {
  effectiveType?: string;
  saveData?: boolean;
};

function getConnection(): NetworkInformationLike | undefined {
  return (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
}

function detectTier(): DeviceTier {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'mid';
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const deviceMemory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;
  const connection = getConnection();
  const effectiveType = connection?.effectiveType || '4g';
  const saveData = Boolean(connection?.saveData);
  const isDesktopWidth = window.innerWidth >= 1024;

  const isLowEnd =
    prefersReducedMotion ||
    saveData ||
    effectiveType === 'slow-2g' ||
    effectiveType === '2g' ||
    deviceMemory <= 2 ||
    (hardwareConcurrency < 4 && deviceMemory < 4);

  if (isLowEnd) return 'low';

  const isHighEnd =
    isDesktopWidth &&
    hardwareConcurrency >= 8 &&
    deviceMemory >= 4 &&
    effectiveType !== '3g' &&
    effectiveType !== '2g' &&
    effectiveType !== 'slow-2g';

  if (isHighEnd) return 'high';
  return 'mid';
}

export function useDevicePerformance(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>(() => {
    if (typeof window === 'undefined') return 'mid';
    return detectTier();
  });

  useEffect(() => {
    const sync = () => setTier(detectTier());
    sync();

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => sync();

    window.addEventListener('resize', sync);
    motionQuery.addEventListener('change', onMotionChange);

    const connection = getConnection() as
      | (NetworkInformationLike & {
          addEventListener?: (type: string, listener: () => void) => void;
          removeEventListener?: (type: string, listener: () => void) => void;
        })
      | undefined;

    connection?.addEventListener?.('change', sync);

    return () => {
      window.removeEventListener('resize', sync);
      motionQuery.removeEventListener('change', onMotionChange);
      connection?.removeEventListener?.('change', sync);
    };
  }, []);

  return tier;
}
