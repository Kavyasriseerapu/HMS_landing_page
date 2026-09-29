import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';

/** Sets --mx / --my on the hovered element so `.spotlight` can follow the cursor. */
export function trackSpotlight(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Counts up to `value` the first time it scrolls into view. Keeps any prefix/suffix and decimals. */
export function CountUp({ value, duration = 1400, className = '' }: { value: string; duration?: number; className?: string }) {
  // Ratios like "24/7" read oddly mid-count, so they render as-is.
  const match = value.includes('/') ? null : value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
  const target = match ? parseFloat(match[2].replace(/,/g, '')) : 0;
  const decimals = match?.[2].includes('.') ? match[2].split('.')[1].length : 0;
  const comma = match?.[2].includes(',') ?? false;
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(target);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match || prefersReducedMotion()) return;
    setN(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      started.current = true;
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        setN(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!match) return <span className={className}>{value}</span>;
  const shown = comma
    ? n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : n.toFixed(decimals);
  return <span ref={ref} className={`tabular-nums ${className}`}>{match[1]}{shown}{match[3]}</span>;
}

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Writes scroll progress for an element into CSS variables (rAF-throttled):
 *   --enter  0 → 1 while the element travels from the bottom of the viewport to `endAt` (fraction of vh)
 *   --p      0 → 1 across the element's whole pass through the viewport
 */
export function useScrollVars<T extends HTMLElement>(endAt = 0.35) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      el.style.setProperty('--enter', clamp((vh - r.top) / (vh * (1 - endAt))).toFixed(3));
      el.style.setProperty('--p', clamp((vh - r.top) / (vh + r.height)).toFixed(3));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [endAt]);
  return ref;
}

/** Section transition: the child grows from a rounded, inset card to full width as it enters. */
export function ScrollExpand({ children }: { children: ReactNode }) {
  const ref = useScrollVars<HTMLDivElement>(0.45);
  return <div ref={ref} className="scroll-expand">{children}</div>;
}

/** Tilts a card toward the cursor; pair with the `.tilt` class. Also feeds the spotlight. */
export function trackTilt(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`);
  el.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}
export function resetTilt(e: MouseEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--rx', '0deg');
  e.currentTarget.style.setProperty('--ry', '0deg');
}

/** Page-level scroll progress (0–1), rAF-throttled. */
export function usePageProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? clamp(window.scrollY / max) : 0);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); };
  }, []);
  return p;
}

/** Section transition for light sections: content rises and fades in as it enters. */
export function SectionRise({ children }: { children: ReactNode }) {
  const ref = useScrollVars<HTMLDivElement>(0.55);
  return <div ref={ref} className="section-rise">{children}</div>;
}
