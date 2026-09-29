const items = [
  ['Telugu', 'Voice AI'],
  ['हिन्दी', 'Voice AI'],
  ['தமிழ்', 'Voice AI'],
  ['ಕನ್ನಡ', 'Voice AI'],
  ['English', 'Voice AI'],
  ['UPI', 'Payments'],
  ['Cards', 'Payments'],
  ['NetBanking', 'Payments'],
  ['Insurance & TPA', 'Claims'],
  ['DICOM PACS', 'Imaging'],
  ['Smart document reading', 'AI'],
  ['Offline-ready', 'Sync'],
];

export default function ProductStrip() {
  const row = [...items, ...items];
  return (
    <section className="border-y border-slate-200/70 bg-slate-50/70 py-9">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-6">
          Built for the way Indian hospitals work
        </p>
        <div className="relative overflow-hidden mask-fade-x">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {row.map(([name, kind], i) => (
              <div key={i} className="flex items-center gap-2.5 px-7 border-r border-slate-200 last:border-0" aria-hidden={i >= items.length}>
                <span className="font-display text-[17px] font-bold text-slate-700 whitespace-nowrap">{name}</span>
                <span className="text-[12px] text-slate-400 whitespace-nowrap">{kind}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
