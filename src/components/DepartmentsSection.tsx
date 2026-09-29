import { useState, type ReactNode } from 'react';
import {
  ActivityIcon, AlertIcon, BedIcon, CheckIcon, ClipboardIcon, FlaskIcon, PillIcon, ScalpelIcon, TargetIcon, TruckIcon,
  type IconType,
} from './icons';
import { Reveal, SectionHeading } from './ui';

type Dept = { key: string; label: string; icon: IconType; title: string; desc: string; points: string[]; visual: ReactNode };

/* ── ICU: interactive 7-tab flowsheet ───────────────────────── */
const icuTabs: [string, [string, string][]][] = [
  ['Vitals & hemodynamics', [['BP', '112/68'], ['MAP', '83'], ['HR', '96'], ['CVP', '9 mmHg'], ['SpO₂', '95%'], ['Temp', '37.8 °C']]],
  ['Ventilator', [['Mode', 'SIMV'], ['FiO₂', '45%'], ['PEEP', '8 cmH₂O'], ['Tidal vol', '420 ml'], ['pH', '7.34'], ['PaO₂', '88']]],
  ['Infusions', [['Noradrenaline', '6 ml/hr'], ['Midazolam', '3 ml/hr'], ['Fentanyl', '2 ml/hr'], ['NS 0.9%', '60 ml/hr']]],
  ['Intake & output', [['Oral / IV', '2,340 ml'], ['Urine', '1,610 ml'], ['Drains', '180 ml'], ['Net balance', '+550 ml']]],
  ['Neuro & pain', [['GCS', 'E3 V4 M6'], ['Pupils', 'Equal, reactive'], ['RASS', '−1'], ['Pain', '3 / 10']]],
  ['Labs & POCT', [['Lactate', '2.1'], ['Na⁺', '138'], ['K⁺', '4.2'], ['Glucose', '164']]],
  ['Lines & airway', [['ET tube', '7.5 · 22 cm'], ['Central line', 'Day 3 · R IJV'], ['Foley', 'Day 2'], ['Art line', 'L radial']]],
];

function IcuVisual() {
  const [t, setT] = useState(0);
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {icuTabs.map(([n], i) => (
          <button key={n} onClick={() => setT(i)} className={`text-[12px] font-semibold rounded-lg px-2.5 py-1.5 transition-colors ${i === t ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {i + 1}. {n}
          </button>
        ))}
      </div>
      <div key={t} className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 animate-view-in">
        {icuTabs[t][1].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white border border-slate-200 px-3.5 py-3">
            <div className="text-[11.5px] text-slate-500">{k}</div>
            <div className="text-[16px] font-bold text-slate-900 tabular-nums">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[12px] text-slate-500">Bed ICU-04 · hourly entries · saved to the patient record, even offline</div>
    </div>
  );
}

function BedsVisual() {
  const cols: Record<string, string> = { Occupied: 'bg-brand-600', Available: 'bg-emerald-500', Cleaning: 'bg-amber-400', Maintenance: 'bg-slate-400' };
  const wards: [string, string[]][] = [
    ['General ward', ['Occupied', 'Occupied', 'Available', 'Occupied', 'Cleaning', 'Occupied', 'Available', 'Occupied']],
    ['Private deluxe', ['Occupied', 'Available', 'Occupied', 'Maintenance']],
    ['ICU', ['Occupied', 'Occupied', 'Occupied', 'Available']],
    ['Isolation', ['Occupied', 'Available']],
  ];
  return (
    <div>
      <div className="flex flex-wrap gap-4 text-[12px] text-slate-600">
        {Object.entries(cols).map(([k, c]) => <span key={k} className="flex items-center gap-1.5"><span className={`h-3 w-3 rounded ${c}`} />{k}</span>)}
      </div>
      <div className="mt-4 space-y-3">
        {wards.map(([w, beds]) => (
          <div key={w} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-[13px] font-semibold text-slate-700">{w}</span>
            <div className="flex flex-wrap gap-1.5">
              {beds.map((b, i) => (
                <span key={i} title={b} className={`h-9 w-9 rounded-lg ${cols[b]} flex items-center justify-center text-white shadow-sm animate-scale-in`} style={{ animationDelay: `${i * 50}ms` }}>
                  <BedIcon size={15} />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[['Vitals', 'Bedside entry'], ['MAR', 'Meds given'], ['Handover', 'Shift notes']].map(([a, b]) => (
          <div key={a} className="rounded-xl bg-white border border-slate-200 py-2.5"><div className="text-[13.5px] font-bold">{a}</div><div className="text-[11.5px] text-slate-500">{b}</div></div>
        ))}
      </div>
    </div>
  );
}

function PipelineVisual({ steps, flag }: { steps: string[]; flag?: [number, string] }) {
  return (
    <div className="space-y-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 90}ms` }}>
          <span className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 text-white text-[12px] font-bold flex items-center justify-center">{i + 1}</span>
          <div className={`flex-1 rounded-xl border px-4 py-2.5 text-[13.5px] font-medium ${flag && flag[0] === i ? 'bg-brand-50 border-brand-200 text-brand-800' : 'bg-white border-slate-200 text-slate-800'}`}>
            {s}
            {flag && flag[0] === i && <span className="ml-2 text-[11.5px] font-semibold text-brand-600">{flag[1]}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function OtVisual() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="rounded-2xl bg-white border border-slate-200 p-4">
        <div className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-slate-400">OT-2 · 10:30 · Lap. cholecystectomy</div>
        {[['Primary surgeon', 'Dr. Priya Deshmukh'], ['Assistant', 'Dr. Karan Shah'], ['Anesthesiologist', 'Dr. Meera Iyer'], ['Scrub nurse', 'Sr. Anjali Thomas']].map(([r, n]) => (
          <div key={r} className="mt-2.5 flex justify-between text-[13px]"><span className="text-slate-500">{r}</span><span className="font-semibold text-slate-800">{n}</span></div>
        ))}
      </div>
      <PipelineVisual steps={['PAC clearance', 'Intra-op notes', 'PACU recovery']} flag={[1, '· In progress']} />
    </div>
  );
}

function RadiologyVisual() {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {['X-Ray', 'CT', 'MRI', 'Ultrasound', 'PET'].map((m) => (
          <span key={m} className="rounded-lg bg-ink-900 text-white text-[12.5px] font-semibold px-3 py-1.5">{m}</span>
        ))}
      </div>
      <div className="mt-4">
        <PipelineVisual steps={['Imaging order placed', 'Technician acquisition log', 'Images linked from PACS', 'Radiologist structured report', 'Critical finding → consultant alerted']} flag={[4, '· Instant']} />
      </div>
    </div>
  );
}

const depts: Dept[] = [
  { key: 'icu', label: 'ICU flowsheet', icon: ActivityIcon, title: 'A 7-tab digital ICU chart', desc: 'Replaces paper ICU charts with structured, hourly flowsheets saved to the patient record, and nothing is lost even if the network drops.', points: ['Hemodynamics & ventilator', 'Infusions & I/O balance', 'GCS, RASS & lines tracking'], visual: <IcuVisual /> },
  { key: 'beds', label: 'Beds & nursing', icon: BedIcon, title: 'Live bed map and nursing operations', desc: 'Every ward bed by category and status, alongside bedside vitals, medication administration, fluid balance and shift handover.', points: ['General to isolation beds', 'Occupied, cleaning, maintenance', 'MAR & handovers'], visual: <BedsVisual /> },
  { key: 'ot', label: 'Surgery & OT', icon: ScalpelIcon, title: 'Theatres from booking to recovery', desc: 'Schedule OT rooms, assemble the surgical team, clear pre-anesthesia checks, record intra-op notes and track PACU recovery.', points: ['OT room scheduling', 'Team configuration', 'PAC → intra-op → PACU'], visual: <OtVisual /> },
  { key: 'lab', label: 'Laboratory', icon: FlaskIcon, title: 'Pay-first lab workflow, enforced', desc: 'Lab orders wait in lab billing until reception collects payment. Only then do they appear on the technician worklist, so no test runs unbilled.', points: ['Two-step billing enforcement', 'Barcode sample tracking', 'Pathologist approval & panic flags'], visual: <PipelineVisual steps={['Doctor orders tests', 'Lab billing queue (unpaid)', 'Reception collects payment', 'Sample collected & barcoded', 'Result entry & pathologist approval']} flag={[1, '· Hidden from lab until billed']} /> },
  { key: 'radiology', label: 'Radiology', icon: TargetIcon, title: 'Imaging with PACS and structured reports', desc: 'Orders across every modality, acquisition logs, PACS-linked images and structured reports, with critical findings pushed to the consultant.', points: ['X-Ray, CT, MRI, US, PET', 'DICOM PACS integration', 'Critical finding alerts'], visual: <RadiologyVisual /> },
  { key: 'discharge', label: 'Discharge', icon: ClipboardIcon, title: 'Discharge without the paperwork chase', desc: 'A multi-step clearance that makes sure the summary, medicines, bill and room are all settled before the patient leaves.', points: ['AI-drafted summary', 'Medicine reconciliation', 'Billing & room clearance'], visual: <PipelineVisual steps={['Clinical discharge summary', 'Pharmacy medicine reconciliation', 'Billing clearance', 'Room vacate protocol']} flag={[0, '· AI draft ready']} /> },
];

export default function DepartmentsSection() {
  const [sel, setSel] = useState(0);
  const d = depts[sel];
  return (
    <section id="departments" className="py-20 sm:py-28 bg-slate-50 border-y border-slate-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Departments in depth"
            title="Built for how each department actually works."
            desc="Not just a module list. Each department gets workflows designed around its real day, from the ICU bedside to the operating theatre."
          />
        </Reveal>

        <Reveal className="mt-10">
          <div className="-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 w-max">
              {depts.map((x, i) => (
                <button
                  key={x.key}
                  onClick={() => setSel(i)}
                  className={`flex items-center gap-2 h-11 px-4 rounded-xl text-[14px] font-semibold border whitespace-nowrap transition-all ${
                    i === sel ? 'bg-ink-900 border-ink-900 text-white shadow-lg shadow-ink-900/20' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <x.icon size={16} className={i === sel ? 'text-brand-300' : 'text-slate-400'} /> {x.label}
                </button>
              ))}
            </div>
          </div>

          <div key={d.key} className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 animate-view-in">
            <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-7 sm:p-8 flex flex-col">
              <span className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/20"><d.icon size={22} /></span>
              <h3 className="mt-5 font-display text-[24px] font-bold text-slate-900 leading-tight">{d.title}</h3>
              <p className="mt-3 text-[15.5px] text-slate-600 leading-relaxed">{d.desc}</p>
              <ul className="mt-6 space-y-2.5">
                {d.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[14.5px] text-slate-700">
                    <span className="h-5 w-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center"><CheckIcon size={12} strokeWidth={3} /></span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-white to-brand-50/60 border border-slate-200 p-6 sm:p-8">{d.visual}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
