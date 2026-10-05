"use client";

import { useState, useEffect } from "react";
import { Wallet, Loader2, CheckCircle2, ChevronDown, LogOut } from "lucide-react";
import { connectMetaMask, connectWalletConnect, isMetaMaskInstalled, listenToAccountChanges } from "@/lib/wallet";
import { shortenAddress } from "@/lib/ethers";

interface WalletButtonProps {
  onConnected: (address: string) => void;
  onDisconnected: () => void;
}

export default function WalletButton({ onConnected, onDisconnected }: WalletButtonProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const cleanup = listenToAccountChanges((newAddress) => {
      setAddress(newAddress);
      if (newAddress) onConnected(newAddress);
      else onDisconnected();
    });
    return cleanup;
  }, [onConnected, onDisconnected]);

  const handleConnect = async (method: "metamask" | "walletconnect") => {
    setConnecting(true);
    setError(null);
    try {
      const state = method === "metamask" ? await connectMetaMask() : await connectWalletConnect();
      setAddress(state.address);
      if (state.address) onConnected(state.address);
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setConnecting(false);
      setMenuOpen(false);
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
    onDisconnected();
  };

  // Pas de wallet installé
  if (!isMetaMaskInstalled() && !address) {
    return (
      <a
        href="https://metamask.io/download/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold hover:opacity-90 hover:scale-[1.02] transition-all shadow-glow"
      >
        <Wallet size={18} />
        Installer un Wallet
      </a>
    );
  }

  // Connecté
  if (address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-700 border border-accent-green/30 shadow-glow-green">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-green" />
          </span>
          <CheckCircle2 size={16} className="text-accent-green" />
          <span className="text-sm font-mono text-white">{shortenAddress(address)}</span>
        </div>
        <button
          onClick={handleDisconnect}
          className="p-2 rounded-xl bg-dark-600 text-gray-300 hover:bg-dark-700 hover:text-white transition-all"
          title="Déconnecter"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  // Déconnecté : menu de choix
  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        disabled={connecting}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold hover:opacity-90 hover:scale-[1.02] transition-all shadow-glow disabled:opacity-50"
      >
        {connecting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Connexion...
          </>
        ) : (
          <>
            <Wallet size={18} />
            Connecter Wallet
            <ChevronDown size={16} className={menuOpen ? "rotate-180 transition-transform" : "transition-transform"} />
          </>
        )}
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-64 glass rounded-2xl p-2 z-50 shadow-card animate-fade-up">
          <p className="px-3 py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">Choisis ta méthode</p>
          <button
            onClick={() => handleConnect("metamask")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-dark-700 transition-all text-left"
          >
            <div className="p-2 rounded-lg bg-orange-500/15">
              <span className="block w-4 h-4 rounded-full bg-gradient-to-br from-orange-400 to-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">MetaMask</p>
              <p className="text-xs text-gray-400">Extension navigateur</p>
            </div>
          </button>
          <button
            onClick={() => handleConnect("walletconnect")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-dark-700 transition-all text-left"
          >
            <div className="p-2 rounded-lg bg-accent-blue/15">
              <span className="block w-4 h-4 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">WalletConnect</p>
              <p className="text-xs text-gray-400">QR code mobile</p>
            </div>
          </button>
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-2 max-w-[220px]">{error}</p>}
    </div>
  );
}
