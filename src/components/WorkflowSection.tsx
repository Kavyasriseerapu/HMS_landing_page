import { useEffect, useRef, useState } from 'react';
import {
  BedIcon, CardIcon, ClipboardIcon, FlaskIcon, PillIcon, StarIcon, StethoscopeIcon, UserIcon, type IconType,
} from './icons';
import { Reveal, SectionHeading } from './ui';

type Step = {
  icon: IconType;
  label: string;
  time: string;
  team: string;
  title: string;
  desc: string;
  events: [string, string][];
};

const steps: Step[] = [
  {
    icon: UserIcon, label: 'Registration', time: '09:52', team: 'Reception',
    title: 'One UHID for life',
    desc: 'The patient is found by fuzzy search or registered once in the Patient Master Index, with demographics, blood group and insurance captured up front.',
    events: [['UHID assigned', 'UHID-10442 · Rajesh Kumar, 54'], ['Insurance captured', 'Star Health · policy verified'], ['Queued to doctor', 'Dr. Priya Deshmukh · OPD']],
  },
  {
    icon: StarIcon, label: 'Triage', time: '09:58', team: 'Emergency / OPD',
    title: 'The sickest are seen first',
    desc: 'Walk-in emergencies are triaged on the ESI 1–5 scale and allocated a trauma, acute or observation bed; OPD patients land in the doctor inbox.',
    events: [['ESI 2 assigned', 'Chest discomfort · diaphoretic'], ['Bed allocated', 'ER-B2-01 · Acute care'], ['Doctor alerted', 'Live board updated']],
  },
  {
    icon: StethoscopeIcon, label: 'Consultation', time: '10:09', team: 'Doctor Portal',
    title: 'Notes by voice, prescriptions by hand',
    desc: 'The doctor talks with the patient in their language. HospAI writes the SOAP note, and the prescription is typed, handwritten or uploaded.',
    events: [['Voice SOAP note', 'Telugu → structured SOAP'], ['Prescription', 'Ink whiteboard · 2 meds, 3 tests'], ['Allergy check', 'No conflicts found']],
  },
  {
    icon: FlaskIcon, label: 'Split dispatch', time: '10:15', team: 'Pharmacy & lab',
    title: 'Medicines and tests go their own way',
    desc: 'AI splits the prescription: medicines go to the pharmacy verification queue, and tests go to lab billing and reach the lab once paid.',
    events: [['Sent to pharmacy', 'Aspirin, Atorvastatin'], ['Lab billing', 'ECG, Troponin I, Lipid profile'], ['Payment collected', 'UPI · ₹1,850']],
  },
  {
    icon: PillIcon, label: 'Diagnostics', time: '10:48', team: 'Lab & radiology',
    title: 'Results with safety nets',
    desc: 'Barcoded samples, pathologist-approved results and panic-value alerts; imaging reports link to PACS and critical findings notify the consultant.',
    events: [['Troponin I', 'Panic value · doctor notified'], ['ECG', 'Reported'], ['Decision', 'Admit to ICU']],
  },
  {
    icon: BedIcon, label: 'ICU & ward', time: '11:20', team: 'ICU & nursing',
    title: 'From paper charts to a live flowsheet',
    desc: 'The patient is admitted to an ICU bed. Nurses chart vitals, infusions and fluid balance on the 7-tab flowsheet, even if the network drops.',
    events: [['ICU bed', 'ICU-04 allocated'], ['Flowsheet', 'Hourly vitals · infusions'], ['Pre-auth', 'TPA approval requested']],
  },
  {
    icon: CardIcon, label: 'Discharge', time: 'Day 4', team: 'Clinical, pharmacy & billing',
    title: 'A clean discharge and a settled claim',
    desc: 'AI drafts the discharge summary, pharmacy reconciles medicines, billing clears the account and the insurance claim dossier is filed.',
    events: [['Discharge summary', 'AI draft · signed'], ['Claim dossier', '14 documents · submitted'], ['Co-pay', 'Collected at checkout']],
  },
];

export default function WorkflowSection() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !visible) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % steps.length), 4500);
    return () => clearTimeout(t);
  }, [active, auto, visible]);

  const s = steps[active];

  return (
    <section id="workflow" ref={ref} className="py-20 sm:py-28 bg-slate-50 border-y border-slate-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Connected workflows"
            title="Follow one patient through HospAI."
            desc="From registration to discharge on one record, with the patient journey visible to every team along the way."
          />
        </Reveal>

        <Reveal className="mt-14">
          <div className="-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto no-scrollbar">
            <div className="relative grid grid-cols-7 min-w-[760px]">
              <div className="absolute left-[7%] right-[7%] top-6 h-0.5 bg-slate-200" />
              <div className="absolute left-[7%] top-6 h-0.5 bg-brand-600 transition-all duration-700" style={{ width: `${(active / (steps.length - 1)) * 86}%` }} />
              {steps.map((st, i) => {
                const done = i < active;
                const on = i === active;
                return (
                  <button key={st.label} onClick={() => { setActive(i); setAuto(false); }} className="relative flex flex-col items-center text-center group">
                    <span
                      className={`relative z-10 h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        on ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-600/30 scale-110' : done ? 'bg-white border-brand-600 text-brand-600' : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-300'
                      }`}
                    >
                      <st.icon size={19} />
                    </span>
                    <span className={`mt-3 text-[13.5px] font-semibold ${on ? 'text-slate-900' : 'text-slate-500'}`}>{st.label}</span>
                    <span className="text-[12px] text-slate-400 font-mono">{st.time}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div key={active} className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9 animate-fade-in flex flex-col">
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-600">Step {active + 1} · {s.team}</div>
              <h3 className="mt-3 font-display text-[26px] font-bold text-slate-900 leading-tight">{s.title}</h3>
              <p className="mt-3 text-[16px] text-slate-600 leading-relaxed">{s.desc}</p>
              <div className="mt-auto pt-8 flex items-center gap-3">
                <button onClick={() => { setActive((a) => (a - 1 + steps.length) % steps.length); setAuto(false); }} className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-[14px] font-medium text-slate-700 hover:bg-slate-50">Previous</button>
                <button onClick={() => { setActive((a) => (a + 1) % steps.length); setAuto(false); }} className="h-10 px-4 rounded-lg bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800">Next step</button>
                <button onClick={() => setAuto((a) => !a)} className="ml-auto text-[13px] text-slate-500 hover:text-slate-800">{auto ? 'Pause' : 'Auto-play'}</button>
              </div>
            </div>

            <div className="rounded-2xl bg-ink-900 p-6 sm:p-7 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-dark opacity-60 pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ClipboardIcon size={16} className="text-brand-300" />
                    <span className="text-[13px] font-semibold">Encounter activity</span>
                  </div>
                  <span className="text-[12px] font-mono text-slate-400">Rajesh Kumar · UHID-10442</span>
                </div>
                <div className="mt-6 space-y-3">
                  {steps.slice(0, active + 1).flatMap((st, si) =>
                    st.events.map(([e, d], ei) => ({ e, d, key: `${si}-${ei}`, cur: si === active, t: st.time })),
                  ).slice(-5).map((row) => (
                    <div
                      key={row.key}
                      className={`flex items-start gap-3 rounded-lg px-4 py-3 border transition-colors ${
                        row.cur ? 'bg-white/[0.07] border-brand-400/30 animate-fade-in-up' : 'bg-white/[0.02] border-white/5 opacity-60'
                      }`}
                    >
                      <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${row.cur ? 'bg-brand-400' : 'bg-slate-500'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-semibold">{row.e}</div>
                        <div className="text-[13px] text-slate-400 truncate">{row.d}</div>
                      </div>
                      <span className="text-[11.5px] font-mono text-slate-500 whitespace-nowrap">{row.t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
