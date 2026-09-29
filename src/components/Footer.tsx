import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Navbar';
import { scrollToId } from './ui';

const cols: { title: string; links: [string, string][] }[] = [
  { title: 'Platform', links: [['Live dashboard', '#dashboard'], ['All modules', '#modules'], ['Doctor Portal', '#doctor'], ['Departments', '#departments'], ['Pharmacy', '#pharmacy'], ['Billing & TPA', '#revenue'], ['AI Intelligence Hub', '#ai'], ['HospAI mobile', '#mobile'], ['Workflows', '#workflow'], ['Architecture', '#architecture'], ['Analytics', '#analytics']] },
  { title: 'Modules', links: [['Emergency', '#modules'], ['Doctor Workspace', '#modules'], ['Nurse Station', '#modules'], ['Surgery', '#modules'], ['Insurance', '#modules'], ['Pharmacy', '#modules']] },
  { title: 'Teams', links: [['Physicians', '#teams'], ['Nurses', '#teams'], ['Surgical teams', '#teams'], ['Finance', '#teams']] },
  { title: 'Company', links: [['Security', '#security'], ['Implementation', '#implementation'], ['FAQ', '#faq'], ['Book a demo', '/book-demo']] },
];

const legal: [string, string][] = [['Privacy', '/privacy'], ['Terms', '/terms'], ['Accessibility', '/accessibility']];

export default function Footer() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onHome = pathname === '/';

  // Section links scroll in place on the home page and navigate there from other pages.
  const go = (href: string) => {
    if (href.startsWith('#')) {
      if (onHome) scrollToId(href);
      else navigate(`/${href}`);
    }
  };

  return (
    <footer className="bg-ink-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 pb-12 border-b border-white/10">
          <div className="col-span-2">
            <Logo dark />
            <p className="mt-4 text-[14px] leading-relaxed max-w-xs">
              The operating system for modern hospitals: clinical, operational and financial workflows on one connected platform, on web and mobile.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[12px]">
              <span className="relative flex h-2 w-2"><span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping-slow" /><span className="relative h-2 w-2 rounded-full bg-emerald-400" /></span>
              All systems operational
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-300 mb-4">{c.title}</div>
              <ul className="space-y-2.5">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith('/') ? (
                      <Link to={href} className="text-[14px] hover:text-white transition-colors">{label}</Link>
                    ) : (
                      <button onClick={() => go(href)} className="text-[14px] hover:text-white transition-colors text-left">{label}</button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-[13px]">
          <div>© {new Date().getFullYear()} HospAI. All rights reserved.</div>
          <nav className="flex gap-6" aria-label="Legal">
            {legal.map(([l, to]) => (
              <Link key={to} to={to} className="hover:text-white transition-colors">{l}</Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
