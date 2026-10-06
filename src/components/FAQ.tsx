"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const items = [
  {
    q: "Qu'est-ce que l'affacturage exactement ?",
    a: "L'affacturage est une opération financière où tu cèdes une créance (un montant qu'on te doit) en échange d'un paiement immédiat. Concrètement : nous te versons une avance sur ta garantie, et nous récupérons la créance à l'échéance. L'assurance couvre le risque que le débiteur ne paie pas.",
  },
  {
    q: "Mes USDC restent-ils sur mon wallet ?",
    a: "Oui. Tes USDC restent sur ton wallet et sont simplement bloqués comme garantie via un smart contract. Tu gardes la propriété, et la garantie est libérée automatiquement à l'échéance du remboursement.",
  },
  {
    q: "Comment vérifiez-vous ma garantie ?",
    a: "Nous lisons directement le solde USDC de ton wallet sur la blockchain Ethereum, en temps réel. C'est transparent, immuable et impossible à falsifier. Aucune donnée personnelle n'est nécessaire.",
  },
  {
    q: "Que se passe-t-il si le prix chute ?",
    a: "L'assurance couvre le risque de défaut de paiement. Si ton débiteur ne rembourse pas, nous t'indemnisons selon les termes de ta police. La surveillance on-chain déclenche les protections automatiquement.",
  },
  {
    q: "Quels sont les frais ?",
    a: "Il n'y a aucun frais caché. Tu paies une prime d'assurance (de 1,2% à 5% par an selon ton ratio de couverture) et un taux d'affacturage sur l'avance. Tout est affiché avant de signer.",
  },
  {
    q: "Est-ce que c'est sécurisé ?",
    a: "Oui. Nos smart contracts sont audités par des cabinets indépendants, les fonds sont dédiés et séparés, et nous travaillons avec des réassureurs de premier rang. La signature se fait via ton wallet, sans jamais transmettre tes clés.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-sm font-medium mb-4">
          <HelpCircle size={14} /> FAQ
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Questions fréquentes</h2>
        <p className="text-gray-400 text-lg">Tout ce qu'il faut savoir avant de souscrire.</p>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="glass rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-dark-700/40 transition-colors"
            >
              <span className="text-white font-medium">{item.q}</span>
              <ChevronDown
                size={20}
                className={`text-accent-blue shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && (
              <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed animate-fade-up">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
