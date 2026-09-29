import { useMemo, useState } from 'react';
import { Reveal, SectionHeading } from './ui';
import { CheckIcon } from './icons';
import { CountUp } from './motion';

type Metric = { id: string; label: string; unit: string; fmt: (v: number) => string; data: number[]; goal: string; lowerIsBetter?: boolean };

// Deterministic sample series (30 days) for the demo chart.
function series(base: number, amp: number, drift: number, seed: number) {
  return Array.from({ length: 30 }, (_, i) => {
    const wave = Math.sin((i + seed) * 0.9) * amp * 0.6 + Math.sin((i + seed) * 0.33) * amp * 0.4;
    const weekend = (i + seed) % 7 >= 5 ? -amp * 0.5 : 0;
    return +(base + wave + weekend + drift * i).toFixed(1);
  });
}

const metrics: Metric[] = [
  { id: 'occ', label: 'Bed occupancy', unit: '%', fmt: (v) => `${v.toFixed(0)}%`, data: series(82, 4, 0.12, 1), goal: 'Target 85%' },
  { id: 'dtp', label: 'ED door-to-provider', unit: 'min', fmt: (v) => `${v.toFixed(0)} min`, data: series(24, 4, -0.3, 3), goal: 'Target < 15 min', lowerIsBetter: true },
  { id: 'or', label: 'OR utilization', unit: '%', fmt: (v) => `${v.toFixed(0)}%`, data: series(68, 5, 0.3, 5), goal: 'Target 80%' },
  { id: 'los', label: 'Avg length of stay', unit: 'days', fmt: (v) => `${v.toFixed(1)} d`, data: series(4.8, 0.25, -0.02, 2), goal: 'Target 4.0 d', lowerIsBetter: true },
];

const W = 640;
const H = 240;
const PAD = { l: 44, r: 12, t: 12, b: 28 };

function niceTicks(min: number, max: number, n = 4) {
  const step0 = (max - min) / n;
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= step0) ?? step0;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + 1e-9; v += step) ticks.push(+v.toFixed(4));
  return ticks;
}

function Chart({ m }: { m: Metric }) {
  const [hover, setHover] = useState<number | null>(null);
  const { ticks, x, y, path, area } = useMemo(() => {
    const ticks = niceTicks(Math.min(...m.data), Math.max(...m.data));
    const lo = ticks[0], hi = ticks[ticks.length - 1];
    const x = (i: number) => PAD.l + (i / (m.data.length - 1)) * (W - PAD.l - PAD.r);
    const y = (v: number) => PAD.t + ((hi - v) / (hi - lo)) * (H - PAD.t - PAD.b);
    const path = m.data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    const area = `${path} L${x(m.data.length - 1)},${H - PAD.b} L${x(0)},${H - PAD.b} Z`;
    return { ticks, x, y, path, area };
  }, [m]);

  const onMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * (m.data.length - 1));
    setHover(Math.max(0, Math.min(m.data.length - 1, i)));
  };

  const last = m.data.length - 1;
  const hi = hover ?? last;
  const day = (i: number) => {
    const d = new Date(2026, 8, 29 - (last - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`${m.label}, last 30 days`}>
        <defs>
          <linearGradient id={`ag-${m.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d93654" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#d93654" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeWidth="1" />
            <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#64748b">{Number.isInteger(t) ? t : t.toFixed(1)}</text>
          </g>
        ))}
        {[0, 7, 14, 21, 29].map((i) => (
          <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? 'start' : i === 29 ? 'end' : 'middle'} fontSize="11" fill="#64748b">{day(i)}</text>
        ))}
        <path d={area} fill={`url(#ag-${m.id})`} />
        <path d={path} fill="none" stroke="#d93654" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} stroke="#94a3b8" strokeWidth="1" />}
        <circle cx={x(hi)} cy={y(m.data[hi])} r="5" fill="#d93654" stroke="white" strokeWidth="2" />
        <rect x={PAD.l} y={PAD.t} width={W - PAD.l - PAD.r} height={H - PAD.t - PAD.b} fill="transparent" onMouseMove={onMove} onMouseLeave={() => setHover(null)} />
      </svg>
      {hover !== null && (
        <div className="absolute top-2 pointer-events-none -translate-x-1/2 rounded-lg bg-slate-900 text-white px-3 py-2 shadow-xl text-[12px] whitespace-nowrap" style={{ left: `${(x(hover) / W) * 100}%` }}>
          <div className="text-slate-400">{day(hover)}</div>
          <div className="font-semibold text-[13px]">{m.fmt(m.data[hover])}</div>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsSection() {
  const [mi, setMi] = useState(0);
  const [table, setTable] = useState(false);
  const m = metrics[mi];
  const first = m.data[0], last = m.data[m.data.length - 1];
  const delta = last - first;
  const good = m.lowerIsBetter ? delta < 0 : delta > 0;

  return (
    <section id="analytics" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <Reveal className="lg:col-span-5">
          <SectionHeading
            eyebrow="Operational intelligence"
            title="Numbers you can act on today, not at month-end."
            desc="The dashboards draw on the same data your clinicians enter, so leadership sees the hospital as it is right now. Drill from any KPI down to the unit, the shift or the patient."
          />
          <ul className="mt-8 space-y-3">
            {['Executive dashboard: occupancy, revenue, ER census, wait trends', 'OP, IP & ER reports: volumes, ALOS, bed turnover, readmissions', 'Pharmacy & diagnostics: fast/slow movers, expiry, lab & scan TAT', 'Financial: collections, revenue by department, doctor earnings, insurance settlements'].map((t) => (
              <li key={t} className="flex items-center gap-3 text-[15px] text-slate-700">
                <span className="h-5 w-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0"><CheckIcon size={12} strokeWidth={3} /></span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
            <div className="flex flex-wrap gap-1 p-2 border-b border-slate-100 bg-slate-50/60">
              {metrics.map((x, i) => (
                <button
                  key={x.id}
                  onClick={() => setMi(i)}
                  className={`h-9 px-3.5 rounded-md text-[13px] font-medium transition-colors ${i === mi ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {x.label}
                </button>
              ))}
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-[13px] font-medium text-slate-500">{m.label} · last 30 days</div>
                  <div className="mt-1 flex items-baseline gap-3">
                    <span className="font-display text-[36px] font-extrabold text-slate-900 leading-none tabular-nums">{m.fmt(last)}</span>
                    <span className={`text-[13px] font-semibold ${good ? 'text-emerald-600' : 'text-red-600'}`}>
                      {good ? '▲' : '▼'} {Math.abs(delta).toFixed(m.unit === 'days' ? 1 : 0)}{m.unit === '%' ? ' pts' : ` ${m.unit}`} vs 30 days ago
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-slate-500 rounded-full border border-slate-200 px-2.5 py-1">{m.goal}</span>
                  <button onClick={() => setTable((t) => !t)} className="text-[12px] font-medium text-brand-600 hover:text-brand-700">
                    {table ? 'Show chart' : 'View as table'}
                  </button>
                </div>
              </div>
              <div className="mt-5">
                {table ? (
                  <div className="max-h-[240px] overflow-y-auto rounded-lg border border-slate-200">
                    <table className="w-full text-[13px]">
                      <thead className="sticky top-0 bg-slate-50"><tr><th className="text-left px-3 py-2 font-semibold text-slate-600">Day</th><th className="text-right px-3 py-2 font-semibold text-slate-600">{m.label}</th></tr></thead>
                      <tbody>
                        {m.data.map((v, i) => (
                          <tr key={i} className="border-t border-slate-100"><td className="px-3 py-1.5 text-slate-600">Day {i + 1}</td><td className="px-3 py-1.5 text-right tabular-nums text-slate-900">{m.fmt(v)}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Chart m={m} />
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-slate-100 divide-x divide-slate-100">
              {[['284', 'Inpatients'], ['412', 'OPD visits today'], ['26', 'Surgeries today'], ['11.8%', '30-day readmits']].map(([v, l]) => (
                <div key={l} className="px-5 py-4">
                  <CountUp value={v} className="block font-display text-[20px] font-bold text-slate-900" />
                  <div className="text-[12px] text-slate-500">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-[12px] text-slate-400 text-center">Sample data for illustration.</p>
        </Reveal>
      </div>
    </section>
  );
}
