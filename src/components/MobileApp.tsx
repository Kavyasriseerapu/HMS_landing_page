import { useEffect, useState } from 'react';
import {
  AlertIcon, BellIcon, CheckIcon, ChevronRightIcon, ClipboardIcon, PlusIcon, SearchIcon, SparkIcon, UsersIcon, XIcon,
} from './icons';

export type MobileTab = 'patients' | 'tasks' | 'alerts' | 'ai';

const W = 300;
const H = 620;

const patients = [
  { name: 'Ann Martinez', meta: '52 F · ED Bay 12', flag: 'Critical result', tone: 'red', vit: [['HR', '104'], ['BP', '158/92'], ['SpO₂', '97%']], ai: 'Hyperkalemia with AKI. Calcium given; shifting therapy in progress. Repeat K⁺ at 12:00.' },
  { name: 'Patricia Okonkwo', meta: '71 F · ED Bay 4', flag: 'To theatre', tone: 'violet', vit: [['HR', '88'], ['BP', '134/80'], ['SpO₂', '96%']], ai: 'Displaced R femoral neck fracture after a fall. Booked for hemiarthroplasty in OR 3 today.' },
  { name: 'George Watts', meta: '60 M · ED Bay 11', flag: 'Reassess BP', tone: 'amber', vit: [['HR', '82'], ['BP', '176/104'], ['SpO₂', '98%']], ai: 'Hypertensive urgency without end-organ damage. Oral therapy started; recheck at 11:15.' },
  { name: 'Robert Hale', meta: '66 M · 3N-01', flag: 'Discharge today', tone: 'green', vit: [['HR', '78'], ['BP', '128/76'], ['SpO₂', '97%']], ai: 'Urosepsis resolved on oral antibiotics. AI discharge summary drafted for your review.' },
] as const;

const toneCls = {
  red: 'bg-red-50 text-red-700',
  violet: 'bg-violet-50 text-violet-700',
  amber: 'bg-amber-50 text-amber-700',
  green: 'bg-emerald-50 text-emerald-700',
} as const;

const tasksInit = [
  { t: '10:30', what: 'Pip-tazo 4.5 g IV', who: 'R. Hale · 3N-01', late: true, done: false },
  { t: '11:00', what: 'Furosemide 40 mg IV', who: 'M. Iyer · 3N-02', late: false, done: false },
  { t: '11:00', what: 'Vitals + pain score', who: 'L. Gomez · 3N-04', late: false, done: false },
  { t: '12:00', what: 'Metoprolol 25 mg PO', who: 'M. Iyer · 3N-02', late: false, done: false },
];

const alertsInit = [
  { id: 1, t: 'Critical lab: K⁺ 6.2', s: 'Ann Martinez · ED 12', red: true },
  { id: 2, t: 'Call light 3N-02', s: 'M. Iyer · 2 min ago', red: true },
  { id: 3, t: 'Bed 3N-07 ready', s: 'Reserved for P. Okonkwo', red: false },
];

const aiQA: [string, string][] = [
  ['Summarize my patients', '4 patients: 1 critical (Martinez, K⁺ 6.2), 1 going to theatre, 1 BP recheck due 11:15, 1 ready for discharge.'],
  ['Draft discharge for Hale', 'Draft ready: urosepsis treated, stepped down to oral ciprofloxacin, Cr back to baseline. PCP follow-up in 7 days. Sent to you for review.'],
];

/** Interactive phone mockup of the HospAI mobile app. Renders at 300×620 and scales. */
export default function MobileApp({ initial = 'patients', scale = 1, className = '' }: { initial?: MobileTab; scale?: number; className?: string }) {
  const [tab, setTab] = useState<MobileTab>(initial);
  const [open, setOpen] = useState<number | null>(null);
  const [tasks, setTasks] = useState(tasksInit);
  const [alerts, setAlerts] = useState(alertsInit);
  const [chat, setChat] = useState<[string, string][]>([]);
  const [thinking, setThinking] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M/, '');
  const pending = tasks.filter((t) => !t.done).length;

  const ask = (q: string, a: string) => {
    setThinking(true);
    setTimeout(() => { setChat((c) => [...c, [q, a]]); setThinking(false); }, 800);
  };

  return (
    <div className={`relative ${className}`} style={{ width: (W + 24) * scale, height: (H + 24) * scale }}>
      <div className="absolute top-0 left-0" style={{ width: W + 24, height: H + 24, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {/* Device frame */}
        <div className="relative h-full w-full rounded-[48px] bg-ink-900 p-3 shadow-[0_40px_80px_-24px_rgba(7,26,36,0.55)] ring-1 ring-black/40">
          <div className="absolute -left-[3px] top-28 h-12 w-[3px] rounded-l bg-ink-700" />
          <div className="absolute -right-[3px] top-36 h-20 w-[3px] rounded-r bg-ink-700" />
          <div className="relative h-full w-full overflow-hidden rounded-[38px] bg-slate-50 font-sans text-slate-900 select-none flex flex-col">
            {/* Status bar */}
            <div className="relative shrink-0 flex items-center justify-between px-7 pt-3 h-10 text-[12px] font-semibold bg-ink-900 text-white">
              <span>{time}</span>
              <span className="absolute left-1/2 -translate-x-1/2 top-2 h-6 w-24 rounded-full bg-black" />
              <span className="flex items-center gap-1">
                <span className="flex items-end gap-[2px]">{[4, 6, 8, 10].map((h) => <span key={h} className="w-[3px] rounded-sm bg-white" style={{ height: h }} />)}</span>
                <span className="ml-1 h-[11px] w-[22px] rounded-[3px] border border-white/80 p-[1.5px]"><span className="block h-full w-[70%] rounded-[1px] bg-white" /></span>
              </span>
            </div>

            {/* App header */}
            <div className="shrink-0 bg-ink-900 text-white px-5 pt-2 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">General Hospital</div>
                  <div className="text-[17px] font-bold leading-tight">
                    {tab === 'patients' ? 'My patients' : tab === 'tasks' ? 'Tasks & meds' : tab === 'alerts' ? 'Alerts' : 'HospAI Assistant'}
                  </div>
                </div>
                <span className="h-9 w-9 rounded-full bg-brand-600 text-[12px] font-semibold flex items-center justify-center">LC</span>
              </div>
              {tab === 'patients' && (
                <div className="mt-3 flex items-center gap-2 h-9 rounded-xl bg-white/10 px-3 text-[12.5px] text-slate-400">
                  <SearchIcon size={14} /> Search patients or MRN
                </div>
              )}
            </div>

            {/* Screens */}
            <div key={tab} className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 py-3 animate-view-in">
              {tab === 'patients' && (
                <div className="space-y-2.5">
                  {patients.map((p, i) => (
                    <button key={p.name} onClick={() => setOpen(i)} className="w-full text-left rounded-2xl bg-white border border-slate-200 p-3.5 shadow-sm active:scale-[0.98] transition-transform">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[14px] font-semibold">{p.name}</div>
                          <div className="text-[11.5px] text-slate-500">{p.meta}</div>
                        </div>
                        <ChevronRightIcon size={16} className="text-slate-300" />
                      </div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className={`text-[10.5px] font-semibold rounded-full px-2 py-0.5 whitespace-nowrap ${toneCls[p.tone]}`}>{p.flag}</span>
                        <span className="flex gap-2.5 text-[10.5px] text-slate-500">
                          {p.vit.slice(0, 2).map(([k, v]) => <span key={k} className="whitespace-nowrap"><span className="text-slate-400">{k}</span> <span className="font-semibold text-slate-800">{v}</span></span>)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {tab === 'tasks' && (
                <div className="space-y-2.5">
                  <div className="text-[11.5px] font-semibold uppercase tracking-wider text-slate-400 px-1">Next 2 hours · {pending} open</div>
                  {tasks.map((t, i) => (
                    <div key={i} className={`rounded-2xl border p-3.5 bg-white ${t.late && !t.done ? 'border-red-200' : 'border-slate-200'}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[11.5px] font-mono font-semibold ${t.late && !t.done ? 'text-red-600' : 'text-slate-500'}`}>{t.t}{t.late && !t.done ? ' · overdue' : ''}</span>
                        {t.done && <span className="flex items-center gap-1 text-[11.5px] font-semibold text-emerald-600"><CheckIcon size={12} strokeWidth={3} /> Done</span>}
                      </div>
                      <div className={`mt-1 text-[13.5px] font-semibold ${t.done ? 'text-slate-400 line-through' : ''}`}>{t.what}</div>
                      <div className="text-[11.5px] text-slate-500">{t.who}</div>
                      {!t.done && (
                        <button
                          onClick={() => { setTasks((x) => x.map((y, j) => (j === i ? { ...y, done: true } : y))); setToast('Barcode matched. Recorded.'); }}
                          className={`mt-2.5 w-full h-8 rounded-lg text-[12px] font-semibold text-white ${t.late ? 'bg-red-600' : 'bg-brand-600'}`}
                        >
                          Scan & complete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {tab === 'alerts' && (
                <div className="space-y-2.5">
                  {alerts.length === 0 && (
                    <div className="mt-16 text-center">
                      <span className="mx-auto h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckIcon size={22} strokeWidth={3} /></span>
                      <div className="mt-3 text-[14px] font-semibold">All caught up</div>
                      <div className="text-[12px] text-slate-500">No alerts need your attention.</div>
                    </div>
                  )}
                  {alerts.map((a) => (
                    <div key={a.id} className="rounded-2xl bg-white border border-slate-200 p-3.5 flex gap-3 animate-view-in">
                      <span className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${a.red ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-600'}`}>
                        {a.red ? <AlertIcon size={16} /> : <BellIcon size={16} />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold">{a.t}</div>
                        <div className="text-[11.5px] text-slate-500">{a.s}</div>
                        <button onClick={() => { setAlerts((x) => x.filter((y) => y.id !== a.id)); setToast('Acknowledged.'); }} className="mt-2 h-7 px-3 rounded-lg bg-slate-900 text-white text-[11.5px] font-semibold">
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'ai' && (
                <div className="flex flex-col gap-3 min-h-full">
                  <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-4">
                    <SparkIcon size={18} />
                    <div className="mt-2 text-[14px] font-semibold">Ask about your patients</div>
                    <div className="text-[11.5px] text-brand-100">Summaries and drafts, reviewed by you.</div>
                  </div>
                  {chat.map(([q, a]) => (
                    <div key={q} className="space-y-2 animate-view-in">
                      <div className="ml-10 rounded-2xl rounded-tr-md bg-slate-900 text-white text-[12px] px-3 py-2">{q}</div>
                      <div className="mr-6 rounded-2xl rounded-tl-md bg-white border border-slate-200 text-[12px] px-3 py-2 leading-relaxed">{a}</div>
                    </div>
                  ))}
                  {thinking && (
                    <div className="mr-6 flex gap-1 px-3 py-3 rounded-2xl bg-white border border-slate-200 w-16">
                      {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />)}
                    </div>
                  )}
                  <div className="mt-auto flex flex-col gap-1.5">
                    {aiQA.filter(([q]) => !chat.some(([c]) => c === q)).map(([q, a]) => (
                      <button key={q} disabled={thinking} onClick={() => ask(q, a)} className="text-left text-[12px] font-medium text-brand-700 bg-white border border-brand-200 rounded-xl px-3 py-2 disabled:opacity-50">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Patient detail sheet */}
            {open !== null && (
              <div className="absolute inset-0 z-20 bg-slate-900/40 flex items-end" onClick={() => setOpen(null)}>
                <div className="w-full rounded-t-3xl bg-white p-5 pb-8 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                  <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" />
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[16px] font-bold">{patients[open].name}</div>
                      <div className="text-[12px] text-slate-500">{patients[open].meta}</div>
                    </div>
                    <button onClick={() => setOpen(null)} className="text-slate-400"><XIcon size={18} /></button>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {patients[open].vit.map(([k, v]) => (
                      <div key={k} className="rounded-xl bg-slate-50 px-2.5 py-2">
                        <div className="text-[10px] text-slate-500">{k}</div>
                        <div className="text-[14px] font-semibold">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-xl border border-brand-200 bg-brand-50 p-3">
                    <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-brand-800"><SparkIcon size={12} /> AI snapshot</div>
                    <p className="mt-1 text-[12px] text-slate-700 leading-relaxed">{patients[open].ai}</p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button onClick={() => { setOpen(null); setToast('Order started.'); }} className="h-10 rounded-xl bg-brand-600 text-white text-[12.5px] font-semibold flex items-center justify-center gap-1"><PlusIcon size={14} /> New order</button>
                    <button onClick={() => { setOpen(null); setToast('Note saved.'); }} className="h-10 rounded-xl border border-slate-200 text-[12.5px] font-semibold">Add note</button>
                  </div>
                </div>
              </div>
            )}

            {toast && (
              <div className="absolute bottom-[76px] left-1/2 -translate-x-1/2 z-30 whitespace-nowrap rounded-full bg-ink-900 text-white text-[12px] px-3.5 py-2 shadow-lg animate-fade-in-up flex items-center gap-1.5">
                <CheckIcon size={12} strokeWidth={3} className="text-brand-300" /> {toast}
              </div>
            )}

            {/* Tab bar */}
            <nav className="shrink-0 h-16 bg-white border-t border-slate-200 grid grid-cols-4 px-2 pb-2">
              {([
                ['patients', 'Patients', UsersIcon, 0],
                ['tasks', 'Tasks', ClipboardIcon, pending],
                ['alerts', 'Alerts', BellIcon, alerts.length],
                ['ai', 'AI', SparkIcon, 0],
              ] as const).map(([id, label, Icon, badge]) => {
                const on = tab === id;
                return (
                  <button key={id} onClick={() => { setTab(id); setOpen(null); }} className={`relative flex flex-col items-center justify-center gap-0.5 text-[10.5px] font-semibold ${on ? 'text-brand-600' : 'text-slate-400'}`}>
                    <span className={`relative h-7 w-12 rounded-full flex items-center justify-center transition-colors ${on ? 'bg-brand-50' : ''}`}>
                      <Icon size={18} />
                      {badge > 0 && <span className="absolute -top-0.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">{badge}</span>}
                    </span>
                    {label}
                  </button>
                );
              })}
            </nav>
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-28 rounded-full bg-slate-900/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
