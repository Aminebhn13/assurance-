"use client";

import { ArrowRight, Coins, HandCoins, ShieldCheck, Scale, FileText } from "lucide-react";

const steps = [
  {
    icon: Coins,
    title: "Tu déposes tes USDC en garantie",
    desc: "Tes stablecoins restent sur ton wallet, mais ils sont bloqués comme garantie de ton prêt.",
  },
  {
    icon: HandCoins,
    title: "On te verse l'avance immédiatement",
    desc: "Tu reçois jusqu'à 95% de ton prêt en trésorerie, sans attendre l'échéance de ta créance.",
  },
  {
    icon: ShieldCheck,
    title: "Ta créance est assurée",
    desc: "En cas de défaut ou de sinistre, l'assurance te couvre et tu récupères ton capital.",
  },
  {
    icon: Scale,
    title: "Tu rembourses à ton rythme",
    desc: "À l'échéance, tu rembourses le solde. Le reste de ta garantie est libéré automatiquement.",
  },
];

export default function FactoringExplainer() {
  return (
    <section id="affacturage" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-sm font-medium mb-4">
          <FileText size={14} /> Qu'est-ce que l'affacturage ?
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Transforme ta garantie en <span className="text-gradient">trésorerie immédiate</span>
        </h2>
        <p className="text-gray-400 text-lg">
          L'affacturage, c'est le principe simple : tu <strong className="text-white">cèdes ta créance future</strong> en échange d'un
          <strong className="text-white"> paiement immédiat</strong>. Nous avançons l'argent, et l'assurance sécurise l'opération.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <div key={i} className="relative glass rounded-3xl p-6 hover:border-accent-blue/40 transition-all group">
            <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-sm font-bold text-white">
              {i + 1}
            </div>
            <div className="p-3 rounded-2xl bg-accent-blue/10 w-fit mb-4 group-hover:scale-110 transition-transform">
              <step.icon size={24} className="text-accent-blue" />
            </div>
            <h3 className="text-white font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
            {i < steps.length - 1 && (
              <ArrowRight size={18} className="absolute top-6 -right-4 text-gray-600 hidden lg:block" />
            )}
          </div>
        ))}
      </div>

      {/* Encart explicatif simplifié */}
      <div className="mt-12 gradient-border rounded-3xl p-8 bg-dark-800">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-4">En une phrase, c'est ça 👇</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Tu as <span className="text-accent-cyan font-semibold">100 000 USDC</span> en garantie d'un prêt de{" "}
              <span className="text-accent-cyan font-semibold">80 000 USDC</span>. Plutôt que d'attendre, on te verse{" "}
              <span className="text-accent-gold font-semibold">jusqu'à 72 000 USDC</span> immédiatement. En échange, tu nous cèdes
              ta créance, et <span className="text-accent-green font-semibold">l'assurance couvre le risque</span> si ton débiteur ne paie pas.
            </p>
          </div>
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-dark-900 rounded-2xl p-5 border border-dark-600">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Exemple chiffré</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Garantie</span><span className="font-mono text-white">100 000 USDC</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Prêt</span><span className="font-mono text-white">80 000 USDC</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Ratio</span><span className="font-mono text-accent-cyan">125%</span></div>
                <div className="border-t border-dark-600 my-2" />
                <div className="flex justify-between"><span className="text-gray-400">Avance (90%)</span><span className="font-mono text-accent-gold font-bold">72 000 USDC</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Prime / an</span><span className="font-mono text-accent-green font-bold">1 440 USDC</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
