import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { ArrowRightIcon } from '../components/icons';

export default function NotFound() {
  return (
    <PageLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid mask-fade-b pointer-events-none" />
        <div className="relative mx-auto max-w-2xl px-4 sm:px-6 py-28 sm:py-36 text-center">
          <div className="font-mono text-[13px] font-semibold text-brand-600 tracking-[0.2em]">ERROR 404</div>
          <h1 className="mt-4 font-display text-[40px] sm:text-[56px] font-extrabold text-slate-900 leading-[1.05] tracking-tight">
            This page has been discharged.
          </h1>
          <p className="mt-5 text-[17px] text-slate-600 leading-relaxed">
            The page you're looking for doesn't exist or has moved. Let's get you back to the right department.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-brand-600 text-white text-[15px] font-semibold hover:bg-brand-700">
              Back to home <ArrowRightIcon size={16} />
            </Link>
            <Link to="/#dashboard" className="inline-flex items-center gap-2 h-12 px-6 rounded-lg border border-slate-200 bg-white text-slate-800 text-[15px] font-semibold hover:bg-slate-50">
              See the live dashboard
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
