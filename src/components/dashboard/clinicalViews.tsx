import { useState } from 'react';
import {
  Avatar, Body, GhostBtn, Meter, PageHeader, Panel, Pill, PrimaryBtn, Segmented, Sparkline, StatRow, Table,
  useDash, type ChartPatient, type Tone,
} from './ui';
import { AlertIcon, ArrowRightIcon, DownloadIcon, FilterIcon, PlusIcon, SearchIcon } from '../icons';

/* ───────────────────────── Main dashboard ───────────────────────── */

const hourly = [6, 5, 4, 4, 5, 8, 12, 17, 21, 24, 22, 19, 18, 20, 23, 21, 19, 17, 15, 14, 12, 10, 8, 7];

export function MainDashboard() {
  const { go } = useDash();
  const kpis = [
    { l: 'Inpatient Census', v: '284', d: '+6 vs yesterday', spark: [262, 268, 271, 270, 276, 278, 284] },
    { l: 'Bed Occupancy', v: '86%', d: '42 beds available', spark: [80, 82, 83, 85, 84, 85, 86] },
    { l: 'ED Median Wait', v: '14m', d: '−22% vs 7-day avg', spark: [22, 20, 19, 18, 17, 15, 14] },
    { l: 'OR Utilization', v: '78%', d: '12 of 14 rooms active', spark: [64, 70, 72, 69, 75, 77, 78] },
  ];
  const depts = [
    { n: 'Medical / Surgical', occ: 118, cap: 132 },
    { n: 'Critical Care (ICU)', occ: 22, cap: 24 },
    { n: 'Maternity', occ: 26, cap: 34 },
    { n: 'Pediatrics', occ: 19, cap: 28 },
    { n: 'Cardiology', occ: 31, cap: 36 },
    { n: 'Oncology', occ: 24, cap: 30 },
  ];
  const alerts = [
    { t: 'Critical lab — K⁺ 6.2 mmol/L', p: 'Ann Martinez · ED Bay 12', tone: 'red' as Tone, a: '2m', v: 'lab' as const },
    { t: 'Sepsis screen positive', p: 'Robert Hale · 3N-14', tone: 'red' as Tone, a: '6m', v: 'ip' as const },
    { t: 'ICU capacity at 92%', p: 'Critical Care · 2 beds left', tone: 'amber' as Tone, a: '11m', v: 'icu' as const },
    { t: 'Pharmacy verification queue > 15', p: 'Inpatient pharmacy', tone: 'amber' as Tone, a: '18m', v: 'pharmacy' as const },
  ];
  const max = Math.max(...hourly);

  return (
    <>
      <PageHeader
        crumb="Dashboard"
        title="Good morning, Jessica"
        subtitle="Hospital-wide operations overview"
        actions={<><GhostBtn><DownloadIcon size={14} /> Export</GhostBtn><PrimaryBtn><PlusIcon size={14} /> New Admission</PrimaryBtn></>}
      />
      <Body>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {kpis.map((k, i) => (
            <div key={k.l} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="text-[12.5px] font-medium text-slate-500">{k.l}</div>
              <div className="flex items-end justify-between mt-1.5">
                <div className="text-[28px] font-bold text-slate-900 leading-none tabular-nums">{k.v}</div>
                <div className="w-24"><Sparkline id={`kpi${i}`} data={k.spark} h={32} w={96} /></div>
              </div>
              <div className="text-[12px] text-slate-500 mt-2">{k.d}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <Panel title="ED arrivals · last 24 hours" action="View ED board" onAction={() => go('er')} className="col-span-2">
            <div className="flex items-end gap-[3px] h-40">
              {hourly.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end h-full group relative">
                  <div
                    className={`rounded-t-[3px] ${i === 10 ? 'bg-brand-600' : 'bg-brand-200 group-hover:bg-brand-400'} transition-colors`}
                    style={{ height: `${(v / max) * 100}%` }}
                  />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap">
                    {String(i).padStart(2, '0')}:00 · {v}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[11px] text-slate-400">
              <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
            </div>
          </Panel>

          <Panel title="Clinical alerts" action={<span className="text-red-600">4 active</span>} pad={false}>
            <div className="divide-y divide-slate-100">
              {alerts.map((a) => (
                <button key={a.t} onClick={() => go(a.v)} className="w-full text-left flex items-start gap-3 px-5 py-3 hover:bg-slate-50">
                  <AlertIcon size={15} className={a.tone === 'red' ? 'text-red-600 mt-0.5' : 'text-amber-500 mt-0.5'} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-slate-900 truncate">{a.t}</div>
                    <div className="text-[12px] text-slate-500 truncate">{a.p}</div>
                  </div>
                  <span className="text-[11px] text-slate-400">{a.a}</span>
                </button>
              ))}
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Panel title="Unit census" action="Bed board" onAction={() => go('ip')} className="col-span-2">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {depts.map((d) => {
                const pct = Math.round((d.occ / d.cap) * 100);
                return (
                  <button key={d.n} onClick={() => go(d.n.includes('ICU') ? 'icu' : 'ip')} className="text-left">
                    <div className="flex justify-between text-[13px] mb-1.5">
                      <span className="text-slate-700 font-medium">{d.n}</span>
                      <span className="text-slate-500 tabular-nums">{d.occ}/{d.cap} · <span className="text-slate-900 font-semibold">{pct}%</span></span>
                    </div>
                    <Meter pct={pct} color={pct >= 90 ? 'bg-red-500' : 'bg-brand-600'} />
                  </button>
                );
              })}
            </div>
          </Panel>
          <Panel title="Today" pad={false}>
            <div className="divide-y divide-slate-100 text-[13px]">
              {[
                ['Admissions', '38'],
                ['Discharges', '31'],
                ['Surgeries scheduled', '26'],
                ['OP appointments', '412'],
                ['Pending lab results', '57'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between px-5 py-3">
                  <span className="text-slate-600">{k}</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{v}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </Body>
    </>
  );
}

/* ───────────────────────── Emergency ───────────────────────── */

const esiStyle: Record<number, string> = {
  1: 'bg-slate-900 text-white',
  2: 'bg-red-600 text-white',
  3: 'bg-orange-500 text-white',
  4: 'bg-emerald-600 text-white',
  5: 'bg-sky-600 text-white',
};

type ErCase = ChartPatient & { esi: number; room: string; wait: number; nurse: string; status: 'In Progress' | 'Waiting' | 'Admit' };

const erCases: ErCase[] = [
  { name: 'Thomas Reed', age: 68, sex: 'M', mrn: 'MRN-204118', complaint: 'Chest pain', esi: 1, room: 'Trauma 1', wait: 0, nurse: 'RN Murphy', provider: 'Dr. Shah', status: 'In Progress', location: 'Trauma 1', allergies: 'Penicillin' },
  { name: 'Ann Martinez', age: 52, sex: 'F', mrn: 'MRN-198772', complaint: 'Altered mental status', esi: 2, room: '12', wait: 8, nurse: 'RN Davis', provider: 'Dr. Chen', status: 'In Progress', location: 'ED Bay 12' },
  { name: 'James Liu', age: 35, sex: 'M', mrn: 'MRN-210034', complaint: 'Abdominal pain', esi: 2, room: '7', wait: 12, nurse: 'RN Davis', provider: 'Dr. Shah', status: 'In Progress', location: 'ED Bay 7' },
  { name: 'Patricia Okonkwo', age: 71, sex: 'F', mrn: 'MRN-176540', complaint: 'Fall, R hip pain', esi: 3, room: '4', wait: 24, nurse: 'RN Pham', provider: 'Dr. Chen', status: 'Admit', location: 'ED Bay 4', allergies: 'Sulfa' },
  { name: 'Kevin Park', age: 28, sex: 'M', mrn: 'MRN-221903', complaint: 'Laceration, L hand', esi: 3, room: '9', wait: 31, nurse: 'RN Pham', provider: 'Dr. Williams', status: 'In Progress', location: 'ED Bay 9' },
  { name: 'Sandra Brown', age: 44, sex: 'F', mrn: 'MRN-187266', complaint: 'Migraine', esi: 3, room: '6', wait: 18, nurse: 'RN Brown', provider: 'Dr. Williams', status: 'In Progress', location: 'ED Bay 6' },
  { name: 'George Watts', age: 60, sex: 'M', mrn: 'MRN-165320', complaint: 'Hypertensive urgency', esi: 3, room: '11', wait: 22, nurse: 'RN Murphy', provider: 'Dr. Chen', status: 'In Progress', location: 'ED Bay 11' },
  { name: 'Isabel Cruz', age: 19, sex: 'F', mrn: 'MRN-230118', complaint: 'Ankle sprain', esi: 4, room: 'Wait', wait: 48, nurse: '—', provider: '—', status: 'Waiting', location: 'Waiting room' },
  { name: 'Marcus Hill', age: 33, sex: 'M', mrn: 'MRN-230121', complaint: 'Sore throat', esi: 5, room: 'Wait', wait: 36, nurse: '—', provider: '—', status: 'Waiting', location: 'Waiting room' },
];

const erStatusTone = { 'In Progress': 'blue', Waiting: 'amber', Admit: 'violet' } as const;

export function ERView() {
  const { openChart } = useDash();
  const [mode, setMode] = useState<'board' | 'rooms'>('board');

  return (
    <>
      <PageHeader
        crumb="Emergency"
        title="Emergency Department"
        subtitle="General Hospital ED · Real-time census"
        actions={
          <>
            <Segmented options={[{ id: 'board', label: 'Board' }, { id: 'rooms', label: 'Rooms' }]} value={mode} onChange={setMode} />
            <PrimaryBtn><PlusIcon size={14} /> Register Patient</PrimaryBtn>
          </>
        }
      />
      <StatRow
        stats={[
          { v: '12', l: 'Total Census' },
          { v: '3', l: 'ESI 1–2 (Critical)', c: 'text-red-600' },
          { v: '5', l: 'Waiting', c: 'text-orange-500' },
          { v: '7', l: 'In Care', c: 'text-emerald-600' },
          { v: '6', l: 'Rooms Available', c: 'text-brand-600' },
          { v: '3', l: 'Awaiting Admission', c: 'text-violet-600' },
        ]}
      />
      <Body>
        {mode === 'board' ? (
          <Table head={['', 'Patient', 'Chief Complaint', 'Acuity', 'Room', 'Wait Time', 'Provider', 'Status', '']} widths={['44px', '22%', '15%', '9%', '9%', '9%', '11%', '13%', '70px']}>
            {erCases.map((c, i) => (
              <tr
                key={c.mrn}
                onClick={() => openChart({ ...c, acuity: `ESI ${c.esi}` })}
                className={`border-b border-slate-100 last:border-0 cursor-pointer transition-colors ${
                  c.esi === 1 ? 'bg-red-50/70 hover:bg-red-50' : c.esi === 2 ? 'bg-amber-50/60 hover:bg-amber-50' : 'hover:bg-slate-50'
                }`}
              >
                <td className="pl-4 py-3.5 text-[12px] text-slate-400 text-right">{i + 1}</td>
                <td className="px-4 py-3.5">
                  <div className="font-semibold text-slate-900">{c.name}</div>
                  <div className="text-[12.5px] text-slate-500 mt-0.5">{c.age} yrs · {c.nurse}</div>
                </td>
                <td className="px-4 py-3.5 text-slate-700 truncate">{c.complaint}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[12px] font-bold font-mono ${esiStyle[c.esi]}`}>ESI {c.esi}</span>
                </td>
                <td className={`px-4 py-3.5 font-semibold font-mono ${c.room === 'Wait' ? 'text-orange-600' : 'text-slate-900'}`}>{c.room}</td>
                <td className={`px-4 py-3.5 font-mono ${c.wait >= 30 ? 'text-orange-600 font-semibold' : 'text-slate-800'}`}>{c.wait}m</td>
                <td className="px-4 py-3.5 text-slate-600">{c.provider}</td>
                <td className="px-4 py-3.5"><Pill tone={erStatusTone[c.status]}>{c.status}</Pill></td>
                <td className="px-4 py-3.5 text-slate-500 font-medium hover:text-brand-600">Chart</td>
              </tr>
            ))}
          </Table>
        ) : (
          <div className="grid grid-cols-6 gap-3">
            {['Trauma 1', 'Trauma 2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'].map((r) => {
              const c = erCases.find((x) => x.room === r);
              const cleaning = r === '3' || r === '14';
              return (
                <button
                  key={r}
                  onClick={() => c && openChart({ ...c, acuity: `ESI ${c.esi}` })}
                  className={`text-left rounded-lg border p-3 h-[104px] flex flex-col ${
                    c ? 'bg-white border-slate-200 hover:border-brand-300' : cleaning ? 'bg-amber-50/50 border-amber-200 border-dashed' : 'bg-slate-50 border-dashed border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-mono font-semibold text-slate-500">{r.startsWith('T') ? r : `Bay ${r}`}</span>
                    {c && <span className={`px-1.5 rounded text-[11px] font-bold font-mono ${esiStyle[c.esi]}`}>{c.esi}</span>}
                  </div>
                  {c ? (
                    <div className="mt-auto">
                      <div className="text-[13.5px] font-semibold text-slate-900 truncate">{c.name}</div>
                      <div className="text-[12px] text-slate-500 truncate">{c.complaint}</div>
                    </div>
                  ) : (
                    <div className={`mt-auto text-[12.5px] font-medium ${cleaning ? 'text-amber-700' : 'text-slate-400'}`}>{cleaning ? 'Cleaning' : 'Available'}</div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </Body>
    </>
  );
}

/* ───────────────────────── Inpatient bed board ───────────────────────── */

type Bed = { id: string; state: 'occ' | 'free' | 'clean' | 'res'; p?: string; dx?: string; los?: number; dc?: boolean };
const wards: { name: string; beds: Bed[] }[] = [
  {
    name: '3 North · Medical',
    beds: [
      { id: '3N-01', state: 'occ', p: 'R. Hale', dx: 'Sepsis', los: 3 },
      { id: '3N-02', state: 'occ', p: 'M. Iyer', dx: 'CHF exacerbation', los: 5, dc: true },
      { id: '3N-03', state: 'free' },
      { id: '3N-04', state: 'occ', p: 'L. Gomez', dx: 'Pneumonia', los: 2 },
      { id: '3N-05', state: 'clean' },
      { id: '3N-06', state: 'occ', p: 'D. Novak', dx: 'COPD', los: 4, dc: true },
      { id: '3N-07', state: 'res', p: 'P. Okonkwo', dx: 'From ED · hip fx' },
      { id: '3N-08', state: 'occ', p: 'H. Tanaka', dx: 'Cellulitis', los: 1 },
    ],
  },
  {
    name: '4 East · Surgical',
    beds: [
      { id: '4E-01', state: 'occ', p: 'A. Osei', dx: 'Post-op lap chole', los: 1, dc: true },
      { id: '4E-02', state: 'occ', p: 'S. Klein', dx: 'TKA day 2', los: 2 },
      { id: '4E-03', state: 'occ', p: 'B. Ruiz', dx: 'Appendectomy', los: 1 },
      { id: '4E-04', state: 'free' },
      { id: '4E-05', state: 'occ', p: 'C. Wright', dx: 'Hernia repair', los: 1, dc: true },
      { id: '4E-06', state: 'free' },
      { id: '4E-07', state: 'occ', p: 'F. Ahmed', dx: 'Bowel resection', los: 6 },
      { id: '4E-08', state: 'clean' },
    ],
  },
];

const bedStyle = {
  occ: 'bg-white border-slate-200',
  free: 'bg-emerald-50/60 border-emerald-200 border-dashed',
  clean: 'bg-amber-50/60 border-amber-200 border-dashed',
  res: 'bg-violet-50/60 border-violet-200',
};

export function IPView() {
  const { openChart } = useDash();
  return (
    <>
      <PageHeader
        crumb="Inpatient"
        title="Bed Management"
        subtitle="All inpatient units · Live bed board"
        actions={<><GhostBtn><FilterIcon size={14} /> All units</GhostBtn><PrimaryBtn><PlusIcon size={14} /> Admit Patient</PrimaryBtn></>}
      />
      <StatRow
        stats={[
          { v: '284', l: 'Occupied Beds' },
          { v: '42', l: 'Available', c: 'text-emerald-600' },
          { v: '9', l: 'Being Cleaned', c: 'text-amber-600' },
          { v: '11', l: 'Pending Admits', c: 'text-violet-600' },
          { v: '23', l: 'Expected Discharges', c: 'text-brand-600' },
          { v: '4.2d', l: 'Avg Length of Stay' },
        ]}
      />
      <Body>
        <div className="flex items-center gap-5 mb-4 text-[12px] text-slate-600">
          {[['Occupied', 'bg-white border border-slate-300'], ['Available', 'bg-emerald-100 border border-emerald-300'], ['Cleaning', 'bg-amber-100 border border-amber-300'], ['Reserved', 'bg-violet-100 border border-violet-300']].map(([l, c]) => (
            <span key={l} className="flex items-center gap-1.5"><span className={`h-3 w-3 rounded-sm ${c}`} />{l}</span>
          ))}
          <span className="flex items-center gap-1.5 ml-2"><span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-1 rounded">DC</span>Discharge today</span>
        </div>
        <div className="space-y-5">
          {wards.map((w) => (
            <div key={w.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[13.5px] font-semibold text-slate-800">{w.name}</div>
                <div className="text-[12px] text-slate-500">{w.beds.filter((b) => b.state === 'occ').length}/{w.beds.length} occupied</div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {w.beds.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => b.p && openChart({ name: b.p, age: 58, sex: 'F', mrn: `MRN-1${b.id.replace(/\D/g, '')}42`, complaint: b.dx ?? '', location: b.id, provider: 'Dr. Patel' })}
                    className={`text-left rounded-lg border p-3 h-[78px] ${bedStyle[b.state]} ${b.p ? 'hover:border-brand-300' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-mono font-semibold text-slate-500">{b.id}</span>
                      {b.dc && <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-1 rounded">DC</span>}
                      {b.los !== undefined && !b.dc && <span className="text-[11px] text-slate-400">LOS {b.los}d</span>}
                    </div>
                    {b.p ? (
                      <div className="mt-1.5">
                        <div className="text-[13.5px] font-semibold text-slate-900">{b.p}</div>
                        <div className="text-[12px] text-slate-500 truncate">{b.dx}</div>
                      </div>
                    ) : (
                      <div className={`mt-3 text-[12.5px] font-medium ${b.state === 'free' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {b.state === 'free' ? 'Available' : 'Cleaning · ETA 20m'}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Body>
    </>
  );
}

/* ───────────────────────── ICU monitoring ───────────────────────── */

const icuPts = [
  { bed: 'ICU-01', name: 'Harold Jensen', age: 74, dx: 'Septic shock', hr: 112, bp: '94/58', spo2: 91, rr: 24, t: 38.6, news: 9, vent: 'Ventilated · FiO₂ 45%', trend: [98, 102, 105, 108, 110, 114, 112] },
  { bed: 'ICU-02', name: 'Grace Min', age: 61, dx: 'Post CABG', hr: 84, bp: '118/72', spo2: 97, rr: 16, t: 37.1, news: 2, vent: 'Room air', trend: [92, 90, 88, 86, 85, 84, 84] },
  { bed: 'ICU-03', name: 'Victor Alvarez', age: 55, dx: 'DKA', hr: 104, bp: '108/66', spo2: 96, rr: 22, t: 37.4, news: 5, vent: 'Nasal cannula 2L', trend: [118, 115, 112, 110, 108, 105, 104] },
  { bed: 'ICU-04', name: 'Eleanor Price', age: 80, dx: 'ARDS', hr: 96, bp: '102/60', spo2: 89, rr: 28, t: 38.1, news: 8, vent: 'Ventilated · FiO₂ 60%', trend: [88, 90, 92, 95, 94, 97, 96] },
  { bed: 'ICU-05', name: 'Samuel Obi', age: 47, dx: 'TBI', hr: 72, bp: '132/80', spo2: 98, rr: 14, t: 36.9, news: 1, vent: 'Room air', trend: [80, 78, 76, 74, 73, 72, 72] },
  { bed: 'ICU-06', name: 'Nora Fitzgerald', age: 66, dx: 'GI bleed', hr: 108, bp: '96/62', spo2: 95, rr: 20, t: 37.2, news: 6, vent: 'Room air', trend: [96, 99, 101, 104, 106, 107, 108] },
];

function newsTone(n: number) {
  return n >= 7 ? { c: 'bg-red-600 text-white', l: 'High' } : n >= 5 ? { c: 'bg-orange-500 text-white', l: 'Medium' } : { c: 'bg-emerald-600 text-white', l: 'Low' };
}

export function ICUView() {
  const { openChart } = useDash();
  return (
    <>
      <PageHeader
        crumb="Critical Care"
        title="ICU Central Monitoring"
        subtitle="Medical ICU · 6 of 8 beds"
        actions={<><GhostBtn>Handover report</GhostBtn><PrimaryBtn><PlusIcon size={14} /> ICU Admission</PrimaryBtn></>}
      />
      <StatRow
        stats={[
          { v: '6/8', l: 'Beds Occupied' },
          { v: '2', l: 'NEWS2 ≥ 7', c: 'text-red-600' },
          { v: '2', l: 'Ventilated', c: 'text-violet-600' },
          { v: '14', l: 'Due Medications', c: 'text-orange-500' },
          { v: '1:2', l: 'Nurse Ratio', c: 'text-brand-600' },
        ]}
      />
      <Body>
        <div className="grid grid-cols-3 gap-4">
          {icuPts.map((p) => {
            const n = newsTone(p.news);
            return (
              <button
                key={p.bed}
                onClick={() => openChart({ name: p.name, age: p.age, sex: 'M', mrn: `MRN-3${p.bed.slice(-2)}871`, complaint: p.dx, location: p.bed, provider: 'Dr. Kaur', acuity: `NEWS2 ${p.news}` })}
                className={`text-left bg-white rounded-lg border p-4 hover:shadow-md transition-shadow ${p.news >= 7 ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200'}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[12px] font-mono text-slate-500">{p.bed}</div>
                    <div className="text-[15px] font-semibold text-slate-900">{p.name}</div>
                    <div className="text-[12.5px] text-slate-500">{p.age} yrs · {p.dx}</div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[12px] font-bold ${n.c}`}>NEWS2 {p.news}</span>
                    <div className="text-[11px] text-slate-500 mt-1">{n.l} risk</div>
                  </div>
                </div>
                <div className="mt-3 mb-2">
                  <div className="text-[11px] text-slate-400 mb-0.5">Heart rate · 6h</div>
                  <Sparkline id={`icu${p.bed}`} data={p.trend} h={36} color={p.news >= 7 ? '#dc2626' : '#d93654'} />
                </div>
                <div className="grid grid-cols-5 gap-1 pt-3 border-t border-slate-100">
                  {[
                    ['HR', p.hr, p.hr > 100],
                    ['BP', p.bp, parseInt(p.bp) < 100],
                    ['SpO₂', `${p.spo2}%`, p.spo2 < 92],
                    ['RR', p.rr, p.rr > 22],
                    ['T °C', p.t, p.t >= 38],
                  ].map(([l, v, bad]) => (
                    <div key={String(l)}>
                      <div className="text-[10.5px] text-slate-400 font-medium">{l}</div>
                      <div className={`text-[14px] font-semibold tabular-nums ${bad ? 'text-red-600' : 'text-slate-900'}`}>{v}</div>
                    </div>
                  ))}
                </div>
                <div className="text-[12px] text-slate-500 mt-2.5">{p.vent}</div>
              </button>
            );
          })}
        </div>
      </Body>
    </>
  );
}

/* ───────────────────────── Outpatient / appointments ───────────────────────── */

const appts = [
  { tk: 'A-021', time: '09:00', name: 'Priya Raman', age: 34, sex: 'F' as const, doc: 'Dr. Mehta', dept: 'Cardiology', type: 'Follow-up', status: 'Completed' },
  { tk: 'A-022', time: '09:15', name: 'John Carver', age: 57, sex: 'M' as const, doc: 'Dr. Mehta', dept: 'Cardiology', type: 'New', status: 'In Consult' },
  { tk: 'B-014', time: '09:20', name: 'Lucia Moreno', age: 29, sex: 'F' as const, doc: 'Dr. Lee', dept: 'Obstetrics', type: 'ANC visit', status: 'In Consult' },
  { tk: 'A-023', time: '09:30', name: 'Ethan Brooks', age: 45, sex: 'M' as const, doc: 'Dr. Mehta', dept: 'Cardiology', type: 'Follow-up', status: 'Vitals Done' },
  { tk: 'C-008', time: '09:30', name: 'Amara Nwosu', age: 8, sex: 'F' as const, doc: 'Dr. Rossi', dept: 'Pediatrics', type: 'Vaccination', status: 'Checked In' },
  { tk: 'B-015', time: '09:40', name: 'Hannah Schultz', age: 38, sex: 'F' as const, doc: 'Dr. Lee', dept: 'Obstetrics', type: 'Ultrasound', status: 'Checked In' },
  { tk: 'D-003', time: '09:45', name: 'Rahul Verma', age: 62, sex: 'M' as const, doc: 'Dr. Okafor', dept: 'Orthopedics', type: 'Post-op', status: 'Scheduled' },
  { tk: 'A-024', time: '10:00', name: 'Olivia Grant', age: 51, sex: 'F' as const, doc: 'Dr. Mehta', dept: 'Cardiology', type: 'Echo review', status: 'Scheduled' },
  { tk: 'C-009', time: '10:00', name: 'Leo Martin', age: 4, sex: 'M' as const, doc: 'Dr. Rossi', dept: 'Pediatrics', type: 'Fever', status: 'No-show' },
];
const apptTone: Record<string, Tone> = { Completed: 'green', 'In Consult': 'blue', 'Vitals Done': 'violet', 'Checked In': 'amber', Scheduled: 'slate', 'No-show': 'red' };

export function OPView() {
  const { openChart } = useDash();
  const [dept, setDept] = useState('All');
  const rows = appts.filter((a) => dept === 'All' || a.dept === dept);
  return (
    <>
      <PageHeader
        crumb="Appointments"
        title="Outpatient Clinics"
        subtitle="Today's schedule · 14 clinics running"
        actions={<><GhostBtn><CalendarMini /> Calendar</GhostBtn><PrimaryBtn><PlusIcon size={14} /> Book Appointment</PrimaryBtn></>}
      />
      <StatRow
        stats={[
          { v: '412', l: 'Booked Today' },
          { v: '96', l: 'Completed', c: 'text-emerald-600' },
          { v: '38', l: 'In Queue', c: 'text-orange-500' },
          { v: '11m', l: 'Avg Wait', c: 'text-brand-600' },
          { v: '4%', l: 'No-show Rate', c: 'text-red-600' },
        ]}
      />
      <Body>
        <div className="flex items-center gap-2 mb-4">
          {['All', 'Cardiology', 'Obstetrics', 'Pediatrics', 'Orthopedics'].map((d) => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={`px-3 h-8 rounded-full text-[12.5px] font-medium border transition-colors ${dept === d ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
            >
              {d}
            </button>
          ))}
        </div>
        <Table head={['Token', 'Time', 'Patient', 'Clinician', 'Department', 'Visit Type', 'Status', '']} widths={['80px', '70px', '20%', '14%', '13%', '13%', '14%', '90px']}>
          {rows.map((a) => (
            <tr key={a.tk} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer" onClick={() => openChart({ name: a.name, age: a.age, sex: a.sex, mrn: `MRN-4${a.tk.replace(/\D/g, '')}55`, complaint: a.type, location: `${a.dept} OPD`, provider: a.doc })}>
              <td className="px-4 py-3 font-mono font-semibold text-slate-700">{a.tk}</td>
              <td className="px-4 py-3 font-mono text-slate-600">{a.time}</td>
              <td className="px-4 py-3">
                <div className="font-semibold text-slate-900">{a.name}</div>
                <div className="text-[12px] text-slate-500">{a.age} yrs · {a.sex}</div>
              </td>
              <td className="px-4 py-3 text-slate-700">{a.doc}</td>
              <td className="px-4 py-3 text-slate-600">{a.dept}</td>
              <td className="px-4 py-3 text-slate-600">{a.type}</td>
              <td className="px-4 py-3"><Pill tone={apptTone[a.status]}>{a.status}</Pill></td>
              <td className="px-4 py-3 text-brand-600 font-medium">{a.status === 'Checked In' ? 'Call in' : 'Open'}</td>
            </tr>
          ))}
        </Table>
      </Body>
    </>
  );
}

function CalendarMini() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
}

/* ───────────────────────── Patient search ───────────────────────── */

const patients = [
  { mrn: 'MRN-204118', name: 'Thomas Reed', age: 68, sex: 'M' as const, phone: '(555) 201-3344', last: 'Today', dept: 'Emergency', payer: 'Medicare', status: 'Admitted' },
  { mrn: 'MRN-198772', name: 'Ann Martinez', age: 52, sex: 'F' as const, phone: '(555) 118-9021', last: 'Today', dept: 'Emergency', payer: 'Aetna PPO', status: 'In ED' },
  { mrn: 'MRN-176540', name: 'Patricia Okonkwo', age: 71, sex: 'F' as const, phone: '(555) 764-0092', last: 'Today', dept: 'Orthopedics', payer: 'Medicare', status: 'Admitting' },
  { mrn: 'MRN-150218', name: 'Robert Hale', age: 66, sex: 'M' as const, phone: '(555) 330-1180', last: '3 days ago', dept: 'Medicine', payer: 'BCBS', status: 'Admitted' },
  { mrn: 'MRN-221903', name: 'Kevin Park', age: 28, sex: 'M' as const, phone: '(555) 902-4417', last: 'Today', dept: 'Emergency', payer: 'Self-pay', status: 'In ED' },
  { mrn: 'MRN-143377', name: 'Priya Raman', age: 34, sex: 'F' as const, phone: '(555) 455-2231', last: 'Today', dept: 'Cardiology', payer: 'Cigna', status: 'Outpatient' },
  { mrn: 'MRN-132908', name: 'Grace Min', age: 61, sex: 'F' as const, phone: '(555) 671-8820', last: '5 days ago', dept: 'Cardiothoracic', payer: 'UnitedHealth', status: 'ICU' },
  { mrn: 'MRN-120044', name: 'Daniel Novak', age: 73, sex: 'M' as const, phone: '(555) 223-5519', last: '4 days ago', dept: 'Pulmonology', payer: 'Medicare', status: 'Discharging' },
];
const ptTone: Record<string, Tone> = { Admitted: 'blue', 'In ED': 'red', Admitting: 'violet', Outpatient: 'green', ICU: 'red', Discharging: 'amber' };

export function PatientsView() {
  const { openChart, notify } = useDash();
  const [q, setQ] = useState('');
  const rows = patients.filter((p) => (p.name + p.mrn).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader
        crumb="Patients"
        title="Patient Search"
        subtitle="Master patient index · 184,209 records"
        actions={<PrimaryBtn><PlusIcon size={14} /> Register Patient</PrimaryBtn>}
      />
      <Body>
        <div className="relative mb-4">
          <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, MRN, phone or date of birth…"
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 bg-white text-[14px] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
        </div>
        <Table head={['Patient', 'MRN', 'Contact', 'Last Visit', 'Department', 'Payer', 'Status']} widths={['24%', '14%', '14%', '11%', '13%', '12%', '12%']}>
          {rows.map((p) => (
            <tr key={p.mrn} onClick={() => openChart({ name: p.name, age: p.age, sex: p.sex, mrn: p.mrn, complaint: p.dept, location: p.dept, provider: 'Dr. Chen' })} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={p.name} tone="bg-brand-50 text-brand-700" />
                  <div>
                    <div className="font-semibold text-slate-900">{p.name}</div>
                    <div className="text-[12px] text-slate-500">{p.age} yrs · {p.sex}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-[12.5px] text-slate-600">{p.mrn}</td>
              <td className="px-4 py-3 text-slate-600">{p.phone}</td>
              <td className="px-4 py-3 text-slate-600">{p.last}</td>
              <td className="px-4 py-3 text-slate-600">{p.dept}</td>
              <td className="px-4 py-3 text-slate-600">{p.payer}</td>
              <td className="px-4 py-3"><Pill tone={ptTone[p.status]}>{p.status}</Pill></td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No patients match “{q}”</td></tr>
          )}
        </Table>
        <div className="flex justify-end mt-3">
          <button onClick={() => notify('Advanced search by DOB, phone or insurance ID is available in the full product.')} className="flex items-center gap-1 text-[12.5px] text-brand-600 font-medium hover:text-brand-700">
            Advanced search <ArrowRightIcon size={13} />
          </button>
        </div>
      </Body>
    </>
  );
}
