import { usePageProgress } from './motion';

/** Gradient reading-progress bar plus a back-to-top button with a progress ring. */
export default function ScrollExtras() {
  const p = usePageProgress();
  const R = 20;
  const C = 2 * Math.PI * R;

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-[70] h-[3px] pointer-events-none">
        <div className="scroll-progress h-full origin-left" style={{ transform: `scaleX(${p})` }} />
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-[60] h-12 w-12 rounded-full bg-white/90 backdrop-blur shadow-xl shadow-ink-900/15 border border-slate-200 flex items-center justify-center transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
          p > 0.06 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r={R} fill="none" stroke="#f1f5f9" strokeWidth="3" />
          <circle cx="24" cy="24" r={R} fill="none" stroke="url(#ringGrad)" strokeWidth="3" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} />
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff677d" />
              <stop offset="100%" stopColor="#392f5a" />
            </linearGradient>
          </defs>
        </svg>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2a2d34" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative" aria-hidden="true">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </>
  );
}
