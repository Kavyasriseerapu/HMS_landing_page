import { useState } from 'react';
import { Reveal, SectionHeading } from './ui';
import { CloudIcon, DatabaseIcon, LinkIcon, RefreshIcon } from './icons';

const nodes = [
  { id: 'ER', name: 'Emergency', flow: 'Triage, orders and admit requests' },
  { id: 'IP', name: 'Inpatient', flow: 'Bed status, transfers, discharges' },
  { id: 'ICU', name: 'Critical Care', flow: 'Vitals, NEWS2 scores, device data' },
  { id: 'OT', name: 'Surgery', flow: 'Case bookings, implants, anesthesia records' },
  { id: 'LAB', name: 'Laboratory', flow: 'Pay-first orders in, approved results out' },
  { id: 'RAD', name: 'Radiology', flow: 'Imaging orders, DICOM reports' },
  { id: 'RX', name: 'Pharmacy', flow: 'Verified orders, dispense, eMAR' },
  { id: 'BIL', name: 'Billing', flow: 'Charges captured from every step' },
  { id: 'OPD', name: 'Outpatient', flow: 'Appointments, queues, referrals' },
  { id: 'ADM', name: 'Admin', flow: 'Users, roles, audit trail' },
];

const C = 260;
const R = 190;

export default function ConnectedHospital() {
  const [hover, setHover] = useState<number | null>(null);
  const pos = nodes.map((_, i) => {
    const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
    return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
  });

  return (
    <section id="architecture" className="relative py-20 sm:py-28 bg-ink-900 overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark mask-fade-b pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-[radial-gradient(closest-side,rgba(217,54,84,0.22),transparent)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        <Reveal>
          <SectionHeading
            dark
            eyebrow="Architecture"
            title="Grows with your hospital, and keeps working offline."
            desc="Every department works on its own screens but shares one patient record, so information moves with the patient. If the internet drops, work carries on and catches up automatically when the connection returns."
          />
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {[
              { i: DatabaseIcon, t: 'One shared patient record', d: 'Reception, doctors, nurses, lab, pharmacy and billing all see the same up-to-date information.' },
              { i: RefreshIcon, t: 'Instant multi-tab sync', d: 'A change in one tab or department appears everywhere else immediately.' },
              { i: LinkIcon, t: 'Keeps working offline', d: 'Staff keep working through network drops, and everything syncs as soon as the connection is back.' },
              { i: CloudIcon, t: 'Built-in document AI', d: 'Read scanned reports and handwritten notes right inside HospAI, with no extra logins.' },
            ].map((f) => (
              <div key={f.t} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition-colors">
                <f.i size={18} className="text-brand-300" />
                <div className="mt-3 text-[15px] font-semibold text-white">{f.t}</div>
                <div className="mt-1 text-[13.5px] text-slate-400 leading-relaxed">{f.d}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto w-full max-w-[520px]">
            <svg viewBox="0 0 520 520" className="w-full h-auto" role="img" aria-label="HospAI core connected to ten hospital modules">
              <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(255,255,255,0.06)" />
              <circle cx={C} cy={C} r={R - 70} fill="none" stroke="rgba(255,255,255,0.04)" />
              {pos.map((p, i) => (
                <line
                  key={i}
                  x1={C} y1={C} x2={p.x} y2={p.y}
                  stroke={hover === i ? '#ff8a9b' : 'rgba(255,138,155,0.35)'}
                  strokeWidth={hover === i ? 2 : 1.25}
                  strokeDasharray="4 6"
                  className="animate-dash-flow"
                  style={{ animationDuration: `${1 + (i % 3) * 0.3}s` }}
                />
              ))}
              {/* Core */}
              <circle cx={C} cy={C} r="68" fill="rgba(217,54,84,0.12)" />
              <circle cx={C} cy={C} r="52" fill="#d93654" />
              <text x={C} y={C - 4} textAnchor="middle" fill="white" fontSize="18" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">HospAI</text>
              <text x={C} y={C + 14} textAnchor="middle" fill="#ffd1d5" fontSize="9.5" fontWeight="600" letterSpacing="1.2">DATA CORE</text>
              {/* Nodes */}
              {pos.map((p, i) => (
                <g key={nodes[i].id} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="hub-node cursor-pointer" style={{ transitionDelay: `${300 + i * 80}ms` }}>
                  <circle cx={p.x} cy={p.y} r="34" fill="transparent" />
                  <circle cx={p.x} cy={p.y} r="27" fill={hover === i ? '#7a1a2c' : '#392f5a'} stroke={hover === i ? '#ff8a9b' : 'rgba(255,255,255,0.14)'} strokeWidth="1.5" />
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fill="white" fontSize="11.5" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
                    {nodes[i].id}
                  </text>
                </g>
              ))}
            </svg>
            <div className="mt-4 h-16 rounded-xl border border-white/10 bg-white/[0.03] px-5 flex items-center">
              {hover === null ? (
                <span className="text-[13.5px] text-slate-400">Hover a module to see what it exchanges with the core.</span>
              ) : (
                <span className="text-[14px]">
                  <span className="font-semibold text-white">{nodes[hover].name}</span>
                  <span className="text-slate-400"> · {nodes[hover].flow}</span>
                </span>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
