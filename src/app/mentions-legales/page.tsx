export default function Page() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Mentions légales</h1>
      <p className="text-gray-400 mb-8">Dernière mise à jour : 2026-10-05</p>
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gold-light mb-3">Éditeur du site</h2>
        <p className="text-gray-300 leading-relaxed mb-3">AssureCrypto — [À COMPLÉTER : raison sociale], [À COMPLÉTER : forme juridique], au capital de [À COMPLÉTER : capital social] euros.</p>
        <p className="text-gray-300 leading-relaxed mb-3">Siège social : [À COMPLÉTER : adresse du siège]. SIRET : [À COMPLÉTER : n° SIRET].</p>
        <p className="text-gray-300 leading-relaxed mb-3">Directeur de la publication : [À COMPLÉTER : nom]. Contact : [À COMPLÉTER : email].</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gold-light mb-3">Activité d'assurance</h2>
        <p className="text-gray-300 leading-relaxed mb-3">AssureCrypto exerce une activité d'assurance de prêt. [À COMPLÉTER : n° d'agrément ACPR / ORIAS].</p>
        <p className="text-gray-300 leading-relaxed mb-3">Le porteur de risque est [À COMPLÉTER : nom du porteur de risque]. L'émission des polices définitives relève de ce porteur.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gold-light mb-3">Hébergement</h2>
        <p className="text-gray-300 leading-relaxed mb-3">Le site est hébergé par [À COMPLÉTER : hébergeur, adresse]. Déployé sur la plateforme Vercel.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gold-light mb-3">Propriété intellectuelle</h2>
        <p className="text-gray-300 leading-relaxed mb-3">L'ensemble des contenus du site (textes, graphismes, logo) est protégé par le droit d'auteur. Toute reproduction sans autorisation est interdite.</p>
      </section>
    </div>
  );
}
