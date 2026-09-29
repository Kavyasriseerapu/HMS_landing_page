import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ChevronRightIcon } from '../icons';

export type ViewId =
  | 'dashboard' | 'patients' | 'appointments' | 'er' | 'clinical' | 'ip' | 'icu' | 'nursing'
  | 'lab' | 'radiology' | 'pharmacy' | 'ot' | 'billing' | 'insurance' | 'reports' | 'analytics' | 'admin' | 'ai';

export type ChartPatient = {
  name: string;
  age: number;
  sex: 'M' | 'F';
  mrn: string;
  complaint: string;
  acuity?: string;
  location: string;
  provider: string;
  allergies?: string;
};

type Ctx = {
  go: (v: ViewId) => void;
  openChart: (p: ChartPatient) => void;
  /** Opens the quick-entry form for a create action such as "Register Patient". */
  action: (label: string) => void;
  /** Shows a short toast inside the product frame. */
  notify: (msg: string) => void;
  now: Date;
};

export const DashCtx = createContext<Ctx>({ go: () => {}, openChart: () => {}, action: () => {}, notify: () => {}, now: new Date() });
export const useDash = () => useContext(DashCtx);

export function useNow(intervalMs = 15000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export function fmtStamp(d: Date) {
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${date} · ${time}`;
}

export function PageHeader({
  crumb,
  title,
  subtitle,
  actions,
}: {
  crumb: string;
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  const { now } = useDash();
  return (
    <>
      <div className="flex items-center gap-2 px-8 h-11 border-b border-slate-200 text-[13px] bg-white shrink-0">
        <span className="text-slate-400">General Hospital</span>
        <ChevronRightIcon size={13} className="text-slate-300" />
        <span className="text-slate-700 font-medium">{crumb}</span>
      </div>
      <div className="flex items-end justify-between px-8 py-5 border-b border-slate-200 bg-white shrink-0">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">{title}</h1>
          <div className="text-[13px] text-slate-500 mt-1">
            {subtitle} · {fmtStamp(now)}
          </div>
        </div>
        <div className="flex items-center gap-3">{actions}</div>
      </div>
    </>
  );
}

const labelOf = (el: HTMLElement) => el.textContent?.trim() ?? '';

export function PrimaryBtn({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  const { action } = useDash();
  return (
    <button
      onClick={(e) => (onClick ? onClick() : action(labelOf(e.currentTarget)))}
      className="flex items-center gap-1.5 px-4 h-9 bg-brand-600 hover:bg-brand-700 text-white text-[13px] font-semibold rounded-md shadow-sm transition-colors"
    >
      {children}
    </button>
  );
}

export function GhostBtn({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  const { notify } = useDash();
  return (
    <button
      onClick={(e) => (onClick ? onClick() : notify(`${labelOf(e.currentTarget)} is available in the full product.`))}
      className="flex items-center gap-1.5 px-3.5 h-9 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[13px] font-medium rounded-md transition-colors"
    >
      {children}
    </button>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex border border-slate-200 rounded-md overflow-hidden bg-white">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`px-4 h-9 text-[13px] font-medium transition-colors ${
            value === o.id ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export type Stat = { v: string; l: string; c?: string; sub?: string };

export function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <div
      className="grid border-b border-slate-200 bg-white shrink-0"
      style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
    >
      {stats.map((s) => (
        <div key={s.l} className="py-5 flex flex-col items-center justify-center text-center">
          <div className={`text-[30px] leading-none font-bold tabular-nums ${s.c ?? 'text-slate-900'}`}>{s.v}</div>
          <div className="text-[12.5px] font-medium text-slate-500 mt-2">{s.l}</div>
          {s.sub && <div className="text-[11px] text-slate-400 mt-0.5">{s.sub}</div>}
        </div>
      ))}
    </div>
  );
}

export function Body({ children }: { children: ReactNode }) {
  return <div className="flex-1 min-h-0 overflow-auto bg-slate-50 p-6">{children}</div>;
}

export function Panel({
  title,
  action,
  children,
  className = '',
  pad = true,
  onAction,
}: {
  title?: string;
  action?: ReactNode;
  onAction?: () => void;
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-5 h-12 border-b border-slate-100">
          <div className="text-[14px] font-semibold text-slate-900">{title}</div>
          {action &&
            (onAction ? (
              <button onClick={onAction} className="text-[12.5px] text-brand-600 font-medium hover:text-brand-700 hover:underline underline-offset-2">{action}</button>
            ) : (
              <div className="text-[12.5px] text-brand-600 font-medium">{action}</div>
            ))}
        </div>
      )}
      <div className={pad ? 'p-5' : ''}>{children}</div>
    </div>
  );
}

const pillTones = {
  blue: 'bg-blue-50 text-blue-700',
  amber: 'bg-amber-50 text-amber-700',
  green: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-red-700',
  slate: 'bg-slate-100 text-slate-600',
  violet: 'bg-violet-50 text-violet-700',
} as const;
const dotTones = {
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  green: 'bg-emerald-500',
  red: 'bg-red-500',
  slate: 'bg-slate-400',
  violet: 'bg-violet-500',
} as const;
export type Tone = keyof typeof pillTones;

export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap ${pillTones[tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotTones[tone]}`} />
      {children}
    </span>
  );
}

export function Table({
  head,
  children,
  widths,
}: {
  head: string[];
  children: ReactNode;
  widths?: (string | undefined)[];
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <table className="w-full text-left border-collapse table-fixed">
        <colgroup>
          {head.map((_, i) => (
            <col key={i} style={{ width: widths?.[i] }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-slate-200 bg-white">
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.06em]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[13.5px]">{children}</tbody>
      </table>
    </div>
  );
}

export function Avatar({ name, tone = 'bg-slate-100 text-slate-600' }: { name: string; tone?: string }) {
  const initials = name
    .replace(/^Dr\.\s*/, '')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
  return (
    <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-[11px] font-semibold ${tone}`}>
      {initials}
    </div>
  );
}

/** Single-series bar meter, 4px radius, recessive track. */
export function Meter({ pct, color = 'bg-brand-600' }: { pct: number; color?: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, pct)}%` }} />
    </div>
  );
}

/** Minimal single-series line/area sparkline used inside product mockups. */
export function Sparkline({
  data,
  w = 220,
  h = 56,
  color = '#d93654',
  id,
}: {
  data: number[];
  w?: number;
  h?: number;
  color?: string;
  id: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, 4 + ((max - v) / range) * (h - 8)] as const);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${w},${h} L0,${h} Z`;
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={lx} cy={ly} r="3.5" fill={color} stroke="white" strokeWidth="2" />
    </svg>
  );
}
