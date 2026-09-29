import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from './icons';
import { moduleCount, moduleGroups } from './moduleData';
import { CountUp, resetTilt, trackTilt } from './motion';
import { Reveal, SectionHeading } from './ui';

const cats = moduleGroups.map((g) => ({ key: g.key, title: g.title, blurb: g.blurb, icon: g.icon, count: g.items.length }));

export default function ModuleGrid() {
  const [cat, setCat] = useState(cats[0].key);
  const navigate = useNavigate();
  const items = moduleGroups.filter((g) => g.key === cat).flatMap((g) => g.items.map((m) => ({ ...m, group: g.title })));

  return (
    <section id="modules" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <SectionHeading
              eyebrow="Modules"
              title="Every department. One data model."
              desc="Deploy the full suite or start with the departments that need it most. Each module is a focused workspace, and all of them share the same patient, bed and order data."
            />
            <div className="flex gap-10 lg:pb-2">
              {[[String(moduleCount), 'Integrated modules'], ['1', 'Patient record'], ['0', 'Internal interfaces']].map(([v, l]) => (
                <div key={l}>
                  <CountUp value={v} className="font-display text-[36px] font-extrabold text-slate-900 leading-none" />
                  <div className="text-[13px] text-slate-500 mt-2">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Category rail */}
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 -mx-4 px-4 lg:mx-0 lg:px-0 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar">
              {cats.map((c) => {
                const on = c.key === cat;
                return (
                  <button
                    key={c.key}
                    onClick={() => setCat(c.key)}
                    className={`shrink-0 lg:w-full text-left rounded-2xl border px-4 py-3.5 lg:p-5 transition-all duration-300 ${
                      on ? 'bg-ink-900 border-ink-900 text-white shadow-xl shadow-ink-900/20' : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${on ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-600'}`}>
                        <c.icon size={17} />
                      </span>
                      <span className="flex-1 font-display text-[15.5px] font-bold whitespace-nowrap">{c.title}</span>
                      <span className={`text-[12px] font-semibold rounded-full px-2 py-0.5 ${on ? 'bg-white/10 text-brand-200' : 'bg-slate-100 text-slate-500'}`}>{c.count}</span>
                    </div>
                    <p className={`hidden lg:block mt-3 text-[13.5px] leading-relaxed ${on ? 'text-slate-300' : 'text-slate-500'}`}>{c.blurb}</p>
                  </button>
                );
              })}
              <div className="hidden lg:block mt-4 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white">
                <div className="font-display text-[16px] font-bold">Not sure where to start?</div>
                <p className="mt-1.5 text-[13.5px] text-brand-100 leading-relaxed">Most hospitals begin with Emergency, Inpatient and Billing. We will map a rollout to your priorities.</p>
                <button onClick={() => navigate('/book-demo')} className="mt-4 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-white text-brand-700 text-[13px] font-semibold hover:bg-brand-50 transition-colors">
                  Plan my rollout <ArrowRightIcon size={13} />
                </button>
              </div>
            </div>
          </Reveal>

          {/* Module cards: remounted per category so they cascade in again */}
          <div className="lg:col-span-8">
            <Reveal stagger key={cat} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((m, i) => {
                return (
                  <button
                    key={m.key}
                    onClick={() => navigate('/book-demo')}
                    onMouseMove={trackTilt}
              onMouseLeave={resetTilt}
                    style={{ ['--i' as string]: i }}
                    className="spotlight lift group text-left rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-300"
                  >
                    <div className="flex items-start justify-between">
                      <span className="h-11 w-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-md shadow-brand-700/25 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
                        <m.icon size={20} />
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{m.group}</span>
                    </div>
                    <h3 className="mt-4 font-display text-[18px] font-bold text-slate-900">{m.label}</h3>
                    <p className="mt-1.5 text-[14px] text-slate-600 leading-relaxed">{m.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {m.features.map((f) => (
                        <span key={f} className="text-[12px] font-medium text-slate-600 bg-slate-100 rounded-md px-2 py-1 transition-colors group-hover:bg-brand-50 group-hover:text-brand-700">{f}</span>
                      ))}
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-600">
                      Request a walkthrough
                      <ArrowRightIcon size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                );
              })}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
