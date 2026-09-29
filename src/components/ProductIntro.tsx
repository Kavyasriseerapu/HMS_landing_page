import type { ReactNode } from 'react';
import { AlertIcon, CheckIcon, LockIcon, PlusIcon } from './icons';
import { resetTilt, trackTilt } from './motion';
import { Reveal, SectionHeading } from './ui';

/* ── Mini visuals for each bento card ─────────────────────────── */

function RecordVisual() {
  const steps = ['Registration', 'Triage', 'Orders', 'Lab', 'Pharmacy', 'Billing'];
  return (
    <div className="h-full flex flex-col justify-center gap-4 px-5">
      <div className="flex items-center gap-3 rounded-xl bg-white border border-slate-200 px-4 py-3 shadow-sm w-fit">
        <span className="h-9 w-9 rounded-full bg-brand-600 text-white text-[12px] font-semibold flex items-center justify-center">TR</span>
        <span>
          <span className="block text-[14px] font-semibold text-slate-900">Thomas Reed · 68</span>
          <span className="block text-[12px] font-mono text-slate-500">MRN-204118</span>
        </span>
        <span className="ml-3 text-[11px] font-semibold text-amber-700 bg-amber-50 rounded-full px-2 py-0.5">Allergy: PCN</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {steps.map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span className="text-[12px] font-medium rounded-full border border-brand-200 bg-white text-brand-800 px-2.5 py-1 transition-colors duration-300 group-hover:bg-brand-50" style={{ transitionDelay: `${i * 60}ms` }}>
              {s}
            </span>
            {i < steps.length - 1 && <span className="h-px w-3 bg-brand-300" />}
          </span>
        ))}
      </div>
    </div>
  );
}

function LiveVisual() {
  const rows = [
    ['Bed 3N-07', 'Cleaned, available', 'bg-emerald-500'],
    ['ED Bay 12', 'K⁺ 6.2 critical', 'bg-red-500'],
    ['OR 2', 'Case started', 'bg-brand-500'],
  ];
  return (
    <div className="h-full flex flex-col justify-center gap-2 px-5">
      {rows.map(([a, b, c]) => (
        <div key={a} className="flex items-center gap-2.5 rounded-lg bg-white border border-slate-200 px-3 py-2">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inset-0 rounded-full ${c} animate-ping-slow`} />
            <span className={`relative h-2 w-2 rounded-full ${c}`} />
          </span>
          <span className="text-[12.5px] font-semibold text-slate-800 whitespace-nowrap">{a}</span>
          <span className="text-[12px] text-slate-500 truncate">{b}</span>
          <span className="ml-auto text-[11px] font-mono text-slate-400">now</span>
        </div>
      ))}
    </div>
  );
}

function RolesVisual() {
  const roles = [['MD', 'bg-brand-600'], ['RN', 'bg-sky-600'], ['Rx', 'bg-amber-500'], ['Lab', 'bg-emerald-600'], ['Fin', 'bg-violet-600']];
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex -space-x-2.5">
        {roles.map(([r, c], i) => (
          <span
            key={r}
            className={`h-12 w-12 rounded-full ${c} text-white text-[12px] font-bold flex items-center justify-center ring-4 ring-slate-50 transition-transform duration-300 group-hover:-translate-y-1.5`}
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

function SafetyVisual() {
  return (
    <div className="h-full flex flex-col justify-center gap-2 px-5">
      <div className="rounded-lg bg-white border border-slate-200 px-3 py-2 text-[12.5px] text-slate-700">Amoxicillin 500 mg PO q8h</div>
      <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-800 transition-transform duration-300 group-hover:scale-[1.02]">
        <AlertIcon size={14} className="text-red-600 mt-0.5 shrink-0" />
        <span><span className="font-semibold">Order blocked:</span> documented penicillin allergy</span>
      </div>
    </div>
  );
}

function ModularVisual() {
  return (
    <div className="h-full flex items-center justify-center gap-2">
      {['ED', 'IP', 'Billing'].map((m) => (
        <span key={m} className="h-14 w-16 rounded-lg bg-ink-900 text-white text-[12px] font-semibold flex items-center justify-center shadow-sm">{m}</span>
      ))}
      <span className="h-14 w-16 rounded-lg border-2 border-dashed border-brand-300 text-brand-600 flex items-center justify-center transition-all duration-300 group-hover:bg-brand-50 group-hover:border-brand-500 group-hover:rotate-90">
        <PlusIcon size={18} />
      </span>
    </div>
  );
}

function SecureVisual() {
  return (
    <div className="h-full flex flex-col justify-center gap-1.5 px-5 font-mono text-[11.5px]">
      {[
        ['10:47:12', 'J. Carter', 'viewed chart', 'text-slate-700'],
        ['10:46:58', 'Dr. Shah', 'signed order', 'text-slate-700'],
        ['10:45:09', 'Agency RN', 'access denied', 'text-red-600'],
      ].map(([t, u, a, c]) => (
        <div key={t} className="flex items-center gap-3 rounded-md bg-white border border-slate-200 px-3 py-1.5">
          <span className="text-slate-400">{t}</span>
          <span className="text-slate-600">{u}</span>
          <span className={`ml-auto font-semibold ${c}`}>{a}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-brand-700 font-sans font-medium">
        <LockIcon size={12} /> Role-based access · Append-only audit trail
      </div>
    </div>
  );
}

const cards: { title: string; desc: string; visual: ReactNode; span: string; points?: string[] }[] = [
  {
    title: 'One longitudinal patient record',
    desc: 'Registration, triage notes, orders, results, medications and invoices all attach to one MRN. No re-keying between departments, no reconciling two systems.',
    points: ['Master patient index with duplicate detection', 'Allergies and alerts follow the patient everywhere'],
    visual: <RecordVisual />,
    span: 'lg:col-span-2',
  },
  {
    title: 'Real-time by default',
    desc: 'Boards, beds and queues update instantly across tabs and departments, and keep working offline until the network returns.',
    visual: <LiveVisual />,
    span: '',
  },
  {
    title: 'Built around roles',
    desc: 'Every role lands on its own workspace and sees what it needs, nothing more.',
    visual: <RolesVisual />,
    span: '',
  },
  {
    title: 'Clinical safety built in',
    desc: 'Allergy and interaction checks at order entry, critical-value escalation and NEWS2 scoring.',
    visual: <SafetyVisual />,
    span: '',
  },
  {
    title: 'Modular, not monolithic',
    desc: 'Start with ED and inpatient, then add modules when you are ready, all on the same data model.',
    visual: <ModularVisual />,
    span: '',
  },
];

export default function ProductIntro() {
  return (
    <section id="product" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="The platform"
            title={<>Replace a dozen disconnected systems with <span className="text-brand-600">one hospital OS.</span></>}
            desc="Most hospitals run separate tools for the ED, wards, pharmacy, lab and billing, and staff act as the integration layer. HospAI puts them on one data model, so information moves with the patient."
          />
        </Reveal>

        <Reveal stagger className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c, i) => (
            <article
              key={c.title}
              onMouseMove={trackTilt}
              onMouseLeave={resetTilt}
              style={{ ['--i' as string]: i }}
              className={`spotlight lift group rounded-3xl border border-slate-200 bg-white p-3 hover:border-brand-200 ${c.span}`}
            >
              <div className="h-44 rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50/70 border border-slate-100 overflow-hidden">{c.visual}</div>
              <div className="px-3 pt-5 pb-3">
                <h3 className="font-display text-[19px] font-bold text-slate-900">{c.title}</h3>
                <p className="mt-2 text-[14.5px] text-slate-600 leading-relaxed">{c.desc}</p>
                {c.points && (
                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
                    {c.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-[13.5px] text-slate-700">
                        <CheckIcon size={14} strokeWidth={3} className="text-brand-600" /> {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}

          <article
            onMouseMove={trackTilt}
              onMouseLeave={resetTilt}
            style={{ ['--i' as string]: cards.length }}
            className="spotlight lift group md:col-span-2 lg:col-span-3 rounded-3xl border border-slate-200 bg-white p-3 hover:border-brand-200 grid grid-cols-1 md:grid-cols-2 gap-3 items-center"
          >
            <div className="px-3 py-4 md:pl-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-600">Security</div>
              <h3 className="mt-2 font-display text-[22px] font-bold text-slate-900">Secure and auditable by design</h3>
              <p className="mt-2 text-[15px] text-slate-600 leading-relaxed max-w-lg">
                User actions, record updates, financial transactions and login attempts go into an append-only audit trail, and role-based access controls every one of 60+ modules.
              </p>
            </div>
            <div className="h-44 rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50/70 border border-slate-100 overflow-hidden">
              <SecureVisual />
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
