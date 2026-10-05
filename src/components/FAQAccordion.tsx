"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "Fonctionnement",
    items: [
      { q: "Qu'est-ce qu'AssureCrypto ?", a: "AssureCrypto est un assureur de prêt crypto. Il ne prête pas d'argent et ne finance rien : il couvre le prêteur contre le défaut de remboursement de l'emprunteur." },
      { q: "AssureCrypto prête-t-il de l'argent ?", a: "Non. AssureCrypto ne prête pas et ne finance rien. Il émet des attestations d'assurance de prêt qui rassurent les fonds prêteurs." },
      { q: "Comment obtenir un financement ?", a: "Vous demandez un financement à un fonds partenaire. Le fonds exige une preuve de solvabilité et une assurance. AssureCrypto vous fournit l'attestation." },
      { q: "Combien de temps prend la souscription ?", a: "La connexion, la vérification des soldes et la génération de l'attestation prennent quelques minutes. L'émission de la police définitive dépend du porteur de risque." },
      { q: "Que se passe-t-il en cas de défaut ?", a: "Le fonds déclare le sinistre. AssureCrypto instruit et, si le sinistre est couvert, indemnise le fonds selon la police. La subrogation peut ensuite être exercée." },
    ],
  },
  {
    group: "Wallet & sécurité",
    items: [
      { q: "Quels wallets sont supportés ?", a: "MetaMask (EIP-1193) et tout wallet compatible WalletConnect (Reown), sur Ethereum Mainnet." },
      { q: "La signature SIWE est-elle dangereuse ?", a: "Non. C'est un message texte lisible qui prouve que vous contrôlez l'adresse, sans donner aucune autorisation de transfert." },
      { q: "AssureCrypto demande-t-il une approbation ?", a: "Jamais. AssureCrypto ne demande jamais d'approuver un contrat, de transférer des fonds ni de signer une transaction." },
      { q: "Mes fonds sont-ils en danger ?", a: "Non. AssureCrypto lit vos soldes en lecture seule et ne déplace aucun actif. Vos fonds restent sous votre contrôle." },
      { q: "Que faire si un site me demande d'approuver ?", a: "C'est une arnaque. Un site prétendant être AssureCrypto ne vous demandera jamais d'approuver quoi que ce soit. Fermez-le immédiatement." },
    ],
  },
  {
    group: "Tarifs",
    items: [
      { q: "Comment la prime est-elle calculée ?", a: "La prime dépend du montant du prêt, de la durée, de la formule choisie (Essentielle, Standard, Premium) et de votre score de solvabilité." },
      { q: "Les tarifs sont-ils définitifs ?", a: "Non, ils sont indicatifs. La prime définitive dépend de l'émission de la police par le porteur de risque." },
      { q: "Comment payer la prime ?", a: "Le paiement se fait par contact commercial / virement. Aucun paiement on-chain n'est déclenché depuis ce site." },
      { q: "Y a-t-il une franchise ?", a: "Oui, chaque formule comporte une franchise (10 à 20 %), c'est-à-dire la part du sinistre qui reste à la charge du bénéficiaire." },
    ],
  },
  {
    group: "Sinistres",
    items: [
      { q: "Comment déclarer un sinistre ?", a: "Le fonds déclare le sinistre auprès d'AssureCrypto avec la preuve de défaut (échéances impayées, mise en demeure)." },
      { q: "Qui est indemnisé en cas de sinistre ?", a: "Le fonds prêteur, bénéficiaire de la police. AssureCrypto peut ensuite être subrogé dans ses droits pour recouvrer auprès de l'emprunteur." },
      { q: "Quel est le délai d'indemnisation ?", a: "[À COMPLÉTER : délai d'indemnisation après instruction du sinistre]." },
    ],
  },
  {
    group: "Fonds",
    items: [
      { q: "Comment un fonds vérifie-t-il une attestation ?", a: "En vérifiant la signature SIWE (ethers.verifyMessage) et en recoupant les soldes avec la blockchain à la date indiquée." },
      { q: "Comment devenir fonds partenaire ?", a: "Contactez AssureCrypto à [À COMPLÉTER : email de contact] pour intégrer la vérification d'attestations et la procédure de sinistre." },
    ],
  },
  {
    group: "Juridique",
    items: [
      { q: "AssureCrypto est-il régulé ?", a: "[À COMPLÉTER : n° d'agrément ACPR / ORIAS]. Consultez les mentions légales et les CGU pour plus d'informations." },
      { q: "Qui est le porteur de risque ?", a: "[À COMPLÉTER : nom du porteur de risque]. L'attestation est indicative tant que la police définitive n'est pas émise." },
      { q: "Mes données sont-elles protégées ?", a: "Consultez notre politique de confidentialité pour comprendre comment vos données sont traitées." },
    ],
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-8">
      {FAQS.map((g) => (
        <div key={g.group}>
          <h2 className="text-xl font-bold text-gold-light mb-4">{g.group}</h2>
          <div className="space-y-2">
            {g.items.map((item) => {
              const id = g.group + item.q;
              const isOpen = open === id;
              return (
                <div key={id} className="glass rounded-xl overflow-hidden">
                  <button onClick={() => setOpen(isOpen ? null : id)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                    <span className="font-medium">{item.q}</span>
                    <ChevronDown size={18} className={`transition ${isOpen ? "rotate-180" : ""} text-gold-light`} />
                  </button>
                  {isOpen && <p className="px-5 pb-4 text-sm text-gray-300 leading-relaxed">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
