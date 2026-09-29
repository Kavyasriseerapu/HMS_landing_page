import { SparkIcon } from './icons';
import { useScrollVars } from './motion';

/**
 * Oversized text band between sections. Two rows slide in opposite
 * directions as the page scrolls (scroll-linked, not time-based).
 */
export default function ScrollBand({ rowA, rowB, dark = false }: { rowA: string[]; rowB: string[]; dark?: boolean }) {
  const ref = useScrollVars<HTMLDivElement>();
  const row = (words: string[], outline: boolean) =>
    [...words, ...words, ...words].map((w, i) => (
      <span key={i} className="flex items-center gap-8 shrink-0">
        <span className={`font-display text-[56px] sm:text-[88px] font-extrabold tracking-tight leading-none whitespace-nowrap ${outline ? 'text-outline' : dark ? 'text-white' : 'text-ink-900'}`}>{w}</span>
        <SparkIcon size={36} className={i % 2 ? 'text-accent-500' : 'text-brand-500'} />
      </span>
    ));

  return (
    <div ref={ref} aria-hidden="true" className={`relative overflow-hidden py-12 sm:py-16 ${dark ? 'bg-ink-900' : 'bg-white'}`}>
      <div className="band-row-a flex gap-8 w-max">{row(rowA, false)}</div>
      <div className="band-row-b mt-4 flex gap-8 w-max">{row(rowB, true)}</div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent" />
    </div>
  );
}
