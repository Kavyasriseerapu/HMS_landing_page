import { useState } from 'react';
import { Body, PageHeader, Pill, PrimaryBtn, GhostBtn, Segmented, StatRow, Sparkline, useDash, type Tone } from './ui';
import { AlertIcon, BellIcon, CheckIcon, ClockIcon, FilterIcon, PlusIcon, SearchIcon, ShieldCheckIcon, SparkIcon } from '../icons';

/* ───────────────────────── Doctor Workspace ───────────────────────── */

const myPatients = [
  {
    name: 'Ann Martinez', age: 52, sex: 'F', loc: 'ED 12', flag: 'Critical result', tone: 'red' as Tone,
    problems: ['Hyperkalemia (E87.5)', 'Acute kidney injury (N17.9)', 'Hypertension (I10)'],
    vitals: [['HR', '104'], ['BP', '158/92'], ['SpO₂', '97%'], ['T', '37.1']],
    results: [['Potassium', '6.2 mmol/L', true], ['Creatinine', '2.1 mg/dL', true], ['Glucose', '142 mg/dL', false], ['ECG', 'Peaked T waves', true]],
    orders: ['Calcium gluconate 1 g IV (given)', 'Insulin + dextrose protocol', 'Repeat BMP at 12:00'],
    ai: 'Hyperkalemia with AKI in a 52F on lisinopril. ECG shows peaked T waves. Membrane stabilization given; shifting therapy in progress. Nephrology consult recommended if K⁺ stays above 6.0 on repeat.',
    hr: [96, 98, 101, 103, 104, 104],
  },
  {
    name: 'Patricia Okonkwo', age: 71, sex: 'F', loc: 'ED 4', flag: 'Consult pending', tone: 'violet' as Tone,
    problems: ['R femoral neck fracture (S72.0)', 'Osteoporosis (M81.0)'],
    vitals: [['HR', '88'], ['BP', '134/80'], ['SpO₂', '96%'], ['T', '36.8']],
    results: [['Hip X-ray', 'Displaced neck fracture', true], ['Hemoglobin', '11.8 g/dL', false], ['INR', '1.0', false]],
    orders: ['Ortho consult (Dr. Okafor)', 'Fascia iliaca block', 'NPO after midnight'],
    ai: '71F after mechanical fall with displaced right femoral neck fracture. Hemodynamically stable. Booked for hip hemiarthroplasty in OR 3 today; pre-op labs acceptable.',
    hr: [92, 90, 89, 88, 88, 88],
  },
  {
    name: 'George Watts', age: 60, sex: 'M', loc: 'ED 11', flag: 'Reassess due', tone: 'amber' as Tone,
    problems: ['Hypertensive urgency (I16.0)', 'Type 2 diabetes (E11.9)'],
    vitals: [['HR', '82'], ['BP', '176/104'], ['SpO₂', '98%'], ['T', '36.9']],
    results: [['Troponin', '< 5 ng/L', false], ['Creatinine', '1.1 mg/dL', false], ['Urinalysis', 'Trace protein', false]],
    orders: ['Amlodipine 10 mg PO', 'Repeat BP at 11:15'],
    ai: 'Asymptomatic severe hypertension with no evidence of end-organ damage. Oral agent started; target a gradual reduction over 24–48 h. Safe for discharge with PCP follow-up if BP improves.',
    hr: [80, 84, 83, 82, 82, 82],
  },
  {
    name: 'Robert Hale', age: 66, sex: 'M', loc: '3N-01', flag: 'Discharge today', tone: 'green' as Tone,
    problems: ['Sepsis, urinary source (A41.9)', 'CKD stage 3 (N18.3)'],
    vitals: [['HR', '78'], ['BP', '128/76'], ['SpO₂', '97%'], ['T', '36.7']],
    results: [['WBC', '9.1 ×10⁹/L', false], ['Creatinine', '1.4 mg/dL', false], ['Blood culture', 'E. coli, sensitive', false]],
    orders: ['Ciprofloxacin 500 mg PO BID', 'Discharge summary (draft ready)'],
    ai: 'Urosepsis resolved; afebrile 48 h on oral ciprofloxacin, renal function back to baseline. AI discharge summary drafted and awaiting your review.',
    hr: [96, 90, 86, 82, 80, 78],
  },
];

export function DoctorWorkspace() {
  const { action, notify, go } = useDash();
  const [sel, setSel] = useState(0);
  const [tasks, setTasks] = useState([
    { t: 'Sign progress note: Robert Hale', done: false },
    { t: 'Review CT abdomen: James Liu', done: false },
    { t: 'Respond to ortho consult: P. Okonkwo', done: false },
    { t: 'Co-sign resident order: G. Watts', done: true },
  ]);
  const p = myPatients[sel];

  return (
    <>
      <PageHeader
        crumb="Doctor Workspace"
        title="Good morning, Dr. Chen"
        subtitle="Emergency Medicine · 14 patients on your list"
        actions={<><GhostBtn><SearchIcon size={14} /> Find patient</GhostBtn><PrimaryBtn><PlusIcon size={14} /> New Order</PrimaryBtn></>}
      />
      <Body>
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Patient list */}
          <div className="col-span-3 bg-white rounded-lg border border-slate-200 flex flex-col min-h-0">
            <div className="px-4 h-11 flex items-center justify-between border-b border-slate-100">
              <span className="text-[13.5px] font-semibold text-slate-900">My patients</span>
              <span className="text-[11.5px] text-slate-400">Sorted by acuity</span>
            </div>
            <div className="p-2 space-y-1 overflow-auto">
              {myPatients.map((x, i) => (
                <button key={x.name} onClick={() => setSel(i)} className={`w-full text-left rounded-md px-3 py-2.5 transition-colors ${i === sel ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-slate-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-slate-900">{x.name}</span>
                    <span className="text-[11px] font-mono text-slate-500">{x.loc}</span>
                  </div>
                  <div className="mt-1.5"><Pill tone={x.tone}>{x.flag}</Pill></div>
                </button>
              ))}
            </div>
          </div>

          {/* Patient summary */}
          <div key={sel} className="col-span-6 flex flex-col gap-4 min-h-0 animate-view-in">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[17px] font-bold text-slate-900">{p.name}</div>
                  <div className="text-[12.5px] text-slate-500">{p.age} yrs · {p.sex} · {p.loc}</div>
                </div>
                <div className="w-40"><div className="text-[10.5px] text-slate-400 text-right">HR · 6h</div><Sparkline id={`doc${sel}`} data={p.hr} h={30} w={160} /></div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {p.vitals.map(([k, v]) => (
                  <div key={k} className="rounded-md bg-slate-50 px-3 py-1.5">
                    <div className="text-[10.5px] text-slate-500">{k}</div>
                    <div className="text-[14px] font-semibold text-slate-900 tabular-nums">{v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.problems.map((x) => <span key={x} className="text-[11.5px] text-slate-700 bg-white border border-slate-200 rounded px-2 py-0.5">{x}</span>)}
              </div>
            </div>

            <div className="rounded-lg border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-800"><SparkIcon size={13} /> AI clinical snapshot</span>
                <button onClick={() => go('ai')} className="text-[11.5px] font-medium text-brand-700 hover:underline">Open Clinical Summaries</button>
              </div>
              <p className="mt-2 text-[12.5px] text-slate-700 leading-relaxed">{p.ai}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="text-[13px] font-semibold text-slate-900 mb-2">Results</div>
                {p.results.map(([k, v, bad]) => (
                  <div key={k as string} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0 text-[12.5px]">
                    <span className="text-slate-600">{k}</span>
                    <span className={`font-medium ${bad ? 'text-red-600' : 'text-slate-900'}`}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="text-[13px] font-semibold text-slate-900 mb-2">Active orders</div>
                {p.orders.map((o) => <div key={o} className="py-1.5 border-b border-slate-100 last:border-0 text-[12.5px] text-slate-700">{o}</div>)}
              </div>
            </div>
          </div>

          {/* Tasks + quick orders */}
          <div className="col-span-3 flex flex-col gap-4 min-h-0">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-semibold text-slate-900">My tasks</span>
                <span className="text-[11.5px] text-slate-400">{tasks.filter((t) => !t.done).length} open</span>
              </div>
              {tasks.map((t, i) => (
                <button
                  key={t.t}
                  onClick={() => { setTasks((ts) => ts.map((x, j) => (j === i ? { ...x, done: !x.done } : x))); if (!t.done) notify('Task completed.'); }}
                  className="w-full flex items-start gap-2.5 py-2 text-left"
                >
                  <span className={`mt-0.5 h-4 w-4 shrink-0 rounded border flex items-center justify-center ${t.done ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'}`}>{t.done && <CheckIcon size={11} strokeWidth={3} />}</span>
                  <span className={`text-[12.5px] ${t.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{t.t}</span>
                </button>
              ))}
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="text-[13px] font-semibold text-slate-900 mb-2">Quick orders</div>
              <div className="grid grid-cols-2 gap-2">
                {['Lab panel', 'Imaging', 'Medication', 'Consult', 'Admit', 'Discharge'].map((o) => (
                  <button key={o} onClick={() => action(`New ${o} Order`)} className="h-8 rounded-md border border-slate-200 text-[12px] font-medium text-slate-700 hover:border-brand-300 hover:bg-brand-50">{o}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Body>
    </>
  );
}

/* ───────────────────────── Nurse Station ───────────────────────── */

const unitBeds = [
  { bed: '3N-01', pt: 'R. Hale', nurse: 'JC', vitals: 'Due 11:00', meds: 1, fall: false, call: false, news: 1 },
  { bed: '3N-02', pt: 'M. Iyer', nurse: 'JC', vitals: 'Due 12:00', meds: 2, fall: true, call: true, news: 3 },
  { bed: '3N-04', pt: 'L. Gomez', nurse: 'JC', vitals: 'Overdue', meds: 1, fall: false, call: false, news: 5 },
  { bed: '3N-06', pt: 'D. Novak', nurse: 'AO', vitals: 'Due 11:30', meds: 0, fall: true, call: false, news: 2 },
  { bed: '3N-07', pt: 'P. Okonkwo', nurse: 'AO', vitals: 'On arrival', meds: 0, fall: true, call: false, news: 0 },
  { bed: '3N-08', pt: 'H. Tanaka', nurse: 'AO', vitals: 'Due 12:00', meds: 1, fall: false, call: true, news: 1 },
];

const marInit = [
  { time: '10:30', pt: 'R. Hale · 3N-01', med: 'Piperacillin-tazobactam 4.5 g IV', state: 'overdue' },
  { time: '11:00', pt: 'M. Iyer · 3N-02', med: 'Furosemide 40 mg IV', state: 'due' },
  { time: '11:00', pt: 'L. Gomez · 3N-04', med: 'Ceftriaxone 1 g IV', state: 'due' },
  { time: '12:00', pt: 'M. Iyer · 3N-02', med: 'Metoprolol 25 mg PO', state: 'upcoming' },
  { time: '12:00', pt: 'H. Tanaka · 3N-08', med: 'Cefazolin 2 g IV', state: 'upcoming' },
];

export function NurseStation() {
  const { notify, openChart } = useDash();
  const [mar, setMar] = useState(marInit);
  const [calls, setCalls] = useState(unitBeds.filter((b) => b.call).map((b) => b.bed));
  const give = (i: number) => {
    setMar((m) => m.map((x, j) => (j === i ? { ...x, state: 'given' } : x)));
    notify(`Barcode match. ${mar[i].med.split(' ')[0]} recorded on the eMAR.`);
  };

  return (
    <>
      <PageHeader
        crumb="Nurse Station"
        title="3 North · Nurse Station"
        subtitle="Day shift · 6 of 8 beds · RN Carter, RN Ortiz"
        actions={<><GhostBtn>Handover (SBAR)</GhostBtn><PrimaryBtn><PlusIcon size={14} /> Add Task</PrimaryBtn></>}
      />
      <StatRow
        stats={[
          { v: String(calls.length), l: 'Call Lights', c: calls.length ? 'text-red-600' : 'text-emerald-600' },
          { v: String(mar.filter((m) => m.state === 'overdue').length), l: 'Meds Overdue', c: 'text-red-600' },
          { v: String(mar.filter((m) => m.state === 'due').length), l: 'Meds Due Now', c: 'text-orange-500' },
          { v: '1', l: 'Vitals Overdue', c: 'text-orange-500' },
          { v: '3', l: 'Fall Risk', c: 'text-violet-600' },
          { v: '1:3', l: 'Nurse Ratio', c: 'text-brand-600' },
        ]}
      />
      <Body>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7 grid grid-cols-2 gap-3 content-start">
            {unitBeds.map((b) => {
              const calling = calls.includes(b.bed);
              return (
                <div key={b.bed} className={`rounded-lg border bg-white p-3.5 ${calling ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-mono font-semibold text-slate-500">{b.bed}</span>
                    <div className="flex items-center gap-1.5">
                      {b.fall && <span className="text-[10px] font-bold text-violet-700 bg-violet-50 rounded px-1.5 py-0.5">FALL</span>}
                      <span className={`text-[10px] font-bold rounded px-1.5 py-0.5 ${b.news >= 5 ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}>NEWS2 {b.news}</span>
                      <span className="h-6 w-6 rounded-full bg-brand-50 text-brand-700 text-[10px] font-semibold flex items-center justify-center">{b.nurse}</span>
                    </div>
                  </div>
                  <button onClick={() => openChart({ name: b.pt, age: 64, sex: 'F', mrn: `MRN-3${b.bed.slice(-2)}7`, complaint: 'Inpatient', location: b.bed, provider: 'Dr. Patel' })} className="mt-1.5 text-[14.5px] font-semibold text-slate-900 hover:text-brand-700">{b.pt}</button>
                  <div className="mt-2 flex items-center gap-3 text-[11.5px]">
                    <span className={`flex items-center gap-1 ${b.vitals === 'Overdue' ? 'text-red-600 font-semibold' : 'text-slate-500'}`}><ClockIcon size={12} /> Vitals {b.vitals.toLowerCase()}</span>
                    <span className="text-slate-500">{b.meds ? `${b.meds} med${b.meds > 1 ? 's' : ''} due` : 'No meds due'}</span>
                  </div>
                  {calling && (
                    <button onClick={() => { setCalls((c) => c.filter((x) => x !== b.bed)); notify(`Call light ${b.bed} answered.`); }} className="mt-2.5 w-full h-8 rounded-md bg-red-600 hover:bg-red-700 text-white text-[12px] font-semibold flex items-center justify-center gap-1.5">
                      <BellIcon size={13} /> Call light active · Respond
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="col-span-5 space-y-4">
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="px-4 h-11 flex items-center justify-between border-b border-slate-100">
                <span className="text-[13.5px] font-semibold text-slate-900">Medication administration (eMAR)</span>
                <span className="text-[11.5px] text-slate-400">Next 2 hours</span>
              </div>
              <div className="divide-y divide-slate-100">
                {mar.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                    <span className={`font-mono text-[12px] w-11 ${m.state === 'overdue' ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>{m.time}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-medium text-slate-900 truncate">{m.med}</div>
                      <div className="text-[11.5px] text-slate-500">{m.pt}</div>
                    </div>
                    {m.state === 'given' ? (
                      <span className="flex items-center gap-1 text-[12px] font-semibold text-emerald-700"><CheckIcon size={12} strokeWidth={3} /> Given</span>
                    ) : m.state === 'upcoming' ? (
                      <span className="text-[11.5px] text-slate-400">Upcoming</span>
                    ) : (
                      <button onClick={() => give(i)} className={`h-7 px-2.5 rounded-md text-[12px] font-semibold text-white ${m.state === 'overdue' ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-600 hover:bg-brand-700'}`}>Scan & give</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="text-[13.5px] font-semibold text-slate-900">Handover notes</div>
              <div className="mt-2 space-y-2 text-[12.5px] text-slate-700">
                <div className="flex gap-2"><AlertIcon size={13} className="text-orange-500 mt-0.5 shrink-0" /> 3N-04 Gomez: NEWS2 rising, recheck vitals and escalate if ≥ 7.</div>
                <div className="flex gap-2"><ShieldCheckIcon size={13} className="text-brand-600 mt-0.5 shrink-0" /> 3N-07 reserved for Okonkwo post-op, bed alarm on arrival.</div>
              </div>
            </div>
          </div>
        </div>
      </Body>
    </>
  );
}

/* ───────────────────────── Insurance ───────────────────────── */

type Auth = { id: string; pt: string; payer: string; svc: string; amt: string; days: number };
const pipeline: { col: string; tone: Tone; items: Auth[] }[] = [
  { col: 'Submitted', tone: 'blue', items: [
    { id: 'PA-77131', pt: 'Patricia Okonkwo', payer: 'Medicare', svc: 'Hip hemiarthroplasty', amt: '$18,400', days: 0 },
    { id: 'PA-77128', pt: 'Rahul Verma', payer: 'Star Health', svc: 'Knee arthroscopy', amt: '$6,200', days: 1 },
  ] },
  { col: 'In review', tone: 'amber', items: [
    { id: 'PA-77120', pt: 'Grace Min', payer: 'UnitedHealth', svc: 'Extended ICU stay', amt: '$42,000', days: 3 },
    { id: 'PA-77115', pt: 'Samuel Obi', payer: 'Aetna PPO', svc: 'MRI brain + contrast', amt: '$2,850', days: 2 },
  ] },
  { col: 'Info requested', tone: 'violet', items: [
    { id: 'PA-77109', pt: 'Karen Adams', payer: 'BCBS', svc: 'Hysterectomy', amt: '$14,900', days: 5 },
  ] },
  { col: 'Decided', tone: 'green', items: [
    { id: 'PA-77101', pt: 'Stefan Klein', payer: 'Aetna PPO', svc: 'TKA inpatient', amt: '$27,300', days: 6 },
    { id: 'PA-77098', pt: 'Priya Raman', payer: 'Cigna', svc: 'Echocardiogram', amt: '$1,150', days: 4 },
  ] },
];

export function InsuranceView() {
  const [member, setMember] = useState('MBR-448 102 771');
  const [payer, setPayer] = useState('Aetna PPO');
  const [result, setResult] = useState<null | 'loading' | 'done'>(null);
  const check = () => { setResult('loading'); setTimeout(() => setResult('done'), 900); };

  return (
    <>
      <PageHeader
        crumb="Insurance"
        title="Insurance & Pre-authorization"
        subtitle="Eligibility, prior auth and denials"
        actions={<><GhostBtn><FilterIcon size={14} /> All payers</GhostBtn><PrimaryBtn><PlusIcon size={14} /> New Pre-auth</PrimaryBtn></>}
      />
      <StatRow
        stats={[
          { v: '36', l: 'Eligibility Checks', sub: 'Today' },
          { v: '12', l: 'Pre-auths Open', c: 'text-orange-500' },
          { v: '2.4d', l: 'Avg Decision Time', c: 'text-brand-600' },
          { v: '94%', l: 'Approval Rate', c: 'text-emerald-600' },
          { v: '2', l: 'Expiring Today', c: 'text-red-600' },
        ]}
      />
      <Body>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 grid grid-cols-4 gap-3">
            {pipeline.map((c) => (
              <div key={c.col} className="rounded-lg bg-slate-100/80 p-2.5">
                <div className="flex items-center justify-between px-1 mb-2">
                  <Pill tone={c.tone}>{c.col}</Pill>
                  <span className="text-[11.5px] text-slate-500">{c.items.length}</span>
                </div>
                <div className="space-y-2">
                  {c.items.map((a) => (
                    <div key={a.id} className="rounded-md bg-white border border-slate-200 p-3 shadow-sm">
                      <div className="flex justify-between text-[10.5px] font-mono text-slate-400"><span>{a.id}</span><span>{a.days}d</span></div>
                      <div className="mt-1 text-[12.5px] font-semibold text-slate-900">{a.pt}</div>
                      <div className="text-[11.5px] text-slate-500">{a.svc}</div>
                      <div className="mt-2 flex justify-between gap-2 text-[11.5px]">
                        <span className="text-slate-600 truncate">{a.payer}</span>
                        <span className="font-mono text-slate-900 shrink-0">{a.amt}</span>
                      </div>
                      {a.id === 'PA-77101' && <div className="mt-2 text-[11px] font-semibold text-red-600">Denied · appeal drafted</div>}
                      {a.id === 'PA-77098' && <div className="mt-2 text-[11px] font-semibold text-emerald-700">Approved</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-4 bg-white rounded-lg border border-slate-200 p-4 self-start">
            <div className="text-[13.5px] font-semibold text-slate-900">Real-time eligibility check</div>
            <div className="mt-3 space-y-3">
              <label className="block">
                <span className="block text-[12px] font-medium text-slate-600 mb-1">Payer</span>
                <select value={payer} onChange={(e) => { setPayer(e.target.value); setResult(null); }} className="w-full h-9 px-2.5 rounded-md border border-slate-200 text-[13px] bg-white outline-none focus:border-brand-500">
                  {['Aetna PPO', 'BCBS', 'Cigna', 'Medicare', 'Star Health', 'UnitedHealth'].map((x) => <option key={x}>{x}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="block text-[12px] font-medium text-slate-600 mb-1">Member ID</span>
                <input value={member} onChange={(e) => { setMember(e.target.value); setResult(null); }} className="w-full h-9 px-2.5 rounded-md border border-slate-200 text-[13px] font-mono outline-none focus:border-brand-500" />
              </label>
              <button onClick={check} disabled={result === 'loading'} className="w-full h-9 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-[13px] font-semibold disabled:opacity-60">
                {result === 'loading' ? 'Checking with payer…' : 'Check eligibility'}
              </button>
            </div>
            {result === 'done' && (
              <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 animate-view-in">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-emerald-800"><CheckIcon size={14} strokeWidth={3} /> Coverage active · {payer}</div>
                <dl className="mt-2 grid grid-cols-2 gap-y-1.5 text-[12px]">
                  {[['Plan', 'PPO Gold'], ['Copay (specialist)', '$40'], ['Deductible left', '$620 of $1,500'], ['OOP max left', '$3,180'], ['Prior auth for MRI', 'Required']].map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-slate-600">{k}</dt>
                      <dd className="text-right font-medium text-slate-900">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-2 text-[10.5px] text-slate-500">X12 270/271 · response in 0.9s</div>
              </div>
            )}
          </div>
        </div>
      </Body>
    </>
  );
}

/* ───────────────────────── Surgery: WHO checklist ───────────────────────── */

const phases = [
  { name: 'Sign in', when: 'Before induction', items: ['Identity, site and procedure confirmed', 'Site marked', 'Anesthesia safety check complete', 'Known allergy reviewed'] },
  { name: 'Time out', when: 'Before incision', items: ['Team introduced by name and role', 'Antibiotic prophylaxis within 60 min', 'Essential imaging displayed', 'Anticipated critical events discussed'] },
  { name: 'Sign out', when: 'Before leaving OR', items: ['Procedure recorded', 'Instrument and sponge counts correct', 'Specimen labelled', 'Recovery concerns handed over'] },
];

export function SurgicalChecklist() {
  const { notify } = useDash();
  const [phase, setPhase] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({ 'Sign in-0': true, 'Sign in-1': true });
  const ph = phases[phase];
  const complete = ph.items.every((_, i) => done[`${ph.name}-${i}`]);

  return (
    <div className="grid grid-cols-12 gap-4 mt-4">
      <div className="col-span-8 bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13.5px] font-semibold text-slate-900">WHO Surgical Safety Checklist · OR 3</div>
            <div className="text-[12px] text-slate-500">Hip hemiarthroplasty · P. Okonkwo · Dr. Okafor</div>
          </div>
          <Segmented options={phases.map((p, i) => ({ id: String(i), label: p.name }))} value={String(phase)} onChange={(v) => setPhase(+v)} />
        </div>
        <div key={phase} className="mt-3 grid grid-cols-2 gap-2 animate-view-in">
          {ph.items.map((it, i) => {
            const k = `${ph.name}-${i}`;
            return (
              <button key={k} onClick={() => setDone((d) => ({ ...d, [k]: !d[k] }))} className={`flex items-center gap-2.5 rounded-md border px-3 py-2 text-left text-[12.5px] ${done[k] ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                <span className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center ${done[k] ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>{done[k] && <CheckIcon size={11} strokeWidth={3} />}</span>
                {it}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11.5px] text-slate-500">{ph.when}</span>
          <button
            disabled={!complete}
            onClick={() => { notify(`${ph.name} complete and time-stamped.`); if (phase < 2) setPhase(phase + 1); }}
            className="h-8 px-3 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-[12.5px] font-semibold disabled:opacity-40"
          >
            Confirm {ph.name.toLowerCase()}
          </button>
        </div>
      </div>
      <div className="col-span-4 bg-white rounded-lg border border-slate-200 p-4">
        <div className="text-[13.5px] font-semibold text-slate-900 mb-2">Theatre status</div>
        {[['OR 1', 'In surgery', 'blue'], ['OR 2', 'Turnover · 12m', 'amber'], ['OR 3', 'Pre-op checklist', 'violet'], ['OR 4', 'In surgery', 'blue'], ['OR 5', 'Ready', 'green'], ['OR 6', 'Cleaning', 'slate']].map(([r, s, t]) => (
          <div key={r} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0 text-[12.5px]">
            <span className="font-semibold text-slate-700">{r}</span>
            <Pill tone={t as Tone}>{s}</Pill>
          </div>
        ))}
      </div>
    </div>
  );
}
