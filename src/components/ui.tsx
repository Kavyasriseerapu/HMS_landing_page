import type { ReactNode } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { LockIcon } from './icons';

/** Fades content in on scroll. With `stagger`, direct children cascade in using their `--i` style index. */
export function Reveal({ children, className = '', delay, stagger = false }: { children: ReactNode; className?: string; delay?: number; stagger?: boolean }) {
  const ref = useScrollReveal<HTMLDivElement>(delay);
  return (
    <div ref={ref} className={`scroll-reveal ${stagger ? 'stagger' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  desc,
  align = 'left',
  dark = false,
  className = '',
}: {
  eyebrow: string;
  title: ReactNode;
  desc?: ReactNode;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''} ${className}`}>
      <div
        className={`inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] mb-4 ${
          dark ? 'text-brand-300' : 'text-brand-600'
        }`}
      >
        <span className={`heading-eyebrow-line h-px ${dark ? 'bg-brand-400/70' : 'bg-brand-600/50'}`} />
        {eyebrow}
      </div>
      <h2
        className={`heading-title font-display text-[32px] sm:text-[40px] font-extrabold leading-[1.1] tracking-tight ${
          dark ? 'text-white' : 'text-slate-900'
        }`}
      >
        {title}
      </h2>
      {desc && <p className={`heading-desc mt-4 text-[17px] leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>}
    </div>
  );
}

export function BrowserFrame({ url, children, className = '' }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl sm:rounded-2xl border border-slate-900/10 bg-white overflow-hidden shadow-[0_40px_80px_-24px_rgba(15,23,42,0.35),0_0_0_1px_rgba(15,23,42,0.04)] ${className}`}
    >
      <div className="flex items-center gap-3 px-3 sm:px-4 h-8 sm:h-10 bg-slate-100 border-b border-slate-200">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1.5 h-5 sm:h-6 px-3 rounded-md bg-white border border-slate-200 text-[10px] sm:text-[11px] text-slate-500 max-w-[280px] w-full justify-center">
            <LockIcon size={10} />
            <span className="truncate">{url}</span>
          </div>
        </div>
        <div className="w-[42px] hidden sm:block" />
      </div>
      {children}
    </div>
  );
}

export function scrollToId(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
}

