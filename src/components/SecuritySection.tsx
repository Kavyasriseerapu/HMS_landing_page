import { Link } from 'react-router-dom';
import { EyeIcon, KeyIcon, LockIcon, RefreshIcon, ShieldCheckIcon, UserCogIcon } from './icons';
import { Reveal, SectionHeading } from './ui';

const controls = [
  { icon: UserCogIcon, t: 'Role-based access control', d: 'Doctor, nurse, receptionist, pharmacist, lab tech, radiologist, billing clerk and admin roles control access to each of 60+ modules.' },
  { icon: KeyIcon, t: 'Login & access monitoring', d: 'Every login attempt is recorded in the audit trail, and each of the eight roles only reaches the modules it is granted.' },
  { icon: EyeIcon, t: 'Complete audit trail', d: 'Every chart open, edit, print and export is logged with user, time and workstation, and is searchable and exportable.' },
  { icon: LockIcon, t: 'Safe through outages', d: 'Records stay safe when the network drops and sync automatically when the connection returns.' },
  { icon: ShieldCheckIcon, t: 'Break-the-glass access', d: 'Emergency access to restricted records requires a reason and triggers a privacy-officer review.' },
  { icon: RefreshIcon, t: 'Downtime resilience', d: 'Read-only downtime views and automated backups keep care running during planned or unplanned outages.' },
];

const audit = [
  ['10:47:12', 'J. Carter (RN)', 'Viewed chart', 'T. Reed · MRN-204118', 'ok'],
  ['10:46:58', 'Dr. A. Shah', 'Signed order', 'Heparin infusion', 'ok'],
  ['10:46:31', 'M. Lopez (PharmD)', 'Verified med', 'Calcium gluconate 1 g', 'ok'],
  ['10:45:09', 'Temp — Agency RN', 'Access denied', 'ICU record outside unit', 'deny'],
  ['10:44:40', 'Dr. L. Chen', 'Break-the-glass', 'Restricted record · reason logged', 'warn'],
  ['10:43:22', 'B. Howard (Billing)', 'Exported report', 'Payer mix — Sep', 'ok'],
];

export default function SecuritySection() {
  return (
    <section id="security" className="py-20 sm:py-28 bg-slate-50 border-y border-slate-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Security & privacy"
              title="Patient data stays with the people who need it."
              desc="Security in HospAI is a design principle, not a checkbox. Access is scoped by role, every action is recorded, and the controls your privacy and compliance teams rely on come built in."
            />
            <div className="mt-8 rounded-2xl bg-ink-900 text-white overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-5 h-12 border-b border-white/10">
                <span className="text-[13px] font-semibold">Audit log</span>
                <span className="flex items-center gap-1.5 text-[11px] text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Streaming</span>
              </div>
              <div className="divide-y divide-white/5">
                {audit.map(([t, u, a, obj, s]) => (
                  <div key={t} className="grid grid-cols-[64px_1fr] gap-3 px-5 py-2.5 text-[12.5px]">
                    <span className="font-mono text-slate-500">{t}</span>
                    <span className="min-w-0">
                      <span className={`font-semibold ${s === 'deny' ? 'text-red-400' : s === 'warn' ? 'text-amber-300' : 'text-white'}`}>{a}</span>
                      <span className="text-slate-400"> · {u}</span>
                      <span className="block text-slate-500 truncate">{obj}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {controls.map((c, i) => (
              <Reveal key={c.t} delay={i * 60}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-200 hover:shadow-[0_12px_32px_-16px_rgba(217,54,84,0.25)] transition-all">
                  <div className="h-10 w-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center"><c.icon size={19} /></div>
                  <h3 className="mt-4 font-display text-[17px] font-bold text-slate-900">{c.t}</h3>
                  <p className="mt-2 text-[14.5px] text-slate-600 leading-relaxed">{c.d}</p>
                </div>
              </Reveal>
            ))}
            <Reveal className="sm:col-span-2">
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="text-[15px] font-semibold text-slate-900">Need our security documentation?</div>
                  <div className="text-[14px] text-slate-600 mt-0.5">Architecture overview, data-flow diagrams and a completed security questionnaire are available under NDA.</div>
                </div>
                <Link to="/book-demo" className="shrink-0 inline-flex items-center justify-center h-10 px-4 rounded-lg border border-slate-300 bg-white text-[14px] font-semibold text-slate-800 hover:bg-slate-50">
                  Request security pack
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
