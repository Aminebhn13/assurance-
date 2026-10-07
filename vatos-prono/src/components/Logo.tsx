export default function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
        <rect width="64" height="64" rx="14" fill="#f97d07" />
        <path d="M14 16h9l9 22 9-22h9L37 48h-10z" fill="#0b0b0f" />
      </svg>
      <span className="h-display text-2xl">Vatos<span className="text-brand-500"> Prono</span></span>
    </span>
  );
}
