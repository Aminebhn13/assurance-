import TOC from "@/components/TOC";
import Callout from "@/components/Callout";

const TOC_ITEMS = [
  { id: "definition", label: "Qu'est-ce qu'une assurance de prêt ?" },
  { id: "assurance-credit", label: "Assurance-crédit et garantie de remboursement" },
  { id: "differences", label: "Différences avec caution, nantissement, assurance emprunteur" },
  { id: "crypto", label: "Spécificités crypto" },
  { id: "retenir", label: "À retenir" },
];

export default function AssuranceDePret() {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Assurance de prêt</h1>
      <p className="text-gray-400 mb-8">Tout comprendre sur l'assurance de prêt, la garantie de remboursement et ses spécificités crypto.</p>

      <TOC items={TOC_ITEMS} />

      <section id="definition" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Qu&apos;est-ce qu&apos;une assurance de prêt ?</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Une <strong>assurance de prêt</strong> (aussi appelée <em>assurance-crédit</em> ou <em>garantie de remboursement</em>)
          est un contrat par lequel un assureur s&apos;engage à indemniser le prêteur si l&apos;emprunteur ne rembourse pas son prêt.
          C&apos;est une protection du <strong>prêteur</strong>, pas de l&apos;emprunteur.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Dans le contexte d&apos;un prêt crypto, le prêteur est généralement un fonds d&apos;investissement partenaire. Ce fonds
          exige, avant d&apos;accorder un financement, que l&apos;emprunteur prouve sa solvabilité et souscrive une assurance qui
          le couvre contre le risque de non-remboursement. C&apos;est exactement ce que propose AssureCrypto.
        </p>
      </section>

      <section id="assurance-credit" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Assurance-crédit et garantie de remboursement</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          L&apos;<strong>assurance-crédit</strong> est un produit historique de la finance structurée. Elle protège le créancier
          contre le risque que son débiteur ne paie pas. On distingue deux grandes familles :
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-gold-light mb-2">Assurance-crédit commerciale</h3>
            <p className="text-sm text-gray-300">Protège un fournisseur contre le non-paiement de ses clients (créances commerciales). C&apos;est la base de l&apos;affacturage.</p>
          </div>
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-gold-light mb-2">Garantie de remboursement de prêt</h3>
            <p className="text-sm text-gray-300">Protège un prêteur contre le défaut de remboursement de l&apos;emprunteur. C&apos;est ce qu&apos;AssureCrypto propose pour les prêts crypto.</p>
          </div>
        </div>
        <Callout variant="info" title="Le rôle de la prime">
          L&apos;assureur se rémunère par la <strong>prime d&apos;assurance</strong>, payée par l&apos;emprunteur. En échange, il porte le
          risque d&apos;indemnisation du prêteur. C&apos;est le seul revenu d&apos;AssureCrypto.
        </Callout>
      </section>

      <section id="differences" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Différences avec caution, nantissement et assurance emprunteur</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Il est essentiel de ne pas confondre l&apos;assurance de prêt avec d&apos;autres mécanismes de garantie :
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-navy-light">
                <th className="border border-navy-border p-3 text-left">Mécanisme</th>
                <th className="border border-navy-border p-3 text-left">Qui est protégé ?</th>
                <th className="border border-navy-border p-3 text-left">Principe</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-navy-border p-3"><strong>Assurance de prêt</strong></td>
                <td className="border border-navy-border p-3">Le prêteur</td>
                <td className="border border-navy-border p-3">Indemnisation par un assureur en cas de défaut</td>
              </tr>
              <tr>
                <td className="border border-navy-border p-3"><strong>Caution</strong></td>
                <td className="border border-navy-border p-3">Le prêteur</td>
                <td className="border border-navy-border p-3">Une tierce personne s'engage à payer à la place du débiteur</td>
              </tr>
              <tr>
                <td className="border border-navy-border p-3"><strong>Sûreté réelle (nantissement)</strong></td>
                <td className="border border-navy-border p-3">Le prêteur</td>
                <td className="border border-navy-border p-3">Un bien est affecté en garantie ; en cas de défaut, il peut être saisi</td>
              </tr>
              <tr>
                <td className="border border-navy-border p-3"><strong>Assurance emprunteur</strong></td>
                <td className="border border-navy-border p-3">L'emprunteur</td>
                <td className="border border-navy-border p-3">Couvre l'emprunteur contre décès, invalidité, incapacité</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-300 leading-relaxed">
          AssureCrypto relève de la première catégorie : une <strong>assurance de prêt</strong> qui protège le fonds prêteur.
          Elle ne nantit pas vos actifs (aucune saisie) et ne couvre pas votre santé. Elle garantit le remboursement au prêteur.
        </p>
      </section>

      <section id="crypto" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Spécificités crypto</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Les prêts crypto présentent des risques particuliers que l&apos;assurance de prêt doit prendre en compte :
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { t: "Volatilité", d: "La valeur des actifs de garantie peut fluctuer fortement. La solvabilité est évaluée à un instant T, avec un ratio de couverture pour absorber les variations." },
            { t: "Liquidation", d: "Certains prêts crypto sont adossés à une garantie qui peut être liquidée si sa valeur chute. L'assurance couvre le risque de défaut, pas la liquidation." },
            { t: "Custody", d: "La détention des actifs (self-custody ou garde chez un tiers) influe sur la preuve de solvabilité. AssureCrypto vérifie les soldes on-chain, où qu'ils soient détenus." },
          ].map((c) => (
            <div key={c.t} className="card-hover rounded-xl bg-navy-light border border-navy-border p-6">
              <h3 className="font-semibold text-gold-light mb-2">{c.t}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="retenir">
        <Callout variant="success" title="À retenir">
          <ul className="list-disc list-inside space-y-1">
            <li>L&apos;assurance de prêt protège le <strong>prêteur</strong>, pas les fonds de l&apos;emprunteur.</li>
            <li>Elle se distingue de la caution, du nantissement et de l&apos;assurance emprunteur.</li>
            <li>AssureCrypto ne prête pas, ne nantit pas et ne gère pas vos actifs.</li>
            <li>La prime d&apos;assurance est le seul revenu d&apos;AssureCrypto.</li>
          </ul>
        </Callout>
      </section>
    </div>
  );
}
