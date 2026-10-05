import { ethers } from "ethers";

// Adresse du contrat USDC sur Ethereum Mainnet
export const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

// ABI minimal pour lire le solde et les infos du token
export const USDC_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function totalSupply() view returns (uint256)"
];

// RPC public par défaut (remplace par ta clé Infura/Alchemy quand tu l'as)
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://eth.llamarpc.com";

// Créer un provider JSON-RPC public
export function getPublicProvider() {
  return new ethers.JsonRpcProvider(RPC_URL);
}

// Créer un provider depuis le wallet du navigateur (MetaMask)
export function getBrowserProvider() {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
}

// Lire le solde USDC d'une adresse (sans connexion wallet, via RPC public)
export async function getUsdcBalance(address: string): Promise<number> {
  try {
    const provider = getPublicProvider();
    const contract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    return Number(ethers.formatUnits(balance, decimals));
  } catch (err) {
    console.error("Erreur lecture solde USDC:", err);
    throw err;
  }
}

// Lire le solde via le wallet connecté (plus fiable, signé)
export async function getUsdcBalanceFromWallet(signer: ethers.Signer): Promise<number> {
  const contract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);
  const address = await signer.getAddress();
  const balance = await contract.balanceOf(address);
  const decimals = await contract.decimals();
  return Number(ethers.formatUnits(balance, decimals));
}

// Formater une adresse pour l'affichage (0x1234...abcd)
export function shortenAddress(address: string): string {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

// ---------- Logique métier (affacturage & assurance) ----------

// Ratio de couverture = garantie / montant du prêt
export function coverageRatio(collateral: number, loanAmount: number): number {
  if (loanAmount <= 0) return 0;
  return (collateral / loanAmount) * 100;
}

// Taux d'affacturage (avance immédiate sur créance) selon la qualité de la garantie
// Plus le ratio est élevé, plus le taux d'avance est favorable
export function factoringAdvanceRate(ratio: number): number {
  if (ratio >= 150) return 0.95; // 95% avance
  if (ratio >= 120) return 0.90;
  if (ratio >= 100) return 0.85;
  if (ratio >= 80) return 0.75;
  return 0.60;
}

// Prime d'assurance annuelle en % du montant couvert
export function premiumRate(ratio: number): number {
  if (ratio >= 150) return 0.012; // 1.2% / an
  if (ratio >= 120) return 0.018;
  if (ratio >= 100) return 0.025;
  if (ratio >= 80) return 0.035;
  return 0.05;
}

// Prime totale pour une durée donnée (en années)
export function totalPremium(coveredAmount: number, ratio: number, years: number): number {
  return coveredAmount * premiumRate(ratio) * years;
}

// Éligibilité à l'assurance
export function isEligible(ratio: number): boolean {
  return ratio >= 80;
}

// Statut qualitatif de la garantie
export function collateralGrade(ratio: number): { label: string; color: string } {
  if (ratio >= 150) return { label: "Excellent", color: "#22c55e" };
  if (ratio >= 120) return { label: "Très bon", color: "#22d3ee" };
  if (ratio >= 100) return { label: "Bon", color: "#4f8cff" };
  if (ratio >= 80) return { label: "Acceptable", color: "#f5b942" };
  return { label: "Risqué", color: "#ef4444" };
}
