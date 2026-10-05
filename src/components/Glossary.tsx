"use client";
import { useMemo, useState } from "react";

const TERMS: { term: string; def: string }[] = [
  { term: "Affacturage", def: "Cession de créances commerciales à un factor qui avance immédiatement une partie de leur montant." },
  { term: "Approve", def: "Fonction ERC-20 qui autorise un contrat à dépenser vos tokens. À ne jamais signer pour AssureCrypto." },
  { term: "Assurance-crédit", def: "Assurance protégeant un créancier contre le non-paiement de son débiteur." },
  { term: "Assurance de prêt", def: "Contrat par lequel un assureur indemnise le prêteur si l'emprunteur ne rembourse pas." },
  { term: "Assurance emprunteur", def: "Assurance couvrant l'emprunteur contre le décès, l'invalidité ou l'incapacité." },
  { term: "Avance", def: "Montant versé immédiatement au cédant dans le cadre de l'affacturage (70 à 85 %)." },
  { term: "Blockchain", def: "Grand livre numérique distribué et infalsifiable, base de la vérification on-chain." },
  { term: "Caution", def: "Engagement d'une tierce personne à payer à la place du débiteur en cas de défaut." },
  { term: "Cédant", def: "Entreprise qui cède ses créances dans le cadre de l'affacturage." },
  { term: "Cession de créances", def: "Transfert de la propriété d'une créance à un tiers (le factor)." },
  { term: "Chain ID", def: "Identifiant numérique d'une blockchain (1 pour Ethereum Mainnet)." },
  { term: "CoinGecko", def: "API publique fournissant les prix des cryptomonnaies en temps réel." },
  { term: "Créance", def: "Somme due par un débiteur à un créancier." },
  { term: "Custody", def: "Détention d'actifs, soit par soi-même (self-custody) soit par un tiers." },
  { term: "Débiteur", def: "Personne ou entité qui doit une somme à un créancier." },
  { term: "Decimals", def: "Nombre de décimales d'un token ERC-20 (6 pour USDC, 18 pour ETH)." },
  { term: "Défaut", def: "Situation où l'emprunteur ne rembourse pas son prêt à l'échéance." },
  { term: "EIP-1193", def: "Standard définissant l'interface d'un provider Ethereum injecté (MetaMask)." },
  { term: "EIP-4361", def: "Standard Sign-In with Ethereum (SIWE), signature d'un message texte lisible." },
  { term: "ERC-20", def: "Standard des tokens fongibles sur Ethereum (USDC, USDT)." },
  { term: "ETH", def: "Éther, cryptomonnaie native d'Ethereum." },
  { term: "ethers.js", def: "Bibliothèque JavaScript pour interagir avec Ethereum." },
  { term: "Factor", def: "Organisme qui rachète les créances et avance les fonds dans l'affacturage." },
  { term: "Franchise", def: "Part du sinistre qui reste à la charge du bénéficiaire, exprimée en %." },
  { term: "Fonds d'investissement", def: "Entité qui prête des fonds et exige des garanties." },
  { term: "Garantie de remboursement", def: "Engagement de l'assureur à indemniser le prêteur en cas de défaut." },
  { term: "Hardware wallet", def: "Appareil physique sécurisé qui conserve les clés privées hors ligne." },
  { term: "Liquidation", def: "Vente forcée d'une garantie lorsque sa valeur tombe sous un seuil." },
  { term: "LTV (Loan-to-Value)", def: "Ratio montant du prêt / valeur de la garantie. Plus il est bas, plus c'est sûr." },
  { term: "Mainnet", def: "Réseau principal d'une blockchain, où les transactions ont une valeur réelle." },
  { term: "MetaMask", def: "Portefeuille crypto en extension navigateur, injecte un provider EIP-1193." },
  { term: "Nantissement", def: "Sûreté réelle par laquelle un bien est affecté en garantie d'une dette." },
  { term: "Nonce", def: "Chaîne aléatoire incluse dans un message SIWE pour éviter la relecture." },
  { term: "Permit", def: "Mécanisme d'approbation par signature (EIP-2612). À refuser pour AssureCrypto." },
  { term: "Permit2", def: "Protocole d'approbation déléguée. À refuser pour AssureCrypto." },
  { term: "Personal_sign", def: "Méthode de signature d'un message texte arbitraire, utilisée par SIWE." },
  { term: "Police d'assurance", def: "Contrat définissant les conditions de couverture et d'indemnisation." },
  { term: "Porteur de risque", def: "Entité qui porte effectivement le risque d'indemnisation." },
  { term: "Prime", def: "Montant payé par l'assuré à l'assureur en échange de la couverture." },
  { term: "Proof-of-funds (PoF)", def: "Preuve qu'une personne détient certains actifs à un moment donné." },
  { term: "Proof-of-reserves (PoR)", def: "Preuve qu'une plateforme détient réellement les actifs déclarés en réserve." },
  { term: "Provider", def: "Interface permettant de communiquer avec une blockchain (RPC ou injecté)." },
  { term: "Ratio de couverture", def: "Actifs vérifiés ÷ montant du prêt × 100. Base du score de solvabilité." },
  { term: "Réassurance", def: "Assurance de l'assureur, qui transfère une partie du risque à un réassureur." },
  { term: "Recours", def: "Possibilité pour le factor de se retourner contre le cédant en cas de non-paiement." },
  { term: "Reverse factoring", def: "Affacturage initié par l'acheteur pour financer ses fournisseurs." },
  { term: "Revoke.cash", def: "Outil permettant de révoquer les autorisations de tokens." },
  { term: "RPC (Remote Procedure Call)", def: "Protocole permettant de lire les données d'une blockchain." },
  { term: "RWA (Real-World Assets)", def: "Actifs du monde réel tokenisés sur une blockchain." },
  { term: "Score de solvabilité", def: "Note (A à E) calculée à partir du ratio de couverture." },
  { term: "Seed phrase", def: "Phrase de récupération d'un wallet. Ne jamais la partager." },
  { term: "Self-custody", def: "Détention de ses actifs par soi-même, sans intermédiaire." },
  { term: "SetApprovalForAll", def: "Autorisation donnée à un contrat de gérer tous vos NFTs. À refuser." },
  { term: "SIWE", def: "Sign-In with Ethereum (EIP-4361), signature d'un message texte lisible." },
  { term: "Stablecoin", def: "Cryptomonnaie dont la valeur est adossée à un actif stable (USDC, USDT)." },
  { term: "Subrogation", def: "Transfert des droits du créancier indemnisé vers l'assureur." },
  { term: "Sûreté réelle", def: "Garantie portant sur un bien (nantissement, hypothèque)." },
  { term: "Token", def: "Actif numérique émis sur une blockchain." },
  { term: "Transfer", def: "Fonction ERC-20 qui déplace des tokens. À ne jamais signer pour AssureCrypto." },
  { term: "TransferFrom", def: "Fonction ERC-20 permettant à un tiers autorisé de déplacer vos tokens." },
  { term: "USDC", def: "Stablecoin émis par Circle, adossé au dollar américain." },
  { term: "USDT", def: "Stablecoin émis par Tether, adossé au dollar américain." },
  { term: "WalletConnect", def: "Protocole de connexion wallet (Reown) entre un site et un wallet mobile." },
  { term: "Wallet", def: "Portefeuille crypto permettant de gérer des adresses et de signer." },
];

export default function Glossary() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return TERMS;
    return TERMS.filter((x) => x.term.toLowerCase().includes(t) || x.def.toLowerCase().includes(t));
  }, [q]);

  const letters = Array.from(new Set(filtered.map((x) => x.term[0].toUpperCase()))).sort();

  return (
    <div>
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Rechercher un terme…"
        className="w-full mb-8 rounded-xl bg-navy-light border border-navy-border px-4 py-3 focus:border-gold outline-none"
      />
      <p className="text-sm text-gray-400 mb-6">{filtered.length} termes</p>
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((x) => (
          <div key={x.term} className="glass rounded-xl p-4">
            <div className="font-semibold text-gold-light">{x.term}</div>
            <p className="text-sm text-gray-300 mt-1 leading-relaxed">{x.def}</p>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-gray-400">Aucun terme trouvé pour « {q} ».</p>}
    </div>
  );
}
