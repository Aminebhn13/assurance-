const PALETTE = ['#f97d07', '#2563eb', '#16a34a', '#dc2626', '#9333ea', '#0891b2', '#ca8a04', '#db2777'];

export default function TeamBadge({ name, logo, size = 36 }: { name: string; logo?: string | null; size?: number }) {
  if (logo) return <img src={logo} alt="" width={size} height={size} className="shrink-0 object-contain" loading="lazy" />;
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const initials = name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold text-white"
      style={{ width: size, height: size, background: PALETTE[hash % PALETTE.length] }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
