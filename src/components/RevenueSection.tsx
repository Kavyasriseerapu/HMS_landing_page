import { useState } from 'react';
import { CardIcon, CheckIcon, ShieldCheckIcon } from './icons';
import { Reveal, SectionHeading } from './ui';

const charges = [['Consultation', '₹800'], ['Bed stay · 3 days', '₹9,600'], ['Nursing procedures', '₹2,150'], ['Lab tests', '₹3,420'], ['Radiology', '₹4,800'], ['Pharmacy', '₹6,185']];
const modes = ['Cash', 'Card', 'UPI', 'NetBanking', 'Insurance / TPA'];

const claimSteps: [string, string, string][] = [
  ['Policy eligibility', 'Insurer, plan, member ID, deductibles, co-pay rules and active coverage verified before admission.', 'Coverage active · Co-pay 10%'],
  ['Pre-authorization', 'Diagnosis, estimated cost and medical justification submitted; approval tracked live.', 'Approved · ₹1,20,000 GOP'],
  ['Interim enhancement', 'Interim bills during long IP / ICU stays raise the guaranteed authorization sum.', 'Enhancement +₹45,000 requested'],
  ['Claim dossier', 'Itemized bills, signed discharge summary, reports, implant invoices and pharmacy vouchers bundled.', 'Dossier complete · 14 documents'],
  ['Adjudication & appeals', 'Submitted, under review, settled or denied, with an appeal workflow for short-settled claims.', 'Under review · Day 3'],
  ['Settlement & co-pay', 'Remittance advice reconciled, write-offs recorded and patient co-pay collected at checkout.', 'Settled · Co-pay ₹16,500 collected'],
];

export default function RevenueSection() {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState(2);

  return (
    <section id="revenue" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Billing, insurance & TPA"
            title={<>Every rupee captured. <span className="text-brand-600">Every claim followed through.</span></>}
            desc="One charge engine gathers consultation, bed, nursing, lab, radiology and pharmacy charges. Patients pay their way, and insurance claims run end-to-end from eligibility to settlement."
          />
        </Reveal>

        <Reveal className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Charge engine */}
          <div className="lg:col-span-5 rounded-3xl bg-ink-900 text-white p-7 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-dark opacity-60 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2.5">
                <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center"><CardIcon size={18} /></span>
                <div>
                  <div className="text-[15px] font-bold">Patient charge engine</div>
                  <div className="text-[12px] text-slate-400">IP-2026-0418 · Rajesh Kumar</div>
                </div>
              </div>
              <div className="mt-5 space-y-2">
                {charges.map(([k, v], i) => (
                  <div key={k} className="flex justify-between text-[13.5px] border-b border-white/5 pb-2 animate-fade-in-up" style={{ animationDelay: `${i * 70}ms` }}>
                    <span className="text-slate-300">{k}</span><span className="font-mono">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-1 text-[16px] font-bold"><span>Total</span><span className="font-mono text-brand-300">₹26,955</span></div>
              </div>
              <div className="mt-6 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">Pay by</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {modes.map((m, i) => (
                  <button key={m} onClick={() => setMode(i)} className={`text-[12.5px] font-semibold rounded-full px-3 py-1.5 border transition-all ${i === mode ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/30' : 'border-white/15 text-slate-300 hover:bg-white/10'}`}>{m}</button>
                ))}
              </div>
              <div key={mode} className="mt-4 flex items-center gap-2 rounded-xl bg-white/[0.06] border border-white/10 px-4 py-3 text-[13px] animate-view-in">
                <CheckIcon size={14} strokeWidth={3} className="text-emerald-400" />
                {mode === 4 ? 'Routed to the claims desk · pre-auth linked' : `${modes[mode]} payment recorded · itemized receipt issued`}
              </div>
            </div>
          </div>

          {/* Insurance flow */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-brand-50/50 p-7">
            <div className="flex items-center gap-2.5">
              <span className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center"><ShieldCheckIcon size={18} /></span>
              <div>
                <div className="text-[15px] font-bold text-slate-900">Insurance & TPA claims desk</div>
                <div className="text-[12px] text-slate-500">The full six-step claim lifecycle</div>
              </div>
            </div>

            <div className="mt-6 relative">
              <div className="absolute left-4 right-4 top-4 h-0.5 bg-slate-200" />
              <div className="absolute left-4 top-4 h-0.5 bg-gradient-to-r from-brand-500 to-accent-600 transition-all duration-700" style={{ width: `calc((100% - 2rem) * ${step / (claimSteps.length - 1)})` }} />
              <div className="relative grid grid-cols-6">
                {claimSteps.map(([t], i) => (
                  <button key={t} onClick={() => setStep(i)} className="flex flex-col items-center gap-2 group">
                    <span className={`h-8 w-8 rounded-full text-[12px] font-bold flex items-center justify-center border-2 transition-all ${i <= step ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-300'} ${i === step ? 'scale-110 shadow-lg shadow-brand-600/30' : ''}`}>
                      {i < step ? <CheckIcon size={13} strokeWidth={3} /> : i + 1}
                    </span>
                    <span className={`hidden sm:block text-[11.5px] font-semibold text-center leading-tight ${i === step ? 'text-slate-900' : 'text-slate-500'}`}>{t}</span>
                  </button>
                ))}
              </div>
            </div>

            <div key={step} className="mt-8 rounded-2xl bg-white border border-slate-200 p-6 animate-view-in">
              <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-600">Step {step + 1} of 6</div>
              <div className="mt-1 font-display text-[21px] font-bold text-slate-900">{claimSteps[step][0]}</div>
              <p className="mt-2 text-[14.5px] text-slate-600 leading-relaxed">{claimSteps[step][1]}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 text-[12.5px] font-semibold px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> {claimSteps[step][2]}
              </div>
              <div className="mt-5 flex gap-2">
                <button disabled={step === 0} onClick={() => setStep(step - 1)} className="h-9 px-4 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40">Previous</button>
                <button disabled={step === claimSteps.length - 1} onClick={() => setStep(step + 1)} className="h-9 px-4 rounded-lg bg-slate-900 text-white text-[13px] font-semibold hover:bg-slate-800 disabled:opacity-40">Next step</button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
