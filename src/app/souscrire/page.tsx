import SubscribeWizard from "@/components/SubscribeWizard";
import Callout from "@/components/Callout";

export default function Souscrire() {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2">Vérifier ma solvabilité</h1>
      <p className="text-gray-400 text-center mb-8">Obtenez votre attestation d&apos;assurance de prêt en 7 étapes.</p>
      <Callout variant="info" title="Vérification sans risque, paiement explicite">
        La vérification de solvabilité ne déplace <strong>aucun fonds</strong> : la seule signature demandée est un message
        texte (SIWE) sans aucune autorisation. Le <strong>paiement de la prime</strong> est un transfert USDC d&apos;un
        <strong> montant affiché</strong>, que vous confirmez vous-même dans votre wallet. AssureCrypto ne vous demandera
        jamais d&apos;approuver un contrat ni de signer une autorisation ouverte.
      </Callout>
      <SubscribeWizard />
    </div>
  );
}
