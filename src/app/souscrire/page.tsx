import SubscribeWizard from "@/components/SubscribeWizard";
import Callout from "@/components/Callout";

export default function Souscrire() {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2">Vérifier ma solvabilité</h1>
      <p className="text-gray-400 text-center mb-8">Obtenez votre attestation d&apos;assurance de prêt en 6 étapes.</p>
      <Callout variant="info" title="Aucune transaction, aucun transfert">
        Ce parcours ne déclenche <strong>aucune transaction</strong> et ne déplace <strong>aucun fonds</strong>. La seule
        signature demandée est un message texte (SIWE) qui ne donne aucune autorisation.
      </Callout>
      <SubscribeWizard />
    </div>
  );
}
