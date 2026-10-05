"use client";

import { Check, ShieldCheck } from "lucide-react";

const tiers = [
  {
    name: "Sécurisé",
    ratio: "80 – 99%",
    advance: "60 – 75%",
    premium: "3.5 – 5% / an",
    color: "#f5b942",
    features: ["Couverture du défaut", "Suivi on-chain", "Support standard"],
  },
  {
    name: "Optimisé",
    ratio: "100 – 119%",
    advance: "85%",
    premium: "2.5% / an",
    color: "#4f8cff",
    popular: true,
    features: ["Tout Sécurisé", "Avance majorée", "Déclenchement auto", "Support prioritaire"],
  },
  {
    name: "Premium",
    ratio: "120% +",
    advance: "90 – 95%",
    premium: "1.2 – 1.8% / an",
    color: "#22c55e",
    features: ["Tout Optimisé", "Avance maximale", "Réassurance de rang 1", "Conciergerie dédiée"],
  },
];

export default function PricingTable() {
  return (
    <section id="tarifs" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/30 text-accent-gold text-sm font-medium mb-4">
          <ShieldCheck size={14} /> Grille tarifaire
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Des taux <span className="text-gradient-gold">dégressifs</span> selon ta garantie
        </h2>
        <p className="text-gray-400 text-lg">Plus ton ratio de couverture est élevé, plus ton taux d'avance est favorable et ta prime est faible.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {tiers.map((t, i) => (
          <div
            key={i}
            className={`relative rounded-3xl p-8 transition-all ${
              t.popular
                ? "gradient-border bg-dark-800 shadow-glow-purple scale-[1.03] z-10"
                : "glass hover:border-dark-500"
            }`}
          >
            {t.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue text-xs font-bold text-white">
                Le plus choisi
              </span>
            )}
            <h3 className="text-xl font-bold text-white mb-1">{t.name}</h3>
            <p className="text-sm text-gray-400 mb-6">Ratio de couverture : <span style={{ color: t.color }} className="font-semibold">{t.ratio}</span></p>

            <div className="mb-6">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Avance immédiate</p>
              <p className="text-3xl font-bold text-white font-mono">{t.advance}</p>
            </div>
            <div className="mb-6">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Prime d'assurance</p>
              <p className="text-2xl font-bold" style={{ color: t.color }}>{t.premium}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {t.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-accent-green shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                t.popular
                  ? "bg-gradient-to-r from-accent-purple to-accent-blue text-white hover:opacity-90 shadow-glow"
                  : "bg-dark-700 text-white hover:bg-dark-600"
              }`}
            >
              Choisir {t.name}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
