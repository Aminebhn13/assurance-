"use client";

import { useState, useMemo } from "react";
import { Wallet, ScanSearch, FileSignature, CheckCircle2, Loader2, ShieldCheck, ArrowRight, ArrowLeft, Lock, Coins } from "lucide-react";
import WalletButton from "@/components/WalletButton";
import { getUsdcBalance, coverageRatio, factoringAdvanceRate, totalPremium, isEligible, collateralGrade } from "@/lib/ethers";

export default function OnboardingTunnel() {
  const [step, setStep] = useState(1);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loanAmount, setLoanAmount] = useState(20000);
  const [duration, setDuration] = useState(1);
  const [signed, setSigned] = useState(false);
  const [signing, setSigning] = useState(false);

  const ratio = useMemo(() => coverageRatio(balance ?? 0, loanAmount), [balance, loanAmount]);
  const eligible = useMemo(() => isEligible(ratio), [ratio]);
  const grade = useMemo(() => collateralGrade(ratio), [ratio]);
  const premium = useMemo(() => totalPremium(loanAmount, ratio, duration), [loanAmount, ratio, duration]);
  const advanceRate = useMemo(() => factoringAdvanceRate(ratio), [ratio]);

  const handleConnected = (addr: string) => setWalletAddress(addr);
  const handleDisconnected = () => {
    setWalletAddress(null);
    setBalance(null);
    setVerified(false);
  };

  const runVerification = async () => {
    if (!walletAddress) return;
    setVerifying(true);
    try {
      const bal = await getUsdcBalance(walletAddress);
      setBalance(bal);
      setVerified(true);
    } catch {
      setBalance(null);
    } finally {
      setVerifying(false);
    }
  };

  const handleSign = () => {
    setSigning(true);
    setTimeout(() => {
      setSigned(true);
      setSigning(false);
    }, 1800);
  };

  const steps = [
    { icon: Wallet, label: "Wallet" },
    { icon: ScanSearch, label: "Garanties" },
    { icon: FileSignature, label: "Signature" },
  ];

  return (
    <section id="souscrire" className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/30 text-accent-purple text-sm font-medium mb-4">
          <ShieldCheck size={14} /> Souscription guidée
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Souscris ta protection <span className="text-gradient">en 3 étapes</span>
        </h2>
        <p className="text-gray-400 text-lg">Un tunnel simple, sécurisé et transparent. Pas besoin d'être expert.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((s, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  done ? "bg-accent-green/15 text-accent-green border border-accent-green/30"
                    : active ? "bg-accent-purple text-white shadow-glow-purple"
                    : "bg-dark-700 text-gray-400"
                }`}
              >
                {done ? <CheckCircle2 size={16} /> : <s.icon size={16} />}
                {s.label}
              </div>
              {i < steps.length - 1 && <div className={`w-8 h-px ${step > n ? "bg-accent-green" : "bg-dark-500"}`} />}
            </div>
          );
        })}
      </div>

      <div className="gradient-border rounded-3xl p-6 sm:p-10 bg-dark-800 shadow-card">
        {/* ÉTAPE 1 : Wallet */}
        {step === 1 && (
          <div className="animate-fade-up">
            <h3 className="text-xl font-bold text-white mb-2">Connecte ton wallet</h3>
            <p className="text-gray-400 mb-8">C'est la première étape pour sécuriser ton identité et tes garanties. Aucune donnée personnelle n'est requise.</p>
            <div className="flex justify-center mb-8">
              <WalletButton onConnected={handleConnected} onDisconnected={handleDisconnected} />
            </div>
            {walletAddress && (
              <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-accent-green/10 border border-accent-green/30 text-accent-green text-sm animate-fade-up">
                <CheckCircle2 size={18} />
                Wallet connecté — prêt pour la vérification
              </div>
            )}
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(2)}
                disabled={!walletAddress}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-purple text-white font-semibold hover:opacity-90 disabled:opacity-40 transition-all"
              >
                Continuer <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : Garanties */}
        {step === 2 && (
          <div className="animate-fade-up">
            <h3 className="text-xl font-bold text-white mb-2">Vérifie tes garanties</h3>
            <p className="text-gray-400 mb-8">On lit ton solde USDC réel sur la blockchain Ethereum. Transparent et immuable.</p>

            <button
              onClick={runVerification}
              disabled={verifying || !walletAddress}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-accent-blue text-white font-semibold hover:opacity-90 disabled:opacity-40 transition-all mb-6"
            >
              {verifying ? <Loader2 size={20} className="animate-spin" /> : <ScanSearch size={20} />}
              {verifying ? "Lecture on-chain en cours..." : "Vérifier mon solde USDC"}
            </button>

            {verified && balance !== null && (
              <div className="space-y-4 animate-fade-up">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-dark-700">
                    <p className="text-xs text-gray-400 flex items-center gap-1.5"><Coins size={12} /> Solde vérifié</p>
                    <p className="text-2xl font-bold text-white font-mono mt-1">${balance.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-0.5">USDC · Ethereum</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-dark-700">
                    <p className="text-xs text-gray-400">Qualité</p>
                    <p className="text-2xl font-bold font-mono mt-1" style={{ color: grade.color }}>{grade.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Ratio {ratio.toFixed(0)}%</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Montant du prêt à sécuriser</label>
                  <input
                    type="range"
                    min={1000}
                    max={Math.max(50000, Math.floor((balance ?? 50000) * 1.2))}
                    step={1000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-accent-blue"
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
                          duration === y ? "bg-accent-blue text-white" : "bg-dark-700 text-gray-300 hover:bg-dark-600"
                        }`}
                      >
                        {y === 0.5 ? "6 mois" : y === 1 ? "1 an" : `${y} ans`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                  eligible ? "bg-accent-green/10 border-accent-green/30 text-accent-green" : "bg-red-500/10 border-red-500/30 text-red-300"
                }`}>
                  {eligible ? <CheckCircle2 size={20} /> : <Lock size={20} />}
                  <p className="text-sm">
                    {eligible
                      ? `Éligible — Avance ${(advanceRate * 100).toFixed(0)}% · Prime ${premium.toLocaleString()} USDC`
                      : `Garantie insuffisante (ratio ${ratio.toFixed(0)}%). Minimum 80% requis.`}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-dark-700 text-gray-300 hover:bg-dark-600 transition-all">
                <ArrowLeft size={18} /> Retour
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!verified || !eligible}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-purple text-white font-semibold hover:opacity-90 disabled:opacity-40 transition-all"
              >
                Continuer <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Signature */}
        {step === 3 && (
          <div className="animate-fade-up">
            <h3 className="text-xl font-bold text-white mb-6">Récapitulatif & signature</h3>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between p-4 rounded-xl bg-dark-700"><span className="text-gray-400">Garantie vérifiée</span><span className="font-mono text-white">${balance?.toLocaleString()} USDC</span></div>
              <div className="flex justify-between p-4 rounded-xl bg-dark-700"><span className="text-gray-400">Montant couvert</span><span className="font-mono text-white">${loanAmount.toLocaleString()}</span></div>
              <div className="flex justify-between p-4 rounded-xl bg-dark-700"><span className="text-gray-400">Durée</span><span className="font-mono text-white">{duration === 0.5 ? "6 mois" : duration === 1 ? "1 an" : `${duration} ans`}</span></div>
              <div className="flex justify-between p-4 rounded-xl bg-dark-700"><span className="text-gray-400">Avance immédiate</span><span className="font-mono text-accent-cyan">${(loanAmount * advanceRate).toLocaleString()}</span></div>
              <div className="flex justify-between p-4 rounded-xl bg-dark-700 border border-accent-gold/30"><span className="text-gray-400">Prime d'assurance</span><span className="font-mono text-accent-gold font-bold">${premium.toLocaleString()} USDC</span></div>
            </div>

            <button
              onClick={handleSign}
              disabled={signing || signed}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-accent-green to-accent-cyan text-white font-bold text-lg hover:opacity-90 disabled:opacity-60 transition-all shadow-glow-green"
            >
              {signing ? <Loader2 size={22} className="animate-spin" /> : signed ? <CheckCircle2 size={22} /> : <FileSignature size={22} />}
              {signing ? "Signature en cours..." : signed ? "Police signée !" : "Signer & souscrire"}
            </button>

            {signed && (
              <div className="mt-6 p-6 rounded-2xl bg-accent-green/10 border border-accent-green/30 text-center animate-fade-up">
                <CheckCircle2 size={40} className="mx-auto text-accent-green mb-3" />
                <h4 className="text-xl font-bold text-white mb-1">Félicitations, tu es couvert ! 🎉</h4>
                <p className="text-gray-400">Ta police est active. Un récapitulatif a été envoyé à ton wallet. Tu peux suivre ta couverture dans ton dashboard.</p>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-dark-700 text-gray-300 hover:bg-dark-600 transition-all">
                <ArrowLeft size={18} /> Retour
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
