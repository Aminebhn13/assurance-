"use client";

import { useState, useMemo } from "react";
import { Calculator, TrendingUp, ShieldCheck, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import {
  coverageRatio,
  factoringAdvanceRate,
  premiumRate,
  totalPremium,
  isEligible,
  collateralGrade,
} from "@/lib/ethers";

interface SimulatorProps {
  collateral: number | null;
}

export default function Simulator({ collateral }: SimulatorProps) {
  const [collateralInput, setCollateralInput] = useState<number>(collateral ?? 50000);
  const [loanAmount, setLoanAmount] = useState(30000);
  const [duration, setDuration] = useState(1); // années

  const effectiveCollateral = collateral ?? collateralInput;

  const ratio = useMemo(() => coverageRatio(effectiveCollateral, loanAmount), [effectiveCollateral, loanAmount]);
  const advanceRate = useMemo(() => factoringAdvanceRate(ratio), [ratio]);
  const pRate = useMemo(() => premiumRate(ratio), [ratio]);
  const premium = useMemo(() => totalPremium(loanAmount, ratio, duration), [loanAmount, ratio, duration]);
  const advance = useMemo(() => loanAmount * advanceRate, [loanAmount, advanceRate]);
  const eligible = useMemo(() => isEligible(ratio), [ratio]);
  const grade = useMemo(() => collateralGrade(ratio), [ratio]);

  return (
    <div className="gradient-border rounded-3xl p-6 sm:p-8 bg-dark-800 shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-accent-purple/15">
          <Calculator size={22} className="text-accent-purple" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Simulateur d'affacturage & assurance</h3>
          <p className="text-sm text-gray-400">Calcule ton avance de trésorerie et ta prime de protection</p>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Garantie (USDC)</label>
          {collateral !== null ? (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dark-700 border border-accent-green/30">
              <CheckCircle2 size={16} className="text-accent-green" />
              <span className="text-white font-mono font-semibold">${collateral.toLocaleString()}</span>
              <span className="text-xs text-gray-400">(vérifié on-chain)</span>
            </div>
          ) : (
            <input
              type="number"
              value={collateralInput}
              onChange={(e) => setCollateralInput(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-dark-500 text-white focus:border-accent-purple focus:outline-none font-mono"
            />
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Montant du prêt à sécuriser</label>
          <input
            type="range"
            min={1000}
            max={100000}
            step={1000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full accent-accent-purple"
          />
          <div className="text-right text-white font-mono font-semibold mt-1">${loanAmount.toLocaleString()}</div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Durée de couverture</label>
          <div className="flex gap-2">
            {[0.5, 1, 2, 3].map((y) => (
              <button
                key={y}
                onClick={() => setDuration(y)}
                className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  duration === y ? "bg-accent-purple text-white" : "bg-dark-700 text-gray-300 hover:bg-dark-600"
                }`}
              >
                {y === 0.5 ? "6 mois" : y === 1 ? "1 an" : `${y} ans`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="space-y-4">
        {/* Éligibilité */}
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border ${
            eligible
              ? "bg-accent-green/10 border-accent-green/30 text-accent-green"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          {eligible ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          <div>
            <p className="font-semibold">{eligible ? "Éligible à l'assurance" : "Garantie insuffisante"}</p>
            <p className="text-sm opacity-90">
              {eligible
                ? `Ratio de couverture ${ratio.toFixed(0)}% — ${grade.label}`
                : `Ratio de ${ratio.toFixed(0)}% — un minimum de 80% est requis.`}
            </p>
          </div>
        </div>

        {/* Cartes résultats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-dark-700">
            <p className="text-xs text-gray-400 flex items-center gap-1.5"><TrendingUp size={12} /> Avance immédiate</p>
            <p className="text-2xl font-bold text-accent-cyan font-mono mt-1">${advance.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">{(advanceRate * 100).toFixed(0)}% du prêt</p>
          </div>
          <div className="p-4 rounded-2xl bg-dark-700">
            <p className="text-xs text-gray-400 flex items-center gap-1.5"><ShieldCheck size={12} /> Prime totale</p>
            <p className="text-2xl font-bold text-accent-gold font-mono mt-1">${premium.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">{(pRate * 100).toFixed(2)}% / an</p>
          </div>
        </div>

        {/* Récap */}
        <div className="p-4 rounded-2xl bg-dark-700/60 space-y-2 text-sm">
          <div className="flex justify-between text-gray-400"><span>Ratio de couverture</span><span className="font-mono text-white">{ratio.toFixed(0)}%</span></div>
          <div className="flex justify-between text-gray-400"><span>Qualité de garantie</span><span className="font-mono" style={{ color: grade.color }}>{grade.label}</span></div>
          <div className="flex justify-between text-gray-400"><span>Taux de prime</span><span className="font-mono text-white">{(pRate * 100).toFixed(2)}% / an</span></div>
          <div className="flex justify-between text-gray-400"><span>Montant couvert</span><span className="font-mono text-white">${loanAmount.toLocaleString()}</span></div>
        </div>

        <button
          disabled={!eligible}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white font-semibold hover:opacity-90 disabled:opacity-40 transition-all shadow-glow-purple"
        >
          Souscrire ma protection <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
