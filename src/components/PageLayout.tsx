import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { Logo } from './Navbar';
import { ArrowRightIcon, ChevronRightIcon } from './icons';

/** Shared chrome for secondary pages (Book a demo, legal pages, 404). */
export default function PageLayout({ children, hideCta = false }: { children: ReactNode; hideCta?: boolean }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" aria-label="HospAI home"><Logo /></Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden sm:inline-flex items-center gap-1 px-3 h-9 text-[14px] font-medium text-slate-600 hover:text-slate-900">
              <ChevronRightIcon size={14} className="rotate-180" /> Back to home
            </Link>
            {!hideCta && (
              <button onClick={() => navigate('/book-demo')} className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800">
                Book a demo <ArrowRightIcon size={14} />
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
