import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { ArrowRightIcon, CalendarIcon, CheckIcon, ClockIcon, PlayIcon, ShieldCheckIcon, UsersIcon } from '../components/icons';

type FormState = {
  fullName: string;
  workEmail: string;
  phone: string;
  hospitalName: string;
  location: string;
  bedCount: string;
  designation: string;
  version: string;
  interests: string[];
  preferredDate: string;
  preferredTime: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const versionOptions = ['Basic version', 'Standard version', 'Enterprise version'];

const bedOptions = ['Under 50', '50–100', '101–250', '251–500', '500+'];

const timeOptions = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
];

const agenda = [
  ['5 min', 'Your priorities and current systems'],
  ['25 min', 'Live walkthrough of the modules you pick'],
  ['10 min', 'Integration, security and deployment'],
  ['5 min', 'Rollout plan and next steps'],
];

const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const validatePhone = (v: string) => /^[\d\s+\-()]{7,18}$/.test(v);

const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const apiUrl = !rawApiUrl || rawApiUrl.endsWith(':') ? 'http://localhost:4000' : rawApiUrl;

export default function BookDemo() {
  const navigate = useNavigate();

  const initialVersion = (() => {
    const p = new URLSearchParams(window.location.search);
    const param = p.get('version') || p.get('interest');
    if (param) {
      const match = versionOptions.find((opt) => opt.toLowerCase().includes(param.toLowerCase()));
      if (match) return match;
    }
    return 'Standard version';
  })();

  const [form, setForm] = useState<FormState>({
    fullName: '', workEmail: '', phone: '', hospitalName: '', location: '', bedCount: '', designation: '',
    version: initialVersion,
    interests: [initialVersion],
    preferredDate: '', preferredTime: '', message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Book a demo · HospAI';
  }, []);

  const setField = (field: keyof FormState, value: string | string[]) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (submitError) setSubmitError(null);
    if (errors[field]) setErrors((e) => { const next = { ...e }; delete next[field]; return next; });
  };

  const selectVersion = (opt: string) => {
    setForm((f) => ({ ...f, version: opt, interests: [opt] }));
    if (submitError) setSubmitError(null);
  };

  const validate = () => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.workEmail.trim()) e.workEmail = 'Work email is required';
    else if (!validateEmail(form.workEmail)) e.workEmail = 'Enter a valid email address';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!validatePhone(form.phone)) e.phone = 'Enter a valid phone number';
    if (!form.hospitalName.trim()) e.hospitalName = 'Hospital name is required';
    if (!form.preferredDate) e.preferredDate = 'Please select a date';
    if (!form.preferredTime) e.preferredTime = 'Please select a time';
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) document.getElementById(`f-${first}`)?.focus();
    return !first;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${apiUrl}/api/demo-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg =
          data?.error ||
          (data?.details ? Object.values(data.details).flat().join('. ') : null) ||
          'Unable to submit your demo request. Please try again.';
        setSubmitError(errorMsg);
        setLoading(false);
        return;
      }

      if (data?.requestId) {
        setRequestId(data.requestId);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitError('Unexpected response from server. Please try again.');
      }
    } catch {
      setSubmitError('Unable to connect to the demo booking server. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (submitted) {
    const when = new Date(`${form.preferredDate}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    return (
      <PageLayout hideCta>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid mask-fade-b pointer-events-none" />
          <div className="relative mx-auto max-w-2xl px-4 sm:px-6 py-20 sm:py-28">
            <div className="animate-scale-in rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-[0_30px_60px_-30px_rgba(7,26,36,0.35)]">
              <div className="h-14 w-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/30">
                <CheckIcon size={28} strokeWidth={3} />
              </div>
              <h1 className="mt-6 font-display text-[30px] sm:text-[36px] font-extrabold text-slate-900 leading-tight">You're booked in, {form.fullName.split(' ').slice(-1)[0] || form.fullName}.</h1>
              <p className="mt-3 text-[16px] text-slate-600 leading-relaxed">
                Thanks for your interest in HospAI. We'll email <span className="font-medium text-slate-900">{form.workEmail}</span> within one business day to confirm your session.
              </p>

              <dl className="mt-8 grid sm:grid-cols-2 gap-px rounded-2xl overflow-hidden border border-slate-200 bg-slate-200">
                {[
                  ['Request ID', <span className="font-mono">{requestId}</span>],
                  ['Hospital', form.hospitalName],
                  ['Requested slot', `${when} · ${form.preferredTime}`],
                  ['Focus version', form.version || (form.interests.length ? form.interests.join(', ') : 'Standard version')],
                ].map(([k, v]) => (
                  <div key={k as string} className="bg-white px-5 py-4">
                    <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-slate-400">{k}</dt>
                    <dd className="mt-1 text-[14.5px] font-medium text-slate-900">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8">
                <div className="text-[13px] font-semibold text-slate-900">What happens next</div>
                <ol className="mt-3 space-y-2.5">
                  {['We confirm the time and send a calendar invite.', 'A solutions consultant reviews your focus areas beforehand.', 'We run a 45-minute live session tailored to your hospital.'].map((t, i) => (
                    <li key={t} className="flex gap-3 text-[14.5px] text-slate-600">
                      <span className="h-6 w-6 shrink-0 rounded-full bg-brand-50 text-brand-700 text-[12px] font-bold flex items-center justify-center">{i + 1}</span>
                      {t}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate('/#dashboard')} className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-brand-600 text-white text-[14px] font-semibold hover:bg-brand-700">
                  <PlayIcon size={13} /> Try the live dashboard meanwhile
                </button>
                <button onClick={() => navigate('/')} className="inline-flex items-center justify-center h-11 px-5 rounded-lg border border-slate-200 text-[14px] font-semibold text-slate-700 hover:bg-slate-50">
                  Back to home
                </button>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout hideCta>
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
        <div className="absolute inset-0 bg-grid mask-fade-b pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-14 pb-12 sm:pt-20 sm:pb-16">
          <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-600 animate-fade-in">Book a demo</div>
          <h1 className="mt-3 font-display text-[36px] sm:text-[52px] font-extrabold text-slate-900 leading-[1.05] tracking-tight max-w-3xl animate-fade-in-up">
            See HospAI running for <span className="text-brand-600">your hospital.</span>
          </h1>
          <p className="mt-4 text-[17px] text-slate-600 leading-relaxed max-w-2xl animate-fade-in-up anim-delay-100">
            Tell us a little about your hospital and pick a time. We'll tailor a 45-minute live session to the departments you care about most.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Context */}
        <aside className="lg:col-span-4 order-2 lg:order-1">
          <div className="lg:sticky lg:top-24 space-y-5">
            <div className="rounded-2xl bg-ink-900 text-white p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-dark opacity-60 pointer-events-none" />
              <div className="relative">
                <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-300">Your 45-minute session</div>
                <ul className="mt-4 space-y-3">
                  {agenda.map(([t, d]) => (
                    <li key={d} className="flex gap-3">
                      <span className="w-14 shrink-0 text-[12px] font-mono text-brand-300 pt-0.5">{t}</span>
                      <span className="text-[14px] text-slate-200">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {[
              { i: UsersIcon, t: 'Clinical & IT specialists', d: 'Talk to people who have implemented hospital systems.' },
              { i: ClockIcon, t: 'Confirmed within one business day', d: 'We will email you a calendar invite.' },
              { i: ShieldCheckIcon, t: 'No commitment', d: 'The session is free, with no obligation.' },
            ].map((x) => (
              <div key={x.t} className="flex gap-3.5 rounded-2xl border border-slate-200 p-5">
                <span className="h-10 w-10 shrink-0 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center"><x.i size={18} /></span>
                <span>
                  <span className="block text-[14.5px] font-semibold text-slate-900">{x.t}</span>
                  <span className="block text-[13.5px] text-slate-500 mt-0.5">{x.d}</span>
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* Form */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_-30px_rgba(7,26,36,0.25)] overflow-hidden">
            <Section n={1} title="About you">
              <Field id="f-fullName" label="Full name" required error={errors.fullName} value={form.fullName} onChange={(v) => setField('fullName', v)} placeholder="Dr. Rajan Kumar" autoComplete="name" />
              <Field id="f-workEmail" label="Work email" required type="email" error={errors.workEmail} value={form.workEmail} onChange={(v) => setField('workEmail', v)} placeholder="rajan@hospital.org" autoComplete="email" />
              <Field id="f-phone" label="Phone number" required type="tel" error={errors.phone} value={form.phone} onChange={(v) => setField('phone', v)} placeholder="+91 98765 43210" autoComplete="tel" />
              <Field id="f-designation" label="Role / designation" value={form.designation} onChange={(v) => setField('designation', v)} placeholder="Medical Director" autoComplete="organization-title" />
            </Section>

            <Section n={2} title="Your hospital">
              <Field id="f-hospitalName" label="Hospital name" required error={errors.hospitalName} value={form.hospitalName} onChange={(v) => setField('hospitalName', v)} placeholder="City General Hospital" autoComplete="organization" />
              <Field id="f-location" label="City / region" value={form.location} onChange={(v) => setField('location', v)} placeholder="Chennai, Tamil Nadu" />
              <div className="sm:col-span-2">
                <Label>Number of beds</Label>
                <div className="flex flex-wrap gap-2">
                  {bedOptions.map((o) => (
                    <Chip key={o} on={form.bedCount === o} onClick={() => setField('bedCount', form.bedCount === o ? '' : o)}>{o}</Chip>
                  ))}
                </div>
              </div>
            </Section>

            <Section n={3} title="What should we focus on?" hint="Choose the version you would like to explore">
              <div className="sm:col-span-2 space-y-4">
                {/* Basic — simple chip */}
                <div className="flex items-center gap-2">
                  <Chip
                    on={form.version === 'Basic version' || form.interests.includes('Basic version')}
                    onClick={() => selectVersion('Basic version')}
                    check
                  >
                    Basic version
                  </Chip>
                  <span className="text-[13px] text-slate-400">Core modules for smaller facilities</span>
                </div>

                {/* Standard & Enterprise — rich cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      opt: 'Standard version',
                      badge: 'Most popular',
                      badgeColor: 'bg-brand-600 text-white',
                      borderActive: 'border-brand-500 ring-2 ring-brand-500/20',
                      borderIdle: 'border-slate-200 hover:border-brand-300',
                      iconBg: 'bg-brand-50 text-brand-600',
                      features: ['All Clinical & Nursing modules', 'Laboratory & Radiology', 'Billing & Payments', 'Patient 360 timeline', 'Standard reports hub'],
                    },
                    {
                      opt: 'Enterprise version',
                      badge: 'Full suite',
                      badgeColor: 'bg-ink-900 text-white',
                      borderActive: 'border-ink-700 ring-2 ring-ink-900/15',
                      borderIdle: 'border-slate-200 hover:border-slate-400',
                      iconBg: 'bg-slate-100 text-slate-700',
                      features: ['Everything in Standard', 'HospAI suite (Voice, OCR, Symptom AI)', 'Insurance & TPA workflow', 'HRMS & credentialing', 'Advanced analytics & NLQ'],
                    },
                  ].map(({ opt, badge, badgeColor, borderActive, borderIdle, iconBg, features }) => {
                    const on = form.version === opt || form.interests.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        aria-pressed={on}
                        onClick={() => selectVersion(opt)}
                        className={`relative text-left rounded-2xl border p-4 transition-all duration-200 ${on ? borderActive + ' bg-white shadow-md' : borderIdle + ' bg-white'}`}
                      >
                        {/* Badge */}
                        <span className={`absolute -top-2.5 left-4 inline-flex items-center h-5 px-2 rounded-full text-[10.5px] font-bold tracking-wide ${badgeColor}`}>
                          {badge}
                        </span>

                        <div className="flex items-center justify-between mt-1">
                          <span className="font-display text-[15px] font-bold text-slate-900">{opt}</span>
                          <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${on ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`}>
                            {on && <CheckIcon size={10} strokeWidth={3} />}
                          </span>
                        </div>

                        <ul className="mt-3 space-y-1.5">
                          {features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-[12.5px] text-slate-600">
                              <span className={`h-4 w-4 rounded flex items-center justify-center shrink-0 ${iconBg}`}>
                                <CheckIcon size={9} strokeWidth={3} />
                              </span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Section>

            <Section n={4} title="Pick a time">
              <div>
                <Label htmlFor="f-preferredDate" required>Preferred date</Label>
                <div className="relative">
                  <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="f-preferredDate"
                    type="date"
                    value={form.preferredDate}
                    min={today}
                    onChange={(e) => setField('preferredDate', e.target.value)}
                    className={inputCls(!!errors.preferredDate) + ' pl-9'}
                  />
                </div>
                {errors.preferredDate && <ErrorText>{errors.preferredDate}</ErrorText>}
              </div>
              <div>
                <Label htmlFor="f-preferredTime" required>Preferred time</Label>
                <select id="f-preferredTime" value={form.preferredTime} onChange={(e) => setField('preferredTime', e.target.value)} className={inputCls(!!errors.preferredTime)}>
                  <option value="">Select a time slot</option>
                  {timeOptions.map((t) => <option key={t}>{t}</option>)}
                </select>
                {errors.preferredTime && <ErrorText>{errors.preferredTime}</ErrorText>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="f-message">Anything we should know?</Label>
                <textarea
                  id="f-message"
                  value={form.message}
                  onChange={(e) => setField('message', e.target.value)}
                  rows={3}
                  placeholder="Current systems, go-live timeline, specific workflows you want to see…"
                  className={inputCls(false) + ' h-auto py-2.5 resize-none'}
                />
              </div>
            </Section>

            <div className="px-6 sm:px-8 py-6 bg-slate-50 border-t border-slate-200 flex flex-col gap-4">
              {submitError && (
                <div className="w-full">
                  <ErrorText>{submitError}</ErrorText>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <p className="flex-1 text-[13px] text-slate-500 leading-relaxed">
                  By submitting, you agree to our <Link to="/privacy" className="text-brand-600 font-medium hover:underline">Privacy Policy</Link> and{' '}
                  <Link to="/terms" className="text-brand-600 font-medium hover:underline">Terms of Service</Link>. Please don't include patient information.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg bg-brand-600 text-white text-[15px] font-semibold shadow-lg shadow-brand-600/25 hover:bg-brand-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Sending request…
                    </>
                  ) : (
                    <>Request my demo <ArrowRightIcon size={16} /></>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}

/* ── Form building blocks ───────────────────────────────────── */

const inputCls = (err: boolean) =>
  `w-full h-11 rounded-lg border px-3 text-[14.5px] text-slate-800 placeholder-slate-400 outline-none transition-colors focus:ring-4 focus:ring-brand-500/15 ${
    err ? 'border-red-300 bg-red-50/60 focus:border-red-400' : 'border-slate-200 bg-white focus:border-brand-500'
  }`;

function Section({ n, title, hint, children }: { n: number; title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="px-6 sm:px-8 py-7 border-b border-slate-100 last:border-0">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center gap-3 mb-5">
        <span className="h-7 w-7 rounded-full bg-ink-900 text-white text-[12px] font-bold flex items-center justify-center">{n}</span>
        <span className="font-display text-[17px] font-bold text-slate-900">{title}</span>
        {hint && <span className="text-[13px] text-slate-400">{hint}</span>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </fieldset>
  );
}

function Label({ children, htmlFor, required }: { children: ReactNode; htmlFor?: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-[13px] font-medium text-slate-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function ErrorText({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-[12.5px] text-red-600">{children}</p>;
}

function Chip({ on, onClick, children, check }: { on: boolean; onClick: () => void; children: ReactNode; check?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border text-[13.5px] font-medium transition-all ${
        on ? 'border-brand-600 bg-brand-600 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50'
      }`}
    >
      {check && on && <CheckIcon size={13} strokeWidth={3} />}
      {children}
    </button>
  );
}

function Field({
  id, label, value, onChange, error, required, type = 'text', placeholder, autoComplete,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void; error?: string; required?: boolean; type?: string; placeholder?: string; autoComplete?: string;
}) {
  return (
    <div>
      <Label htmlFor={id} required={required}>{label}</Label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={inputCls(!!error)}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}
