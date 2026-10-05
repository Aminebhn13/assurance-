"use client";
import { useEffect, useState } from "react";

interface TocItem { id: string; label: string; }

export default function TOC({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="glass rounded-xl p-4 mb-8">
      <p className="text-sm font-semibold text-gold-light mb-2">Sommaire</p>
      <ul className="space-y-1 text-sm">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className={`block px-2 py-1 rounded hover:text-gold-light transition ${
                active === i.id ? "text-gold-light bg-gold/10" : "text-gray-300"
              }`}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
