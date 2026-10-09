import { NextResponse } from "next/server";
import { ethers } from "ethers";
import {
  USDC_ADDRESS, PREMIUM_RECEIVER, CHAIN_ID,
  USDC_DOMAIN_NAME, USDC_DOMAIN_VERSION, USDC_DECIMALS, MIN_PREMIUM_USDC,
} from "@/lib/usdcConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const USDC_ABI = [
  "function transferWithAuthorization(address from, address to, uint256 value, uint256 validAfter, uint256 validBefore, bytes32 nonce, uint8 v, bytes32 r, bytes32 s)",
];

function rpcUrl(): string {
  return (
    process.env.RELAYER_RPC_URL ||
    process.env.NEXT_PUBLIC_RPC_URL ||
    "https://eth.llamarpc.com"
  );
}

export async function POST(req: Request) {
  const pk = process.env.RELAYER_PRIVATE_KEY;
  if (!pk) {
    return NextResponse.json(
      { error: "Paiement sans frais indisponible : le relayeur n'est pas configuré. Réessayez le paiement classique." },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const { from, to, value, validAfter, validBefore, nonce, signature } = body as {
    from: string; to: string; value: string;
    validAfter: number; validBefore: number; nonce: string; signature: string;
  };

  // --- Validations anti-abus ---
  if (!from || !to || !value || !nonce || !signature) {
    return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
  }
  if (to.toLowerCase() !== PREMIUM_RECEIVER.toLowerCase()) {
    return NextResponse.json({ error: "Destinataire non autorisé." }, { status: 400 });
  }
  let valueBn: bigint;
  try {
    valueBn = BigInt(value);
  } catch {
    return NextResponse.json({ error: "Montant invalide." }, { status: 400 });
  }
  const minUnits = BigInt(Math.round(MIN_PREMIUM_USDC * 10 ** USDC_DECIMALS));
  if (valueBn < minUnits) {
    return NextResponse.json({ error: `Montant trop faible (minimum ${MIN_PREMIUM_USDC} USDC).` }, { status: 400 });
  }
  const now = Math.floor(Date.now() / 1000);
  if (Number(validBefore) < now) {
    return NextResponse.json({ error: "Autorisation expirée." }, { status: 400 });
  }

  // --- Vérifie que la signature provient bien de `from` ---
  const domain = {
    name: USDC_DOMAIN_NAME,
    version: USDC_DOMAIN_VERSION,
    chainId: CHAIN_ID,
    verifyingContract: USDC_ADDRESS,
  };
  const types = {
    TransferWithAuthorization: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
    ],
  };
  const message = { from, to, value, validAfter, validBefore, nonce };
  try {
    const recovered = ethers.verifyTypedData(domain, types, message, signature);
    if (recovered.toLowerCase() !== from.toLowerCase()) {
      return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Signature illisible." }, { status: 400 });
  }

  // --- Soumission par le relayeur (il paie le gas) ---
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl());
    const relayer = new ethers.Wallet(pk, provider);
    const usdc = new ethers.Contract(USDC_ADDRESS, USDC_ABI, relayer);
    const sig = ethers.Signature.from(signature);

    const tx = await usdc.transferWithAuthorization(
      from, to, value, validAfter, validBefore, nonce, sig.v, sig.r, sig.s
    );
    return NextResponse.json({ txHash: tx.hash });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur lors de la soumission.";
    // Erreurs fréquentes : relayeur sans ETH pour le gas, nonce déjà utilisé, RPC indisponible.
    return NextResponse.json({ error: `Soumission impossible : ${msg}` }, { status: 502 });
  }
}
