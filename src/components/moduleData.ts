import {
  ActivityIcon, BedIcon, BodyIcon, BriefcaseIcon, BrainIcon, CalendarIcon, CardIcon, ClipboardIcon, ClockIcon, EyeIcon, FileTextIcon,
  FlaskIcon, GridIcon, HeartPulseIcon, MicIcon, PillIcon, ScalpelIcon, ScanIcon, SearchIcon, SettingsIcon, ShieldIcon,
  SparkIcon, SplitIcon, StarIcon, StethoscopeIcon, TargetIcon, TrendIcon, UserIcon, type IconType,
} from './icons';

/**
 * Module catalogue for the marketing site.
 * Independent of the demo code in ./dashboard.
 */
export type ModuleInfo = { key: string; label: string; icon: IconType; desc: string; features: string[] };
export type ModuleGroup = { key: string; title: string; blurb: string; icon: IconType; items: ModuleInfo[] };

export const moduleGroups: ModuleGroup[] = [
  {
    key: 'clinical',
    title: 'Clinical care',
    blurb: 'Outpatient, emergency and inpatient care streams, from the first consult to discharge.',
    icon: ActivityIcon,
    items: [
      { key: 'doctor', label: 'Doctor Portal', icon: StethoscopeIcon, desc: 'A 4-step consultation: patient inbox, voice-to-SOAP notes, digital prescription and split dispatch.', features: ['Voice SOAP notes', 'Digital Rx', 'Split dispatch'] },
      { key: 'live', label: 'Live Clinic Board', icon: ClockIcon, desc: 'Real-time waiting count, consult timers, per-patient wait and actionable alerts.', features: ['Wait timers', 'Critical lab alerts', 'Queue pulse'] },
      { key: 'er', label: 'Emergency & Triage', icon: StarIcon, desc: 'ESI 1–5 triage, rapid registration, trauma bay allocation and fast-track orders.', features: ['ESI 1–5', 'Trauma bays', 'ICU / OT transfer'] },
      { key: 'ip', label: 'Inpatient & Beds', icon: BedIcon, desc: 'Admissions and a live ward bed map across General, Private, ICU and Isolation.', features: ['Bed map', 'Admissions', 'Transfers'] },
      { key: 'nursing', label: 'Nursing Portal', icon: HeartPulseIcon, desc: 'Bedside vitals, medication administration, fluid balance and shift handovers.', features: ['MAR', 'Fluid balance', 'Handovers'] },
      { key: 'icu', label: 'ICU Flowsheet', icon: ActivityIcon, desc: 'A 7-tab digital ICU chart replacing paper, from hemodynamics to lines and airway.', features: ['7 tabs', 'Ventilator', 'Infusions'] },
      { key: 'ot', label: 'Surgery & OT', icon: ScalpelIcon, desc: 'Theatre scheduling, surgical team set-up, PAC clearance, intra-op notes and PACU.', features: ['OT scheduling', 'PAC clearance', 'PACU'] },
      { key: 'discharge', label: 'Discharge', icon: ClipboardIcon, desc: 'Multi-step clearance: summary, medicine reconciliation, billing and room vacate.', features: ['Summary', 'Med reconciliation', 'Billing clearance'] },
    ],
  },
  {
    key: 'access',
    title: 'Patient access & diagnostics',
    blurb: 'Registration, the patient record, and the lab, imaging and pharmacy services behind care.',
    icon: FlaskIcon,
    items: [
      { key: 'reg', label: 'Registration & UHID', icon: UserIcon, desc: 'Patient Master Index with a unique UHID / MRN and fuzzy search by name, ID or phone.', features: ['UHID / MRN', 'Fuzzy search', 'Insurance intake'] },
      { key: 'emr', label: 'Unified EMR & Chart', icon: FileTextIcon, desc: 'One longitudinal timeline across OP, ER, IP, ICU, labs, imaging and prescriptions.', features: ['Timeline', 'Vitals history', 'Patient journey'] },
      { key: 'appointments', label: 'Appointments', icon: CalendarIcon, desc: 'Outpatient scheduling and queues that feed straight into the doctor’s inbox.', features: ['Scheduling', 'Queues', 'First visit / revisit'] },
      { key: 'lab', label: 'Laboratory', icon: FlaskIcon, desc: 'Pay-first lab billing, sample tracking, result entry, pathologist approval and panic values.', features: ['Two-step billing', 'Barcodes', 'Panic alerts'] },
      { key: 'radiology', label: 'Radiology & PACS', icon: TargetIcon, desc: 'X-Ray, CT, MRI, ultrasound and PET orders, PACS links and structured reports.', features: ['DICOM PACS', 'Structured reports', 'Critical findings'] },
      { key: 'pharmacy', label: 'Pharmacy & Dispensary', icon: PillIcon, desc: 'Verification queue, stock ledger, purchase orders, GRN, returns and expiry tracking.', features: ['Verification', 'PO & GRN', 'Expiry alerts'] },
      { key: 'patient360', label: 'Patient 360', icon: EyeIcon, desc: 'A single, chronological view of every patient interaction — visits, vitals, labs, imaging, prescriptions, billing and clinical notes across all departments.', features: ['Full timeline', 'Cross-dept view', 'Instant context'] },
    ],
  },
  {
    key: 'revenue',
    title: 'Revenue & administration',
    blurb: 'Billing, insurance, people and control, with reports across every department.',
    icon: CardIcon,
    items: [
      { key: 'dashboard', label: 'Executive Dashboard', icon: GridIcon, desc: 'Live occupancy, daily revenue, ER census, doctor attendance and wait-time trends.', features: ['Occupancy', 'Revenue', 'ER census'] },
      { key: 'billing', label: 'Billing & Payments', icon: CardIcon, desc: 'One charge engine with Cash, Card, UPI, NetBanking and insurance, plus cashier reconciliation.', features: ['UPI & cards', 'Itemized receipts', 'Daily reconciliation'] },
      { key: 'insurance', label: 'Insurance & TPA', icon: ShieldIcon, desc: 'Eligibility, pre-auth, enhancements, claim dossiers, appeals and ERA settlement.', features: ['Pre-auth', 'Claim dossier', 'Appeals'] },
      { key: 'hrms', label: 'HRMS & Staffing', icon: BriefcaseIcon, desc: 'Staff directory, shift rosters, doctor scheduling, leave, attendance and credentialing.', features: ['Rosters', 'Attendance', 'Credentialing'] },
      { key: 'reports', label: 'Reports & Analytics', icon: TrendIcon, desc: 'OP, IP, ER, pharmacy, diagnostic and financial reports from one reports hub.', features: ['OP / IP / ER', 'TAT metrics', 'Revenue split'] },
      { key: 'admin', label: 'Admin & Access Control', icon: SettingsIcon, desc: 'Role-based access across 60+ modules with an append-only audit trail.', features: ['8 roles', 'Audit trail', 'Permissions'] },
    ],
  },
  {
    key: 'ai',
    title: 'Hosp AI suite',
    blurb: 'AI woven into care and administration, with clinicians reviewing every output.',
    icon: SparkIcon,
    items: [
      { key: 'voice', label: 'Voice SOAP Notes', icon: MicIcon, desc: 'Hands-free transcription in Telugu, Hindi, Tamil, Kannada and English, with doctor/patient speaker detection.', features: ['5 languages', 'Speaker detection', 'SOAP output'] },
      { key: 'split', label: 'Prescription Split', icon: SplitIcon, desc: 'Reads a prescription and sends medicines to the pharmacy and tests to lab billing.', features: ['Reads handwriting', 'Pharmacy dispatch', 'Lab dispatch'] },
      { key: 'ocr', label: 'Keppler OCR', icon: ScanIcon, desc: 'Reads handwritten sheets and scanned reports, summarises long documents and answers questions about them.', features: ['Reads handwriting', 'Summaries', 'Ask the document'] },
      { key: 'search', label: 'Clinical Search', icon: BrainIcon, desc: 'Ask questions and get answers from patient records, drug information and hospital protocols.', features: ['Ask in plain words', 'Protocols', 'Drug information'] },
      { key: 'symptom', label: 'Symptom AI', icon: BodyIcon, desc: 'Analyses patient complaints to suggest differential diagnoses and the right specialist.', features: ['Body map', 'Differentials', 'Specialist match'] },
      { key: 'summary', label: 'Clinical Summaries', icon: FileTextIcon, desc: 'Concise discharge summaries and encounter notes drafted from long patient histories.', features: ['Discharge', 'Encounter notes', 'Sign-off'] },
      { key: 'nlq', label: 'NL Filtering & Bulk AI', icon: SearchIcon, desc: 'Ask the database in plain language, and import patient spreadsheets with AI column mapping.', features: ['Plain English', 'Bulk import', 'Cohorts'] },
    ],
  },
];

export const aiModules = moduleGroups.find((g) => g.key === 'ai')!.items;
export const moduleCount = moduleGroups.reduce((n, g) => n + g.items.length, 0);

/** Scroll to the live ED dashboard in the hero. */
export const showDashboard = () => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth', block: 'center' });

