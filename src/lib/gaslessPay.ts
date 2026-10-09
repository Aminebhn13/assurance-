"use client";
import { getActiveProvider } from "@/lib/wallet";
import {
  USDC_ADDRESS, PREMIUM_RECEIVER, CHAIN_ID, CHAIN_ID_HEX,
  USDC_DOMAIN_NAME, USDC_DOMAIN_VERSION, USDC_DECIMALS,
} from "@/lib/usdcConfig";

// Paiement GASLESS de la prime en USDC via EIP-3009 (transferWithAuthorization).
// Le client signe une autorisation BORNÉE (montant exact + destinataire exact),
// ne paie aucun gas et n'envoie aucune transaction. C'est le serveur (relayeur)
// qui soumet la transaction et paie les frais.
// Ce n'est PAS une autorisation ouverte (approve/permit) : l'autorisation vaut
// pour un seul transfert, d'un montant précis, vers un destinataire précis.

type Eip1193 = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> };

function randomNonce(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return "0x" + Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function toUnits(amountUsd: number): string {
  // Convertit un montant en USDC (6 décimales) sans flottant.
  const [int, frac = ""] = amountUsd.toFixed(USDC_DECIMALS).split(".");
  return (BigInt(int) * 10n ** BigInt(USDC_DECIMALS) + BigInt((frac + "000000").slice(0, USDC_DECIMALS))).toString();
}

export interface GaslessResult {
  txHash: string;
  amountUsdc: string;
  receiver: string;
}

export async function payPremiumGasless(amountUsd: number, fromAddress: string): Promise<GaslessResult> {
  if (!(amountUsd > 0)) throw new Error("Montant de prime invalide.");
  const provider = (getActiveProvider() ?? (window as unknown as { ethereum?: Eip1193 }).ethereum) as Eip1193 | undefined;
  if (!provider) throw new Error("Aucun wallet connecté.");

  const value = toUnits(amountUsd);
  const now = Math.floor(Date.now() / 1000);
  const validAfter = 0;
  const validBefore = now + 3600; // valable 1h
  const nonce = randomNonce();

  const typedData = {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      TransferWithAuthorization: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "validAfter", type: "uint256" },
        { name: "validBefore", type: "uint256" },
        { name: "nonce", type: "bytes32" },
      ],
    },
    primaryType: "TransferWithAuthorization",
    domain: {
      name: USDC_DOMAIN_NAME,
      version: USDC_DOMAIN_VERSION,
      chainId: CHAIN_ID,
      verifyingContract: USDC_ADDRESS,
    },
    message: {
      from: fromAddress,
      to: PREMIUM_RECEIVER,
      value,
      validAfter,
      validBefore,
      nonce,
    },
  };

  const signature = (await provider.request({
    method: "eth_signTypedData_v4",
    params: [fromAddress, JSON.stringify(typedData)],
  })) as string;

  const res = await fetch("/api/pay-premium", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromAddress,
      to: PREMIUM_RECEIVER,
      value,
      validAfter,
      validBefore,
      nonce,
      signature,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Le paiement gasless a échoué côté serveur.");
  }
  return { txHash: data.txHash as string, amountUsdc: amountUsd.toFixed(2), receiver: PREMIUM_RECEIVER };
}

export { CHAIN_ID_HEX };
