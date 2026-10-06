"use client";

import { Lock, ShieldCheck, FileCheck, Eye, Fingerprint, Globe } from "lucide-react";

const items = [
  { icon: Lock, title: "Smart contracts audités", desc: "Nos contrats sont vérifiés par des cabinets indépendants (audits complets)." },
  { icon: Eye, title: "Transparence on-chain", desc: "Chaque garantie, chaque police, chaque indemnisation est visible et vérifiable." },
  { icon: Fingerprint, title: "Aucune clé partagée", desc: "Tu signes via ton wallet. Tes clés privées ne quittent jamais ton appareil." },
  { icon: FileCheck, title: "Conformité réglementaire", desc: "Nous respectons les réglementations en vigueur et les normes KYC/AML." },
  { icon: ShieldCheck, title: "Fonds dédiés", desc: "Les primes sont isolées dans des fonds séparés, protégés des créanciers." },
  { icon: Globe, title: "Disponibilité 24/7", desc: "Surveillance continue de la blockchain pour un déclenchement automatique." },
];

export default function SecuritySection() {
  return (
    <section id="securite" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-green/10 border border-accent-green/30 text-accent-green text-sm font-medium mb-4">
          <Lock size={14} /> Sécurité maximale
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ta protection est <span className="text-gradient">notre priorité</span>
        </h2>
        <p className="text-gray-400 text-lg">Une infrastructure de niveau institutionnel, pensée pour la confiance.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div key={i} className="glass rounded-3xl p-6 hover:border-accent-green/40 transition-all group">
            <div className="p-3 rounded-2xl bg-accent-green/10 w-fit mb-4 group-hover:scale-110 transition-transform">
              <item.icon size={24} className="text-accent-green" />
            </div>
            <h3 className="text-white font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
