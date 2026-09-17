import type { DeviceTier } from '../hooks/useDevicePerformance';

export type ScrollFrameConfig = {
  totalFrames: number;
  basePath: string;
  scrollHeightVh: number;
  concurrency: number;
  resolutionScale: number;
};

const HIGH_CONFIG: ScrollFrameConfig = {
  totalFrames: 140,
  basePath: '/frames',
  scrollHeightVh: 300,
  concurrency: 12,
  resolutionScale: 1,
};

const MID_CONFIG: ScrollFrameConfig = {
  totalFrames: 70,
  basePath: '/frames-mid',
  scrollHeightVh: 240,
  concurrency: 6,
  resolutionScale: 0.75,
};

export function getScrollFrameConfig(
  tier: Exclude<DeviceTier, 'low'>
): ScrollFrameConfig {
  return tier === 'high' ? HIGH_CONFIG : MID_CONFIG;
}
