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

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Soft continuity: hero bean lifts on a curved path into the scroll story, then dissolves.
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
      const vw = window.innerWidth || 1;
      const sectionTop = section.getBoundingClientRect().top;

      // Begin once the section has entered ~85% down the viewport
      const startAt = vh * 0.85;
      const raw = clamp((startAt - sectionTop) / startAt);
      const p = easeInOutCubic(raw);
      const sizeP = easeOutCubic(raw);

      const startRect = start.getBoundingClientRect();
      const endRect = end.getBoundingClientRect();

      const startSize = Math.max(startRect.width, startRect.height);
      const endSize = Math.max(endRect.width, endRect.height);
      // Slight overshoot mid-flight, settle on the film bean size
      const grow = startSize + (endSize - startSize) * sizeP;
      const pulse = 1 + Math.sin(raw * Math.PI) * 0.08;
      const size = grow * pulse;

      const startCx = startRect.left + startRect.width / 2;
      const startCy = startRect.top + startRect.height / 2;
      const endCx = endRect.left + endRect.width / 2;
      const endCy =
        endRect.top + endRect.height / 2 - Math.max(0, sectionTop);

      // Smooth travel: linear handoff + a gentle mid-flight lift toward center
      const linearX = startCx + (endCx - startCx) * p;
      const linearY = startCy + (endCy - startCy) * p;
      const bow = Math.sin(raw * Math.PI);
      const cx = linearX + (vw / 2 - linearX) * 0.22 * bow;
      const cy = linearY - vh * 0.045 * bow;

      const heroOpacity = clamp(1 - raw / 0.05);

      // Hold the flyer until the film is ready, then dissolve on contact
      const filmReady = section.getAttribute('data-bean-film-ready') === 'true';
      const dissolveStart = filmReady ? 0.86 : 1.05;
      const dissolve = clamp((raw - dissolveStart) / 0.14);
      const flyerOpacity =
        raw < 0.02 ? 0 : clamp(1 - dissolve) * clamp(raw / 0.05);
      const blur = dissolve * 8;

      // Gentle tumble that settles near the film bean's pose
      const rotate = Math.sin(p * Math.PI) * 16 + p * 4;

      root.style.setProperty('--bean-hero-opacity', String(heroOpacity));
      root.style.setProperty('--bean-canvas-reveal', '1');

      const shadow = 0.25 + Math.sin(raw * Math.PI) * 0.25;

      flyer.style.width = `${size}px`;
      flyer.style.height = `${size}px`;
      flyer.style.opacity = String(flyerOpacity);
      flyer.style.transform = `translate3d(${cx - size / 2}px, ${cy - size / 2}px, 0) rotate(${rotate}deg)`;
      flyer.style.filter =
        blur > 0.5
          ? `blur(${blur}px) drop-shadow(0 ${10 + shadow * 12}px ${20 + shadow * 16}px rgba(0,0,0,${0.35 + shadow * 0.2}))`
          : `drop-shadow(0 ${10 + shadow * 12}px ${20 + shadow * 16}px rgba(0,0,0,${0.35 + shadow * 0.2}))`;
      flyer.style.visibility = flyerOpacity > 0.02 ? 'visible' : 'hidden';
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        sync();
      });
    };

    const boot = requestAnimationFrame(sync);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    prefersReduced.addEventListener('change', sync);

    // Re-sync when the film finishes loading (attribute flips on the section)
    const sectionEl = document.querySelector(SECTION_ATTR);
    const mo =
      sectionEl &&
      new MutationObserver(() => {
        sync();
      });
    if (sectionEl && mo) {
      mo.observe(sectionEl, {
        attributes: true,
        attributeFilter: ['data-bean-film-ready'],
      });
    }

    return () => {
      cancelAnimationFrame(boot);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      prefersReduced.removeEventListener('change', sync);
      mo?.disconnect();
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
      <CoffeeBean className="h-full w-full object-contain" />
    </div>,
    document.body
  );
}
