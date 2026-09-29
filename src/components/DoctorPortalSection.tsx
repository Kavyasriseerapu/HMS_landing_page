import { useEffect, useRef, useState } from 'react';
import { CheckIcon, FlaskIcon, MicIcon, PenIcon, PillIcon, SplitIcon, UsersIcon, type IconType } from './icons';
import { Reveal, SectionHeading } from './ui';

const steps: { icon: IconType; label: string; title: string; desc: string }[] = [
  { icon: UsersIcon, label: 'Patient inbox', title: 'Your queue, with history ready', desc: 'A real-time queue for the signed-in doctor. First visits open a fresh consult; revisits load prior notes, labs and medicines automatically.' },
  { icon: MicIcon, label: 'Voice SOAP notes', title: 'Talk to the patient. The notes write themselves.', desc: 'Hands-free transcription in five Indian languages. HospAI tells doctor and patient apart and compiles a structured SOAP note.' },
  { icon: PenIcon, label: 'Digital prescription', title: 'Prescribe the way you like', desc: 'Type it, write it by hand on the ink whiteboard, or upload a scan or PDF of your prescription sheet.' },
  { icon: SplitIcon, label: 'Review & split dispatch', title: 'One prescription, two destinations', desc: 'AI splits the prescription into medications for the pharmacy and investigations for lab billing. Each half goes out independently.' },
];

const languages = ['English', 'हिन्दी', 'తెలుగు', 'தமிழ்', 'ಕನ್ನಡ'];

export default function DoctorPortalSection() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || !visible) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % steps.length), 5200);
    return () => clearTimeout(t);
  }, [active, auto, visible]);

  const pick = (i: number) => { setActive(i); setAuto(false); };

  return (
    <section id="doctor" ref={ref} className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Doctor Portal"
            title={<>A consultation in four steps, <span className="text-brand-600">with AI doing the typing.</span></>}
            desc="From the patient inbox to split dispatch, the doctor stays with the patient while HospAI handles notes, prescriptions and routing."
          />
        </Reveal>

        <Reveal className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Step list */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            {steps.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.label}
                  onClick={() => pick(i)}
                  className={`relative text-left rounded-2xl border p-5 transition-all duration-300 overflow-hidden ${on ? 'bg-white border-brand-300 shadow-lg shadow-brand-600/10' : 'bg-slate-50/60 border-slate-200 hover:bg-white'}`}
                >
                  {on && auto && <span key={active} className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-500 to-accent-600 animate-[progress_5.2s_linear_forwards]" />}
                  <div className="flex items-center gap-4">
                    <span className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center transition-colors ${on ? 'bg-gradient-to-br from-brand-500 to-accent-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500'}`}>
                      <s.icon size={20} />
                    </span>
                    <div>
                      <div className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-slate-400">Step {i + 1}</div>
                      <div className={`text-[16px] font-bold ${on ? 'text-slate-900' : 'text-slate-600'}`}>{s.label}</div>
                    </div>
                  </div>
                  {on && <p className="mt-3 text-[14px] text-slate-600 leading-relaxed animate-view-in">{s.desc}</p>}
                </button>
              );
            })}
          </div>

          {/* Visual */}
          <div className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-ink-900 text-white p-5 sm:p-8 min-h-[440px] flex flex-col">
            <div className="absolute inset-0 bg-grid-dark opacity-60 pointer-events-none" />
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
            <div className="relative flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-300">Step {active + 1} · {steps[active].label}</span>
              <button onClick={() => setAuto((a) => !a)} className="text-[12px] text-slate-400 hover:text-white">{auto ? 'Pause' : 'Auto-play'}</button>
            </div>
            <h3 key={`t${active}`} className="relative mt-2 font-display text-[22px] sm:text-[26px] font-bold animate-view-in">{steps[active].title}</h3>
            <div key={`v${active}`} className="relative mt-6 flex-1 animate-view-in">
              {active === 0 && <InboxVisual />}
              {active === 1 && <VoiceVisual />}
              {active === 2 && <InkVisual />}
              {active === 3 && <SplitVisual />}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function InboxVisual() {
  const rows = [
    ['Rajesh Kumar', 'UHID-10442 · 54 M', 'Revisit', 'Prior notes + HbA1c loaded'],
    ['Lakshmi Devi', 'UHID-10457 · 38 F', 'First visit', 'New consult card opened'],
    ['Arjun Mehta', 'UHID-10461 · 28 M', 'Revisit', 'Ortho follow-up · X-ray on file'],
    ['Fatima Begum', 'UHID-10470 · 61 F', 'First visit', 'Referred from ER'],
  ];
  return (
    <div className="space-y-2.5">
      {rows.map(([n, m, t, d], i) => (
        <div key={n} className="flex items-center gap-4 rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3 animate-fade-in-up" style={{ animationDelay: `${i * 110}ms` }}>
          <span className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 text-[12px] font-bold flex items-center justify-center">{n.split(' ').map((x) => x[0]).join('')}</span>
          <div className="flex-1 min-w-0">
            <div className="text-[14.5px] font-semibold">{n} <span className="text-slate-400 font-normal text-[12.5px]">· {m}</span></div>
            <div className="text-[12.5px] text-slate-400 truncate">{d}</div>
          </div>
          <span className={`text-[11.5px] font-semibold rounded-full px-2.5 py-1 ${t === 'Revisit' ? 'bg-brand-500/20 text-brand-200' : 'bg-emerald-500/15 text-emerald-300'}`}>{t}</span>
        </div>
      ))}
    </div>
  );
}

function VoiceVisual() {
  const [lang, setLang] = useState(0);
  const lines: [string, string][] = [
    ['Doctor', 'How long have you had the chest discomfort?'],
    ['Patient', 'About two days, worse when I climb stairs.'],
    ['Doctor', 'Any sweating or breathlessness with it?'],
  ];
  return (
    <div className="grid sm:grid-cols-5 gap-4 h-full">
      <div className="sm:col-span-3 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {languages.map((l, i) => (
            <button key={l} onClick={() => setLang(i)} className={`text-[12px] font-semibold rounded-full px-3 py-1 border transition-colors ${i === lang ? 'bg-brand-500 border-brand-500 text-white' : 'border-white/15 text-slate-300 hover:bg-white/10'}`}>{l}</button>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-red-500"><span className="absolute inset-0 rounded-full bg-red-500 animate-ping-slow" /><MicIcon size={16} className="relative" /></span>
          <div className="flex items-center gap-[3px] h-8 flex-1">
            {Array.from({ length: 28 }, (_, i) => (
              <span key={i} className="wave-bar w-[3px] h-full rounded-full bg-gradient-to-t from-brand-500 to-accent-400" style={{ animationDelay: `${(i % 7) * 0.12}s` }} />
            ))}
          </div>
          <span className="text-[11.5px] font-mono text-slate-400">02:14</span>
        </div>
        {lines.map(([who, t], i) => (
          <div key={i} className="flex gap-2.5 animate-fade-in-up" style={{ animationDelay: `${300 + i * 350}ms` }}>
            <span className={`shrink-0 h-6 px-2 rounded-md text-[10.5px] font-bold flex items-center ${who === 'Doctor' ? 'bg-brand-500/25 text-brand-200' : 'bg-white/10 text-slate-300'}`}>{who}</span>
            <span className="text-[13.5px] text-slate-200">{t}</span>
          </div>
        ))}
      </div>
      <div className="sm:col-span-2 rounded-2xl bg-white text-slate-900 p-4 animate-fade-in-up" style={{ animationDelay: '1.3s' }}>
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">Auto-generated SOAP</div>
        {[['S', 'Exertional chest discomfort × 2 days'], ['O', 'BP 148/92 · HR 96 · SpO₂ 97%'], ['A', 'Suspected stable angina'], ['P', 'ECG, troponin, lipid profile; review 48h']].map(([k, v]) => (
          <div key={k} className="mt-2.5 flex gap-2.5 text-[12.5px]">
            <span className="h-5 w-5 shrink-0 rounded bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-[11px]">{k}</span>
            <span className="text-slate-700">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InkVisual() {
  return (
    <div className="grid sm:grid-cols-5 gap-4 h-full">
      <div className="sm:col-span-3 rounded-2xl bg-[#fffdf7] text-slate-900 p-4 relative overflow-hidden">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Rx · Ink whiteboard</div>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} className="absolute left-4 right-4 h-px bg-sky-200/70" style={{ top: 56 + i * 34 }} />)}
        <svg viewBox="0 0 320 180" className="relative mt-2 w-full h-[190px]" aria-hidden="true">
          <path className="ink-path" d="M10 30 q10 -18 22 0 t22 0 M64 22 v18 M70 22 q14 -4 14 8 q0 10 -14 10 l16 12" fill="none" stroke="#1e3a8a" strokeWidth="2.6" strokeLinecap="round" />
          <path className="ink-path" style={{ animationDelay: '0.5s' }} d="M10 78 c20 -14 40 14 60 0 s40 -14 60 0 M150 70 q10 -10 20 0 q10 10 20 0 M200 78 h40" fill="none" stroke="#1e3a8a" strokeWidth="2.6" strokeLinecap="round" />
          <path className="ink-path" style={{ animationDelay: '1s' }} d="M10 114 c16 -12 32 12 48 0 s32 -12 48 0 s32 12 48 0 M170 110 l10 8 l14 -18" fill="none" stroke="#1e3a8a" strokeWidth="2.6" strokeLinecap="round" />
          <path className="ink-path" style={{ animationDelay: '1.5s' }} d="M10 150 c24 -10 48 10 72 0 s48 -10 72 0 M180 146 h60" fill="none" stroke="#b91c1c" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      </div>
      <div className="sm:col-span-2 space-y-2.5">
        {[['Type it', 'Structured drug, dose and frequency fields'], ['Write it', 'Pen or stylus on the ink whiteboard'], ['Upload it', 'Photo, scan or PDF of a paper Rx']].map(([t, d], i) => (
          <div key={t} className={`rounded-xl border p-3.5 ${i === 1 ? 'bg-brand-500/15 border-brand-400/40' : 'bg-white/[0.04] border-white/10'}`}>
            <div className="text-[14px] font-semibold">{t}</div>
            <div className="text-[12.5px] text-slate-400">{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SplitVisual() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full max-w-sm rounded-2xl bg-white text-slate-900 p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Prescription · UHID-10442</span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-brand-600"><SplitIcon size={12} /> AI parsed</span>
        </div>
        <div className="mt-2 text-[12.5px] text-slate-600 leading-relaxed">Tab Aspirin 75 mg OD · Tab Atorvastatin 20 mg HS · ECG · Troponin I · Lipid profile</div>
      </div>
      <svg viewBox="0 0 400 60" className="w-full max-w-md h-14" aria-hidden="true">
        <path className="flow-line" d="M200 0 V20 Q200 30 190 30 H110 Q100 30 100 40 V60" fill="none" stroke="#ff8a9b" strokeWidth="2" />
        <path className="flow-line" d="M200 0 V20 Q200 30 210 30 H290 Q300 30 300 40 V60" fill="none" stroke="#8a7cc0" strokeWidth="2" />
      </svg>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {[
          { icon: PillIcon, t: 'Pharmacy', items: ['Aspirin 75 mg · OD', 'Atorvastatin 20 mg · HS'], g: 'from-brand-500 to-brand-700', s: 'Sent to dispensing queue' },
          { icon: FlaskIcon, t: 'Lab billing', items: ['ECG', 'Troponin I', 'Lipid profile'], g: 'from-accent-400 to-accent-600', s: 'Awaiting payment at reception' },
        ].map((c, i) => (
          <div key={c.t} className="rounded-2xl bg-white/[0.06] border border-white/10 p-4 animate-fade-in-up" style={{ animationDelay: `${300 + i * 200}ms` }}>
            <div className="flex items-center gap-2.5">
              <span className={`h-9 w-9 rounded-lg bg-gradient-to-br ${c.g} flex items-center justify-center`}><c.icon size={17} /></span>
              <span className="text-[15px] font-bold">{c.t}</span>
            </div>
            <ul className="mt-3 space-y-1.5">
              {c.items.map((x) => <li key={x} className="text-[13px] text-slate-300 flex items-center gap-2"><CheckIcon size={12} strokeWidth={3} className="text-brand-300" />{x}</li>)}
            </ul>
            <div className="mt-3 text-[11.5px] text-slate-400">{c.s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
