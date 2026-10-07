export default function ProbBar({ h, d, a, labels = ['1', 'N', '2'] }: { h: number; d: number; a: number; labels?: string[] }) {
  const max = Math.max(h, d, a);
  const seg = [
    { v: h, l: labels[0], c: 'bg-brand-500' },
    { v: d, l: labels[1], c: 'bg-stone-400 dark:bg-stone-500' },
    { v: a, l: labels[2], c: 'bg-sky-500' },
  ];
  return (
    <div>
      <div className="flex h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-ink-700">
        {seg.map((s) => <div key={s.l} className={s.c} style={{ width: `${s.v}%` }} />)}
      </div>
      <div className="mt-1.5 grid grid-cols-3 text-xs">
        {seg.map((s, i) => (
          <span key={s.l} className={`num ${i === 1 ? 'text-center' : i === 2 ? 'text-right' : ''} ${s.v === max ? 'font-bold' : 'text-stone-500 dark:text-stone-400'}`}>
            {s.l} · {s.v}%
          </span>
        ))}
      </div>
    </div>
  );
}
