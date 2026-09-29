import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Body, PageHeader, Pill, StatRow, useDash } from './ui';
import {
  AlertIcon, ArrowRightIcon, BodyIcon, BrainIcon, CheckIcon, ChevronRightIcon, FileTextIcon, ScanIcon, SearchIcon,
  SendIcon, SparkIcon, TableIcon, UploadIcon, type IconType,
} from '../icons';

export type AiId = 'ocr' | 'symptom' | 'summary' | 'bulk' | 'nlq';

export const aiModules: { id: AiId; name: string; icon: IconType; desc: string }[] = [
  { id: 'ocr', name: 'Keppler OCR', icon: ScanIcon, desc: 'Full medical document intelligence platform: OCR extraction, PDF summarization, and a RAG assistant over uploaded records.' },
  { id: 'symptom', name: 'Symptom AI', icon: BodyIcon, desc: 'Interactive body map for patient symptom logging with AI-assisted preliminary insights and specialist suggestions.' },
  { id: 'summary', name: 'Clinical Summaries', icon: FileTextIcon, desc: 'Generate concise discharge summaries and encounter notes from long patient histories or uploaded records.' },
  { id: 'bulk', name: 'Bulk Patient AI', icon: TableIcon, desc: 'Upload patient record spreadsheets or documents for AI-assisted column mapping and asynchronous import.' },
  { id: 'nlq', name: 'NL Patient Filtering', icon: SearchIcon, desc: 'Use natural language queries to filter the bulk-imported patient population (e.g. "male patients over 50").' },
];

/** Reveals `text` progressively once `run` is true, to mimic streamed model output. */
function useTyped(text: string, run: boolean, speed = 6) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return setN(0);
    setN(0);
    const t = setInterval(() => setN((x) => (x >= text.length ? (clearInterval(t), x) : x + speed)), 16);
    return () => clearInterval(t);
  }, [text, run, speed]);
  return { out: text.slice(0, n), done: run && n >= text.length };
}

function QwenBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-2 py-0.5">
      <SparkIcon size={11} /> Qwen-powered
    </span>
  );
}

function AiNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-[12px] text-amber-900">
      <AlertIcon size={13} className="text-amber-600 mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

function Card({ title, right, children, className = '' }: { title?: string; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 flex flex-col min-h-0 ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-4 h-11 border-b border-slate-100 shrink-0">
          <span className="text-[13.5px] font-semibold text-slate-900">{title}</span>
          {right}
        </div>
      )}
      <div className="p-4 flex-1 min-h-0 overflow-auto">{children}</div>
    </div>
  );
}

/* ───────────────────────── Hub ───────────────────────── */

export function AIHubView({ initial }: { initial?: AiId }) {
  const [open, setOpen] = useState<AiId | null>(initial ?? null);
  useEffect(() => setOpen(initial ?? null), [initial]);
  const mod = aiModules.find((m) => m.id === open);

  return (
    <>
      <PageHeader
        crumb={mod ? `Intelligence Hub / ${mod.name}` : 'Intelligence Hub'}
        title={mod ? mod.name : 'Intelligence Hub'}
        subtitle={mod ? 'AI module · vLLM · Qwen' : 'AI command center · one vLLM-served Qwen model'}
        actions={
          mod ? (
            <button onClick={() => setOpen(null)} className="flex items-center gap-1.5 px-3.5 h-9 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[13px] font-medium rounded-md">
              <ChevronRightIcon size={14} className="rotate-180" /> All AI modules
            </button>
          ) : (
            <span className="flex items-center gap-2 text-[12.5px] text-slate-600 bg-white border border-slate-200 rounded-full px-3 h-8">
              <span className="relative flex h-2 w-2"><span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping-slow" /><span className="relative h-2 w-2 rounded-full bg-emerald-500" /></span>
              Model online · Qwen via vLLM
            </span>
          )
        }
      />
      {!mod && (
        <StatRow
          stats={[
            { v: '5', l: 'AI Modules' },
            { v: '1,284', l: 'Documents Processed', c: 'text-brand-600', sub: 'Today' },
            { v: '312', l: 'Summaries Drafted', c: 'text-violet-600', sub: 'Today' },
            { v: '18,406', l: 'Patients Imported', c: 'text-emerald-600' },
            { v: '100%', l: 'Human Review', c: 'text-slate-900', sub: 'Before anything is filed' },
          ]}
        />
      )}
      <Body>
        {!mod ? (
          <div className="grid grid-cols-3 gap-4">
            {aiModules.map((m, i) => (
              <div key={m.id} className={`group bg-white rounded-xl border border-slate-200 p-5 flex flex-col hover:border-brand-300 hover:shadow-md transition-all ${i < 2 ? 'col-span-1' : ''}`}>
                <div className="flex items-center justify-between">
                  <span className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 text-white flex items-center justify-center shadow-sm"><m.icon size={19} /></span>
                  <QwenBadge />
                </div>
                <div className="mt-4 text-[16px] font-semibold text-slate-900">{m.name}</div>
                <p className="mt-1.5 text-[13px] text-slate-600 leading-relaxed flex-1">{m.desc}</p>
                <button onClick={() => setOpen(m.id)} className="mt-4 self-start flex items-center gap-1.5 h-8 px-3 rounded-md bg-slate-900 hover:bg-brand-600 text-white text-[12.5px] font-semibold transition-colors">
                  Open module <ArrowRightIcon size={13} />
                </button>
              </div>
            ))}
            <div className="rounded-xl border border-dashed border-slate-300 p-5 flex flex-col justify-center">
              <BrainIcon size={22} className="text-slate-400" />
              <div className="mt-3 text-[14px] font-semibold text-slate-800">One model, every module</div>
              <p className="mt-1 text-[12.5px] text-slate-500 leading-relaxed">All AI features call the same Qwen model served with vLLM, so behaviour, prompts and governance stay consistent across the hospital.</p>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {open === 'ocr' && <OcrPanel />}
            {open === 'symptom' && <SymptomPanel />}
            {open === 'summary' && <SummaryPanel />}
            {open === 'bulk' && <BulkPanel />}
            {open === 'nlq' && <NlqPanel />}
          </div>
        )}
      </Body>
    </>
  );
}

/* ───────────────────────── Keppler OCR ───────────────────────── */

const docs = [
  {
    name: 'Discharge_Summary_StMarys.pdf', pages: 6, kind: 'PDF',
    fields: [['Patient', 'Robert Hale · 66 M'], ['DOB', '1960-03-14'], ['Primary diagnosis', 'Sepsis, urinary source (A41.9)'], ['Secondary', 'Type 2 diabetes (E11.9), CKD stage 3 (N18.3)'], ['Allergies', 'Sulfonamides'], ['Discharge meds', 'Ciprofloxacin 500 mg BID × 7d, Metformin 500 mg BID']],
    conf: [99, 98, 94, 91, 97, 93],
    summary: '66-year-old man admitted with urosepsis, treated with IV piperacillin-tazobactam then stepped down to oral ciprofloxacin. Renal function returned to baseline (Cr 1.4). Discharged home day 5 with a 7-day antibiotic course and PCP follow-up in one week.',
  },
  {
    name: 'Lab_Report_2026-09-21.pdf', pages: 2, kind: 'PDF',
    fields: [['Patient', 'Ann Martinez · 52 F'], ['Collected', '2026-09-21 08:14'], ['Potassium', '6.2 mmol/L (H)'], ['Creatinine', '2.1 mg/dL (H)'], ['Glucose', '142 mg/dL'], ['Ordering provider', 'Dr. L. Chen']],
    conf: [99, 99, 98, 98, 97, 95],
    summary: 'Basic metabolic panel with critical hyperkalemia (K⁺ 6.2) and elevated creatinine suggesting acute kidney injury. Remaining values within or near reference ranges.',
  },
  {
    name: 'Referral_Letter_scan.jpg', pages: 1, kind: 'Image',
    fields: [['Patient', 'Priya Raman · 34 F'], ['Referred by', 'Dr. K. Iyer, Family Medicine'], ['Reason', 'Palpitations, abnormal ECG'], ['Requested', 'Cardiology consult + echo'], ['Urgency', 'Routine, within 4 weeks'], ['Insurance', 'Cigna PPO']],
    conf: [97, 92, 95, 93, 88, 96],
    summary: 'Handwritten referral from primary care for intermittent palpitations with a nonspecific ECG finding. Requests cardiology consultation and echocardiogram within four weeks.',
  },
];

const ragQA: Record<number, [string, string][]> = {
  0: [
    ['What antibiotics was he discharged on?', 'Ciprofloxacin 500 mg twice daily for 7 days, after 4 days of IV piperacillin-tazobactam. [Discharge summary, p.4]'],
    ['Any drug allergies to flag?', 'Yes. Documented sulfonamide allergy (rash). [p.1, Allergies section]'],
    ['What follow-up is planned?', 'PCP visit within 7 days with repeat BMP, and urology referral if symptoms recur. [p.6]'],
  ],
  1: [
    ['Which values are critical?', 'Potassium 6.2 mmol/L is flagged critical; creatinine 2.1 mg/dL is high. [p.1, results table]'],
    ['Who ordered the panel?', 'Dr. L. Chen, Emergency Department. [p.2, footer]'],
  ],
  2: [
    ['Why was she referred?', 'Intermittent palpitations with an abnormal ECG. [Referral letter, para 2]'],
    ['What does the referrer request?', 'Cardiology consultation and an echocardiogram within four weeks. [para 3]'],
  ],
};

function OcrPanel() {
  const [sel, setSel] = useState(0);
  const [chat, setChat] = useState<[string, string][]>([]);
  const [asking, setAsking] = useState<string | null>(null);
  const d = docs[sel];
  const pick = (i: number) => { setSel(i); setChat([]); setAsking(null); };
  const ask = (q: string, a: string) => {
    setAsking(q);
    setTimeout(() => { setChat((c) => [...c, [q, a]]); setAsking(null); }, 700);
  };
  const asked = new Set(chat.map(([q]) => q));

  return (
    <div className="grid grid-cols-12 gap-4 h-full min-h-0">
      <Card title="Uploaded records" right={<span className="text-[11.5px] text-slate-400">{docs.length} files</span>} className="col-span-3">
        <div className="space-y-2">
          {docs.map((x, i) => (
            <button key={x.name} onClick={() => pick(i)} className={`w-full text-left rounded-md border px-3 py-2.5 transition-colors ${i === sel ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'}`}>
              <div className="text-[12.5px] font-semibold text-slate-900 truncate">{x.name}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] text-slate-500">{x.kind} · {x.pages} {x.pages > 1 ? 'pages' : 'page'}</span>
                <span className="text-[10.5px] font-semibold text-emerald-700">Extracted</span>
              </div>
            </button>
          ))}
          <div className="rounded-md border-2 border-dashed border-slate-200 px-3 py-4 text-center text-[12px] text-slate-500">
            <UploadIcon size={16} className="mx-auto text-slate-400 mb-1" />
            Drop PDF, image or DOCX
          </div>
        </div>
      </Card>

      <div className="col-span-5 flex flex-col gap-4 min-h-0">
        <Card title="Extracted fields" right={<QwenBadge />}>
          <table key={sel} className="w-full text-[12.5px] animate-view-in">
            <tbody>
              {d.fields.map(([k, v], i) => (
                <tr key={k} className="border-b border-slate-100 last:border-0">
                  <td className="py-1.5 pr-3 text-slate-500 w-[34%]">{k}</td>
                  <td className="py-1.5 text-slate-900 font-medium">{v}</td>
                  <td className="py-1.5 text-right">
                    <span className={`text-[11px] font-mono ${d.conf[i] >= 95 ? 'text-emerald-600' : 'text-amber-600'}`}>{d.conf[i]}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="AI summary">
          <p key={sel} className="text-[13px] text-slate-700 leading-relaxed animate-view-in">{d.summary}</p>
        </Card>
      </div>

      <Card title="Ask the record (RAG)" right={<span className="text-[11px] text-slate-400">Answers cite source pages</span>} className="col-span-4">
        <div className="flex flex-col h-full gap-3">
          <div className="flex-1 space-y-3">
            {chat.length === 0 && !asking && <div className="text-[12.5px] text-slate-500">Ask a question about <span className="font-medium text-slate-700">{d.name}</span>.</div>}
            {chat.map(([q, a]) => (
              <div key={q} className="space-y-2 animate-view-in">
                <div className="ml-8 rounded-lg rounded-tr-sm bg-slate-900 text-white text-[12.5px] px-3 py-2">{q}</div>
                <div className="mr-4 rounded-lg rounded-tl-sm bg-brand-50 border border-brand-100 text-slate-800 text-[12.5px] px-3 py-2 leading-relaxed">{a}</div>
              </div>
            ))}
            {asking && (
              <div className="space-y-2">
                <div className="ml-8 rounded-lg bg-slate-900 text-white text-[12.5px] px-3 py-2">{asking}</div>
                <div className="mr-4 flex gap-1 px-3 py-3 rounded-lg bg-brand-50 w-16">
                  {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ragQA[sel].filter(([q]) => !asked.has(q)).map(([q, a]) => (
              <button key={q} disabled={!!asking} onClick={() => ask(q, a)} className="text-[11.5px] text-brand-700 bg-white border border-brand-200 hover:bg-brand-50 rounded-full px-2.5 py-1 disabled:opacity-50">
                {q}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 h-9 rounded-md border border-slate-200 px-3 text-[12.5px] text-slate-400">
            <span className="flex-1">Pick a suggested question above</span>
            <SendIcon size={14} />
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ───────────────────────── Symptom AI ───────────────────────── */

type Region = 'head' | 'chest' | 'abdomen' | 'l-arm' | 'r-arm' | 'l-leg' | 'r-leg';
const regionLabel: Record<Region, string> = { head: 'Head', chest: 'Chest', abdomen: 'Abdomen', 'l-arm': 'Left arm', 'r-arm': 'Right arm', 'l-leg': 'Left leg', 'r-leg': 'Right leg' };
const symptomsFor: Record<Region, string[]> = {
  head: ['Headache', 'Dizziness', 'Blurred vision'],
  chest: ['Chest pain', 'Shortness of breath', 'Palpitations'],
  abdomen: ['Abdominal pain', 'Nausea', 'Bloating'],
  'l-arm': ['Arm pain', 'Numbness', 'Weakness'],
  'r-arm': ['Arm pain', 'Numbness', 'Weakness'],
  'l-leg': ['Leg swelling', 'Calf pain', 'Weakness'],
  'r-leg': ['Leg swelling', 'Calf pain', 'Weakness'],
};

function insightFor(regions: Region[], sev: number): { title: string; points: string[]; specialist: string; urgency: [string, 'red' | 'amber' | 'green'] } {
  const has = (r: Region) => regions.includes(r);
  if (has('chest') && (has('l-arm') || sev >= 7))
    return { title: 'Pattern consistent with possible cardiac origin', points: ['Chest symptoms with left-arm involvement or high severity', 'Consider ECG and troponin before other work-up', 'Rule out acute coronary syndrome first'], specialist: 'Emergency Medicine → Cardiology', urgency: ['Urgent evaluation', 'red'] };
  if ((has('l-leg') || has('r-leg')) && has('chest'))
    return { title: 'Consider venous thromboembolism', points: ['Leg symptoms combined with chest or breathing complaints', 'Assess Wells score; consider D-dimer or CT angiography'], specialist: 'Emergency Medicine → Pulmonology', urgency: ['Urgent evaluation', 'red'] };
  if (has('abdomen'))
    return { title: 'Abdominal complaint: localize and assess', points: ['Document location, onset and associated GI symptoms', 'Consider CBC, lipase and imaging based on exam'], specialist: 'General Surgery or Gastroenterology', urgency: [sev >= 7 ? 'Same-day review' : 'Routine review', sev >= 7 ? 'amber' : 'green'] };
  if (has('head'))
    return { title: 'Headache work-up', points: ['Screen for red flags: sudden onset, neuro deficit, fever', 'Most presentations are primary headache disorders'], specialist: 'Neurology (if red flags present)', urgency: [sev >= 8 ? 'Same-day review' : 'Routine review', sev >= 8 ? 'amber' : 'green'] };
  return { title: 'Musculoskeletal or peripheral complaint', points: ['Document mechanism, range of motion and neurovascular status', 'Consider X-ray if trauma or bony tenderness'], specialist: 'Orthopedics or Physiotherapy', urgency: ['Routine review', 'green'] };
}

function SymptomPanel() {
  const [regions, setRegions] = useState<Region[]>(['chest']);
  const [sev, setSev] = useState(6);
  const [ran, setRan] = useState(false);
  const toggle = (r: Region) => { setRan(false); setRegions((x) => (x.includes(r) ? x.filter((y) => y !== r) : [...x, r])); };
  const ins = insightFor(regions, sev);
  const fill = (r: Region) => (regions.includes(r) ? '#ff677d' : '#e2e8f0');
  const part = (r: Region) => ({ onClick: () => toggle(r), fill: fill(r), stroke: '#fff', strokeWidth: 2, className: 'cursor-pointer transition-colors hover:opacity-80' });

  return (
    <div className="grid grid-cols-12 gap-4 h-full min-h-0">
      <Card title="Body map" right={<span className="text-[11.5px] text-slate-400">Tap regions to log symptoms</span>} className="col-span-4">
        <svg viewBox="0 0 200 330" className="h-[300px] mx-auto" role="img" aria-label="Front body map">
          <circle cx="100" cy="36" r="26" {...part('head')} />
          <rect x="62" y="68" width="76" height="72" rx="18" {...part('chest')} />
          <rect x="66" y="142" width="68" height="62" rx="14" {...part('abdomen')} />
          <rect x="30" y="74" width="28" height="118" rx="14" {...part('r-arm')} />
          <rect x="142" y="74" width="28" height="118" rx="14" {...part('l-arm')} />
          <rect x="68" y="208" width="30" height="116" rx="15" {...part('r-leg')} />
          <rect x="102" y="208" width="30" height="116" rx="15" {...part('l-leg')} />
        </svg>
        <div className="flex justify-between text-[10.5px] text-slate-400 px-6 -mt-1"><span>Patient's right</span><span>Patient's left</span></div>
      </Card>

      <Card title="Symptom log" className="col-span-4">
        {regions.length === 0 ? (
          <div className="text-[12.5px] text-slate-500">No regions selected. Tap the body map to begin.</div>
        ) : (
          <div className="space-y-3">
            {regions.map((r) => (
              <div key={r} className="rounded-md border border-slate-200 p-3 animate-view-in">
                <div className="text-[12.5px] font-semibold text-slate-900">{regionLabel[r]}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {symptomsFor[r].map((s, i) => (
                    <span key={s} className={`text-[11.5px] rounded-full px-2 py-0.5 border ${i === 0 ? 'bg-brand-50 border-brand-200 text-brand-800' : 'border-slate-200 text-slate-500'}`}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
            <label className="block">
              <div className="flex justify-between text-[12.5px] mb-1"><span className="font-medium text-slate-700">Severity</span><span className="font-mono text-slate-900">{sev}/10</span></div>
              <input type="range" min={1} max={10} value={sev} onChange={(e) => { setSev(+e.target.value); setRan(false); }} className="w-full accent-[#d93654]" />
            </label>
          </div>
        )}
        <button disabled={!regions.length} onClick={() => setRan(true)} className="mt-4 w-full h-9 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40">
          <SparkIcon size={14} /> Generate preliminary insight
        </button>
      </Card>

      <Card title="AI insight" right={<QwenBadge />} className="col-span-4">
        {ran && regions.length ? (
          <div className="space-y-3 animate-view-in">
            <div className="text-[14px] font-semibold text-slate-900">{ins.title}</div>
            <ul className="space-y-1.5">
              {ins.points.map((p) => <li key={p} className="flex gap-2 text-[12.5px] text-slate-700"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />{p}</li>)}
            </ul>
            <div className="rounded-md bg-slate-50 border border-slate-200 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Suggested specialist</div>
              <div className="text-[13px] font-semibold text-slate-900 mt-0.5">{ins.specialist}</div>
            </div>
            <Pill tone={ins.urgency[1]}>{ins.urgency[0]}</Pill>
            <AiNote>Preliminary, AI-assisted guidance only. Not a diagnosis. A clinician must review before any action.</AiNote>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-[12.5px] text-slate-500 gap-2">
            <BodyIcon size={24} className="text-slate-300" />
            Select regions and generate an insight.
          </div>
        )}
      </Card>
    </div>
  );
}

/* ───────────────────────── Clinical Summaries ───────────────────────── */

const outputs = {
  discharge: `DISCHARGE SUMMARY: Robert Hale, 66 M · MRN-150218

Diagnosis: Sepsis secondary to urinary tract infection (A41.9). Comorbidities: T2DM, CKD stage 3.

Hospital course: Presented with fever, rigors and confusion. Lactate 4.1, blood cultures grew E. coli. Treated with IV piperacillin-tazobactam and fluids; mentation normalized by day 2. Stepped down to oral ciprofloxacin on day 4. Creatinine peaked at 2.0 and returned to baseline 1.4.

Discharge medications: Ciprofloxacin 500 mg PO BID × 7 days. Continue metformin 500 mg BID. Hold lisinopril until PCP review.

Follow-up: PCP in 7 days with repeat BMP. Return if fever, confusion or reduced urine output.`,
  encounter: `ENCOUNTER NOTE: Robert Hale · Day 3 progress

S: Feels better, tolerating diet, no dysuria.
O: T 37.2, HR 84, BP 128/76. WBC 11.2 (↓ from 18.4). Cr 1.6.
A: Urosepsis, improving. AKI on CKD, resolving.
P: Continue IV antibiotics today, plan oral step-down tomorrow if afebrile. Recheck BMP in the morning. Encourage oral fluids.`,
};

function SummaryPanel() {
  const [kind, setKind] = useState<'discharge' | 'encounter'>('discharge');
  const [run, setRun] = useState(false);
  const { out, done } = useTyped(outputs[kind], run, 7);
  const { notify } = useDash();

  return (
    <div className="grid grid-cols-12 gap-4 h-full min-h-0">
      <Card title="Source record" right={<span className="text-[11.5px] text-slate-400">5-day admission · 42 documents</span>} className="col-span-5">
        <div className="space-y-2 text-[12px]">
          {[
            ['Day 1', 'ED note, sepsis bundle, blood cultures ×2, lactate 4.1, CT abdomen'],
            ['Day 1', 'Admission H&P: fever, rigors, confusion; PMH T2DM, CKD3'],
            ['Day 2', 'Cultures: E. coli, pan-sensitive. Mentation improving'],
            ['Day 3', 'Progress note, WBC trending down, Cr 1.6'],
            ['Day 4', 'Switched to oral ciprofloxacin. Afebrile 36h'],
            ['Day 5', 'PT cleared for home. Medication reconciliation'],
          ].map(([d, t], i) => (
            <div key={i} className="flex gap-3 rounded-md bg-slate-50 border border-slate-100 px-3 py-2">
              <span className="font-mono text-slate-400 w-10 shrink-0">{d}</span>
              <span className="text-slate-700">{t}</span>
            </div>
          ))}
          <div className="text-[11.5px] text-slate-400 pt-1">+ 36 more notes, results and orders</div>
        </div>
      </Card>

      <Card
        title="Generated draft"
        right={
          <div className="flex border border-slate-200 rounded-md overflow-hidden">
            {(['discharge', 'encounter'] as const).map((k) => (
              <button key={k} onClick={() => { setKind(k); setRun(false); }} className={`px-2.5 h-7 text-[11.5px] font-medium ${kind === k ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                {k === 'discharge' ? 'Discharge summary' : 'Encounter note'}
              </button>
            ))}
          </div>
        }
        className="col-span-7"
      >
        {run ? (
          <div className="flex flex-col h-full gap-3">
            <pre className="flex-1 whitespace-pre-wrap font-sans text-[12.5px] text-slate-800 leading-relaxed">{out}{!done && <span className="inline-block w-1.5 h-3.5 bg-brand-500 align-middle ml-0.5 animate-pulse" />}</pre>
            {done && (
              <div className="flex items-center gap-2 animate-view-in">
                <button onClick={() => notify('Draft sent to Dr. Chen for review and signature.')} className="h-8 px-3 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-[12.5px] font-semibold">Send for review</button>
                <button onClick={() => setRun(false)} className="h-8 px-3 rounded-md border border-slate-200 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50">Discard</button>
                <span className="ml-auto text-[11px] text-slate-400">Generated in 3.8s · 42 sources</span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
            <FileTextIcon size={26} className="text-slate-300" />
            <div className="text-[12.5px] text-slate-500 max-w-xs">Turn the full admission record into a concise {kind === 'discharge' ? 'discharge summary' : 'encounter note'}.</div>
            <button onClick={() => setRun(true)} className="h-9 px-4 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-[13px] font-semibold flex items-center gap-1.5">
              <SparkIcon size={14} /> Generate
            </button>
            <AiNote>Drafts are never filed automatically. A clinician reviews and signs every summary.</AiNote>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ───────────────────────── Bulk Patient AI ───────────────────────── */

const mapping = [
  ['Pt_Name', 'Full name', 99],
  ['DOB', 'Date of birth', 98],
  ['Gender', 'Sex', 97],
  ['Contact No.', 'Phone', 95],
  ['Ins. Provider', 'Payer', 91],
  ['Dx', 'Primary diagnosis (ICD-10)', 84],
  ['Ref Dr', 'Referring physician', 78],
] as const;

function BulkPanel() {
  const [step, setStep] = useState(0);
  const [pct, setPct] = useState(0);
  const { notify } = useDash();

  useEffect(() => {
    if (step !== 2) return;
    setPct(0);
    const t = setInterval(() => setPct((p) => (p >= 100 ? (clearInterval(t), 100) : p + 4)), 60);
    return () => clearInterval(t);
  }, [step]);
  useEffect(() => { if (pct === 100 && step === 2) notify('Import complete: 2,418 patients added.'); }, [pct]); // eslint-disable-line react-hooks/exhaustive-deps

  const steps = ['Upload', 'Map columns', 'Import'];
  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      <div className="flex items-center gap-3">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <span className={`h-7 w-7 rounded-full text-[12px] font-bold flex items-center justify-center ${i < step || (i === 2 && pct === 100) ? 'bg-emerald-500 text-white' : i === step ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              {i < step || (i === 2 && pct === 100) ? <CheckIcon size={13} strokeWidth={3} /> : i + 1}
            </span>
            <span className={`text-[13px] font-medium ${i === step ? 'text-slate-900' : 'text-slate-500'}`}>{s}</span>
            {i < steps.length - 1 && <span className="w-16 h-px bg-slate-300" />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <Card className="flex-1">
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
            <div className="rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/50 px-10 py-8">
              <UploadIcon size={26} className="mx-auto text-brand-600" />
              <div className="mt-2 text-[14px] font-semibold text-slate-900">patients_export_q3.xlsx</div>
              <div className="text-[12px] text-slate-500">2,418 rows · 7 columns · 1.8 MB</div>
            </div>
            <div className="text-[12px] text-slate-500">Also accepts CSV, XLSX and scanned PDF registers</div>
            <button onClick={() => setStep(1)} className="h-9 px-4 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-[13px] font-semibold flex items-center gap-1.5">
              <SparkIcon size={14} /> Analyze columns
            </button>
          </div>
        </Card>
      )}

      {step === 1 && (
        <Card title="AI-suggested column mapping" right={<QwenBadge />} className="flex-1">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="py-2">Source column</th><th />
                <th className="py-2">HMS field</th><th className="py-2 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {mapping.map(([src, dst, c], i) => (
                <tr key={src} className="border-b border-slate-100 animate-view-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <td className="py-2 font-mono text-slate-700">{src}</td>
                  <td className="py-2 text-slate-300"><ArrowRightIcon size={13} /></td>
                  <td className="py-2 font-medium text-slate-900">{dst}</td>
                  <td className="py-2 text-right">
                    <span className={`font-mono ${c >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>{c}%</span>
                    {c < 90 && <span className="ml-2 text-[10.5px] font-semibold text-amber-700 bg-amber-50 rounded px-1.5 py-0.5">Review</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => setStep(2)} className="h-9 px-4 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-[13px] font-semibold">Confirm mapping & import</button>
            <span className="text-[12px] text-slate-500">2 low-confidence fields flagged for review</span>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card title="Asynchronous import" className="flex-1">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[12.5px] mb-1.5"><span className="text-slate-700 font-medium">{pct < 100 ? 'Importing in background…' : 'Import complete'}</span><span className="font-mono text-slate-900">{Math.round((pct / 100) * 2418).toLocaleString()} / 2,418</span></div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${pct}%` }} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[['New patients', Math.round((pct / 100) * 2291)], ['Merged with existing MRN', Math.round((pct / 100) * 104)], ['Needs review', Math.round((pct / 100) * 23)]].map(([l, v]) => (
                <div key={l as string} className="rounded-md border border-slate-200 p-3">
                  <div className="text-[20px] font-bold text-slate-900 tabular-nums">{(v as number).toLocaleString()}</div>
                  <div className="text-[11.5px] text-slate-500">{l}</div>
                </div>
              ))}
            </div>
            {pct === 100 && (
              <button onClick={() => setStep(0)} className="h-8 px-3 rounded-md border border-slate-200 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50">Start another import</button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ───────────────────────── NL Patient Filtering ───────────────────────── */

type P = { name: string; sex: 'M' | 'F'; age: number; cond: string[]; city: string };
const population: P[] = [
  { name: 'Robert Hale', sex: 'M', age: 66, cond: ['diabetes', 'ckd'], city: 'Chennai' },
  { name: 'Ann Martinez', sex: 'F', age: 52, cond: ['hypertension'], city: 'Bengaluru' },
  { name: 'George Watts', sex: 'M', age: 60, cond: ['hypertension', 'diabetes'], city: 'Chennai' },
  { name: 'Priya Raman', sex: 'F', age: 34, cond: [], city: 'Chennai' },
  { name: 'Daniel Novak', sex: 'M', age: 73, cond: ['copd'], city: 'Mumbai' },
  { name: 'Grace Min', sex: 'F', age: 61, cond: ['hypertension'], city: 'Hyderabad' },
  { name: 'Kevin Park', sex: 'M', age: 28, cond: ['asthma'], city: 'Pune' },
  { name: 'Harold Jensen', sex: 'M', age: 74, cond: ['diabetes', 'hypertension'], city: 'Chennai' },
  { name: 'Lucia Moreno', sex: 'F', age: 29, cond: [], city: 'Bengaluru' },
  { name: 'Victor Alvarez', sex: 'M', age: 55, cond: ['diabetes'], city: 'Mumbai' },
  { name: 'Eleanor Price', sex: 'F', age: 80, cond: ['copd', 'hypertension'], city: 'Chennai' },
  { name: 'Samuel Obi', sex: 'M', age: 47, cond: [], city: 'Hyderabad' },
  { name: 'Nora Fitzgerald', sex: 'F', age: 66, cond: ['ckd'], city: 'Pune' },
  { name: 'Rahul Verma', sex: 'M', age: 62, cond: ['hypertension'], city: 'Chennai' },
  { name: 'Hannah Schultz', sex: 'F', age: 38, cond: ['asthma'], city: 'Mumbai' },
  { name: 'John Carver', sex: 'M', age: 57, cond: ['hypertension', 'ckd'], city: 'Bengaluru' },
];
const condWords: Record<string, string> = { diabet: 'diabetes', hypertens: 'hypertension', 'high blood pressure': 'hypertension', bp: 'hypertension', asthma: 'asthma', copd: 'copd', kidney: 'ckd', ckd: 'ckd' };
const cities = ['chennai', 'bengaluru', 'mumbai', 'hyderabad', 'pune'];

/** Tiny rule-based parser standing in for the model's structured-output step. */
function parse(q: string) {
  const s = q.toLowerCase();
  const f: { sex?: 'M' | 'F'; min?: number; max?: number; cond: string[]; city?: string } = { cond: [] };
  // min / max are inclusive bounds; "over 50" becomes min 51.
  if (/\b(female|women|woman)\b/.test(s)) f.sex = 'F';
  else if (/\b(male|men|man)\b/.test(s)) f.sex = 'M';
  const between = s.match(/between (\d+) and (\d+)/);
  if (between) { f.min = +between[1]; f.max = +between[2]; }
  const over = s.match(/(?:over|above|older than|>)\s*(\d+)/);
  if (over) f.min = +over[1] + 1;
  const under = s.match(/(?:under|below|younger than|<)\s*(\d+)/);
  if (under) f.max = +under[1] - 1;
  Object.entries(condWords).forEach(([k, v]) => { if (s.includes(k) && !f.cond.includes(v)) f.cond.push(v); });
  f.city = cities.find((c) => s.includes(c));
  return f;
}

function NlqPanel() {
  const examples = ['male patients over 50', 'women with hypertension', 'diabetic patients in Chennai', 'patients between 30 and 60 with asthma'];
  const [q, setQ] = useState(examples[0]);
  const [applied, setApplied] = useState(examples[0]);
  const f = useMemo(() => parse(applied), [applied]);
  const rows = population.filter((p) =>
    (!f.sex || p.sex === f.sex) && (f.min === undefined || p.age >= f.min) && (f.max === undefined || p.age <= f.max) &&
    f.cond.every((c) => p.cond.includes(c)) && (!f.city || p.city.toLowerCase() === f.city),
  );
  const chips = [
    f.sex && `Sex = ${f.sex === 'M' ? 'Male' : 'Female'}`,
    f.min !== undefined && (f.max !== undefined ? `Age ${f.min}–${f.max}` : `Age > ${f.min - 1}`),
    f.max !== undefined && f.min === undefined && `Age < ${f.max + 1}`,
    ...f.cond.map((c) => `Condition = ${c.toUpperCase() === 'CKD' || c === 'copd' ? c.toUpperCase() : c[0].toUpperCase() + c.slice(1)}`),
    f.city && `City = ${f.city[0].toUpperCase() + f.city.slice(1)}`,
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <form onSubmit={(e) => { e.preventDefault(); setApplied(q); }} className="flex gap-2">
          <div className="relative flex-1">
            <SparkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder='Try "female patients over 60 with hypertension"' className="w-full h-10 pl-9 pr-3 rounded-md border border-slate-200 text-[13.5px] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15" />
          </div>
          <button type="submit" className="h-10 px-4 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-[13px] font-semibold">Filter</button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11.5px] text-slate-400 mr-1">Examples:</span>
          {examples.map((e) => (
            <button key={e} onClick={() => { setQ(e); setApplied(e); }} className={`text-[11.5px] rounded-full px-2.5 py-1 border ${applied === e ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{e}</button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[12px] text-slate-500">Parsed filters:</span>
        {chips.length ? chips.map((c) => <span key={c} className="text-[12px] font-medium text-brand-800 bg-brand-50 border border-brand-200 rounded-md px-2 py-0.5 font-mono">{c}</span>) : <span className="text-[12px] text-slate-400">none recognized, showing everyone</span>}
        <span className="ml-auto text-[12.5px] font-semibold text-slate-900">{rows.length} of {population.length} patients</span>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-auto flex-1 min-h-0">
        <table className="w-full text-[12.5px]">
          <thead className="sticky top-0 bg-white">
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="px-4 py-2.5">Patient</th><th className="px-4 py-2.5">Sex</th><th className="px-4 py-2.5">Age</th><th className="px-4 py-2.5">Conditions</th><th className="px-4 py-2.5">City</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.name} className="border-b border-slate-100 last:border-0 animate-view-in">
                <td className="px-4 py-2 font-semibold text-slate-900">{p.name}</td>
                <td className="px-4 py-2 text-slate-600">{p.sex}</td>
                <td className="px-4 py-2 text-slate-600 tabular-nums">{p.age}</td>
                <td className="px-4 py-2 text-slate-600">{p.cond.length ? p.cond.map((c) => (c === 'ckd' || c === 'copd' ? c.toUpperCase() : c)).join(', ') : '—'}</td>
                <td className="px-4 py-2 text-slate-600">{p.city}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No patients match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
