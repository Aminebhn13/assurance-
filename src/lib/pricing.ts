// Calcul des prix USD, du score de solvabilité, du ratio de couverture et des primes.
// Les prix sont indicatifs. Les valeurs de repli sont utilisées si l'API prix échoue.

export interface Prices {
  eth: number;
  usdc: number;
  usdt: number;
  source: "live" | "fallback";
}

// Valeurs de repli (indicatives, à ajuster) si CoinGecko est indisponible.
const FALLBACK_PRICES: Prices = { eth: 3000, usdc: 1, usdt: 1, source: "fallback" };

export async function fetchPrices(): Promise<Prices> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,tether,usd-coin&vs_currencies=usd",
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return FALLBACK_PRICES;
    const data = await res.json();
    return {
      eth: data.ethereum?.usd ?? FALLBACK_PRICES.eth,
      usdc: data["usd-coin"]?.usd ?? FALLBACK_PRICES.usdc,
      usdt: data.tether?.usd ?? FALLBACK_PRICES.usdt,
      source: "live",
    };
  } catch {
    return FALLBACK_PRICES;
  }
}

export interface SolvencyResult {
  totalUsd: number;
  ethUsd: number;
  usdcUsd: number;
  usdtUsd: number;
  loanAmountUsd: number;
  coverageRatio: number; // %
  score: "A" | "B" | "C" | "D" | "E";
}

// Score basé sur le ratio de couverture (actifs vérifiés / prêt demandé).
export function scoreFromRatio(ratio: number): SolvencyResult["score"] {
  if (ratio >= 150) return "A";
  if (ratio >= 120) return "B";
  if (ratio >= 100) return "C";
  if (ratio >= 70) return "D";
  return "E";
}

export function computeSolvency(
  eth: string,
  usdc: string | null,
  usdt: string | null,
  prices: Prices,
  loanAmountUsd: number
): SolvencyResult {
  const ethUsd = parseFloat(eth) * prices.eth;
  const usdcUsd = usdc ? parseFloat(usdc) * prices.usdc : 0;
  const usdtUsd = usdt ? parseFloat(usdt) * prices.usdt : 0;
  const totalUsd = ethUsd + usdcUsd + usdtUsd;
  const coverageRatio = loanAmountUsd > 0 ? (totalUsd / loanAmountUsd) * 100 : 0;
  return {
    totalUsd,
    ethUsd,
    usdcUsd,
    usdtUsd,
    loanAmountUsd,
    coverageRatio,
    score: scoreFromRatio(coverageRatio),
  };
}

export interface CoveragePlan {
  id: "essentielle" | "standard" | "premium";
  name: string;
  coverageRate: number; // % du prêt couvert
  franchise: number; // % de franchise
  annualRate: number; // taux de prime annuel
}

export const COVERAGE_PLANS: CoveragePlan[] = [
  { id: "essentielle", name: "Essentielle", coverageRate: 0.5, franchise: 0.2, annualRate: 0.035 },
  { id: "standard", name: "Standard", coverageRate: 0.7, franchise: 0.15, annualRate: 0.045 },
  { id: "premium", name: "Premium", coverageRate: 0.9, franchise: 0.1, annualRate: 0.06 },
];

export function computePremium(loanAmountUsd: number, durationMonths: number, plan: CoveragePlan): number {
  const annual = loanAmountUsd * plan.annualRate;
  return (annual * durationMonths) / 12;
}
