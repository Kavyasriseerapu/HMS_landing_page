import { Link } from 'react-router-dom';
import MobileApp from './MobileApp';
import { ArrowRightIcon, BellIcon, ClipboardIcon, LockIcon, SparkIcon, UsersIcon } from './icons';
import { resetTilt, trackTilt } from './motion';
import { Reveal, SectionHeading } from './ui';

const features = [
  { icon: UsersIcon, t: 'Rounds on the move', d: 'Patient lists, vitals, results and an AI snapshot for every patient, right at the bedside.' },
  { icon: ClipboardIcon, t: 'Tasks & medication', d: 'Nurses scan and complete medication and care tasks as they go, with overdue items flagged.' },
  { icon: BellIcon, t: 'Critical alerts', d: 'Critical results, call lights and bed updates reach the right person instantly.' },
  { icon: SparkIcon, t: 'AI in your pocket', d: 'Ask for a summary of your patients or a discharge draft, then review and sign.' },
];

export default function MobileSection() {
  return (
    <section id="mobile" className="relative py-20 sm:py-28 bg-white overflow-hidden">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 h-[720px] w-[720px] rounded-full bg-[radial-gradient(closest-side,rgba(57,47,90,0.14),transparent)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
        <Reveal className="lg:col-span-6">
          <SectionHeading
            eyebrow="HospAI mobile"
            title={<>The whole hospital, <span className="text-brand-600">in your pocket.</span></>}
            desc="The same platform, designed for phones and tablets. Doctors round, nurses chart and managers stay informed from anywhere in the hospital, on the same live patient record."
          />

          <Reveal stagger className="mt-10 grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={f.t} onMouseMove={trackTilt}
              onMouseLeave={resetTilt} style={{ ['--i' as string]: i }} className="spotlight lift rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-200">
                <span className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center"><f.icon size={18} /></span>
                <div className="mt-4 font-display text-[16px] font-bold text-slate-900">{f.t}</div>
                <p className="mt-1.5 text-[14px] text-slate-600 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </Reveal>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link to="/book-demo" className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800">
              See HospAI mobile in a demo <ArrowRightIcon size={14} />
            </Link>
            <span className="flex items-center gap-1.5 text-[13px] text-slate-500"><LockIcon size={13} className="text-brand-600" /> Same sign-in, roles and audit trail as the web</span>
          </div>
        </Reveal>

        {/* Two interactive phones */}
        <Reveal className="lg:col-span-6">
          <div className="relative flex justify-center items-end gap-0 min-h-[560px] sm:min-h-[640px]">
            <div className="hidden sm:block absolute left-[4%] top-10 -rotate-6 opacity-95 animate-float" style={{ animationDuration: '8s' }}>
              <MobileApp initial="tasks" scale={0.78} />
            </div>
            <div className="relative sm:ml-40 z-10 animate-float" style={{ animationDelay: '1.2s', animationDuration: '7s' }}>
              <MobileApp initial="patients" scale={0.92} />
            </div>
            <div className="absolute right-0 sm:right-[2%] top-6 z-20 hidden md:flex items-center gap-2 rounded-full bg-white border border-slate-200 shadow-xl shadow-slate-900/10 px-3.5 py-2 text-[12.5px] font-semibold text-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Live on the same record
            </div>
          </div>
          <p className="mt-4 text-center text-[13px] text-slate-500">Tap the phones: open a patient, complete a task, clear an alert or ask the AI.</p>
        </Reveal>
      </div>
    </section>
  );
}
