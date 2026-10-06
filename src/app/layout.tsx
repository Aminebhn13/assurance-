import type { Metadata } from "next";
import "./globals.css";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AssureCrypto — Assurance & Affacturage pour prêts crypto",
  description:
    "Sécurise tes prêts crypto et débloque ta trésorerie immédiatement. Vérifie tes garanties USDC sur la blockchain Ethereum et souscris une assurance en un clic.",
  keywords: [
    "assurance crypto",
    "affacturage",
    "prêt crypto",
    "garantie USDC",
    "stablecoin",
    "assurance décentralisée",
    "ethereum",
  ],
  openGraph: {
    title: "AssureCrypto — Assurance & Affacturage crypto",
    description: "Sécurise tes prêts crypto et débloque ta trésorerie immédiatement.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-dark-900 text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
