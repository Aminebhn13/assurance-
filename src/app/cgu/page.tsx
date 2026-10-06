export default function Page() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Conditions générales d'utilisation</h1>
      <p className="text-gray-400 mb-8">Dernière mise à jour : 2026-10-05</p>
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gold-light mb-3">Objet</h2>
        <p className="text-gray-300 leading-relaxed mb-3">Les présentes CGU régissent l'utilisation du site AssureCrypto. En accédant au site, vous acceptez les présentes conditions.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gold-light mb-3">Nature du service</h2>
        <p className="text-gray-300 leading-relaxed mb-3">AssureCrypto est un assureur de prêt. Il ne prête pas d'argent, ne finance rien et ne gère pas les fonds des utilisateurs.</p>
        <p className="text-gray-300 leading-relaxed mb-3">Le site permet de prouver sa solvabilité par wallet et de générer une attestation d'assurance indicative.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gold-light mb-3">Preuve de solvabilité</h2>
        <p className="text-gray-300 leading-relaxed mb-3">La preuve repose sur la signature d'un message SIWE (EIP-4361) et la lecture on-chain des soldes. Aucune transaction n'est déclenchée.</p>
        <p className="text-gray-300 leading-relaxed mb-3">Un solde est une photographie à un instant T. L'attestation est indicative tant que la police définitive n'est pas émise.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gold-light mb-3">Sécurité</h2>
        <p className="text-gray-300 leading-relaxed mb-3">AssureCrypto ne demande jamais d'approuver un contrat, de transférer des fonds ni de signer une transaction. Toute demande de ce type est frauduleuse.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gold-light mb-3">Responsabilité</h2>
        <p className="text-gray-300 leading-relaxed mb-3">[À COMPLÉTER : clauses de limitation de responsabilité]. Les informations fournies sont indicatives et ne constituent pas un conseil en investissement.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gold-light mb-3">Droit applicable</h2>
        <p className="text-gray-300 leading-relaxed mb-3">[À COMPLÉTER : juridiction compétente et loi applicable].</p>
      </section>
    </div>
  );
}
