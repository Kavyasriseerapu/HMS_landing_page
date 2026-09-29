import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, CalendarIcon, ClockIcon, UsersIcon } from './icons';
import { Reveal, scrollToId } from './ui';

export default function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-6 py-14 sm:px-14 sm:py-20">
            <div className="absolute inset-0 bg-grid-dark opacity-70 pointer-events-none" />
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent-400/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-accent-600/40 blur-3xl pointer-events-none" />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <h2 className="font-display text-[34px] sm:text-[46px] font-extrabold text-white leading-[1.08] tracking-tight">
                  See your hospital running on HospAI.
                </h2>
                <p className="mt-5 text-[17px] text-brand-100 leading-relaxed max-w-xl">
                  In a 45-minute session we configure the demo around your departments and walk through the workflows that matter most to your teams.
                </p>
                <div className="mt-9 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate('/book-demo')}
                    className="btn-shine inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-white text-brand-700 text-[15px] font-semibold shadow-lg shadow-brand-950/30 hover:bg-brand-50 hover:-translate-y-0.5 transition-all"
                  >
                    Book a demo <ArrowRightIcon size={16} />
                  </button>
                  <button
                    onClick={() => scrollToId('#dashboard')}
                    className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg border border-white/30 text-white text-[15px] font-semibold hover:bg-white/10 transition-all"
                  >
                    See the live dashboard
                  </button>
                </div>
              </div>
              <div className="lg:col-span-5 grid gap-3">
                {[
                  { i: CalendarIcon, t: 'Tailored to your hospital', d: 'Your departments, bed count and priorities' },
                  { i: UsersIcon, t: 'Clinical & IT specialists', d: 'Answers on workflow, integration and security' },
                  { i: ClockIcon, t: 'Confirmed within one business day', d: 'No commitment required' },
                ].map((x) => (
                  <div key={x.t} className="flex items-center gap-4 rounded-xl bg-white/10 border border-white/15 backdrop-blur px-5 py-4">
                    <span className="h-10 w-10 rounded-lg bg-white/15 text-white flex items-center justify-center shrink-0"><x.i size={18} /></span>
                    <span>
                      <span className="block text-[15px] font-semibold text-white">{x.t}</span>
                      <span className="block text-[13px] text-brand-100">{x.d}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
