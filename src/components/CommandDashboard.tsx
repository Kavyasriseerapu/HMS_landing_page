import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIcon, AlertIcon, ArrowRightIcon, BedIcon, BellIcon, BuildingIcon, CalendarIcon, CardIcon, CheckIcon,
  ChevronRightIcon, ClipboardIcon, CommandIcon, FileTextIcon, FlaskIcon, GridIcon, HeartPulseIcon, HelpIcon, MenuIcon,
  MessageIcon, PillIcon, PlusIcon, RefreshIcon, ScalpelIcon, ScanIcon, SearchIcon, SettingsIcon, ShieldIcon, SparkIcon,
  StarIcon, StethoscopeIcon, TrendIcon, UserCogIcon, UserIcon, UsersIcon, XIcon, ZapIcon, type IconType,
} from './icons';

/**
 * Replica of the HospAI "Hospital Operations & Census Command" dashboard.
 * Renders at a fixed native size and scales to its container like a screenshot.
 */

const NATIVE_W = 1520;

type Nav = { label: string; icon: IconType; badge?: number; sub?: boolean };
const nav: Nav[] = [
  { label: 'Dashboard', icon: GridIcon },
  { label: 'Doctor Workspace', icon: StethoscopeIcon },
  { label: 'Reception', icon: UsersIcon, sub: true },
  { label: 'OP Department', icon: ClipboardIcon, sub: true },
  { label: 'Clinical', icon: FileTextIcon, sub: true },
  { label: 'Emergency', icon: ZapIcon, badge: 6, sub: true },
  { label: 'Inpatient', icon: BedIcon, sub: true },
  { label: 'ICU', icon: HeartPulseIcon },
  { label: 'Nursing', icon: ActivityIcon },
  { label: 'Laboratory', icon: FlaskIcon, badge: 12 },
  { label: 'Radiology', icon: ScanIcon },
  { label: 'Pharmacy', icon: PillIcon, badge: 11, sub: true },
  { label: 'Surgery', icon: ScalpelIcon },
  { label: 'Billing', icon: CardIcon, sub: true },
  { label: 'Insurance', icon: ShieldIcon },
  { label: 'HR & Staff', icon: UserCogIcon, sub: true },
  { label: 'Doctor Scheduling', icon: CalendarIcon },
  { label: 'Hosp AI', icon: SparkIcon, sub: true },
  { label: 'Reports', icon: TrendIcon, sub: true },
  { label: 'Administration', icon: SettingsIcon },
];

const kpis = [
  { l: 'Patients today', v: '80', tag: '+5 today', sub: 'Active hospital census', link: 'View all', chip: 'Patients', icon: UserIcon, bar: 'from-brand-400 to-brand-600', tint: 'text-brand-600 bg-brand-50' },
  { l: 'Appointments', v: '194', tag: 'Live queue', sub: '8 scheduled today', link: 'Schedule', chip: 'Outpatient', icon: CalendarIcon, bar: 'from-accent-400 to-accent-600', tint: 'text-accent-600 bg-accent-400/15' },
  { l: 'Inpatient admissions', v: '4', tag: 'In care', sub: '54 beds available', link: 'Bed board', chip: 'Inpatient', icon: BedIcon, bar: 'from-brand-500 to-accent-600', tint: 'text-accent-500 bg-accent-400/15' },
  { l: 'Discharges ready', v: '4', tag: 'Clearance queue', sub: '0 from ICU portal', link: 'View queue', chip: 'Discharge', icon: ArrowRightIcon, bar: 'from-dust-300 to-dust-400', tint: 'text-emerald-600 bg-emerald-50' },
  { l: 'ED waiting room', v: '6', tag: 'Live ER feed', sub: '2 ESI-1 or ESI-2 critical', link: 'View ED', chip: 'Emergency', icon: StarIcon, bar: 'from-rose-500 to-red-600', tint: 'text-rose-600 bg-rose-50' },
  { l: 'Critical alerts', v: '2', tag: 'High urgency', sub: 'Action required', link: 'Review', chip: 'Safety', icon: AlertIcon, bar: 'from-red-500 to-orange-500', tint: 'text-red-600 bg-red-50' },
];

const depts = [
  { n: 'Emergency Dept.', w: 'ED Wing', icon: StarIcon, care: 6, waiting: 0, crit: 2, avail: 36, used: 6, cap: 42, act: 'View ER' },
  { n: '3-North · Medical', w: '3N Wing', icon: BedIcon, care: 4, waiting: 0, crit: 2, avail: 1, used: 4, cap: 26, act: 'View 3N ward' },
  { n: '4-South · Surgical', w: '4S Wing', icon: BedIcon, care: 4, waiting: 0, crit: 1, avail: 3, used: 4, cap: 32, act: 'View 4S ward' },
  { n: 'Intensive Care (ICU)', w: 'ICU Wing', icon: HeartPulseIcon, care: 12, waiting: 0, crit: 6, avail: 2, used: 12, cap: 14, act: 'View ICU' },
  { n: 'Operating Rooms', w: 'OR Wing', icon: ScalpelIcon, care: 2, waiting: 3, crit: 0, avail: 3, used: 2, cap: 5, act: 'View surgery' },
];

const appts = [
  { n: 'Ravi Teja', who: 'Duty Physician · Awaiting triage', t: '09:30 AM', s: 'Registered', c: 'bg-slate-100 text-slate-600' },
  { n: 'Lakshmi Prasanna', who: 'Duty Physician · Awaiting triage', t: '09:45 AM', s: 'In queue', c: 'bg-amber-50 text-amber-700' },
  { n: 'Suresh Babu', who: 'Dr. P. R. K. Varma · Cardiology', t: '10:00 AM', s: 'Consultation completed', c: 'bg-emerald-50 text-emerald-700' },
  { n: 'Priya Nair', who: 'Dr. U. Nagaraju · General Medicine', t: '10:15 AM', s: 'Under consultation', c: 'bg-brand-50 text-brand-700' },
  { n: 'Mohammed Irfan', who: 'Dr. D. Krishnam Raju · General Medicine', t: '10:30 AM', s: 'Under consultation', c: 'bg-brand-50 text-brand-700' },
  { n: 'Akhil Setty', who: 'Dr. P. R. K. Varma · Cardiology', t: '10:45 AM', s: 'Under consultation', c: 'bg-brand-50 text-brand-700' },
];

export function HospAILogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 72" className={compact ? 'h-9' : 'h-[58px]'} aria-hidden="true">
        {/* circuit nodes */}
        {[[14, 16], [14, 40], [106, 16], [106, 40], [30, 6], [90, 6]].map(([x, y], i) => (
          <g key={i}>
            <line x1={x} y1={y} x2={x < 60 ? 40 : 80} y2={Math.min(Math.max(y, 22), 44)} stroke="#ff8a9b" strokeWidth="2" />
            <circle cx={x} cy={y} r="4" fill="#2a2d34" stroke="#ff8a9b" strokeWidth="2" />
          </g>
        ))}
        {/* building */}
        <rect x="38" y="22" width="44" height="46" rx="3" fill="#e2e8f0" />
        <rect x="46" y="10" width="28" height="18" rx="2" fill="#f8fafc" />
        {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={43 + c * 9} y={36 + r * 9} width="5" height="5" rx="1" fill="#ff677d" />))}
        <rect x="55" y="58" width="10" height="10" fill="#392f5a" />
        {/* cross */}
        <rect x="54" y="4" width="12" height="28" rx="2.5" fill="#ef4444" stroke="white" strokeWidth="2" />
        <rect x="46" y="12" width="28" height="12" rx="2.5" fill="#ef4444" stroke="white" strokeWidth="2" />
      </svg>
      <div className={`font-display font-extrabold tracking-tight leading-none ${compact ? 'text-[18px]' : 'text-[30px] mt-1'}`}>
        <span className="text-white">Hosp</span>
        <span className="text-brand-400">AI</span>
      </div>
      {!compact && <div className="mt-1 text-[8.5px] text-slate-400 tracking-wide">— AI Driven Healthcare Optimization —</div>}
    </div>
  );
}

export default function CommandDashboard({ nativeHeight = 1010 }: { nativeHeight?: number }) {
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [active, setActive] = useState('Dashboard');
  const [alerts, setAlerts] = useState([true, true]);
  const [spin, setSpin] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  useLayoutEffect(() => {
    const el = outer.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / NATIVE_W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const refresh = () => {
    setSpin(true);
    setTimeout(() => { setSpin(false); setNow(new Date()); setAlerts([true, true]); setToast('Dashboard refreshed · all feeds live'); }, 700);
  };
  const go = (label: string) => {
    setActive(label);
    if (label !== 'Dashboard') setToast(`${label} opens in the full product`);
  };

  return (
    <div ref={outer} className="relative w-full overflow-hidden" style={{ height: nativeHeight * scale }}>
      <div
        className="absolute top-0 left-0 flex bg-slate-50 font-sans text-slate-900 select-none"
        style={{ width: NATIVE_W, height: nativeHeight, transform: `scale(${scale})`, transformOrigin: 'top left', visibility: scale ? 'visible' : 'hidden' }}
      >
        {/* ── Sidebar ── */}
        <aside className="w-[250px] shrink-0 bg-ink-900 text-slate-300 flex flex-col">
          <div className="h-[132px] flex items-center justify-center border-b border-white/5">
            <HospAILogo />
          </div>
          <nav className="flex-1 overflow-hidden px-3 py-2.5 space-y-[2px]">
            {nav.map((n) => {
              const on = n.label === active;
              return (
                <button
                  key={n.label}
                  onClick={() => go(n.label)}
                  className={`w-full flex items-center gap-3 h-[33px] px-3 rounded-lg text-[14px] transition-colors ${on ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold shadow-lg shadow-brand-600/30' : 'hover:bg-white/5 hover:text-white'}`}
                >
                  <n.icon size={17} className={on ? 'text-white' : 'text-slate-400'} />
                  <span className="flex-1 text-left">{n.label}</span>
                  {n.badge && <span className="h-5 min-w-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">{n.badge}</span>}
                  {n.sub && <ChevronRightIcon size={14} className="text-slate-500" />}
                </button>
              );
            })}
          </nav>
          <div className="p-3 border-t border-white/5">
            <div className="flex items-center gap-2.5 h-10 px-3 rounded-lg border border-white/10 bg-white/[0.03] text-[13px] text-slate-400">
              <CommandIcon size={15} /> <span className="flex-1">Command Palette</span> <span className="text-[11px] font-mono text-slate-500">Ctrl+K</span>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 flex flex-col">
          {/* ── Top bar ── */}
          <header className="flex items-center h-14 shrink-0 bg-ink-900 text-white px-4 gap-4 border-b border-white/5">
            <MenuIcon size={20} className="text-slate-400" />
            <div className="ml-10 flex items-center gap-3 w-[470px] h-10 px-4 rounded-xl bg-white/[0.06] border border-white/10 text-slate-400 text-[14px]">
              <SearchIcon size={16} /> <span className="flex-1">Search patients, MRN, appointments…</span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white/10">Ctrl</span><span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white/10">K</span>
            </div>
            <button onClick={() => setToast('Quick create opens in the full product')} className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-gradient-to-r from-brand-600 to-accent-600 hover:brightness-110 text-[14px] font-semibold"><PlusIcon size={16} strokeWidth={2.5} /> New</button>
            <div className="ml-auto flex items-center gap-5 text-slate-400">
              <span className="flex items-center rounded-lg bg-white/[0.06] text-[12px] font-semibold overflow-hidden">{['A-', 'A', 'A+'].map((a) => <span key={a} className="px-2 py-1">{a}</span>)}</span>
              <span className="relative"><BellIcon size={18} /><span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">!</span></span>
              <span className="relative"><MessageIcon size={18} /><span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-emerald-500 text-[9px] font-bold text-white flex items-center justify-center">3</span></span>
              <HelpIcon size={18} />
              <span className="h-8 w-px bg-white/10" />
              <span className="flex items-center gap-2.5">
                <span className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 text-white text-[13px] font-bold flex items-center justify-center">HA</span>
                <span className="leading-tight">
                  <span className="flex items-center gap-1.5 text-[14px] font-semibold text-white">Hospital Administrator <span className="text-[10px] font-bold rounded bg-brand-500/25 text-brand-200 px-1.5 py-0.5">Role</span></span>
                  <span className="block text-[12px] text-brand-300">System Administrator</span>
                </span>
              </span>
            </div>
          </header>

          <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 px-6 h-9 bg-white border-b border-slate-200 text-[13px] shrink-0">
              <span className="text-slate-400">Home</span><ChevronRightIcon size={13} className="text-slate-300" /><span className="font-semibold">Dashboard</span>
            </div>

            {/* Page header */}
            <div className="flex items-center gap-4 px-6 py-4 bg-white border-b border-slate-200 shrink-0">
              <span className="h-11 w-11 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 text-white flex items-center justify-center shadow-md shadow-brand-600/25"><BuildingIcon size={20} /></span>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-[20px] font-bold tracking-tight">Hospital Operations & Census Command</h1>
                  <span className="text-[10.5px] font-bold rounded bg-emerald-600 text-white px-2 py-0.5 tracking-wide">HOSPITAL ADMIN</span>
                </div>
                <div className="text-[13.5px] text-slate-500 mt-0.5">
                  Welcome, <span className="font-semibold text-slate-700">Hospital Administrator</span> · Administration · <span className="font-mono">{date}</span> · <span className="font-mono text-[12px] rounded bg-slate-100 px-1.5 py-0.5">hosp-default</span>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2.5">
                <span className="flex items-center gap-2 h-9 px-3.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-[13px] font-semibold"><span className="relative flex h-2 w-2"><span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping-slow" /><span className="relative h-2 w-2 rounded-full bg-emerald-500" /></span>All systems operational</span>
                <span className="flex items-center gap-2 h-9 px-3.5 rounded-full border border-red-200 bg-red-50 text-red-700 text-[13px] font-semibold"><span className="h-2 w-2 rounded-full bg-red-500" />ED active: 6</span>
                <button onClick={refresh} className="flex items-center gap-2 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[13.5px] font-medium text-slate-700 hover:bg-slate-50"><RefreshIcon size={15} className={spin ? 'animate-spin' : ''} /> Refresh</button>
              </div>
            </div>

            <div className="flex-1 min-h-0 p-5 flex flex-col gap-4 overflow-hidden">
              {/* Alerts */}
              {alerts[0] && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-white px-4 py-3 shrink-0 animate-view-in">
                  <span className="h-8 w-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"><AlertIcon size={16} /></span>
                  <div className="flex-1">
                    <div className="text-[13.5px] font-semibold text-red-700">Critical lab result: Patient 1016 (MRN #UMR10016)</div>
                    <div className="text-[13px] text-red-600/90">Lab result marked STAT critical. Requires immediate physician review.</div>
                  </div>
                  <button onClick={() => { setAlerts([false, alerts[1]]); setToast('Critical result routed to the attending physician'); }} className="h-8 px-3.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[12.5px] font-semibold">Review now</button>
                </div>
              )}
              {alerts[1] && (
                <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white px-4 py-3 shrink-0 animate-view-in">
                  <span className="h-8 w-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center"><ZapIcon size={16} /></span>
                  <div className="flex-1">
                    <div className="text-[13.5px] font-semibold text-amber-800">Emergency department live census</div>
                    <div className="text-[13px] text-amber-700/90">ED census at 6 active patients. 2 high-priority ESI-1/2 cases in care.</div>
                  </div>
                  <button onClick={() => { setAlerts([alerts[0], false]); setToast('Opening the ED track board'); }} className="h-8 px-3.5 rounded-lg border border-amber-300 bg-white text-amber-800 text-[12.5px] font-semibold hover:bg-amber-50">View ED board</button>
                </div>
              )}

              {/* KPI cards */}
              <div className="grid grid-cols-6 gap-3 shrink-0">
                {kpis.map((k) => (
                  <div key={k.l} className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${k.bar}`} />
                    <div className="flex items-start justify-between">
                      <div className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-slate-500 leading-tight pr-2">{k.l}</div>
                      <span className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${k.tint}`}><k.icon size={15} /></span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-[30px] font-extrabold leading-none tabular-nums">{k.v}</span>
                      <span className={`text-[12px] font-mono font-semibold ${k.tint.split(' ')[0]}`}>{k.tag}</span>
                    </div>
                    <div className="mt-1 text-[12.5px] text-slate-500">{k.sub}</div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className={`text-[12.5px] font-semibold ${k.tint.split(' ')[0]}`}>{k.link} →</span>
                      <span className="text-[11px] rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">{k.chip}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Census + appointments */}
              <div className="flex-1 min-h-0 grid grid-cols-12 gap-4">
                <div className="col-span-8 rounded-xl bg-white border border-slate-200 flex flex-col overflow-hidden">
                  <div className="flex items-center gap-3 px-5 h-[60px] border-b border-slate-100 shrink-0">
                    <span className="h-9 w-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center"><BedIcon size={17} /></span>
                    <div>
                      <div className="text-[14.5px] font-bold">Department census & capacity</div>
                      <div className="text-[12.5px] text-slate-500">Real-time patient distribution across care units</div>
                    </div>
                    <span className="ml-auto text-[13px] font-medium text-brand-600">Full bed board →</span>
                  </div>
                  <table className="w-full table-fixed text-left">
                    <colgroup><col style={{ width: '29%' }} /><col style={{ width: '8%' }} /><col style={{ width: '11%' }} /><col style={{ width: '13%' }} /><col style={{ width: '11%' }} /><col style={{ width: '13%' }} /><col style={{ width: '15%' }} /></colgroup>
                    <thead>
                      <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 border-b border-slate-100">
                        {['Department', 'In care', 'Waiting', 'Critical', 'Available', 'Capacity', 'Action'].map((h) => <th key={h} className="px-4 py-2.5 whitespace-nowrap">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {depts.map((d) => {
                        const pct = Math.round((d.used / d.cap) * 100);
                        return (
                          <tr key={d.n} className="border-b border-slate-100 last:border-0 hover:bg-brand-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <span className="h-8 w-8 shrink-0 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center"><d.icon size={15} /></span>
                                <div className="min-w-0">
                                  <div className="text-[14px] font-semibold truncate">{d.n}</div>
                                  <div className="text-[11.5px] font-mono text-slate-400">{d.w}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[15px] font-bold tabular-nums">{d.care}</td>
                            <td className="px-4 py-3">{d.waiting ? <span className="text-[12px] font-mono font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 whitespace-nowrap">{d.waiting} waiting</span> : <span className="text-slate-300">—</span>}</td>
                            <td className="px-4 py-3">{d.crit ? <span className="text-[12px] font-mono font-semibold rounded-full bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 whitespace-nowrap">{d.crit} ESI-1/2</span> : <span className="text-slate-300">—</span>}</td>
                            <td className="px-4 py-3"><span className="text-[12px] font-mono font-semibold rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 whitespace-nowrap">{d.avail} beds</span></td>
                            <td className="px-4 py-3">
                              <div className="flex justify-between text-[11.5px] font-mono"><span className="font-semibold">{pct}%</span><span className="text-slate-400">{d.used}/{d.cap}</span></div>
                              <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full rounded-full ${pct >= 80 ? 'bg-red-500' : pct >= 35 ? 'bg-emerald-500' : 'bg-accent-500'}`} style={{ width: `${pct}%` }} /></div>
                            </td>
                            <td className="px-4 py-3 text-[13px] font-medium text-slate-600 whitespace-nowrap">{d.act} →</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="col-span-4 rounded-xl bg-white border border-slate-200 flex flex-col overflow-hidden">
                  <div className="flex items-center gap-3 px-5 h-[60px] border-b border-slate-100 shrink-0">
                    <span className="h-9 w-9 rounded-lg bg-accent-400/15 text-accent-600 flex items-center justify-center"><CalendarIcon size={17} /></span>
                    <span className="text-[14.5px] font-bold">Today's appointments</span>
                    <span className="ml-auto text-[13px] font-medium text-slate-500">View all →</span>
                  </div>
                  <div className="flex-1 overflow-hidden divide-y divide-slate-100">
                    {appts.map((a) => (
                      <div key={a.n} className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50">
                        <span className="h-9 w-9 shrink-0 rounded-full bg-brand-50 text-brand-600 text-[12px] font-bold flex items-center justify-center">{a.n.split(' ').map((x) => x[0]).join('')}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-semibold truncate">{a.n}</div>
                          <div className="text-[12px] text-slate-500 truncate">{a.who}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[12px] font-mono text-slate-600">{a.t}</div>
                          <span className={`mt-1 inline-flex items-center gap-1 text-[11px] font-semibold rounded-full px-2 py-0.5 ${a.c}`}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />{a.s}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {toast && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-xl bg-ink-900 text-white text-[13.5px] px-4 py-2.5 shadow-2xl animate-fade-in-up">
            <CheckIcon size={15} strokeWidth={3} className="text-emerald-400" /> {toast}
            <button onClick={() => setToast(null)} className="ml-1 text-slate-500 hover:text-white"><XIcon size={14} /></button>
          </div>
        )}
      </div>
    </div>
  );
}
