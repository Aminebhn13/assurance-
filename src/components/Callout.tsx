import { ReactNode } from "react";

type Variant = "info" | "warn" | "danger" | "success";

const styles: Record<Variant, string> = {
  info: "border-brand-light/40 bg-brand-light/5",
  warn: "border-gold/40 bg-gold/5",
  danger: "border-red-500/40 bg-red-500/5",
  success: "border-emerald-500/40 bg-emerald-500/5",
};

export default function Callout({ variant = "info", title, children }: {
  variant?: Variant; title?: string; children: ReactNode;
}) {
  return (
    <div className={`rounded-xl border p-4 my-6 ${styles[variant]}`}>
      {title && <p className="font-semibold mb-1 text-gold-light">{title}</p>}
      <div className="text-sm text-gray-200 leading-relaxed">{children}</div>
    </div>
  );
}
