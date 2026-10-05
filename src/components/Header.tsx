"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

const COMPRENDRE = [
  { href: "/assurance-de-pret", label: "Assurance de prêt" },
  { href: "/affacturage", label: "Affacturage" },
  { href: "/solvabilite", label: "Solvabilité" },
  { href: "/securite-wallet", label: "Sécurité wallet" },
  { href: "/glossaire", label: "Glossaire" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy/90 backdrop-blur border-b border-navy-border">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold gold-text">AssureCrypto</span>
          <span className="text-xs text-gray-400 hidden sm:inline">· Assurance de prêt crypto</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/comment-ca-marche" className="hover:text-gold-light transition">Comment ça marche</Link>
          <div className="relative">
            <button onClick={() => setOpen(!open)} className="flex items-center gap-1 hover:text-gold-light transition">
              Comprendre <ChevronDown size={14} />
            </button>
            {open && (
              <div className="absolute left-0 mt-2 w-56 rounded-xl bg-navy-light border border-navy-border p-2 shadow-xl">
                {COMPRENDRE.map((i) => (
                  <Link key={i.href} href={i.href} onClick={() => setOpen(false)}
                    className="block px-3 py-2 rounded-lg hover:bg-navy-border transition">
                    {i.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/tarifs" className="hover:text-gold-light transition">Tarifs</Link>
          <Link href="/faq" className="hover:text-gold-light transition">FAQ</Link>
          <Link href="/souscrire" className="btn-gold px-4 py-2 rounded-lg font-semibold text-sm">
            Vérifier ma solvabilité
          </Link>
        </nav>

        <button className="md:hidden text-gold-light" onClick={() => setMobile(!mobile)}>
          {mobile ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobile && (
        <nav className="md:hidden px-4 pb-4 space-y-2 text-sm">
          <Link href="/comment-ca-marche" className="block py-2 border-b border-navy-border">Comment ça marche</Link>
          {COMPRENDRE.map((i) => (
            <Link key={i.href} href={i.href} onClick={() => setMobile(false)} className="block py-2 border-b border-navy-border">
              {i.label}
            </Link>
          ))}
          <Link href="/tarifs" className="block py-2 border-b border-navy-border">Tarifs</Link>
          <Link href="/faq" className="block py-2 border-b border-navy-border">FAQ</Link>
          <Link href="/souscrire" onClick={() => setMobile(false)} className="block py-2 btn-gold rounded-lg text-center font-semibold">
            Vérifier ma solvabilité
          </Link>
        </nav>
      )}
    </header>
  );
}
