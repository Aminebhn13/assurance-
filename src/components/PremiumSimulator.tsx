"use client";
import { useState } from "react";
import { COVERAGE_PLANS, computePremium } from "@/lib/pricing";

export default function PremiumSimulator() {
  const [loan, setLoan] = useState(100000);
  const [months, setMonths] = useState(12);
  const [planId, setPlanId] = useState<"essentielle" | "standard" | "premium">("standard");

  const plan = COVERAGE_PLANS.find((p) => p.id === planId)!;
  const premium = computePremium(loan, months, plan);
  const monthly = premium / months;

  return (
    <div className="glass rounded-2xl p-6 sm:p-8">
      <h3 className="text-xl font-bold text-gold-light mb-6">Simulateur de prime</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Montant du prêt : <strong>{loan.toLocaleString("fr-FR")} USD</strong></label>
            <input type="range" min={10000} max={1000000} step={5000} value={loan}
              onChange={(e) => setLoan(Number(e.target.value))} className="w-full accent-gold" />
          </div>
          <div>
            <label className="block text-sm mb-2">Durée : <strong>{months} mois</strong></label>
            <input type="range" min={3} max={36} step={1} value={months}
              onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-gold" />
          </div>
          <div>
            <label className="block text-sm mb-2">Formule :</label>
            <div className="grid gap-2">
              {COVERAGE_PLANS.map((p) => (
                <button key={p.id} onClick={() => setPlanId(p.id)}
                  className={`text-left px-4 py-3 rounded-xl border transition ${
                    planId === p.id ? "border-gold bg-gold/10" : "border-navy-border bg-navy-light"
                  }`}>
                  <span className="font-semibold">{p.name}</span>
                  <span className="text-xs text-gray-400 block mt-0.5">
                    Couverture {p.coverageRate * 100}% · Franchise {p.franchise * 100}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-navy-dark border border-navy-border p-6 flex flex-col justify-center">
          <p className="text-sm text-gray-400">Prime totale (indicative)</p>
          <p className="text-4xl font-bold gold-text mt-2">{premium.toLocaleString("fr-FR")} USD</p>
          <p className="text-sm text-gray-400 mt-2">Soit {monthly.toLocaleString("fr-FR")} USD / mois</p>
          <p className="text-xs text-gray-500 mt-6">Montant couvert : {(loan * plan.coverageRate).toLocaleString("fr-FR")} USD
            <br />Taux annuel : {plan.annualRate * 100}%
          </p>
          <p className="text-xs text-gray-500 mt-4">⚠️ Valeurs <strong>indicatives</strong>. La prime définitive dépend de votre score de solvabilité et de l&apos;émission de la police par le porteur de risque.</p>
        </div>
      </div>
    </div>
  );
}
