import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import CommandDashboard from './CommandDashboard';
import MobileApp from './MobileApp';
import { EDMini, ICUMini } from './MiniScreens';
import { AlertIcon, ArrowRightIcon, CheckIcon, MicIcon, PlayIcon, SparkIcon, ZapIcon } from './icons';
import { BrowserFrame, scrollToId } from './ui';


export default function Hero() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax: background layers drift slower than the page.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let f = 0;
    // --lay: 1 = dashboard lying back at the top of the page, 0 = upright after ~55% of a screen of scroll.
    const on = () => {
      if (f) return;
      f = requestAnimationFrame(() => {
        f = 0;
        const y = window.scrollY;
        el.style.setProperty('--sy', String(Math.min(y, 1200)));
        el.style.setProperty('--lay', Math.max(0, 1 - y / (window.innerHeight * 0.55)).toFixed(3));
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => { cancelAnimationFrame(f); window.removeEventListener('scroll', on); };
  }, []);

  return (
    <section ref={sectionRef} style={{ ['--lay' as string]: 1 }} className="relative pt-36 sm:pt-40 pb-20 sm:pb-28 overflow-hidden bg-white">
      {/* Light stage: grid + soft coral/purple glows */}
      <div className="absolute inset-0 bg-grid mask-fade-b pointer-events-none" style={{ transform: 'translateY(calc(var(--sy, 0) * 0.25px))' }} />
      <div className="hero-aurora absolute -top-40 left-[10%] h-[520px] w-[520px] rounded-full bg-brand-300/30 blur-[110px] pointer-events-none" />
      <div className="hero-aurora absolute -top-24 right-[8%] h-[480px] w-[560px] rounded-full bg-accent-400/25 blur-[110px] pointer-events-none" style={{ animationDelay: '-6s' }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <button
            onClick={() => scrollToId('#dashboard')}
            className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 backdrop-blur pl-1.5 pr-3.5 py-1.5 text-[13px] text-slate-600 shadow-sm hover:border-slate-300 transition-colors"
          >
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white text-[11px] font-bold px-2.5 py-0.5"><SparkIcon size={11} /> HospAI</span>
            AI-driven hospital management, live in production
            <ArrowRightIcon size={13} className="text-slate-400" />
          </button>

          <h1 className="mt-7 font-display text-[42px] sm:text-[64px] lg:text-[76px] font-extrabold text-slate-900 leading-[1.04] tracking-[-0.035em]">
            {['The', 'command', 'center'].map((w, i) => (
              <span key={w} className="word-rise" style={{ animationDelay: `${0.1 + i * 0.09}s` }}>{w}&nbsp;</span>
            ))}
            <br className="hidden sm:block" />
            {['for', 'your'].map((w, i) => (
              <span key={w} className="word-rise" style={{ animationDelay: `${0.37 + i * 0.09}s` }}>{w}&nbsp;</span>
            ))}
            <span className="word-rise" style={{ animationDelay: '0.58s' }}>
              <span className="text-shimmer bg-gradient-to-r from-brand-600 via-accent-600 to-brand-600 bg-clip-text text-transparent">entire hospital.</span>
            </span>
          </h1>

          <p className="animate-fade-in-up anim-delay-500 mt-7 text-[17px] sm:text-[20px] text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Census, beds, ED, ICU, OT, lab, pharmacy, billing and insurance on one live screen, with AI that writes notes,
            splits prescriptions and reads documents for your team.
          </p>

          <div className="animate-fade-in-up anim-delay-600 mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/book-demo')}
              className="btn-shine w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[52px] px-7 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-[15.5px] font-semibold shadow-lg shadow-brand-600/25 hover:-translate-y-0.5 transition-all"
            >
              Book a live demo <ArrowRightIcon size={16} />
            </button>
            <button
              onClick={() => scrollToId('#dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[52px] px-7 rounded-xl border border-slate-200 bg-white text-slate-800 text-[15.5px] font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              <PlayIcon size={14} className="text-brand-600" /> Explore the dashboard
            </button>
          </div>

        </div>

        {/* Product, elevated */}
        <div className="relative mt-16 sm:mt-20 dash-rise">
          <div className="absolute -inset-x-6 -top-10 bottom-10 rounded-[48px] bg-gradient-to-b from-brand-500/15 via-accent-500/10 to-transparent blur-3xl pointer-events-none" />

          <div id="dashboard" className="hero-tilt relative scroll-mt-28">
            <div className="hero-tilt-inner relative">
              {/* Screens fanned out behind the main dashboard */}
              <div className="hidden lg:block absolute -left-[3%] -top-12 w-[40%] z-0 fan-left" aria-hidden="true">
                <EDMini />
              </div>
              <div className="hidden lg:block absolute -right-[3%] -top-8 w-[40%] z-0 fan-right" aria-hidden="true">
                <ICUMini />
              </div>

              <div className="relative z-10 mx-auto lg:w-[80%]">
              {/* On small screens the dashboard stays readable and swipes sideways */}
              <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto md:overflow-visible no-scrollbar">
                <div className="min-w-[760px] md:min-w-0 rounded-[22px] p-[1.5px] bg-gradient-to-b from-slate-200 via-slate-100 to-white shadow-[0_50px_100px_-30px_rgba(42,45,52,0.35)]">
                  <BrowserFrame url="hms.yourhospital.org/dashboard" className="relative !rounded-[21px]">
                    <CommandDashboard />
                  </BrowserFrame>
                </div>
              </div>
              <div className="md:hidden mt-3 flex items-center justify-center gap-2 text-[12.5px] font-medium text-slate-500">
                <span className="swipe-hint inline-block">←</span> Swipe to explore the dashboard <span className="swipe-hint inline-block">→</span>
              </div>

              {/* Floating proof chips */}
              <div className="hidden lg:flex absolute -left-5 xl:-left-10 -top-8 z-10 chip-pop items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl shadow-ink-900/20 px-4 py-3" style={{ animationDelay: '1.6s, 2.3s' }}>
                <span className="relative h-9 w-9 rounded-xl bg-red-500 text-white flex items-center justify-center"><span className="absolute inset-0 rounded-xl bg-red-500 animate-ping-slow" /><AlertIcon size={16} className="relative" /></span>
                <span className="leading-tight">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-red-600">Critical lab</span>
                  <span className="block text-[13.5px] font-semibold text-slate-900">Escalated in 42 sec</span>
                </span>
              </div>
              <div className="hidden lg:flex absolute -right-5 xl:-right-10 -top-8 z-10 chip-pop items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl shadow-ink-900/20 px-4 py-3" style={{ animationDelay: '1.85s, 2.55s' }}>
                <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 text-white flex items-center justify-center"><MicIcon size={16} /></span>
                <span className="leading-tight">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-accent-600">Voice AI</span>
                  <span className="block text-[13.5px] font-semibold text-slate-900">SOAP note ready · Telugu</span>
                </span>
              </div>
              <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 -bottom-7 z-10 chip-pop items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl shadow-ink-900/20 px-4 py-3" style={{ animationDelay: '2.1s, 2.8s' }}>
                <span className="h-9 w-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center"><ZapIcon size={16} /></span>
                <span className="leading-tight">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-600">Live sync</span>
                  <span className="block text-[13.5px] font-semibold text-slate-900">54 beds available now</span>
                </span>
              </div>
              </div>

              {/* The same platform on mobile, in front */}
              <div className="hidden lg:block absolute right-[1%] -bottom-16 z-20 phone-in">
                <MobileApp scale={0.62} />
              </div>
            </div>

          </div>

          {/* Phones and tablets: the mobile app, full size */}
          <div className="lg:hidden mt-14 flex flex-col items-center">
            <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-600">HospAI mobile</div>
            <div className="mt-1 text-[15px] font-semibold text-slate-800">Tap to try the app</div>
            <div className="mt-5"><MobileApp scale={0.9} /></div>
          </div>

          <p className="mt-6 lg:mt-24 flex items-center justify-center gap-2 text-center text-[13px] text-slate-500">
            <CheckIcon size={14} strokeWidth={2.5} className="text-emerald-600" />
            Live preview with sample data. Click the sidebar, dismiss alerts, or tap the phone app.
          </p>
        </div>
      </div>
    </section>
  );
}
