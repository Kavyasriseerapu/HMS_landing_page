import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { ActivityIcon, BellIcon, HeartPulseIcon, PillIcon, SearchIcon, ZapIcon } from './icons';
import { LogoMark } from './Navbar';

/** Renders children at a fixed native size, scaled to the container width. */
export function Scaled({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const m = () => setS(el.clientWidth / w);
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: h * s }}>
      <div className="absolute top-0 left-0" style={{ width: w, height: h, transform: `scale(${s})`, transformOrigin: 'top left', visibility: s ? 'visible' : 'hidden' }}>{children}</div>
    </div>
  );
}

function Shell({ title, sub, icon: Icon, children }: { title: string; sub: string; icon: typeof ZapIcon; children: ReactNode }) {
  return (
    <div className="h-full w-full flex flex-col bg-slate-50 font-sans text-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-[0_30px_60px_-20px_rgba(42,45,52,0.35)]">
      <div className="flex items-center gap-3 h-12 px-4 bg-ink-900 text-white shrink-0">
        <LogoMark size={28} />
        <span className="text-[13px] font-bold">Hosp<span className="text-brand-400">AI</span></span>
        <span className="ml-4 flex items-center gap-2 h-7 w-56 px-3 rounded-lg bg-white/[0.07] text-[11px] text-slate-400"><SearchIcon size={12} /> Search patients…</span>
        <span className="ml-auto relative text-slate-400"><BellIcon size={15} /><span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" /></span>
        <span className="h-7 w-7 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 text-[10px] font-bold flex items-center justify-center">HA</span>
      </div>
      <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-slate-200 shrink-0">
        <span className="h-9 w-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center"><Icon size={17} /></span>
        <div>
          <div className="text-[15px] font-bold">{title}</div>
          <div className="text-[11.5px] text-slate-500">{sub}</div>
        </div>
      </div>
      <div className="flex-1 min-h-0 p-4">{children}</div>
    </div>
  );
}

const triage = [
  ['Arjun Mehta', 'B1 · Resuscitation', 'bg-red-50 text-red-700 ring-red-200', 'bg-red-500', 'ER-TRAUMA-01', 'ICU requested'],
  ['Robert Lee', 'B2 · Emergent', 'bg-orange-50 text-orange-700 ring-orange-200', 'bg-orange-500', 'ER-B2-01', 'ICU requested'],
  ['Maria Garcia', 'B2 · Emergent', 'bg-orange-50 text-orange-700 ring-orange-200', 'bg-orange-500', 'ER-B2-02', 'Ward requested'],
  ['Thomas Reed', 'B3 · Urgent', 'bg-amber-50 text-amber-800 ring-amber-200', 'bg-amber-400', 'ER-B3-01', 'Ward requested'],
  ['Kavya Nair', 'B4 · Less urgent', 'bg-emerald-50 text-emerald-700 ring-emerald-200', 'bg-emerald-500', 'ER-B4-02', '—'],
];

export function EDMini() {
  return (
    <Scaled w={640} h={420}>
      <Shell title="ED Track Board" sub="Emergency queue · 7 patients · live" icon={ZapIcon}>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[['Active', '7', 'text-slate-900'], ['Critical', '3', 'text-red-600'], ['Beds req.', '4', 'text-brand-600'], ['Allocated', '7', 'text-emerald-600']].map(([l, v, c]) => (
            <div key={l} className="rounded-lg bg-white border border-slate-200 px-3 py-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{l}</div>
              <div className={`text-[20px] font-extrabold leading-tight ${c}`}>{v}</div>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-white border border-slate-200 divide-y divide-slate-100">
          {triage.map(([n, t, cls, bar, bed, dest]) => (
            <div key={n} className="relative flex items-center gap-3 px-3 py-2">
              <span className={`absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r ${bar}`} />
              <span className="w-28 text-[12.5px] font-semibold truncate">{n}</span>
              <span className={`text-[10.5px] font-semibold rounded-md px-2 py-0.5 ring-1 ${cls}`}>{t}</span>
              <span className="ml-auto text-[10.5px] font-mono text-slate-500">{bed}</span>
              <span className="w-24 text-right text-[10.5px] font-semibold text-accent-600">{dest}</span>
            </div>
          ))}
        </div>
      </Shell>
    </Scaled>
  );
}

const hr = [96, 98, 101, 99, 104, 102, 106, 103, 101, 99, 97, 96];

export function ICUMini() {
  const max = Math.max(...hr), min = Math.min(...hr);
  const path = hr.map((v, i) => `${i ? 'L' : 'M'}${(i / (hr.length - 1)) * 280},${6 + ((max - v) / (max - min)) * 48}`).join(' ');
  return (
    <Scaled w={640} h={420}>
      <Shell title="ICU Flowsheet · Bed ICU-04" sub="7-tab digital chart · hourly entries" icon={HeartPulseIcon}>
        <div className="flex gap-1.5 mb-3">
          {['Vitals', 'Ventilator', 'Infusions', 'I/O', 'Neuro', 'Labs', 'Lines'].map((t, i) => (
            <span key={t} className={`text-[10.5px] font-semibold rounded-md px-2 py-1 ${i === 0 ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{t}</span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[['BP', '112/68'], ['MAP', '83'], ['HR', '96'], ['SpO₂', '95%'], ['CVP', '9'], ['Temp', '37.8°']].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-white border border-slate-200 px-3 py-2">
              <div className="text-[10px] text-slate-500">{k}</div>
              <div className="text-[17px] font-bold tabular-nums">{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg bg-white border border-slate-200 p-3">
          <div className="flex items-center justify-between text-[10.5px] text-slate-500"><span className="flex items-center gap-1"><ActivityIcon size={11} /> Heart rate · 12h</span><span className="font-semibold text-brand-600">Stable</span></div>
          <svg viewBox="0 0 280 60" className="mt-1 w-full h-[70px]" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="icuMini" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff677d" stopOpacity="0.25" /><stop offset="100%" stopColor="#ff677d" stopOpacity="0" /></linearGradient></defs>
            <path d={`${path} L280,60 L0,60 Z`} fill="url(#icuMini)" />
            <path d={path} fill="none" stroke="#d93654" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </Shell>
    </Scaled>
  );
}

export function PharmacyMini() {
  return (
    <Scaled w={640} h={420}>
      <Shell title="Pharmacy" sub="Main pharmacy · store open" icon={PillIcon}>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[['Rx queue', '5', 'text-brand-600'], ['Dispensed today', '342', 'text-slate-900'], ['Low stock', '14', 'text-orange-600'], ['Expiring 30d', '6', 'text-red-600']].map(([l, v, c]) => (
            <div key={l} className="rounded-lg bg-white border border-slate-200 px-3 py-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{l}</div>
              <div className={`text-[20px] font-extrabold leading-tight ${c}`}>{v}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-3 rounded-lg bg-white border border-slate-200 divide-y divide-slate-100">
            {[['Rajesh Kumar', 'Aspirin · Atorvastatin', 'Verified', 'bg-emerald-50 text-emerald-700'], ['Lakshmi Prasanna', 'Ceftriaxone 1 g IV', 'Verify', 'bg-brand-600 text-white'], ['Arjun Mehta', 'Amoxicillin 500 mg', 'Allergy', 'bg-red-50 text-red-700'], ['Priya Nair', 'Metformin 500 mg', 'Verify', 'bg-brand-600 text-white']].map(([n, m, s, c]) => (
              <div key={n} className="flex items-center gap-2 px-3 py-2">
                <div className="flex-1 min-w-0"><div className="text-[12px] font-semibold truncate">{n}</div><div className="text-[10.5px] text-slate-500 truncate">{m}</div></div>
                <span className={`text-[10px] font-semibold rounded-md px-2 py-0.5 ${c}`}>{s}</span>
              </div>
            ))}
          </div>
          <div className="col-span-2 space-y-2">
            {[['Ceftriaxone 1 g', 21, 'bg-orange-500'], ['Insulin glargine', 45, 'bg-orange-500'], ['Ondansetron 4 mg', 92, 'bg-emerald-500']].map(([n, p, c]) => (
              <div key={n as string} className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                <div className="flex justify-between text-[10.5px]"><span className="font-semibold">{n}</span><span className="text-slate-400">{p}%</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-slate-100"><div className={`h-full rounded-full ${c}`} style={{ width: `${p}%` }} /></div>
              </div>
            ))}
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-[10.5px] font-semibold text-emerald-700">GRN posted · PO-2211 · stock updated</div>
          </div>
        </div>
      </Shell>
    </Scaled>
  );
}
