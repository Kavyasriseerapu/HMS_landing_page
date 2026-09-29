import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckIcon } from './icons';
import { PharmacyMini } from './MiniScreens';
import { Reveal, SectionHeading } from './ui';

const points = [
  'Prescription queue with allergy & dosage checks',
  'Batch-wise dispensing with GST billing',
  'Stock ledger with reorder alerts',
  'Purchase orders & goods received notes',
  'Patient & supplier returns',
  'Near-expiry tracking',
];

/** Compact pharmacy highlight: short copy plus one screen that sums up the module. */
export default function PharmacySection() {
  return (
    <section id="pharmacy" className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-brand-50/60 via-white to-accent-400/10 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Pharmacy management"
              title={<>A complete pharmacy, <span className="text-brand-600">built in.</span></>}
              desc="Prescriptions arrive from doctors, get verified and dispensed, billed at the counter, and stock, purchasing and expiry update on their own."
            />
            <ul className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[14px] text-slate-700">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center"><CheckIcon size={12} strokeWidth={3} /></span>
                  {p}
                </li>
              ))}
            </ul>
            <Link to="/book-demo" className="mt-7 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-600 hover:text-brand-700">
              See the pharmacy in a demo <ArrowRightIcon size={14} />
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <div className="-mx-6 px-6 sm:mx-0 sm:px-0 overflow-x-auto sm:overflow-visible no-scrollbar">
              <div className="min-w-[560px] sm:min-w-0 lg:[transform:perspective(1200px)_rotateY(-6deg)_rotateX(3deg)]">
                <PharmacyMini />
              </div>
            </div>
            <div className="sm:hidden mt-2 text-center text-[12px] text-slate-500">← Swipe to see more →</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
