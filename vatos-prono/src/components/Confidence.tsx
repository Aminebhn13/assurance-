export default function Confidence({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`h-2.5 w-1.5 rounded-sm ${i <= value ? 'bg-brand-500' : 'bg-stone-300 dark:bg-ink-700'}`} />
      ))}
    </span>
  );
}
