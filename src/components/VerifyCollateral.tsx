"use client";

import { useState, useMemo } from "react";
import { ShieldCheck, Search, Loader2, AlertTriangle, CheckCircle2, RefreshCw, Lock, Coins } from "lucide-react";
import { getUsdcBalance, coverageRatio, collateralGrade } from "@/lib/ethers";

interface VerifyCollateralProps {
  walletAddress: string | null;
}

export default function VerifyCollateral({ walletAddress }: VerifyCollateralProps) {
  const [manualAddress, setManualAddress] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [loanAmount, setLoanAmount] = useState(10000);

  const addressToCheck = walletAddress || manualAddress.trim();

  const ratio = useMemo(() => coverageRatio(balance ?? 0, loanAmount), [balance, loanAmount]);
  const grade = useMemo(() => collateralGrade(ratio), [ratio]);

  const runVerification = async () => {
    if (!addressToCheck) return;
    setLoading(true);
    setError(null);
    setVerified(false);
    try {
      const bal = await getUsdcBalance(addressToCheck);
      setBalance(bal);
      setVerified(true);
    } catch (err: any) {
      setError(err.message || "Impossible de vérifier le solde. Vérifie le réseau (Ethereum Mainnet).");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setBalance(null);
    setVerified(false);
    setError(null);
  };

  return (
    <div className="gradient-border rounded-3xl p-6 sm:p-8 bg-dark-800 shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-accent-green/15">
          <ShieldCheck size={22} className="text-accent-green" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Vérification des garanties</h3>
          <p className="text-sm text-gray-400">Lecture du solde USDC réel sur Ethereum Mainnet</p>
        </div>
      </div>

      {/* Adresse */}
      {!walletAddress && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            placeholder="Adresse du wallet (0x...)"
            className="flex-1 px-4 py-3 rounded-xl bg-dark-700 border border-dark-500 text-white placeholder-gray-500 focus:border-accent-blue focus:outline-none font-mono text-sm"
          />
          <button
            onClick={runVerification}
            disabled={loading || !manualAddress.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent-blue text-white font-semibold hover:opacity-90 disabled:opacity-40 transition-all"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            Vérifier
          </button>
        </div>
      )}

      {walletAddress && (
        <div className="mb-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-700 border border-accent-green/30">
            <CheckCircle2 size={18} className="text-accent-green shrink-0" />
            <span className="text-sm font-mono text-white truncate">{walletAddress}</span>
          </div>
          <button
            onClick={runVerification}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent-green text-white font-semibold hover:opacity-90 disabled:opacity-40 transition-all"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
            Vérifier mes garanties
          </button>
        </div>
      )}

      {/* Montant du prêt (pour le ratio) */}
      <div className="mb-5">
        <label className="block text-sm text-gray-400 mb-2">Montant du prêt couvert (USD)</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1000}
            max={100000}
            step={500}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="flex-1 accent-accent-blue"
          />
          <span className="text-white font-mono font-semibold">${loanAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Résultat */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-10 text-gray-400">
          <Loader2 size={20} className="animate-spin" />
          Lecture on-chain du solde USDC...
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {verified && balance !== null && (
        <div className="space-y-5 animate-fade-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-dark-700">
              <p className="text-xs text-gray-400 flex items-center gap-1.5"><Coins size={12} /> Solde USDC vérifié</p>
              <p className="text-2xl font-bold text-white font-mono mt-1">${balance.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">on-chain · Ethereum</p>
            </div>
            <div className="p-4 rounded-2xl bg-dark-700">
              <p className="text-xs text-gray-400">Ratio de couverture</p>
              <p className="text-2xl font-bold font-mono mt-1" style={{ color: grade.color }}>{ratio.toFixed(0)}%</p>
              <p className="text-xs mt-0.5" style={{ color: grade.color }}>{grade.label}</p>
            </div>
          </div>

          {/* Jauge de ratio */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Garantie</span>
              <span className="font-mono">{ratio.toFixed(0)}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-dark-700 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(ratio, 100)}%`, background: `linear-gradient(90deg, ${grade.color}, #22d3ee)` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>0%</span><span>80% min</span><span>150%+</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-accent-green/10 border border-accent-green/20 text-accent-green text-sm">
            <Lock size={16} />
            Garantie vérifiée en direct sur la blockchain — données immuables.
          </div>

          <button onClick={reset} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <RefreshCw size={14} /> Nouvelle vérification
          </button>
        </div>
      )}

      {!loading && !error && !verified && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-dark-700/60 text-gray-400 text-sm">
          <Lock size={16} className="shrink-0" />
          {walletAddress
            ? "Connecte-toi puis clique sur « Vérifier mes garanties » pour lire ton solde USDC on-chain."
            : "Entre une adresse ou connecte ton wallet pour vérifier le solde USDC réel."}
        </div>
      )}
    </div>
  );
}
