'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CoffeeBean from './CoffeeBean';
import { useDevicePerformance } from '../hooks/useDevicePerformance';

export const BEAN_HANDOFF_START_ID = 'bean-handoff-start';
export const BEAN_HANDOFF_END_ID = 'bean-handoff-end';

const SECTION_ATTR = '[data-bean-handoff-section]';
/** Frame index where the film bean first appears (0-based → frame-002). */
const FILM_BEAN_FRAME = 1;
const DISSOLVE_MS = 160;
/** Final tilt (deg) when parked — match the film bean in frame-002. */
const HANDOFF_SETTLE_ROTATE_DEG = 32;

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
 * Soft continuity: hero bean flies into the empty start frame, holds on the cup,
 * then dissolves the moment the film advances to frame 2 (bean appears in-frame).
 */
export default function BeanHandoff() {
  const tier = useDevicePerformance();
  const [mounted, setMounted] = useState(false);
  const flyerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const dissolveRafRef = useRef<number | null>(null);
  const dissolveStartedAtRef = useRef<number | null>(null);
  const enabled = tier !== 'low';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!enabled || !mounted) return;

    const root = document.documentElement;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const stopDissolveLoop = () => {
      if (dissolveRafRef.current !== null) {
        cancelAnimationFrame(dissolveRafRef.current);
        dissolveRafRef.current = null;
      }
    };

    const sync = () => {
      const flyer = flyerRef.current;

      if (prefersReduced.matches) {
        root.style.setProperty('--bean-hero-opacity', '1');
        root.style.setProperty('--bean-canvas-reveal', '1');
        if (flyer) flyer.style.opacity = '0';
        dissolveStartedAtRef.current = null;
        stopDissolveLoop();
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
      // Settle to film-bean size; slight overshoot mid-flight
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

      const filmReady = section.getAttribute('data-bean-film-ready') === 'true';
      const frameIndex = Number(section.getAttribute('data-bean-frame') || '0');
      const filmHasBean = filmReady && frameIndex >= FILM_BEAN_FRAME;

      // Hold on the empty cup until frame 2; then soft-dissolve into the film bean
      if (filmHasBean) {
        if (dissolveStartedAtRef.current === null) {
          dissolveStartedAtRef.current = performance.now();
        }
      } else {
        dissolveStartedAtRef.current = null;
        stopDissolveLoop();
      }

      const dissolveElapsed =
        dissolveStartedAtRef.current === null
          ? 0
          : performance.now() - dissolveStartedAtRef.current;
      const dissolve = filmHasBean ? clamp(dissolveElapsed / DISSOLVE_MS) : 0;

      // Keep ticking through the short dissolve even if scroll stops
      if (filmHasBean && dissolve < 1) {
        if (dissolveRafRef.current === null) {
          dissolveRafRef.current = requestAnimationFrame(() => {
            dissolveRafRef.current = null;
            sync();
          });
        }
      } else {
        stopDissolveLoop();
      }

      const flyerOpacity =
        raw < 0.02 ? 0 : clamp(1 - dissolve) * clamp(raw / 0.05);
      const blur = dissolve * 8;

      // Gentle tumble that settles to the film bean's tilt
      const rotate =
        Math.sin(p * Math.PI) * 14 + p * HANDOFF_SETTLE_ROTATE_DEG;

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

    // Re-sync when film ready / frame index flips
    const sectionEl = document.querySelector(SECTION_ATTR);
    const mo =
      sectionEl &&
      new MutationObserver(() => {
        sync();
      });
    if (sectionEl && mo) {
      mo.observe(sectionEl, {
        attributes: true,
        attributeFilter: ['data-bean-film-ready', 'data-bean-frame'],
      });
    }

    return () => {
      cancelAnimationFrame(boot);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      prefersReduced.removeEventListener('change', sync);
      mo?.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      stopDissolveLoop();
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
