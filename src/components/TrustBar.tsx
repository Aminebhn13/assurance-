"use client";

import { ShieldCheck, Lock, FileCheck, Users, Award } from "lucide-react";

const stats = [
  { value: "1.2B$", label: "Garanties sécurisées" },
  { value: "12 400+", label: "Polices actives" },
  { value: "99.98%", label: "Taux de couverture" },
  { value: "24/7", label: "Surveillance on-chain" },
];

const badges = [
  { icon: ShieldCheck, text: "Fonds dédiés & audités" },
  { icon: Lock, text: "Contrats immuables" },
  { icon: FileCheck, text: "Conformité réglementaire" },
  { icon: Users, text: "Support dédié" },
  { icon: Award, text: "Réassureurs de premier rang" },
];

export default function TrustBar() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="gradient-border rounded-3xl p-8 bg-dark-800/60">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-bold text-gradient">{s.value}</p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {badges.map((b, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-700/70 border border-dark-500">
              <b.icon size={16} className="text-accent-green" />
              <span className="text-sm text-gray-300">{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
