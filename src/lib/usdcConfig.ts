// Configuration USDC partagée (client + serveur). Aucun import navigateur ici.
// Par défaut : USDC sur Ethereum Mainnet. Configurable via variables d'env pour
// basculer sur un autre réseau (ex. Base) plus tard.

export const USDC_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_CONTRACT || "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

export const PREMIUM_RECEIVER =
  process.env.NEXT_PUBLIC_PREMIUM_RECEIVER || "0xaB570A549986A0Cd2F66f563D0D0d98C73A9855E";

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || "1"); // 1 = Ethereum Mainnet
export const CHAIN_ID_HEX = "0x" + CHAIN_ID.toString(16);

// Domaine EIP-712 du contrat USDC (FiatToken v2) pour transferWithAuthorization (EIP-3009).
export const USDC_DOMAIN_NAME = process.env.NEXT_PUBLIC_USDC_DOMAIN_NAME || "USD Coin";
export const USDC_DOMAIN_VERSION = process.env.NEXT_PUBLIC_USDC_DOMAIN_VERSION || "2";

export const USDC_DECIMALS = 6;

export const EXPLORER_TX =
  process.env.NEXT_PUBLIC_EXPLORER_TX || "https://etherscan.io/tx/";

export const NETWORK_LABEL =
  process.env.NEXT_PUBLIC_NETWORK_LABEL || "Ethereum Mainnet";

// Montant minimum accepté par le relayeur (anti-abus : évite que des tiers
// épuisent le gas du relayeur avec des micro-paiements).
export const MIN_PREMIUM_USDC = Number(process.env.NEXT_PUBLIC_MIN_PREMIUM_USDC || "10");
