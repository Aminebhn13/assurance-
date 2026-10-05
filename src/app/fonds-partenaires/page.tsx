import TOC from "@/components/TOC";
import Callout from "@/components/Callout";

const TOC_ITEMS = [
  { id: "attestation", label: "Ce que contient l'attestation" },
  { id: "verifier", label: "Comment vérifier son authenticité" },
  { id: "sinistre", label: "Procédure de sinistre" },
  { id: "devenir", label: "Devenir fonds partenaire" },
  { id: "retenir", label: "À retenir" },
];

export default function FondsPartenaires() {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Fonds partenaires</h1>
      <p className="text-gray-400 mb-8">Espace dédié aux fonds d&apos;investissement : vérification des attestations et procédure de sinistre.</p>

      <TOC items={TOC_ITEMS} />

      <section id="attestation" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Ce que contient l&apos;attestation</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Chaque attestation émise par AssureCrypto contient les éléments suivants :
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Le <strong>numéro d&apos;attestation</strong> unique.</li>
          <li>L&apos;<strong>adresse wallet</strong> de l&apos;emprunteur.</li>
          <li>Le <strong>message signé</strong> (SIWE) et sa <strong>signature</strong>.</li>
          <li>Les <strong>soldes vérifiés</strong> et la <strong>date de lecture</strong>.</li>
          <li>Le <strong>montant et la durée</strong> du prêt demandé.</li>
          <li>La <strong>formule de couverture</strong> choisie.</li>
          <li>La mention « Document indicatif en attente d&apos;émission définitive par le porteur de risque ».</li>
        </ul>
      </section>

      <section id="verifier" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Comment vérifier son authenticité</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Un fonds peut vérifier l&apos;authenticité d&apos;une attestation de deux manières :
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass rounded-xl p-6">
            <h3 className="font-semibold text-gold-light mb-2">1. Vérification de la signature SIWE</h3>
            <p className="text-sm text-gray-300 leading-relaxed">Le message signé peut être vérifié avec <code>ethers.verifyMessage</code>. L&apos;adresse récupérée doit correspondre à l&apos;adresse déclarée dans l&apos;attestation.</p>
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="font-semibold text-gold-light mb-2">2. Vérification des soldes à la date indiquée</h3>
            <p className="text-sm text-gray-300 leading-relaxed">Les soldes peuvent être recoupés avec la blockchain à la date de lecture indiquée. C&apos;est une vérification publique et indépendante.</p>
          </div>
        </div>
        <Callout variant="info" title="Recommandation">
          Pour toute vérification d&apos;authenticité, contactez AssureCrypto à [À COMPLÉTER : email de contact] avec le
          numéro d&apos;attestation.
        </Callout>
      </section>

      <section id="sinistre" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Procédure de sinistre</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          En cas de défaut de remboursement de l&apos;emprunteur, le fonds peut déclarer un sinistre :
        </p>
        <div className="space-y-3">
          {[
            { n: "1", t: "Déclaration", d: "Le fonds déclare le sinistre auprès d'AssureCrypto avec la preuve de défaut (échéances impayées, mise en demeure)." },
            { n: "2", t: "Instruction", d: "AssureCrypto instruit le dossier : vérification de la police, du défaut et des conditions de couverture." },
            { n: "3", t: "Indemnisation", d: "Si le sinistre est couvert, l'assurance indemnise le fonds selon le taux de couverture et la franchise de la police." },
            { n: "4", t: "Subrogation", d: "AssureCrypto peut être subrogé dans les droits du fonds pour recouvrer auprès de l'emprunteur." },
          ].map((s) => (
            <div key={s.n} className="flex gap-4 glass rounded-xl p-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold text-navy-dark font-bold flex items-center justify-center">{s.n}</div>
              <div>
                <h3 className="font-semibold text-gold-light">{s.t}</h3>
                <p className="text-sm text-gray-300 mt-1">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="devenir" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Devenir fonds partenaire</h2>
        <p className="text-gray-300 leading-relaxed">
          Si vous êtes un fonds d&apos;investissement et souhaitez proposer l&apos;assurance AssureCrypto à vos emprunteurs,
          contactez-nous à [À COMPLÉTER : email de contact]. Nous vous accompagnerons dans l&apos;intégration de la
          vérification d&apos;attestations et de la procédure de sinistre.
        </p>
      </section>

      <section id="retenir">
        <Callout variant="success" title="À retenir">
          <ul className="list-disc list-inside space-y-1">
            <li>L&apos;attestation contient signature SIWE, soldes, montant, durée et formule.</li>
            <li>Son authenticité se vérifie par la signature et les soldes on-chain.</li>
            <li>La procédure de sinistre est claire : déclaration, instruction, indemnisation, subrogation.</li>
          </ul>
        </Callout>
      </section>
    </div>
  );
}
