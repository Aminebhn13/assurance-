"use client";

import { useState } from "react";
import { ShieldCheck, Menu, X, ArrowRight, Sparkles, TrendingUp, Coins, Lock, Zap, CheckCircle2 } from "lucide-react";
import WalletButton from "@/components/WalletButton";
import VerifyCollateral from "@/components/VerifyCollateral";
import Simulator from "@/components/Simulator";
import FactoringExplainer from "@/components/FactoringExplainer";
import HowItWorks from "@/components/HowItWorks";
import TrustBar from "@/components/TrustBar";
import PricingTable from "@/components/PricingTable";
import OnboardingTunnel from "@/components/OnboardingTunnel";
import SecuritySection from "@/components/SecuritySection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [verifiedBalance, setVerifiedBalance] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleConnected = (address: string) => setWalletAddress(address);
  const handleDisconnected = () => {
    setWalletAddress(null);
    setVerifiedBalance(null);
  };

  return (
    <div className="min-h-screen bg-dark-900 relative overflow-x-hidden">
      {/* Fond */}
      <div className="fixed inset-0 bg-grid bg-grid-fade pointer-events-none opacity-60" />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-accent-purple/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-blue/15 blur-[140px] rounded-full pointer-events-none" />

      {/* NAVBAR */}
      <nav className="relative z-10 border-b border-dark-700 bg-dark-900/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple shadow-glow">
                <ShieldCheck size={22} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Assure<span className="text-accent-blue">Crypto</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
              <a href="#affacturage" className="hover:text-white transition-colors">Affacturage</a>
              <a href="#comment-ca-marche" className="hover:text-white transition-colors">Comment ça marche</a>
              <a href="#verification" className="hover:text-white transition-colors">Vérification</a>
              <a href="#tarifs" className="hover:text-white transition-colors">Tarifs</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </div>

            <div className="hidden md:block">
              <WalletButton onConnected={handleConnected} onDisconnected={handleDisconnected} />
            </div>

            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-dark-700 bg-dark-900 p-4 space-y-3">
            <a href="#affacturage" className="block text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Affacturage</a>
            <a href="#comment-ca-marche" className="block text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Comment ça marche</a>
            <a href="#verification" className="block text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Vérification</a>
            <a href="#tarifs" className="block text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Tarifs</a>
            <a href="#faq" className="block text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>FAQ</a>
            <div className="pt-2">
              <WalletButton onConnected={handleConnected} onDisconnected={handleDisconnected} />
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-green/10 border border-accent-green/30 text-accent-green text-sm font-medium mb-6">
              <Sparkles size={14} />
              Assurance & affacturage décentralisés
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Sécurise tes prêts crypto et <span className="text-gradient">débloque ta trésorerie</span> immédiatement
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-xl">
              Vérifie tes garanties USDC en direct sur la blockchain, souscris une assurance en un clic et
              reçois une avance sur ta créance. <strong className="text-white">Simple, transparent, sécurisé.</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a href="#souscrire" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold hover:opacity-90 hover:scale-[1.02] transition-all shadow-glow">
                Souscrire maintenant <ArrowRight size={18} />
              </a>
              <a href="#affacturage" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-dark-700 text-white font-semibold hover:bg-dark-600 transition-all">
                Découvrir l'affacturage
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md">
              {[
                { icon: Coins, label: "Garanties vérifiées", sub: "on-chain" },
                { icon: Zap, label: "Avance immédiate", sub: "jusqu'à 95%" },
                { icon: Lock, label: "100% sécurisé", sub: "audité" },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <f.icon size={18} className="text-accent-blue mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">{f.label}</p>
                    <p className="text-xs text-gray-500">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carte wallet animée */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 blur-3xl rounded-full" />
            <div className="relative glass rounded-3xl p-8 shadow-card animate-float">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <span className="font-bold">AssureCrypto</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-accent-green/15 text-accent-green text-xs font-medium border border-accent-green/30">
                  ● Actif
                </span>
              </div>

              <div className="mb-6">
                <p className="text-xs text-gray-400 mb-1">Solde USDC vérifié</p>
                <p className="text-4xl font-bold text-white font-mono">100 000<span className="text-xl text-gray-400"> USDC</span></p>
                <p className="text-xs text-accent-green mt-1 flex items-center gap-1"><CheckCircle2 size={12} /> Vérifié on-chain · Ethereum</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 rounded-2xl bg-dark-700">
                  <p className="text-xs text-gray-400">Ratio de couverture</p>
                  <p className="text-xl font-bold text-accent-cyan font-mono">125%</p>
                </div>
                <div className="p-4 rounded-2xl bg-dark-700">
                  <p className="text-xs text-gray-400">Avance dispo</p>
                  <p className="text-xl font-bold text-accent-gold font-mono">72 000$</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-accent-purple/10 border border-accent-purple/30">
                <div>
                  <p className="text-xs text-gray-400">Prime d'assurance</p>
                  <p className="text-lg font-bold text-white">1 440 USDC / an</p>
                </div>
                <div className="p-2 rounded-xl bg-accent-purple/20">
                  <TrendingUp size={20} className="text-accent-purple" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barre de confiance */}
      <TrustBar />

      {/* Affacturage expliqué */}
      <FactoringExplainer />

      {/* Comment ça marche */}
      <HowItWorks />

      {/* Vérification + Simulateur */}
      <section id="verification" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-sm font-medium mb-4">
            <ShieldCheck size={14} /> Vérification en direct
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Vérifie tes garanties et <span className="text-gradient">simule ta couverture</span>
          </h2>
          <p className="text-gray-400 text-lg">Connecte ton wallet, on lit ton solde USDC réel, et tu calcules ta protection instantanément.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <VerifyCollateral walletAddress={walletAddress} />
          <Simulator collateral={verifiedBalance} />
        </div>
      </section>

      {/* Grille tarifaire */}
      <PricingTable />

      {/* Tunnel de souscription */}
      <OnboardingTunnel />

      {/* Sécurité */}
      <SecuritySection />

      {/* FAQ */}
      <FAQ />

      {/* CTA final */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="gradient-border rounded-3xl p-10 sm:p-14 text-center bg-dark-800 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-purple/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-blue/20 blur-3xl rounded-full" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 relative z-10">
            Prêt à sécuriser tes prêts crypto ?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto relative z-10">
            Rejoins plus de 12 400 clients qui protègent leurs garanties et débloquent leur trésorerie avec AssureCrypto.
          </p>
          <a href="#souscrire" className="relative z-10 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold text-lg hover:opacity-90 hover:scale-[1.02] transition-all shadow-glow">
            Commencer maintenant <ArrowRight size={20} />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
