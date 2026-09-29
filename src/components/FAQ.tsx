import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, ChevronDownIcon } from './icons';
import { Reveal, SectionHeading } from './ui';

const faqs = [
  {
    q: 'What exactly is HospAI?',
    a: 'HospAI is a hospital management system that runs clinical, operational and financial workflows on one platform. It covers emergency, inpatient, ICU, surgery, outpatient, nursing, lab, radiology, pharmacy, billing and insurance, and every module shares one patient record.',
  },
  {
    q: 'Do we have to deploy every module at once?',
    a: 'No. Many hospitals start with Emergency, Inpatient and Billing, then add Surgery, Pharmacy or Analytics in later phases. All modules share the same data model, so adding one later needs no new interfaces.',
  },
  {
    q: 'How does HospAI integrate with our existing systems?',
    a: 'HospAI connects with imaging systems (PACS) and includes built-in document reading. Connections to your existing lab equipment, devices and other systems are planned with your team during implementation.',
  },
  {
    q: 'Can we migrate data from our current system?',
    a: 'Yes. Migration is a dedicated phase of every implementation. We typically migrate demographics, allergies, active problems and medications, recent encounters and open financial balances, and we validate them with your team before go-live.',
  },
  {
    q: 'How does the AI work, and who checks it?',
    a: 'The HospAI AI tools help with notes, prescriptions, documents, symptoms, summaries and patient searches. They act as an assistant: summaries and suggestions are drafts that doctors and staff review and sign, and AI use follows the same role-based access and audit trail as the rest of HospAI.',
  },
  {
    q: 'Which languages does voice documentation support?',
    a: 'Voice SOAP notes work in Telugu, Hindi, Tamil, Kannada and English. HospAI separates what the doctor and the patient say and turns the conversation into a structured SOAP note for the doctor to review.',
  },
  {
    q: 'Does HospAI work if the internet goes down?',
    a: 'Yes. Staff can keep working through network drops, and changes sync automatically when the connection returns. Open screens stay in step with each other, so everyone sees the latest information.',
  },
  {
    q: 'Can HospAI handle insurance and TPA claims end to end?',
    a: 'Yes. The claims desk covers policy eligibility, pre-authorization, interim enhancements, claim dossier packaging, adjudication and appeals, and final ERA settlement with co-pay collection.',
  },
  {
    q: 'Is it cloud-based or on-premise?',
    a: 'Both. HospAI runs as a managed cloud service, in your private cloud, or on-premise in your data center. It is the same product in every case, and the right choice depends on your regulatory, connectivity and IT preferences.',
  },
  {
    q: 'What happens during network or system downtime?',
    a: 'HospAI provides read-only downtime views of census, active medications and recent results, plus downtime forms that reconcile back into the record when service is restored.',
  },
  {
    q: 'How long does an implementation take?',
    a: 'It depends on scope and hospital size. A focused deployment for a single facility is much faster than a multi-site, full-suite rollout. We give you a detailed timeline after the discovery phase.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const navigate = useNavigate();

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <Reveal className="lg:col-span-4">
          <SectionHeading eyebrow="FAQ" title="Questions hospitals ask us." desc="Can't find what you're looking for? Our team will walk you through it on a call." />
          <button
            onClick={() => navigate('/book-demo')}
            className="mt-8 inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800"
          >
            Talk to our team <ArrowRightIcon size={14} />
          </button>
        </Reveal>

        <Reveal className="lg:col-span-8">
          <div className="rounded-2xl border border-slate-200 divide-y divide-slate-200 overflow-hidden">
            {faqs.map((f, i) => {
              const on = open === i;
              return (
                <div key={f.q} className={on ? 'bg-slate-50/70' : 'bg-white'}>
                  <button
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                    onClick={() => setOpen(on ? null : i)}
                    aria-expanded={on}
                  >
                    <span className="text-[16px] font-semibold text-slate-900">{f.q}</span>
                    <span className={`h-8 w-8 shrink-0 rounded-full border flex items-center justify-center transition-all ${on ? 'bg-slate-900 border-slate-900 text-white rotate-180' : 'border-slate-200 text-slate-500'}`}>
                      <ChevronDownIcon size={16} />
                    </span>
                  </button>
                  <div className={`grid transition-all duration-300 ${on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 -mt-1 text-[15px] text-slate-600 leading-relaxed max-w-3xl">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
