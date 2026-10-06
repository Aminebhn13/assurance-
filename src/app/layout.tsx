import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SecurityBanner from "@/components/SecurityBanner";

export const metadata: Metadata = {
  title: "AssureCrypto — Assurance de prêt crypto",
  description: "L'assurance qui rassure votre prêteur. Preuve de solvabilité par wallet et couverture de prêt crypto.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-navy text-white antialiased">
        <SecurityBanner />
        <Header />
        <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
