'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CoffeeBean from './CoffeeBean';
import { useDevicePerformance } from '../hooks/useDevicePerformance';

export const BEAN_HANDOFF_START_ID = 'bean-handoff-start';
export const BEAN_HANDOFF_END_ID = 'bean-handoff-end';

const SECTION_ATTR = '[data-bean-handoff-section]';

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Soft continuity: hero bean lifts, travels into the scroll story, then dissolves into the film.
 * Progress is driven by the scroll section entering the viewport (0 → pinned).
 */
export default function BeanHandoff() {
  const tier = useDevicePerformance();
  const [mounted, setMounted] = useState(false);
  const flyerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const enabled = tier !== 'low';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!enabled || !mounted) return;

    const root = document.documentElement;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => {
      const flyer = flyerRef.current;

      if (prefersReduced.matches) {
        root.style.setProperty('--bean-hero-opacity', '1');
        root.style.setProperty('--bean-canvas-reveal', '1');
        if (flyer) flyer.style.opacity = '0';
        return;
      }

      const start = document.getElementById(BEAN_HANDOFF_START_ID);
      const end = document.getElementById(BEAN_HANDOFF_END_ID);
      const section = document.querySelector(SECTION_ATTR) as HTMLElement | null;

      if (!start || !end || !section || !flyer) {
        root.style.setProperty('--bean-hero-opacity', '1');
        root.style.setProperty('--bean-canvas-reveal', '1');
        if (flyer) flyer.style.opacity = '0';
        return;
      }

      const vh = window.innerHeight || 1;
      const sectionTop = section.getBoundingClientRect().top;

      // Begin only once the section has entered ~85% down the viewport,
      // so the hero bean stays solid at page top (no premature fade/flyer).
      const startAt = vh * 0.85;
      const raw = clamp((startAt - sectionTop) / startAt);
      const p = easeInOutCubic(raw);

      const startRect = start.getBoundingClientRect();
      const endRect = end.getBoundingClientRect();

      const startSize = Math.max(startRect.width, startRect.height);
      const endSize = Math.max(endRect.width, endRect.height);
      const size = startSize + (endSize - startSize) * p;

      const startCx = startRect.left + startRect.width / 2;
      const startCy = startRect.top + startRect.height / 2;
      const endCx = endRect.left + endRect.width / 2;
      // Aim at where the end target will sit once sticky pins (avoid overshoot while section rises)
      const endCy =
        endRect.top + endRect.height / 2 - Math.max(0, sectionTop);

      const cx = startCx + (endCx - startCx) * p;
      const cy = startCy + (endCy - startCy) * p;

      const heroOpacity = clamp(1 - raw / 0.05);
      // Stay solid until near the film bean, then dissolve quickly
      const dissolve = clamp((raw - 0.88) / 0.12);
      const flyerOpacity =
        raw < 0.02 ? 0 : clamp(1 - dissolve) * clamp(raw / 0.05);
      const blur = dissolve * 10;
      // PNG already sits on a diagonal — keep flight rotation subtle
      const rotate = p * 10;

      root.style.setProperty('--bean-hero-opacity', String(heroOpacity));
      root.style.setProperty('--bean-canvas-reveal', '1');

      flyer.style.width = `${size}px`;
      flyer.style.height = `${size}px`;
      flyer.style.opacity = String(flyerOpacity);
      flyer.style.transform = `translate3d(${cx - size / 2}px, ${cy - size / 2}px, 0) rotate(${rotate}deg)`;
      flyer.style.filter = blur > 0.5 ? `blur(${blur}px)` : 'none';
      flyer.style.visibility = flyerOpacity > 0.02 ? 'visible' : 'hidden';
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        sync();
      });
    };

    // Wait one frame so portal + end target are in the DOM
    const boot = requestAnimationFrame(sync);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    prefersReduced.addEventListener('change', sync);

    return () => {
      cancelAnimationFrame(boot);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      prefersReduced.removeEventListener('change', sync);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      root.style.removeProperty('--bean-hero-opacity');
      root.style.removeProperty('--bean-canvas-reveal');
    };
  }, [enabled, mounted]);

  if (!enabled || !mounted) return null;

  return createPortal(
    <div
      ref={flyerRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[60] will-change-transform"
      style={{
        opacity: 0,
        visibility: 'hidden',
        width: 0,
        height: 0,
      }}
    >
      <CoffeeBean className="h-full w-full object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.45)]" />
    </div>,
    document.body
  );
}
