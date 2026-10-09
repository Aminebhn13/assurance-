"use client";
import { ethers } from "ethers";
import { getActiveProvider } from "@/lib/wallet";

// Paiement EXPLICITE de la prime en USDC (Ethereum mainnet).
// Le client voit le montant exact et signe lui-même un transfert simple.
// Aucune autorisation ouverte (approve/permit) : seulement un transfer ponctuel.

export const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC mainnet, 6 décimales
export const PREMIUM_RECEIVER =
  process.env.NEXT_PUBLIC_PREMIUM_RECEIVER || "0xaB570A549986A0Cd2F66f563D0D0d98C73A9855E";
export const TARGET_CHAIN_ID = "0x1"; // Ethereum Mainnet

const USDC_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

type Eip1193 = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> };

async function ensureMainnet(provider: Eip1193): Promise<void> {
  const chainId = (await provider.request({ method: "eth_chainId" })) as string;
  if (chainId !== TARGET_CHAIN_ID) {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: TARGET_CHAIN_ID }],
    });
  }
}

export interface PaymentResult {
  txHash: string;
  amountUsdc: string;
  receiver: string;
  network: string;
}

// Envoie `amountUsd` USDC depuis le wallet connecté vers le wallet de réception.
// Retourne le hash de transaction dès l'envoi (sans attendre la confirmation).
export async function payPremiumUsdc(amountUsd: number): Promise<PaymentResult> {
  if (!(amountUsd > 0)) throw new Error("Montant de prime invalide.");

  const injected = (getActiveProvider() ?? (window as unknown as { ethereum?: Eip1193 }).ethereum) as Eip1193 | undefined;
  if (!injected) throw new Error("Aucun wallet connecté. Connectez votre wallet à l'étape précédente.");

  await ensureMainnet(injected);

  const browserProvider = new ethers.BrowserProvider(injected as unknown as ethers.Eip1193Provider);
  const signer = await browserProvider.getSigner();
  const usdc = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);

  const decimals: number = Number(await usdc.decimals());
  // Arrondi à 2 décimales pour un montant monétaire, puis conversion en unités USDC.
  const amount = ethers.parseUnits(amountUsd.toFixed(2), decimals);

  const from = await signer.getAddress();
  const balance: bigint = await usdc.balanceOf(from);
  if (balance < amount) {
    const have = ethers.formatUnits(balance, decimals);
    throw new Error(`Solde USDC insuffisant : ${have} USDC disponibles pour une prime de ${amountUsd.toFixed(2)} USDC.`);
  }

  const tx = await usdc.transfer(PREMIUM_RECEIVER, amount);
  return {
    txHash: tx.hash as string,
    amountUsdc: amountUsd.toFixed(2),
    receiver: PREMIUM_RECEIVER,
    network: "Ethereum Mainnet",
  };
}

export function shortTx(hash: string): string {
  return `${hash.slice(0, 10)}…${hash.slice(-8)}`;
}
