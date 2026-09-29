import { useState } from 'react';
import {
  BuildingIcon, CardIcon, ClockIcon, FlaskIcon, PillIcon, ScalpelIcon, SettingsIcon, StethoscopeIcon, UserIcon,
  HeartPulseIcon, CheckIcon, ArrowRightIcon, type IconType,
} from './icons';
import { Link } from 'react-router-dom';
import { Reveal, SectionHeading } from './ui';

const roles: { role: string; icon: IconType; homeLabel: string; does: string[] }[] = [
  { role: 'Doctors', icon: StethoscopeIcon, homeLabel: 'Doctor Portal', does: ['Patient inbox with first-visit / revisit history', 'Voice SOAP notes in 5 languages', 'Digital Rx with split dispatch to pharmacy & lab'] },
  { role: 'Nurses', icon: ClockIcon, homeLabel: 'Nursing Portal', does: ['Bedside vitals and fluid balance', 'Medication administration records', 'Shift handovers and doctor orders'] },
  { role: 'ICU teams', icon: HeartPulseIcon, homeLabel: 'ICU Flowsheet', does: ['7-tab digital ICU chart', 'Ventilator, infusions and I/O balance', 'GCS, RASS, lines and airway tracking'] },
  { role: 'Reception', icon: UserIcon, homeLabel: 'Registration desk', does: ['UHID / MRN registration', 'Fuzzy patient search', 'Lab payment collection before testing'] },
  { role: 'Surgical teams', icon: ScalpelIcon, homeLabel: 'Surgery & OT', does: ['OT room scheduling', 'Surgical team and PAC clearance', 'Intra-op notes and PACU recovery'] },
  { role: 'Pharmacists', icon: PillIcon, homeLabel: 'Dispensary', does: ['Verify prescriptions before dispensing', 'Stock ledger, PO and GRN', 'Returns and expiry tracking'] },
  { role: 'Lab & radiology', icon: FlaskIcon, homeLabel: 'Diagnostics worklists', does: ['Barcoded samples and result entry', 'Pathologist approval and panic flags', 'PACS-linked structured imaging reports'] },
  { role: 'Billing & TPA', icon: CardIcon, homeLabel: 'Billing & claims desk', does: ['Cash, card, UPI and NetBanking', 'Pre-auth, claim dossiers and appeals', 'ERA settlement and co-pay collection'] },
  { role: 'Management', icon: BuildingIcon, homeLabel: 'Executive dashboard', does: ['Live occupancy and revenue', 'OP, IP, ER and financial reports', 'Doctor earnings and payouts'] },
  { role: 'HR & admin', icon: SettingsIcon, homeLabel: 'HRMS & access control', does: ['Rosters, leave and attendance', 'Role-based access across 60+ modules', 'Append-only audit trail'] },
];

export default function HospitalTeams() {
  const [sel, setSel] = useState(0);
  const r = roles[sel];

  return (
    <section id="teams" className="py-20 sm:py-28 bg-slate-50 border-y border-slate-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Role-based workspaces"
            title="Every team gets a home screen built for its job."
            desc="Staff sign in and land on the workspace for their role, with the permissions to match. Nobody has to dig through menus built for someone else."
          />
        </Reveal>

        <Reveal className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {roles.map((x, i) => (
              <button
                key={x.role}
                onClick={() => setSel(i)}
                className={`flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  sel === i ? 'bg-white border-brand-500 ring-4 ring-brand-500/10 shadow-sm' : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <span className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${sel === i ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <x.icon size={17} />
                </span>
                <span className="text-[13.5px] font-semibold text-slate-900 leading-tight">{x.role}</span>
              </button>
            ))}
          </div>

          <div key={sel} className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-7 animate-fade-in flex flex-col">
            <div className="flex items-center gap-3">
              <span className="h-11 w-11 rounded-xl bg-brand-600 text-white flex items-center justify-center"><r.icon size={20} /></span>
              <div>
                <div className="font-display text-[20px] font-bold text-slate-900">{r.role}</div>
                <div className="text-[13px] text-slate-500">Home screen: <span className="font-medium text-slate-700">{r.homeLabel}</span></div>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {r.does.map((d) => (
                <li key={d} className="flex items-start gap-3 text-[15px] text-slate-700">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckIcon size={12} strokeWidth={3} /></span>
                  {d}
                </li>
              ))}
            </ul>
            <Link to="/book-demo" className="mt-auto pt-7 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-600 hover:text-brand-700 self-start">
              See this workspace in a demo <ArrowRightIcon size={14} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
