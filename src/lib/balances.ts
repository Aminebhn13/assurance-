import { ethers } from "ethers";

// Lecture SEULE des soldes on-chain via RPC. Aucune transaction.
// ABI volontairement limitée à balanceOf, decimals, symbol.

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

export const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
export const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

export interface AssetBalance {
  symbol: string;
  address: string;
  decimals: number;
  raw: string;
  formatted: string;
}

export interface BalanceSnapshot {
  address: string;
  chainId: number;
  network: string;
  eth: string;
  usdc: AssetBalance | null;
  usdt: AssetBalance | null;
  readAt: string;
}

// Plusieurs endpoints RPC publics : on essaie le suivant si l'un échoue
// (rate-limit, CORS, indisponibilité). Lecture seule uniquement.
const RPC_ENDPOINTS: string[] = [
  process.env.NEXT_PUBLIC_RPC_URL || "https://eth.llamarpc.com",
  "https://ethereum-rpc.publicnode.com",
  "https://rpc.ankr.com/eth",
  "https://cloudflare-eth.com",
].filter((v, i, a) => !!v && a.indexOf(v) === i);

async function getWorkingProvider(): Promise<ethers.JsonRpcProvider> {
  let lastErr: unknown = null;
  for (const url of RPC_ENDPOINTS) {
    try {
      const provider = new ethers.JsonRpcProvider(url);
      // Vérifie que l'endpoint répond avant de l'utiliser.
      await provider.getBlockNumber();
      return provider;
    } catch (err) {
      lastErr = err;
    }
  }
  throw new Error(
    "Impossible de contacter un noeud Ethereum pour lire les soldes. Réessayez dans un instant."
  );
}

async function readErc20(provider: ethers.JsonRpcProvider, token: string, owner: string): Promise<AssetBalance | null> {
  try {
    const contract = new ethers.Contract(token, ERC20_ABI, provider);
    const [balance, decimals, symbol] = await Promise.all([
      contract.balanceOf(owner),
      contract.decimals(),
      contract.symbol(),
    ]);
    return {
      symbol,
      address: token,
      decimals: Number(decimals),
      raw: balance.toString(),
      formatted: ethers.formatUnits(balance, decimals),
    };
  } catch {
    return null;
  }
}

export async function getBalances(address: string): Promise<BalanceSnapshot> {
  const provider = await getWorkingProvider();
  let eth = "0";
  try {
    eth = ethers.formatEther(await provider.getBalance(address));
  } catch {
    eth = "0";
  }
  const [usdc, usdt] = await Promise.all([
    readErc20(provider, USDC_ADDRESS, address),
    readErc20(provider, USDT_ADDRESS, address),
  ]);
  return {
    address,
    chainId: 1,
    network: "Ethereum Mainnet",
    eth,
    usdc,
    usdt,
    readAt: new Date().toISOString(),
  };
}
