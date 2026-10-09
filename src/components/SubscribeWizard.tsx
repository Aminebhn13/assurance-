"use client";
import { useState } from "react";
import { connectMetaMask, connectWalletConnect, getActiveProvider, type WalletState } from "@/lib/wallet";
import {
  buildSiweMessage, generateNonce, verifySiweSignature,
} from "@/lib/siwe";
import { getBalances, type BalanceSnapshot } from "@/lib/balances";
import {
  fetchPrices, computeSolvency, COVERAGE_PLANS, computePremium, type Prices, type SolvencyResult,
} from "@/lib/pricing";
import { generateReference, downloadAttestation, type AttestationData } from "@/lib/attestation";
import { payPremiumUsdc, PREMIUM_RECEIVER, shortTx, type PaymentResult } from "@/lib/payment";
import { payPremiumGasless } from "@/lib/gaslessPay";

const STEPS = ["Votre prêt", "Connexion", "Preuve de contrôle", "Analyse", "Couverture", "Paiement", "Attestation"];

export default function SubscribeWizard() {
  const [step, setStep] = useState(0);
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [duration, setDuration] = useState(12);
  const [fundName, setFundName] = useState("");
  const [clientType, setClientType] = useState<"particulier" | "entreprise">("particulier");

  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [siweMessage, setSiweMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [balances, setBalances] = useState<BalanceSnapshot | null>(null);
  const [prices, setPrices] = useState<Prices | null>(null);
  const [solvency, setSolvency] = useState<SolvencyResult | null>(null);
  const [planId, setPlanId] = useState<"essentielle" | "standard" | "premium">("standard");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState("");
  const [agreedAmount, setAgreedAmount] = useState<number | null>(null);
  const [payment, setPayment] = useState<PaymentResult | null>(null);

  const canNext = () => {
    if (step === 0) return loanAmount > 0 && duration >= 3 && fundName.trim().length > 0;
    if (step === 1) return !!wallet?.connected;
    if (step === 2) return !!signature;
    if (step === 3) return !!solvency;
    if (step === 4) return true;
    if (step === 5) return !!payment;
    if (step === 6) return accepted;
    return false;
  };

  const handleConnect = async (method: "metamask" | "walletconnect") => {
    setError(null); setLoading(true);
    try {
      const w = method === "metamask" ? await connectMetaMask() : await connectWalletConnect();
      setWallet(w);
      if (w.address) {
        const msg = buildSiweMessage({
          domain: window.location.hostname || "assurecrypto.com",
          address: w.address,
          nonce: generateNonce(),
          issuedAt: new Date().toISOString(),
          chainId: 1,
        });
        setSiweMessage(msg);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de connexion");
    } finally { setLoading(false); }
  };

  const handleDisconnect = () => {
    setWallet(null); setSignature(""); setBalances(null); setSolvency(null);
  };

  const handleSign = async () => {
    if (!wallet?.address || !siweMessage) return;
    setError(null); setLoading(true);
    try {
      const sig = (await (getActiveProvider() ?? window.ethereum)?.request({
        method: "personal_sign",
        params: [siweMessage, wallet.address],
      })) as string;
      const ok = verifySiweSignature(siweMessage, sig, wallet.address);
      if (!ok) { setError("La signature ne correspond pas à l'adresse. Veuillez réessayer."); return; }
      setSignature(sig);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Signature refusée");
    } finally { setLoading(false); }
  };

  const handleAnalyze = async () => {
    if (!wallet?.address) return;
    setError(null); setLoading(true);
    try {
      const [bal, pr] = await Promise.all([getBalances(wallet.address), fetchPrices()]);
      setBalances(bal); setPrices(pr);
      const sol = computeSolvency(bal.eth, bal.usdc?.formatted ?? null, bal.usdt?.formatted ?? null, pr, loanAmount);
      setSolvency(sol);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'analyse");
    } finally { setLoading(false); }
  };

  const plan = COVERAGE_PLANS.find((p) => p.id === planId)!;
  const premium = solvency ? computePremium(loanAmount, duration, plan) : 0;
  const amountToPay = agreedAmount ?? Math.round(premium);

  const asFriendly = (e: unknown) => {
    const msg = e instanceof Error ? e.message : "Paiement échoué";
    return /user rejected|user denied|rejected the request/i.test(msg) ? "Paiement annulé dans le wallet." : msg;
  };

  const handlePay = async () => {
    if (!(amountToPay > 0)) return;
    setError(null); setLoading(true);
    try {
      setPayment(await payPremiumUsdc(amountToPay));
    } catch (e) {
      setError(asFriendly(e));
    } finally { setLoading(false); }
  };

  const handlePayGasless = async () => {
    if (!(amountToPay > 0) || !wallet?.address) return;
    setError(null); setLoading(true);
    try {
      const res = await payPremiumGasless(amountToPay, wallet.address);
      setPayment({ ...res, network: "Ethereum Mainnet (gas offert)" });
    } catch (e) {
      setError(asFriendly(e));
    } finally { setLoading(false); }
  };

  const handleGenerate = async () => {
    if (!wallet?.address || !signature || !balances) return;
    const ref = generateReference();
    const data: AttestationData = {
      reference: ref,
      address: wallet.address,
      message: siweMessage,
      signature,
      balances: `ETH : ${balances.eth} · USDC : ${balances.usdc?.formatted ?? "0"} · USDT : ${balances.usdt?.formatted ?? "0"}`,
      readAt: balances.readAt,
      loanAmountUsd: loanAmount,
      durationMonths: duration,
      fundName,
      planName: plan.name,
      coverageRate: plan.coverageRate,
      premiumUsd: amountToPay,
      clientType: clientType === "entreprise" ? "Entreprise" : "Particulier",
      score: solvency?.score,
      coverageRatio: solvency?.coverageRatio,
      paymentTxHash: payment?.txHash,
      paymentAmountUsdc: payment?.amountUsdc,
    };
    setError(null); setLoading(true);
    try {
      await downloadAttestation(data);
      setReference(ref);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la génération du PDF");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Barre de progression */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 text-center">
            <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              i <= step ? "bg-gold text-navy-dark" : "bg-navy-light text-gray-400"
            }`}>{i + 1}</div>
            <div className="text-xs mt-1 text-gray-400 hidden sm:block">{s}</div>
          </div>
        ))}
      </div>

      {error && <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/40 p-4 text-sm text-red-300">{error}</div>}

      {/* Étape 1 : Votre prêt */}
      {step === 0 && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <h2 className="text-xl font-bold text-gold-light">Votre prêt</h2>
          <div>
            <label className="block text-sm mb-1">Montant demandé (USD) : {loanAmount.toLocaleString("fr-FR")}</label>
            <input type="range" min={500000} max={50000000} step={500000} value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full accent-gold" />
          </div>
          <div>
            <label className="block text-sm mb-1">Durée (3 à 36 mois) : {duration} mois</label>
            <input type="range" min={3} max={36} step={1} value={duration}
              onChange={(e) => setDuration(Number(e.target.value))} className="w-full accent-gold" />
          </div>
          <div>
            <label className="block text-sm mb-1">Nom du fonds prêteur</label>
            <input type="text" value={fundName} onChange={(e) => setFundName(e.target.value)}
              placeholder="Ex : Fonds Alpha Capital" className="w-full rounded-xl bg-navy-light border border-navy-border px-4 py-3 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Type de client</label>
            <div className="flex gap-2">
              {(["particulier", "entreprise"] as const).map((t) => (
                <button key={t} onClick={() => setClientType(t)}
                  className={`px-4 py-2 rounded-xl border transition ${
                    clientType === t ? "border-gold bg-gold/10" : "border-navy-border bg-navy-light"
                  }`}>{t === "particulier" ? "Particulier" : "Entreprise"}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Étape 2 : Connexion */}
      {step === 1 && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <h2 className="text-xl font-bold text-gold-light">Connexion du wallet</h2>
          {!wallet?.connected ? (
            <div className="space-y-3">
              <button onClick={() => handleConnect("metamask")} disabled={loading}
                className="btn-gold w-full px-6 py-3 rounded-xl font-semibold disabled:opacity-50">
                {loading ? "Connexion…" : "Se connecter avec MetaMask"}
              </button>
              <button onClick={() => handleConnect("walletconnect")} disabled={loading}
                className="btn-navy w-full px-6 py-3 rounded-xl font-semibold disabled:opacity-50">
                Se connecter avec WalletConnect
              </button>
              <p className="text-xs text-gray-400">Ethereum Mainnet requis. Aucun fonds ne sera déplacé.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4">
                <p className="font-mono text-emerald-300">{wallet.address}</p>
                <p className="text-xs text-gray-400 mt-1">Connecté · Ethereum Mainnet</p>
              </div>
              <button onClick={handleDisconnect} className="text-sm text-gray-400 hover:text-white">Déconnecter</button>
            </div>
          )}
        </div>
      )}

      {/* Étape 3 : Preuve de contrôle */}
      {step === 2 && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <h2 className="text-xl font-bold text-gold-light">Preuve de contrôle</h2>
          <p className="text-sm text-gray-300">Lisez attentivement le message ci-dessous. Il prouve que vous contrôlez votre adresse, sans donner aucune autorisation de transfert.</p>
          <div className="rounded-xl bg-navy-dark border border-navy-border p-4 font-mono text-xs text-gray-300 whitespace-pre-wrap">{siweMessage}</div>
          {!signature ? (
            <button onClick={handleSign} disabled={loading}
              className="btn-gold px-6 py-3 rounded-xl font-semibold disabled:opacity-50">
              {loading ? "Signature…" : "Signer le message"}
            </button>
          ) : (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4">
              <p className="text-sm text-emerald-300 font-semibold">✓ Signature vérifiée</p>
              <p className="font-mono text-xs text-gray-400 mt-2 break-all">{signature}</p>
            </div>
          )}
        </div>
      )}

      {/* Étape 4 : Analyse */}
      {step === 3 && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <h2 className="text-xl font-bold text-gold-light">Analyse de solvabilité</h2>
          {!solvency ? (
            <button onClick={handleAnalyze} disabled={loading}
              className="btn-gold px-6 py-3 rounded-xl font-semibold disabled:opacity-50">
              {loading ? "Analyse en cours…" : "Lancer l'analyse des soldes"}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-navy-light border border-navy-border p-3">ETH : <strong>{balances?.eth} ETH</strong><br/><span className="text-gray-400">{solvency.ethUsd.toLocaleString("fr-FR")} USD</span></div>
                <div className="rounded-xl bg-navy-light border border-navy-border p-3">USDC : <strong>{balances?.usdc?.formatted ?? "0"}</strong><br/><span className="text-gray-400">{solvency.usdcUsd.toLocaleString("fr-FR")} USD</span></div>
                <div className="rounded-xl bg-navy-light border border-navy-border p-3">USDT : <strong>{balances?.usdt?.formatted ?? "0"}</strong><br/><span className="text-gray-400">{solvency.usdtUsd.toLocaleString("fr-FR")} USD</span></div>
                <div className="rounded-xl bg-navy-light border border-navy-border p-3">Total : <strong>{solvency.totalUsd.toLocaleString("fr-FR")} USD</strong></div>
              </div>
              <div className="rounded-xl bg-navy-dark border border-navy-border p-4">
                <p>Ratio de couverture : <strong className="text-gold-light">{solvency.coverageRatio.toFixed(0)}%</strong></p>
                <p className="mt-2">Score de solvabilité : <strong className="text-gold-light text-2xl">{solvency.score}</strong></p>
                <p className="text-xs text-gray-400 mt-1">Prix source : {prices?.source === "live" ? "en direct (CoinGecko)" : "valeur de repli"}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Étape 5 : Couverture */}
      {step === 4 && solvency && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <h2 className="text-xl font-bold text-gold-light">Choix de la couverture</h2>
          <div className="space-y-3">
            {COVERAGE_PLANS.map((p) => {
              const pr = computePremium(loanAmount, duration, p);
              return (
                <button key={p.id} onClick={() => setPlanId(p.id)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition ${
                    planId === p.id ? "border-gold bg-gold/10" : "border-navy-border bg-navy-light"
                  }`}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{p.name}</span>
                    <span className="text-gold-light font-semibold">{pr.toLocaleString("fr-FR")} USD</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Couverture {p.coverageRate * 100}% · Franchise {p.franchise * 100}% · Taux {p.annualRate * 100}%</div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500">Prime indicative. Le montant exact est confirmé à l&apos;étape de paiement.</p>
        </div>
      )}

      {/* Étape 6 : Paiement de la prime en USDC */}
      {step === 5 && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <h2 className="text-xl font-bold text-gold-light">Paiement de la prime</h2>
          <p className="text-sm text-gray-300">Réglez la prime en <strong>USDC</strong> sur Ethereum Mainnet. Vous signez vous-même un transfert du montant affiché — aucune autorisation ouverte, aucun prélèvement automatique.</p>

          <div>
            <label className="block text-sm mb-1">Montant convenu (USDC)</label>
            <input
              type="number" min={1} step={1}
              value={agreedAmount ?? Math.round(premium)}
              onChange={(e) => setAgreedAmount(Number(e.target.value))}
              disabled={!!payment}
              className="w-full rounded-xl bg-navy-light border border-navy-border px-4 py-3 focus:border-gold outline-none disabled:opacity-60"
            />
            <p className="text-xs text-gray-500 mt-1">Prime indicative calculée : {premium.toLocaleString("fr-FR")} USD. Ajustez si un autre montant a été convenu.</p>
          </div>

          <div className="rounded-xl bg-navy-dark border border-navy-border p-4 text-sm space-y-1">
            <p className="text-gray-400">Bénéficiaire (AssureCrypto)</p>
            <p className="font-mono text-xs break-all">{PREMIUM_RECEIVER}</p>
            <p className="text-gray-400 mt-2">Réseau : <strong className="text-gray-200">Ethereum Mainnet</strong> · Jeton : <strong className="text-gray-200">USDC</strong></p>
          </div>

          {!payment ? (
            <div className="space-y-3">
              <button onClick={handlePayGasless} disabled={loading || !wallet?.connected || !(amountToPay > 0)}
                className="btn-gold w-full px-6 py-3 rounded-xl font-semibold disabled:opacity-50">
                {loading ? "Paiement en cours…" : `Payer ${amountToPay.toLocaleString("fr-FR")} USDC — frais offerts`}
              </button>
              <p className="text-xs text-gray-500 text-center">Vous signez une autorisation (gratuite), AssureCrypto paie les frais de réseau.</p>
              <button onClick={handlePay} disabled={loading || !wallet?.connected || !(amountToPay > 0)}
                className="btn-navy w-full px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50">
                Ou payer moi-même les frais de gas
              </button>
            </div>
          ) : (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm">
              <p className="text-emerald-300 font-semibold">✓ Paiement envoyé — {payment.amountUsdc} USDC</p>
              <p className="text-xs text-gray-400 mt-1">Transaction : {shortTx(payment.txHash)}</p>
              <a href={`https://etherscan.io/tx/${payment.txHash}`} target="_blank" rel="noopener noreferrer"
                className="text-gold-light underline text-xs">Voir sur Etherscan ↗</a>
              <p className="text-xs text-gray-500 mt-2">La confirmation on-chain peut prendre quelques instants. Vous pouvez poursuivre.</p>
            </div>
          )}
          {!wallet?.connected && <p className="text-xs text-amber-300">Connectez votre wallet (étape 2) pour payer.</p>}
        </div>
      )}

      {/* Étape 7 : Attestation */}
      {step === 6 && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <h2 className="text-xl font-bold text-gold-light">Récapitulatif & attestation</h2>
          <div className="rounded-xl bg-navy-light border border-navy-border p-4 text-sm space-y-1">
            <p>Montant : <strong>{loanAmount.toLocaleString("fr-FR")} USD</strong></p>
            <p>Durée : <strong>{duration} mois</strong></p>
            <p>Fonds : <strong>{fundName}</strong></p>
            <p>Formule : <strong>{plan.name}</strong> (couverture {plan.coverageRate * 100}%)</p>
            <p>Prime payée : <strong>{amountToPay.toLocaleString("fr-FR")} USDC</strong></p>
            <p>Score : <strong>{solvency?.score}</strong> · Ratio : <strong>{solvency?.coverageRatio.toFixed(0)}%</strong></p>
            {payment && <p className="text-xs text-gray-400 break-all">Transaction : {payment.txHash}</p>}
          </div>
          <label className="flex items-start gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 accent-gold" />
            <span>J&apos;ai lu et j&apos;accepte les <a href="/cgu" className="text-gold-light underline">CGU</a> et la <a href="/confidentialite" className="text-gold-light underline">politique de confidentialité</a>.</span>
          </label>
          <button onClick={handleGenerate} disabled={!accepted || loading}
            className="btn-gold px-6 py-3 rounded-xl font-semibold disabled:opacity-40">
            {loading ? "Génération du PDF…" : "Télécharger l'attestation (PDF)"}
          </button>
          {reference && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm">
              <p className="text-emerald-300 font-semibold">Attestation {reference} générée</p>
              <p className="text-xs text-gray-400 mt-1">Document indicatif en attente d&apos;émission définitive par le porteur de risque [À COMPLÉTER].</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
          className="btn-navy px-6 py-3 rounded-xl font-semibold disabled:opacity-40">Précédent</button>
        {step < 6 ? (
          <button onClick={() => setStep(Math.min(6, step + 1))} disabled={!canNext()}
            className="btn-gold px-6 py-3 rounded-xl font-semibold disabled:opacity-40">Suivant</button>
        ) : (
          <button onClick={() => { setStep(0); setPayment(null); setAgreedAmount(null); setReference(""); setAccepted(false); }}
            className="btn-navy px-6 py-3 rounded-xl font-semibold">Recommencer</button>
        )}
      </div>
    </div>
  );
}
