export default function Page() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Politique de confidentialité</h1>
      <p className="text-gray-400 mb-8">Dernière mise à jour : 2026-10-05</p>
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gold-light mb-3">Données collectées</h2>
        <p className="text-gray-300 leading-relaxed mb-3">AssureCrypto collecte uniquement les données nécessaires à l'évaluation de solvabilité : adresse wallet, soldes on-chain, message SIWE signé, informations de prêt déclarées.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gold-light mb-3">Utilisation des données</h2>
        <p className="text-gray-300 leading-relaxed mb-3">Les données sont utilisées pour établir la preuve de solvabilité et générer l'attestation d'assurance. Elles sont transmises au fonds prêteur avec votre consentement.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gold-light mb-3">Stockage et sécurité</h2>
        <p className="text-gray-300 leading-relaxed mb-3">[À COMPLÉTER : durée de conservation, mesures de sécurité, localisation des serveurs].</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gold-light mb-3">Vos droits</h2>
        <p className="text-gray-300 leading-relaxed mb-3">Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Contact : [À COMPLÉTER : email DPO].</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gold-light mb-3">Cookies</h2>
        <p className="text-gray-300 leading-relaxed mb-3">[À COMPLÉTER : politique cookies, traceurs utilisés].</p>
      </section>
    </div>
  );
}
