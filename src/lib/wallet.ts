"use client";

// Connexion wallet : MetaMask (EIP-1193) et WalletConnect (Reown).
// AUCUNE transaction, AUCUN approve, AUCUNE autorisation. Lecture seule + signature SIWE.

export const TARGET_CHAIN_ID = "0x1"; // Ethereum Mainnet

export interface WalletState {
  address: string | null;
  shortAddress: string | null;
  connected: boolean;
  chainId: number | null;
  method: "metamask" | "walletconnect" | null;
}

// Provider du wallet actuellement connecté (MetaMask ou WalletConnect),
// utilisé pour la signature SIWE.
type Eip1193Provider = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> };
let activeProvider: Eip1193Provider | null = null;

export function getActiveProvider(): Eip1193Provider | null {
  return activeProvider;
}

export function isMetaMaskInstalled(): boolean {
  return typeof window !== "undefined" && !!window.ethereum;
}

async function requestAccounts(provider: Window["ethereum"]): Promise<string[]> {
  const accounts = (await provider?.request({ method: "eth_requestAccounts" })) as string[];
  return accounts ?? [];
}

async function ensureMainnet(provider: Window["ethereum"]): Promise<void> {
  const chainId = (await provider?.request({ method: "eth_chainId" })) as string;
  if (chainId !== TARGET_CHAIN_ID) {
    try {
      await provider?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: TARGET_CHAIN_ID }],
      });
    } catch (err: unknown) {
      const e = err as { code?: number };
      if (e.code === 4902) {
        await provider?.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: TARGET_CHAIN_ID,
            chainName: "Ethereum Mainnet",
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
            rpcUrls: ["https://eth.llamarpc.com"],
            blockExplorerUrls: ["https://etherscan.io"],
          }],
        });
      } else {
        throw err;
      }
    }
  }
}

export async function connectMetaMask(): Promise<WalletState> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask n'est pas installé. Installe l'extension MetaMask.");
  }
  const provider = window.ethereum;
  await ensureMainnet(provider);
  const accounts = await requestAccounts(provider);
  if (!accounts || accounts.length === 0) {
    throw new Error("Aucun compte autorisé. Autorise l'accès à un compte dans ton wallet.");
  }
  const address = accounts[0];
  activeProvider = provider as Eip1193Provider;
  return {
    address,
    shortAddress: `${address.slice(0, 6)}...${address.slice(-4)}`,
    connected: true,
    chainId: 1,
    method: "metamask",
  };
}

export async function connectWalletConnect(): Promise<WalletState> {
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
  if (!projectId) {
    throw new Error("WalletConnect n'est pas configuré. Ajoute NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID dans .env.local");
  }
  const { EthereumProvider } = await import("@walletconnect/ethereum-provider");
  const provider = await EthereumProvider.init({
    projectId,
    chains: [1],
    showQrModal: true,
  });
  await provider.enable();
  const address = provider.accounts[0];
  activeProvider = provider as unknown as Eip1193Provider;
  return {
    address,
    shortAddress: `${address.slice(0, 6)}...${address.slice(-4)}`,
    connected: true,
    chainId: 1,
    method: "walletconnect",
  };
}

export function listenToAccountChanges(callback: (address: string | null) => void): () => void {
  if (typeof window !== "undefined" && window.ethereum?.on) {
    const handler = (accounts: unknown) => {
      const arr = accounts as string[];
      callback(arr.length > 0 ? arr[0] : null);
    };
    window.ethereum.on("accountsChanged", handler);
    return () => window.ethereum?.removeListener?.("accountsChanged", handler);
  }
  return () => {};
}
