import { useEffect, useState } from 'react';

export type DeviceTier = 'high' | 'mid' | 'low';

export function useDevicePerformance(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>('mid');

  useEffect(() => {
    const detectTier = (): DeviceTier => {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return 'mid';
      }

      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const deviceMemory = navigator.deviceMemory || 4;
      const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
      const effectiveType = connection?.effectiveType || '4g';
      const isMobile = window.innerWidth < 768;

      const isLowEnd = (
        (hardwareConcurrency < 4 && deviceMemory < 2) ||
        effectiveType === 'slow-2g' ||
        effectiveType === '2g'
      );

      const isHighEnd = (
        hardwareConcurrency >= 8 &&
        deviceMemory >= 4 &&
        effectiveType !== 'slow-2g' &&
        effectiveType !== '2g' &&
        effectiveType !== '3g'
      );

      if (isLowEnd) return 'low';
      if (isHighEnd) return 'high';
      return 'mid';
    };

    setTier(detectTier());

    const handleResize = () => {
      setTier(detectTier());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return tier;
}