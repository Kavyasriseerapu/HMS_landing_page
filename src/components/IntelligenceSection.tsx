import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, BrainIcon, CheckIcon, EyeIcon, LinkIcon, ShieldCheckIcon, SparkIcon } from './icons';
import { aiModules } from './moduleData';
import { resetTilt, trackTilt } from './motion';
import { Reveal, SectionHeading } from './ui';

/* Small dark-theme visuals for each module card */
const visuals: Record<string, ReactNode> = {
  voice: (
    <div className="h-full flex items-center gap-4 px-5">
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500"><span className="absolute inset-0 rounded-full bg-brand-500 animate-ping-slow" /><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="relative"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4" /></svg></span>
      <div className="flex-1">
        <div className="flex items-center gap-[3px] h-9">
          {Array.from({ length: 30 }, (_, i) => <span key={i} className="wave-bar w-[3px] h-full rounded-full bg-gradient-to-t from-brand-500 to-accent-400" style={{ animationDelay: `${(i % 7) * 0.12}s` }} />)}
        </div>
        <div className="mt-2 flex gap-1.5 text-[10.5px] font-semibold text-slate-300">
          {['EN', 'हि', 'తె', 'த', 'ಕ'].map((l) => <span key={l} className="rounded bg-white/10 px-1.5 py-0.5">{l}</span>)}
          <span className="ml-auto text-brand-300">→ SOAP</span>
        </div>
      </div>
    </div>
  ),
  split: (
    <div className="h-full flex items-center justify-center gap-3 px-4 text-[11px]">
      <span className="rounded-md bg-white/10 px-2.5 py-2 text-white font-medium">Rx sheet</span>
      <svg width="40" height="50" viewBox="0 0 40 50" aria-hidden="true"><path className="flow-line" d="M0 25 H14 Q20 25 20 19 V10 Q20 4 26 4 H40 M20 25 V40 Q20 46 26 46 H40" fill="none" stroke="#ff8a9b" strokeWidth="2" /></svg>
      <div className="space-y-2">
        <span className="block rounded-md bg-brand-500/25 text-brand-100 px-2.5 py-1 font-semibold">Pharmacy · 2 meds</span>
        <span className="block rounded-md bg-accent-500/30 text-white px-2.5 py-1 font-semibold">Lab billing · 3 tests</span>
      </div>
    </div>
  ),
  search: (
    <div className="h-full flex flex-col justify-center gap-1.5 px-4">
      <div className="rounded-md bg-white/[0.08] border border-white/10 px-2.5 py-1.5 text-[11.5px] text-white">Sepsis bundle protocol for adults?</div>
      {[['Hospital protocol · §4.2', '96%'], ['Drug DB · Piperacillin', '91%'], ['Patient record · 12 Sep', '88%']].map(([a, b]) => (
        <div key={a} className="flex justify-between rounded bg-white/[0.05] px-2 py-1 text-[10.5px]"><span className="text-slate-300">{a}</span><span className="text-brand-300 font-mono">{b}</span></div>
      ))}
    </div>
  ),
  ocr: (
    <div className="flex gap-3 h-full items-center px-4">
      <div className="w-24 shrink-0 rounded-md bg-white/[0.06] border border-white/10 p-2 space-y-1.5">
        {[80, 60, 90, 45, 70, 55].map((w, i) => (
          <div key={i} className={`h-1.5 rounded-full ${i === 2 || i === 4 ? 'bg-brand-400/80' : 'bg-white/15'}`} style={{ width: `${w}%` }} />
        ))}
      </div>
      <ArrowRightIcon size={14} className="text-brand-300 shrink-0" />
      <div className="flex-1 space-y-1.5 text-[11px]">
        {[['Diagnosis', 'A41.9 Sepsis'], ['Allergy', 'Sulfonamides'], ['Meds', 'Cipro 500 BID']].map(([k, v]) => (
          <div key={k} className="flex justify-between rounded bg-white/[0.06] px-2 py-1">
            <span className="text-slate-400">{k}</span><span className="text-white font-medium">{v}</span>
          </div>
        ))}
      </div>
    </div>
  ),
  symptom: (
    <div className="h-full flex items-center justify-center">
      <svg viewBox="0 0 200 330" className="h-[92px]">
        <circle cx="100" cy="36" r="26" fill="rgba(255,255,255,0.12)" />
        <rect x="62" y="68" width="76" height="72" rx="18" fill="#ff8a9b" className="animate-pulse" />
        <rect x="66" y="142" width="68" height="62" rx="14" fill="rgba(255,255,255,0.12)" />
        <rect x="30" y="74" width="28" height="118" rx="14" fill="rgba(255,255,255,0.12)" />
        <rect x="142" y="74" width="28" height="118" rx="14" fill="#ff8a9b" opacity="0.6" />
        <rect x="68" y="208" width="30" height="116" rx="15" fill="rgba(255,255,255,0.12)" />
        <rect x="102" y="208" width="30" height="116" rx="15" fill="rgba(255,255,255,0.12)" />
      </svg>
      <div className="ml-3 text-[11px]">
        <div className="text-slate-400">Suggested</div>
        <div className="text-white font-semibold">Cardiology</div>
        <div className="mt-1 inline-block rounded bg-red-500/20 text-red-300 px-1.5 py-0.5 font-semibold">Urgent</div>
      </div>
    </div>
  ),
  summary: (
    <div className="h-full flex flex-col justify-center gap-1.5 px-4">
      <div className="text-[10px] font-semibold tracking-wider text-brand-300">DISCHARGE SUMMARY</div>
      {[95, 88, 70, 92, 50].map((w, i) => (
        <div key={i} className="h-1.5 rounded-full bg-white/25 animate-pulse" style={{ width: `${w}%`, animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  ),
  bulk: (
    <div className="h-full flex flex-col justify-center gap-1.5 px-4 text-[11px] font-mono">
      {[['Pt_Name', 'Full name', '99%'], ['DOB', 'Date of birth', '98%'], ['Dx', 'Diagnosis', '84%']].map(([a, b, c]) => (
        <div key={a} className="flex items-center gap-2">
          <span className="w-16 text-slate-400">{a}</span>
          <ArrowRightIcon size={11} className="text-brand-300" />
          <span className="flex-1 text-white font-sans">{b}</span>
          <span className={c === '84%' ? 'text-amber-300' : 'text-brand-300'}>{c}</span>
        </div>
      ))}
    </div>
  ),
  nlq: (
    <div className="h-full flex flex-col justify-center gap-2 px-4">
      <div className="rounded-md bg-white/[0.08] border border-white/10 px-2.5 py-1.5 text-[11.5px] text-white flex items-center gap-1.5">
        <SparkIcon size={11} className="text-brand-300" /> male patients over 50
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {['Sex = Male', 'Age > 50'].map((c) => <span key={c} className="text-[10.5px] font-mono text-brand-200 bg-brand-500/15 border border-brand-400/30 rounded px-1.5 py-0.5">{c}</span>)}
        <span className="text-[10.5px] text-slate-400 self-center">→ 7 patients</span>
      </div>
    </div>
  ),
};

const principles = [
  { icon: BrainIcon, t: 'Consistent everywhere', d: 'Every AI tool works the same trusted way across departments, so staff learn it once.' },
  { icon: EyeIcon, t: 'Clinician in the loop', d: 'AI drafts and suggests. People review and sign. Nothing is filed to the record automatically.' },
  { icon: LinkIcon, t: 'Grounded in the record', d: 'Answers and summaries are built from the patient’s own documents, with page-level citations.' },
  { icon: ShieldCheckIcon, t: 'Governed and audited', d: 'AI use follows the same role-based access and audit trail as the rest of HospAI.' },
];

export default function IntelligenceSection() {
  const navigate = useNavigate();
  return (
    <section id="ai" className="relative py-20 sm:py-28 bg-ink-900 overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark mask-fade-b pointer-events-none" />
      <div className="absolute -top-40 left-1/3 h-[560px] w-[760px] rounded-full bg-[radial-gradient(closest-side,rgba(57,47,90,0.22),transparent)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-[420px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(212,165,165,0.18),transparent)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <SectionHeading
              dark
              eyebrow="Intelligence Hub"
              title={<>Clinical AI that works <span className="text-shimmer bg-gradient-to-r from-brand-300 via-accent-400 to-brand-300 bg-clip-text text-transparent">inside the workflow.</span></>}
              desc="AI is built into everyday work: voice notes in five languages, prescription splitting, document reading, clinical search, symptom insights, summaries and plain-English patient search."
            />
            <button
              onClick={() => navigate('/book-demo')}
              className="self-start lg:self-auto shrink-0 inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-white text-ink-900 text-[14px] font-semibold hover:bg-brand-50 transition-colors"
            >
              See the AI in a demo <ArrowRightIcon size={14} />
            </button>
          </div>
        </Reveal>

        <Reveal stagger className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiModules.map((m, i) => (
            <button
              key={m.key}
              onClick={() => navigate('/book-demo')}
              onMouseMove={trackTilt}
              onMouseLeave={resetTilt}
              style={{ ['--i' as string]: i }}
              className={`spotlight lift group text-left rounded-3xl border border-white/10 bg-white/[0.04] p-3 hover:border-brand-400/40 hover:bg-white/[0.06] ${i === 0 || i === aiModules.length - 1 ? 'lg:col-span-2' : ''}`}
            >
              <div className="h-32 rounded-2xl bg-ink-800/80 border border-white/5 overflow-hidden">{visuals[m.key]}</div>
              <div className="px-3 pt-5 pb-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5">
                    <span className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-400 to-accent-600 text-white flex items-center justify-center"><m.icon size={17} /></span>
                    <span className="font-display text-[18px] font-bold text-white">{m.label}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-200 bg-brand-500/10 border border-brand-400/25 rounded-full px-2 py-0.5 whitespace-nowrap">
                    <SparkIcon size={10} /> AI-powered
                  </span>
                </div>
                <p className="mt-3 text-[14px] text-slate-400 leading-relaxed">{m.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-300 group-hover:text-white transition-colors">
                  Request a walkthrough <ArrowRightIcon size={13} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          ))}
        </Reveal>

        <Reveal className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/10 bg-white/10">
          {principles.map((p) => (
            <div key={p.t} className="bg-ink-900 p-6">
              <p.icon size={18} className="text-brand-300" />
              <div className="mt-3 text-[15px] font-semibold text-white">{p.t}</div>
              <p className="mt-1.5 text-[13.5px] text-slate-400 leading-relaxed">{p.d}</p>
            </div>
          ))}
        </Reveal>

        <p className="mt-6 flex items-center gap-2 text-[12.5px] text-slate-500">
          <CheckIcon size={13} className="text-brand-400" /> AI outputs are decision support only and are reviewed by qualified staff.
        </p>
      </div>
    </section>
  );
}
