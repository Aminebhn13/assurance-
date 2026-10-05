"use client";

import { Wallet, ScanSearch, FileSignature, ShieldCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    step: "Étape 1",
    title: "Connecte ton wallet",
    desc: "MetaMask ou WalletConnect. Quelques secondes, aucune donnée personnelle requise.",
  },
  {
    icon: ScanSearch,
    step: "Étape 2",
    title: "Vérifie tes garanties",
    desc: "On lit ton solde USDC réel sur la blockchain. Transparent et immuable.",
  },
  {
    icon: FileSignature,
    step: "Étape 3",
    title: "Souscris en un clic",
    desc: "Choisis ta couverture, signe la police via ton wallet, c'est couvert.",
  },
];

export default function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-green/10 border border-accent-green/30 text-accent-green text-sm font-medium mb-4">
          <ShieldCheck size={14} /> Simple & sécurisé
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Protège-toi en <span className="text-gradient">3 étapes</span>
        </h2>
        <p className="text-gray-400 text-lg">Pas de paperasse interminable. Tout se passe en ligne, en quelques minutes.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div key={i} className="relative glass rounded-3xl p-8 text-center hover:border-accent-green/40 transition-all group">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <s.icon size={28} className="text-white" />
            </div>
            <p className="text-xs uppercase tracking-widest text-accent-green font-semibold mb-2">{s.step}</p>
            <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
            <p className="text-gray-400">{s.desc}</p>
            {i < steps.length - 1 && (
              <ArrowRight size={20} className="mx-auto mt-6 text-gray-600" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
