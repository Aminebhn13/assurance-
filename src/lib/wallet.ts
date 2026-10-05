"use client";

// Gestion de la connexion wallet (MetaMask + WalletConnect)

type WalletState = {
  address: string | null;
  connected: boolean;
  provider: any;
  method: "metamask" | "walletconnect" | null;
};

// Réseau cible : Ethereum Mainnet
export const TARGET_CHAIN_ID = "0x1";

export async function connectMetaMask(): Promise<WalletState> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask n'est pas installé. Installe l'extension MetaMask.");
  }

  // Demander l'accès au compte
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  // Vérifier / basculer sur Ethereum Mainnet
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  if (chainId !== TARGET_CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: TARGET_CHAIN_ID }],
      });
    } catch (switchErr: any) {
      if (switchErr.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: TARGET_CHAIN_ID,
              chainName: "Ethereum Mainnet",
              nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://eth.llamarpc.com"],
              blockExplorerUrls: ["https://etherscan.io"],
            },
          ],
        });
      } else {
        throw switchErr;
      }
    }
  }

  const address = accounts[0];
  return {
    address,
    connected: true,
    provider: window.ethereum,
    method: "metamask",
  };
}

// Vérifier si MetaMask est installé
export function isMetaMaskInstalled(): boolean {
  return typeof window !== "undefined" && !!window.ethereum;
}

// Écouter les changements de compte
export function listenToAccountChanges(callback: (address: string | null) => void) {
  if (typeof window !== "undefined" && window.ethereum) {
    const handleAccountsChanged = (accounts: string[]) => {
      callback(accounts.length > 0 ? accounts[0] : null);
    };
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }
  return () => {};
}

// Connexion WalletConnect (nécessite un projectId WalletConnect Cloud)
// NOTE : pour activer, mets NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID dans .env.local
export async function connectWalletConnect(): Promise<WalletState> {
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
  if (!projectId) {
    throw new Error("WalletConnect n'est pas configuré. Ajoute NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID dans .env.local");
  }
  const { EthereumProvider } = await import("@walletconnect/ethereum-provider");
  const provider = await EthereumProvider.init({
    projectId,
    chains: [1], // Ethereum Mainnet
    showQrModal: true,
  });
  await provider.enable();
  const address = provider.accounts[0];
  return { address, connected: true, provider, method: "walletconnect" };
}
