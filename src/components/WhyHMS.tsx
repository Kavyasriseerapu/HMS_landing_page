import { CheckIcon, ClipboardIcon, DatabaseIcon, SettingsIcon, UsersIcon, ZapIcon, type IconType } from './icons';
import { Reveal, SectionHeading } from './ui';

const phases: { n: string; t: string; d: string; out: string; icon: IconType; points: string[] }[] = [
  { n: '01', t: 'Discovery', icon: ClipboardIcon, d: 'We map your departments, workflows, order sets and existing systems with your clinical and IT leads.', out: 'Workflow blueprint', points: ['Department walkthroughs', 'Systems & integration audit', 'Success metrics agreed'] },
  { n: '02', t: 'Configuration', icon: SettingsIcon, d: 'Units, beds, roles, order sets, charge masters and templates are configured to match how you work.', out: 'Configured tenant', points: ['Roles & permissions', 'Order sets & templates', 'Tariffs & charge masters'] },
  { n: '03', t: 'Data migration', icon: DatabaseIcon, d: 'Patient demographics, active problems, allergies, medications and open balances are migrated and validated.', out: 'Reconciled data', points: ['AI-assisted column mapping', 'Duplicate detection', 'Sign-off by your team'] },
  { n: '04', t: 'Training', icon: UsersIcon, d: 'Role-based training with super-users on every unit, using your own configured environment.', out: 'Trained super-users', points: ['Role-based sessions', 'Super-user programme', 'Quick-reference guides'] },
  { n: '05', t: 'Go-live & support', icon: ZapIcon, d: 'At-the-elbow support through go-live, then a named success manager and continuous optimization.', out: 'Live hospital', points: ['On-site go-live support', 'Named success manager', 'Quarterly optimization'] },
];

const reasons = [
  ['Clinician-first design', 'Workflows designed with nurses and physicians, aiming for fewer clicks on repeated tasks.'],
  ['Phased or big-bang', 'Go live module by module, or all at once. Your choice.'],
  ['Transparent pricing', 'Per-bed or per-module licensing with no surprise interface fees.'],
];

export default function WhyHMS() {
  return (
    <section id="implementation" className="relative py-20 sm:py-28 bg-ink-900">
      <div className="absolute inset-0 bg-grid-dark mask-fade-b pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sticky intro */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <SectionHeading
                dark
                eyebrow="Implementation"
                title="A structured path from kickoff to go-live."
                desc="Hospital software succeeds or fails on implementation. Ours follows a proven five-phase plan with clinical informatics specialists at every step."
              />
            </Reveal>
            <Reveal className="mt-10 space-y-3">
              {reasons.map(([t, d]) => (
                <div key={t} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center"><CheckIcon size={13} strokeWidth={3} /></span>
                  <span>
                    <span className="block text-[15px] font-semibold text-white">{t}</span>
                    <span className="block text-[13.5px] text-slate-400 leading-relaxed">{d}</span>
                  </span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>

        {/* Stacking cards: each phase pins slightly lower than the last, forming a deck as you scroll */}
        <div className="lg:col-span-7">
          {phases.map((p, i) => (
            <div key={p.n} className="lg:sticky mb-6 lg:mb-10" style={{ top: `${120 + i * 26}px` }}>
              <div
                className="relative overflow-hidden rounded-3xl border border-white/10 p-7 sm:p-8 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.6)]"
                style={{ background: `linear-gradient(135deg, ${['#392f5a', '#3f3463', '#46396c', '#4d3f75', '#54457e'][i]} 0%, #2a2d34 100%)` }}
              >
                <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-brand-500/15 blur-2xl" />
                <div className="relative flex items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[13px] font-semibold text-brand-300">{p.n} / 05</span>
                      <span className="h-px w-10 bg-brand-400/40" />
                    </div>
                    <h3 className="mt-3 font-display text-[26px] font-bold text-white">{p.t}</h3>
                  </div>
                  <span className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
                    <p.icon size={24} />
                  </span>
                </div>
                <p className="relative mt-3 text-[15.5px] text-slate-300 leading-relaxed max-w-lg">{p.d}</p>
                <div className="relative mt-5 flex flex-wrap gap-2">
                  {p.points.map((x) => (
                    <span key={x} className="text-[12.5px] font-medium text-white/90 bg-white/[0.08] border border-white/10 rounded-full px-3 py-1">{x}</span>
                  ))}
                </div>
                <div className="relative mt-6 pt-5 border-t border-white/10 text-[13px] font-semibold text-brand-300">Outcome → {p.out}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
