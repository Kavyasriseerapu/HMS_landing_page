import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import PageLayout from '../components/PageLayout';

type Doc = { title: string; intro: string; sections: { h: string; p: string[] }[] };

const UPDATED = 'September 29, 2026';

export const legalDocs: Record<'privacy' | 'terms' | 'accessibility', Doc> = {
  privacy: {
    title: 'Privacy Policy',
    intro:
      'This policy explains what information we collect through this website, how we use it, and the choices you have. It covers the marketing website only. Patient data processed inside the HospAI platform is governed by the agreement with each hospital customer.',
    sections: [
      {
        h: 'Information we collect',
        p: [
          'When you request a demo, we collect the details you enter in the form: your name, work email, phone number, designation, hospital name, location, bed count, areas of interest, preferred schedule and any message you add.',
          'We also collect basic technical information that browsers send automatically, such as device type, browser version and pages visited, to keep the site secure and working.',
        ],
      },
      {
        h: 'How we use information',
        p: [
          'We use demo request details to contact you, schedule and tailor the demonstration, and follow up on your enquiry.',
          'We use technical information to operate, secure and improve the website. We do not sell personal information.',
        ],
      },
      {
        h: 'Patient health information',
        p: [
          'Please do not submit patient health information through this website. The demo on this site uses fictional sample data only.',
          'Protected health information processed in the HospAI platform is handled under a separate agreement with each customer, including any required business associate or data processing terms.',
        ],
      },
      {
        h: 'Retention and security',
        p: [
          'We keep demo request details only as long as needed for the purposes above or as required by law, and protect them with administrative, technical and physical safeguards.',
        ],
      },
      {
        h: 'Your choices',
        p: [
          'You can ask us to access, correct or delete the personal information you submitted, or to stop contacting you, by reaching out to our team.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: 'These terms govern your use of this website and the interactive product demo. Use of the HospAI platform itself is governed by a separate customer agreement.',
    sections: [
      {
        h: 'Use of the website',
        p: [
          'You may use this website to learn about HospAI and to request a demonstration. You agree not to misuse the site, interfere with its operation, or attempt to access it by automated means beyond normal browsing.',
        ],
      },
      {
        h: 'Interactive demo',
        p: [
          'The product preview on this site is for illustration. All patients, staff, figures and events shown are fictional sample data, and actions performed in the preview are not saved.',
          'The preview is not a medical device and must not be used for clinical decision-making. The product design and workflows shown are protected by copyright.',
        ],
      },
      {
        h: 'Intellectual property',
        p: ['The website, its content and the HospAI name and marks belong to us or our licensors. You may not copy or redistribute them without permission.'],
      },
      {
        h: 'Disclaimer',
        p: [
          'The website is provided "as is". Feature descriptions are general and may vary by edition, configuration and deployment. The terms of your customer agreement take precedence.',
        ],
      },
      {
        h: 'Changes',
        p: ['We may update these terms from time to time. The date at the top of this page shows when they last changed.'],
      },
    ],
  },
  accessibility: {
    title: 'Accessibility Statement',
    intro: 'We want everyone, including clinicians and staff who use assistive technology, to be able to use this website and the HospAI platform.',
    sections: [
      {
        h: 'Our approach',
        p: [
          'This website is designed to follow the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA. That includes sufficient colour contrast, keyboard access to interactive elements, and text alternatives for meaningful graphics.',
          'Animations respect your system "reduce motion" setting, and colour is never the only way information is conveyed. Status indicators always carry a text label.',
        ],
      },
      {
        h: 'Known limitations',
        p: [
          'The interactive product preview is a scaled visual demonstration. On small screens its text is reduced in size. The same content is described in text elsewhere on the page.',
        ],
      },
      {
        h: 'Feedback',
        p: ['If you run into a barrier on this site, please let our team know through the demo request form, and tell us the page and the assistive technology you use.'],
      },
    ],
  },
};

export default function Legal({ doc }: { doc: keyof typeof legalDocs }) {
  const d = legalDocs[doc];
  useEffect(() => {
    document.title = `${d.title} · HospAI`;
  }, [d.title]);

  return (
    <PageLayout>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20">
          <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-600">Legal</div>
          <h1 className="mt-3 font-display text-[36px] sm:text-[48px] font-extrabold text-slate-900 tracking-tight">{d.title}</h1>
          <p className="mt-3 text-[14px] text-slate-500">Last updated {UPDATED}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-3">
          <nav className="lg:sticky lg:top-24 flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
            {(Object.keys(legalDocs) as (keyof typeof legalDocs)[]).map((k) => (
              <NavLink
                key={k}
                to={`/${k}`}
                className={({ isActive }) =>
                  `shrink-0 px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
                }
              >
                {legalDocs[k].title}
              </NavLink>
            ))}
            <div className="hidden lg:block mt-6 pt-6 border-t border-slate-200">
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-2">On this page</div>
              {d.sections.map((s, i) => (
                <a key={s.h} href={`#s${i}`} className="block py-1.5 text-[13.5px] text-slate-500 hover:text-slate-900">{s.h}</a>
              ))}
            </div>
          </nav>
        </aside>

        <article className="lg:col-span-8 lg:col-start-5 max-w-3xl">
          <p className="text-[17px] text-slate-700 leading-relaxed">{d.intro}</p>
          {d.sections.map((s, i) => (
            <section key={s.h} id={`s${i}`} className="mt-10 scroll-mt-24">
              <h2 className="font-display text-[22px] font-bold text-slate-900">{s.h}</h2>
              {s.p.map((para) => (
                <p key={para} className="mt-3 text-[15.5px] text-slate-600 leading-relaxed">{para}</p>
              ))}
            </section>
          ))}
          <div className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="font-semibold text-slate-900">Questions about this page?</div>
            <p className="mt-1 text-[14.5px] text-slate-600">
              Reach our team through the <Link to="/book-demo" className="text-brand-600 font-medium hover:underline">demo request form</Link> and mention your question in the message field.
            </p>
          </div>
        </article>
      </div>
    </PageLayout>
  );
}
