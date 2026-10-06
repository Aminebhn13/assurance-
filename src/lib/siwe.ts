import { ethers } from "ethers";

// Construction et vérification du message Sign-In with Ethereum (EIP-4361).
// Ce message est du texte lisible, ne coûte rien, ne déplace aucun fonds
// et ne donne AUCUNE autorisation de transfert.

export interface SiweMessageFields {
  domain: string;
  address: string;
  nonce: string;
  issuedAt: string;
  chainId: number;
  statement?: string;
}

export function buildSiweMessage({
  domain,
  address,
  nonce,
  issuedAt,
  chainId,
  statement = "Je certifie être le détenteur de cette adresse pour l'évaluation de solvabilité AssureCrypto. Cette signature n'autorise aucun transfert de fonds ni aucune transaction.",
}: SiweMessageFields): string {
  return [
    `${domain} veut que vous vous connectiez avec votre compte Ethereum :`,
    address,
    "",
    statement,
    "",
    `URI: https://${domain}`,
    `Version: 1`,
    `Chain ID: ${chainId}`,
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
  ].join("\n");
}

export function generateNonce(length = 16): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  const arr = new Uint8Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < length; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  for (let i = 0; i < length; i++) out += chars[arr[i] % chars.length];
  return out;
}

// Vérifie qu'une signature provient bien de l'adresse attendue.
// Retourne true si l'adresse récupérée correspond.
export function verifySiweSignature(message: string, signature: string, expectedAddress: string): boolean {
  try {
    const recovered = ethers.verifyMessage(message, signature);
    return recovered.toLowerCase() === expectedAddress.toLowerCase();
  } catch {
    return false;
  }
}
