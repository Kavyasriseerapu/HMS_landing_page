import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  BedIcon, BellIcon, CalendarIcon, CardIcon, ChevronDownIcon, ChevronRightIcon, ClockIcon, CommandIcon,
  FileTextIcon, FlaskIcon, GridIcon, HeartPulseIcon, HelpIcon, MenuIcon, MessageIcon, PillIcon, PlusIcon,
  ScalpelIcon, SearchIcon, SettingsIcon, ShieldIcon, StarIcon, TargetIcon, TrendIcon, UserIcon, XIcon,
  AlertIcon, CheckIcon, SparkIcon, StethoscopeIcon, type IconType,
} from '../icons';
import { DashCtx, Pill, useDash, useNow, type ChartPatient, type ViewId } from './ui';
import { ERView, ICUView, IPView, MainDashboard, OPView, PatientsView } from './clinicalViews';
import { AnalyticsView, BillingView, GenericView, LabView, OTView, PharmacyView } from './opsViews';
import { DoctorWorkspace, InsuranceView, NurseStation } from './careViews';
import { AIHubView, type AiId } from './aiViews';

export type { AiId } from './aiViews';

export type { ViewId } from './ui';

type NavItem = { id: ViewId; label: string; icon: IconType; badge?: number; children?: string[]; chevron?: boolean; tag?: string };

export const moduleNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: GridIcon },
  { id: 'patients', label: 'Patients', icon: UserIcon, children: ['Patient Search', 'Registration'] },
  { id: 'appointments', label: 'Appointments', icon: CalendarIcon, badge: 14 },
  { id: 'er', label: 'Emergency', icon: StarIcon },
  { id: 'clinical', label: 'Doctor Workspace', icon: StethoscopeIcon },
  { id: 'ip', label: 'Inpatient', icon: BedIcon },
  { id: 'icu', label: 'Critical Care', icon: HeartPulseIcon },
  { id: 'nursing', label: 'Nurse Station', icon: ClockIcon },
  { id: 'lab', label: 'Laboratory', icon: FlaskIcon, badge: 3 },
  { id: 'radiology', label: 'Radiology', icon: TargetIcon },
  { id: 'pharmacy', label: 'Pharmacy', icon: PillIcon, badge: 8 },
  { id: 'ot', label: 'Surgery', icon: ScalpelIcon },
  { id: 'billing', label: 'Billing', icon: CardIcon },
  { id: 'insurance', label: 'Insurance', icon: ShieldIcon },
  { id: 'reports', label: 'Reports', icon: FileTextIcon },
  { id: 'analytics', label: 'Analytics', icon: TrendIcon },
  { id: 'ai', label: 'Intelligence Hub', icon: SparkIcon, tag: 'AI' },
  { id: 'admin', label: 'Administration', icon: SettingsIcon },
];

const NATIVE_W = 1280;

interface Props {
  view?: ViewId;
  /** Height of the app at its native 1280px width. */
  nativeHeight?: number;
  onViewChange?: (v: ViewId) => void;
  /** Opens a specific module inside the Intelligence Hub when view is 'ai'. */
  aiModule?: AiId;
  className?: string;
}

/**
 * A fully interactive HMS product mockup. It renders at a fixed native
 * resolution and scales to fit its container so it always reads like a
 * real screenshot rather than a cramped, reflowed layout.
 */
export default function HMSDashboard({ view = 'dashboard', nativeHeight = 800, onViewChange, aiModule, className = '' }: Props) {
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [active, setActive] = useState<ViewId>(view);
  const [palette, setPalette] = useState(false);
  const [menu, setMenu] = useState<Menu>(null);
  const [chart, setChart] = useState<ChartPatient | null>(null);
  const [form, setForm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null);
  const now = useNow();

  useEffect(() => setActive(view), [view]);

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
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const closeAll = () => {
    setPalette(false);
    setMenu(null);
    setChart(null);
    setForm(null);
  };

  const go = (v: ViewId) => {
    closeAll();
    setActive(v);
    onViewChange?.(v);
  };

  const notify = (msg: string) => setToast({ id: Date.now(), msg });
  const action = (label: string) => {
    closeAll();
    setForm(label);
  };

  const ctx = useMemo(() => ({ go, openChart: setChart, action, notify, now }), [now]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={outer} className={`relative w-full overflow-hidden ${className}`} style={{ height: nativeHeight * scale }}>
      <DashCtx.Provider value={ctx}>
        <div
          className="absolute top-0 left-0 flex flex-col bg-white font-sans text-slate-900 select-none"
          style={{ width: NATIVE_W, height: nativeHeight, transform: `scale(${scale})`, transformOrigin: 'top left', visibility: scale ? 'visible' : 'hidden' }}
        >
          <TopBar onSearch={() => setPalette(true)} menu={menu} setMenu={setMenu} />
          <div className="flex flex-1 min-h-0" onClick={() => menu && setMenu(null)}>
            <Sidebar active={active} go={go} onPalette={() => setPalette(true)} />
            <main className="flex-1 min-w-0 flex flex-col bg-slate-50 overflow-hidden">
              <div key={active} className="flex-1 min-h-0 flex flex-col animate-view-in">
                <ActiveView id={active} aiModule={aiModule} />
              </div>
            </main>
          </div>

          {palette && <CommandPalette onClose={() => setPalette(false)} go={go} />}
          {chart && <ChartDrawer p={chart} onClose={() => setChart(null)} />}
          {form && <QuickForm label={form} onClose={() => setForm(null)} />}
          {toast && (
            <div key={toast.id} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 rounded-lg bg-ink-900 text-white text-[13.5px] pl-3.5 pr-4 py-2.5 shadow-2xl animate-fade-in-up">
              <CheckIcon size={15} strokeWidth={3} className="text-brand-300" />
              {toast.msg}
            </div>
          )}
        </div>
      </DashCtx.Provider>
    </div>
  );
}

type Menu = 'notif' | 'msgs' | 'new' | null;

function ActiveView({ id, aiModule }: { id: ViewId; aiModule?: AiId }) {
  switch (id) {
    case 'clinical': return <DoctorWorkspace />;
    case 'nursing': return <NurseStation />;
    case 'insurance': return <InsuranceView />;
    case 'ai': return <AIHubView initial={aiModule} />;
    case 'dashboard': return <MainDashboard />;
    case 'er': return <ERView />;
    case 'ip': return <IPView />;
    case 'icu': return <ICUView />;
    case 'appointments': return <OPView />;
    case 'patients': return <PatientsView />;
    case 'ot': return <OTView />;
    case 'lab': return <LabView />;
    case 'pharmacy': return <PharmacyView />;
    case 'billing': return <BillingView />;
    case 'analytics': return <AnalyticsView />;
    default: return <GenericView id={id} />;
  }
}

function Dropdown({ title, extra, children, className }: { title: string; extra?: ReactNode; children: ReactNode; className: string }) {
  return (
    <div className={`absolute top-[58px] w-[360px] bg-white text-slate-900 rounded-lg shadow-2xl border border-slate-200 overflow-hidden animate-fade-in z-30 ${className}`}>
      <div className="flex items-center justify-between px-4 h-11 border-b border-slate-100">
        <span className="text-[14px] font-semibold">{title}</span>
        {extra}
      </div>
      {children}
    </div>
  );
}

function TopBar({ onSearch, menu, setMenu }: { onSearch: () => void; menu: Menu; setMenu: (m: Menu) => void }) {
  const { go, action, notify } = useDash();
  const [unread, setUnread] = useState(7);
  const [unreadMsgs, setUnreadMsgs] = useState(3);
  const toggle = (m: Menu) => setMenu(menu === m ? null : m);

  const notes: { t: string; s: string; v: ViewId; tone: 'red' | 'amber' | 'blue' }[] = [
    { t: 'Critical lab result', s: 'K⁺ 6.2, Ann Martinez, ED 12', v: 'lab', tone: 'red' },
    { t: 'Trauma activation', s: 'EMS ETA 4 min · Level 1', v: 'er', tone: 'red' },
    { t: 'Bed 3N-07 ready', s: 'Reserved for P. Okonkwo', v: 'ip', tone: 'blue' },
    { t: 'Pre-auth requires info', s: 'Karen Adams · Hysterectomy', v: 'insurance', tone: 'amber' },
  ];
  const msgs = [
    { from: 'Dr. Arjun Shah', text: 'Can we get Trauma 2 turned over? EMS is 4 out.', t: '2m' },
    { from: 'Pharmacy · M. Lopez', text: 'Heparin drip for Reed verified, on its way.', t: '9m' },
    { from: 'Bed Mgmt · Olivia', text: '3N-07 is clean and reserved for Okonkwo.', t: '14m' },
  ];
  const quick = ['Register Patient', 'Book Appointment', 'Admit Patient', 'New Lab Order'];

  return (
    <header className="relative flex items-center h-16 shrink-0 bg-ink-900 text-white border-b border-white/5 z-20">
      <div className="flex items-center gap-3 w-[248px] shrink-0 px-5 h-full border-r border-white/5">
        <div className="h-9 w-9 rounded-lg bg-brand-600 flex items-center justify-center"><PlusIcon size={18} strokeWidth={2.5} /></div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold">General Hospital</div>
          <div className="text-[12px] text-slate-400 flex items-center gap-1">Main Campus <ChevronDownIcon size={11} /></div>
        </div>
        <MenuIcon size={18} className="ml-auto text-slate-400" />
      </div>

      <button onClick={onSearch} className="ml-6 flex items-center gap-3 w-[460px] h-10 px-3.5 rounded-md bg-white/[0.06] border border-white/10 text-slate-400 text-[14px] hover:bg-white/[0.09] transition-colors">
        <SearchIcon size={16} />
        <span className="flex-1 text-left">Search patients, MRN, appointments…</span>
        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-400">⌘K</span>
      </button>

      <div className="relative ml-5">
        <button onClick={() => toggle('new')} className={`flex items-center gap-1.5 h-10 px-4 rounded-md text-[14px] font-semibold transition-colors ${menu === 'new' ? 'bg-brand-500' : 'bg-brand-600 hover:bg-brand-500'}`}>
          <PlusIcon size={16} strokeWidth={2.5} /> New <ChevronDownIcon size={14} className="opacity-70" />
        </button>
        {menu === 'new' && (
          <div className="absolute left-0 top-[50px] w-56 bg-white text-slate-800 rounded-lg shadow-2xl border border-slate-200 p-1.5 animate-fade-in z-30">
            {quick.map((q) => (
              <button key={q} onClick={() => action(q)} className="w-full flex items-center gap-2.5 h-9 px-3 rounded-md text-[13.5px] hover:bg-slate-100 text-left">
                <PlusIcon size={14} className="text-slate-400" /> {q}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-6 pr-6 text-slate-400">
        <button onClick={() => toggle('notif')} className={`relative hover:text-white ${menu === 'notif' ? 'text-white' : ''}`} aria-label="Notifications">
          <BellIcon size={19} />
          {unread > 0 && <span className="absolute -top-2 -right-2 h-[18px] min-w-[18px] px-1 rounded-full bg-red-600 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-ink-900">{unread}</span>}
        </button>
        <button onClick={() => { toggle('msgs'); setUnreadMsgs(0); }} className={`relative hover:text-white ${menu === 'msgs' ? 'text-white' : ''}`} aria-label="Messages">
          <MessageIcon size={19} />
          {unreadMsgs > 0 && <span className="absolute -top-2 -right-2 h-[18px] min-w-[18px] px-1 rounded-full bg-emerald-600 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-ink-900">{unreadMsgs}</span>}
        </button>
        <button onClick={() => notify('Help center and live chat support are available in the full product.')} className="hover:text-white" aria-label="Help">
          <HelpIcon size={19} />
        </button>
        <div className="h-8 w-px bg-white/10" />
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-brand-600 text-white text-[13px] font-semibold flex items-center justify-center">JC</div>
          <div className="leading-tight">
            <div className="text-[14px] font-semibold text-white">Jessica Carter</div>
            <div className="text-[12px] text-slate-400">RN · 3N Medical</div>
          </div>
        </div>
      </div>

      {menu === 'notif' && (
        <Dropdown
          title="Notifications"
          className="right-44"
          extra={
            unread > 0 ? (
              <button onClick={() => setUnread(0)} className="text-[12px] text-brand-600 font-medium hover:text-brand-700">Mark all read</button>
            ) : (
              <span className="text-[12px] text-slate-400">All caught up</span>
            )
          }
        >
          {notes.map((n) => (
            <button key={n.t} onClick={() => go(n.v)} className="w-full text-left flex gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0">
              <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${unread === 0 ? 'bg-slate-300' : n.tone === 'red' ? 'bg-red-500' : n.tone === 'amber' ? 'bg-amber-500' : 'bg-brand-500'}`} />
              <span>
                <span className="block text-[13px] font-semibold">{n.t}</span>
                <span className="block text-[12px] text-slate-500">{n.s}</span>
              </span>
            </button>
          ))}
        </Dropdown>
      )}

      {menu === 'msgs' && (
        <Dropdown title="Secure messages" className="right-32" extra={<span className="text-[12px] text-slate-400">Care team</span>}>
          {msgs.map((m) => (
            <div key={m.from} className="flex gap-3 px-4 py-3 border-b border-slate-100 last:border-0">
              <span className="h-8 w-8 shrink-0 rounded-full bg-brand-50 text-brand-700 text-[11px] font-semibold flex items-center justify-center">
                {m.from.replace(/^Dr\.\s*/, '').split(' ').map((x) => x[0]).slice(0, 2).join('')}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex justify-between text-[13px] font-semibold">{m.from}<span className="text-[11px] font-normal text-slate-400">{m.t}</span></span>
                <span className="block text-[12.5px] text-slate-600">{m.text}</span>
              </span>
            </div>
          ))}
        </Dropdown>
      )}
    </header>
  );
}

function QuickForm({ label, onClose }: { label: string; onClose: () => void }) {
  const { notify } = useDash();
  const [name, setName] = useState('');
  const [dept, setDept] = useState('Emergency');
  const [err, setErr] = useState(false);
  const save = () => {
    if (!name.trim()) return setErr(true);
    onClose();
    notify(`${label}: saved for ${name.trim()} (demo record).`);
  };
  return (
    <div className="absolute inset-0 z-30 bg-slate-900/40 backdrop-blur-[2px] flex items-start justify-center pt-24" onClick={onClose}>
      <div className="w-[520px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 h-14 border-b border-slate-100">
          <div className="text-[16px] font-semibold text-slate-900">{label}</div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700" aria-label="Close"><XIcon size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <label className="block">
            <span className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Patient or item name <span className="text-red-500">*</span></span>
            <input
              autoFocus
              value={name}
              onChange={(e) => { setName(e.target.value); setErr(false); }}
              onKeyDown={(e) => e.key === 'Enter' && save()}
              placeholder="e.g. Maria Santos"
              className={`w-full h-10 px-3 rounded-md border text-[14px] outline-none focus:ring-2 focus:ring-brand-500/20 ${err ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-brand-500'}`}
            />
            {err && <span className="block mt-1 text-[12px] text-red-600">Please enter a name.</span>}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Department</span>
              <select value={dept} onChange={(e) => setDept(e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-200 text-[14px] bg-white outline-none focus:border-brand-500">
                {['Emergency', 'Inpatient', 'Critical Care', 'Outpatient', 'Surgery', 'Laboratory', 'Pharmacy', 'Billing'].map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Priority</span>
              <select className="w-full h-10 px-3 rounded-md border border-slate-200 text-[14px] bg-white outline-none focus:border-brand-500">
                <option>Routine</option><option>Urgent</option><option>STAT</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Notes</span>
            <textarea rows={3} placeholder="Optional" className="w-full px-3 py-2 rounded-md border border-slate-200 text-[14px] outline-none focus:border-brand-500 resize-none" />
          </label>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50">
          <button onClick={onClose} className="h-9 px-4 rounded-md border border-slate-200 bg-white text-[13.5px] font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
          <button onClick={save} className="h-9 px-4 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-[13.5px] font-semibold">Save</button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ active, go, onPalette }: { active: ViewId; go: (v: ViewId) => void; onPalette: () => void }) {
  return (
    <aside className="w-[248px] shrink-0 flex flex-col bg-ink-900 text-slate-300">
      <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-2.5 space-y-px">
        {moduleNav.map(({ id, label, icon: Icon, badge, children, chevron, tag }) => {
          const on = id === active;
          return (
            <div key={id}>
              <button
                onClick={() => go(id)}
                className={`w-full flex items-center gap-3 rounded-md px-3 h-8 text-[14px] transition-colors ${
                  on ? 'bg-brand-600 text-white font-medium shadow-sm' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={17} className={on ? 'text-white' : 'text-slate-400'} />
                <span className="flex-1 text-left">{label}</span>
                {tag && <span className={`text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded ${on ? 'bg-white/20 text-white' : 'bg-gradient-to-r from-brand-500 to-accent-500 text-white'}`}>{tag}</span>}
                {badge && <span className="h-5 min-w-5 px-1.5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center">{badge}</span>}
                {children && <ChevronDownIcon size={15} className="text-slate-500" />}
                {chevron && <ChevronRightIcon size={15} className="text-slate-500" />}
              </button>
              {children && on && (
                <div className="pl-11 py-0.5">
                  {children.map((c) => (
                    <button key={c} onClick={() => go('patients')} className="block w-full text-left h-8 text-[13px] text-slate-400 hover:text-white">
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/5">
        <button onClick={onPalette} className="w-full flex items-center gap-2.5 h-10 px-3 rounded-md border border-white/10 bg-white/[0.03] text-[13px] text-slate-400 hover:text-white hover:bg-white/[0.06]">
          <CommandIcon size={15} />
          <span className="flex-1 text-left">Command Palette</span>
          <span className="text-[11px] font-mono text-slate-500">⌘K</span>
        </button>
      </div>
    </aside>
  );
}

function CommandPalette({ onClose, go }: { onClose: () => void; go: (v: ViewId) => void }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const items = moduleNav.filter((m) => m.label.toLowerCase().includes(q.toLowerCase()));
  const quick = ['Register new patient', 'Book appointment', 'Admit patient', 'Order lab test'];

  return (
    <div className="absolute inset-0 z-30 bg-slate-900/40 backdrop-blur-[2px] flex items-start justify-center pt-24" onClick={onClose}>
      <div className="w-[600px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 h-14 border-b border-slate-100">
          <SearchIcon size={18} className="text-slate-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, items.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
              if (e.key === 'Enter' && items[sel]) go(items[sel].id);
              if (e.key === 'Escape') onClose();
            }}
            placeholder="Jump to a module, patient or action…"
            className="flex-1 text-[15px] outline-none placeholder-slate-400"
          />
          <span className="text-[11px] font-mono text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">ESC</span>
        </div>
        <div className="max-h-[420px] overflow-y-auto p-2">
          <div className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Modules</div>
          {items.map((m, i) => (
            <button
              key={m.id}
              onMouseEnter={() => setSel(i)}
              onClick={() => go(m.id)}
              className={`w-full flex items-center gap-3 px-3 h-10 rounded-md text-[14px] ${i === sel ? 'bg-brand-50 text-brand-700' : 'text-slate-700'}`}
            >
              <m.icon size={16} />
              <span className="flex-1 text-left">{m.label}</span>
              {i === sel && <span className="text-[11px] text-brand-600">↵ Open</span>}
            </button>
          ))}
          {items.length === 0 && <div className="px-3 py-6 text-[13px] text-slate-500 text-center">No modules match “{q}”</div>}
          {!q && (
            <>
              <div className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Quick actions</div>
              {quick.map((a) => (
                <div key={a} className="flex items-center gap-3 px-3 h-10 rounded-md text-[14px] text-slate-700">
                  <PlusIcon size={16} className="text-slate-400" /> {a}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ChartDrawer({ p, onClose }: { p: ChartPatient; onClose: () => void }) {
  const { notify, action } = useDash();
  const vitals = [
    ['HR', '98', 'bpm'],
    ['BP', '142/88', 'mmHg'],
    ['SpO₂', '96', '%'],
    ['Temp', '37.4', '°C'],
    ['RR', '18', '/min'],
    ['Pain', '6', '/10'],
  ];
  const timeline = [
    ['10:44', 'Lab result posted — BMP'],
    ['10:31', 'Medication given — Ondansetron 4 mg IV'],
    ['10:22', 'Imaging ordered — CT per protocol'],
    ['10:09', 'Provider assessment — ' + p.provider],
    ['09:58', 'Triage complete' + (p.acuity ? ` — ${p.acuity}` : '')],
  ];
  return (
    <div className="absolute inset-0 z-30" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/30" />
      <aside className="absolute right-0 top-0 bottom-0 w-[460px] bg-white shadow-2xl flex flex-col animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3 p-5 border-b border-slate-200">
          <div className="h-12 w-12 rounded-full bg-brand-50 text-brand-700 font-semibold flex items-center justify-center text-[15px]">
            {p.name.split(' ').map((s) => s[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1">
            <div className="text-[18px] font-bold text-slate-900">{p.name}</div>
            <div className="text-[13px] text-slate-500">{p.age} yrs · {p.sex} · <span className="font-mono">{p.mrn}</span></div>
            <div className="flex flex-wrap gap-2 mt-2">
              {p.acuity && <Pill tone="red">{p.acuity}</Pill>}
              <Pill tone="blue">{p.location}</Pill>
              {p.allergies ? <Pill tone="amber">Allergy: {p.allergies}</Pill> : <Pill tone="green">NKDA</Pill>}
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><XIcon size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Presenting problem</div>
            <div className="text-[14px] text-slate-800">{p.complaint} · Attending {p.provider}</div>
          </div>
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Latest vitals · 10:40</div>
            <div className="grid grid-cols-3 gap-2">
              {vitals.map(([l, v, u]) => (
                <div key={l} className="rounded-md border border-slate-200 px-3 py-2">
                  <div className="text-[11px] text-slate-500">{l}</div>
                  <div className="text-[16px] font-semibold text-slate-900 tabular-nums">{v} <span className="text-[11px] font-normal text-slate-400">{u}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Active orders</div>
            <div className="space-y-2">
              {[['Troponin I (hs) — serial', 'Pending', 'amber'], ['ECG 12-lead', 'Complete', 'green'], ['NS 0.9% 1 L IV bolus', 'Running', 'blue']].map(([o, s, t]) => (
                <div key={o} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-[13px]">
                  <span className="text-slate-800">{o}</span>
                  <Pill tone={t as 'amber'}>{s}</Pill>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Timeline</div>
            <div className="relative pl-4 border-l border-slate-200 space-y-3">
              {timeline.map(([t, e]) => (
                <div key={t} className="relative text-[13px]">
                  <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-white border-2 border-brand-500" />
                  <span className="font-mono text-slate-400 mr-2">{t}</span>
                  <span className="text-slate-700">{e}</span>
                </div>
              ))}
            </div>
          </div>
          {p.allergies && (
            <div className="flex gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-[13px] text-amber-900">
              <AlertIcon size={16} className="text-amber-600 shrink-0 mt-0.5" />
              Allergy alert is enforced at order entry and pharmacy verification.
            </div>
          )}
        </div>
        <div className="flex gap-2 p-4 border-t border-slate-200">
          <button onClick={() => notify('The full chart (notes, flowsheets, imaging) is available in the full product.')} className="flex-1 h-10 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-[14px] font-semibold">Open full chart</button>
          <button onClick={() => action('New Order')} className="h-10 px-4 rounded-md border border-slate-200 hover:bg-slate-50 text-[14px] font-medium text-slate-700">New order</button>
        </div>
      </aside>
    </div>
  );
}
