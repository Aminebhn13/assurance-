import TOC from "@/components/TOC";
import Callout from "@/components/Callout";

const TOC_ITEMS = [
  { id: "definition", label: "Qu'est-ce qu'une preuve de solvabilité ?" },
  { id: "pof-por", label: "Proof-of-funds vs proof-of-reserves" },
  { id: "verification", label: "Comment fonctionne la vérification par wallet ?" },
  { id: "limites", label: "Les limites : un solde est une photo à un instant T" },
  { id: "pourquoi", label: "Pourquoi les fonds l'exigent" },
  { id: "score", label: "Méthode de calcul du score" },
  { id: "retenir", label: "À retenir" },
];

export default function Solvabilite() {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Preuve de solvabilité</h1>
      <p className="text-gray-400 mb-8">Comment AssureCrypto vérifie votre solvabilité par votre wallet, en toute sécurité.</p>

      <TOC items={TOC_ITEMS} />

      <section id="definition" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Qu&apos;est-ce qu&apos;une preuve de solvabilité ?</h2>
        <p className="text-gray-300 leading-relaxed">
          Une <strong>preuve de solvabilité</strong> est un ensemble d&apos;éléments démontrant qu&apos;un emprunteur détient des
          actifs suffisants pour honorer ses engagements. Dans la finance traditionnelle, on demande des relevés bancaires,
          des déclarations de patrimoine, des avis d&apos;imposition. Dans la finance crypto, la preuve peut être faite
          <strong> directement sur la blockchain</strong>, de manière vérifiable et sans intermédiaire.
        </p>
      </section>

      <section id="pof-por" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Proof-of-funds vs proof-of-reserves</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="glass rounded-xl p-6">
            <h3 className="font-semibold text-gold-light mb-2">Proof-of-funds (PoF)</h3>
            <p className="text-sm text-gray-300 leading-relaxed">Démontre qu&apos;une <strong>personne</strong> (ou une entité) détient certains actifs à un moment donné. C&apos;est ce que fait AssureCrypto : prouver que <em>vous</em> contrôlez les actifs déclarés. Le PoF est lié à une identité ou une adresse.</p>
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="font-semibold text-gold-light mb-2">Proof-of-reserves (PoR)</h3>
            <p className="text-sm text-gray-300 leading-relaxed">Démontre qu&apos;une <strong>plateforme</strong> (échange, stablecoin, protocole) détient réellement les actifs qu&apos;elle déclare en réserve. C&apos;est utilisé par les exchanges pour prouver qu&apos;ils ne sont pas en réserve fractionnaire.</p>
          </div>
        </div>
        <Callout variant="info" title="La nuance clé">
          Le PoF concerne <strong>votre</strong> solvabilité personnelle. Le PoR concerne la solvabilité d&apos;une plateforme.
          AssureCrypto s&apos;appuie sur le <strong>PoF</strong> pour évaluer un emprunteur.
        </Callout>
      </section>

      <section id="verification" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Comment fonctionne la vérification par wallet ?</h2>
        <div className="space-y-4">
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-gold-light">1. Preuve de contrôle de l&apos;adresse (SIWE)</h3>
            <p className="text-sm text-gray-300 mt-2">Vous signez un message texte lisible (Sign-In with Ethereum, EIP-4361) qui contient votre adresse et une déclaration claire : « Je certifie être le détenteur de cette adresse pour l&apos;évaluation de solvabilité AssureCrypto. Cette signature n&apos;autorise aucun transfert. » Cette signature prouve que vous contrôlez l&apos;adresse, sans donner aucune autorisation.</p>
          </div>
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-gold-light">2. Lecture on-chain (lecture seule)</h3>
            <p className="text-sm text-gray-300 mt-2">AssureCrypto lit vos soldes publics (ETH, USDC, USDT) directement sur la blockchain via RPC. Cette lecture est publique, gratuite et ne nécessite aucune signature. Elle établit les montants que vous détenez à l&apos;instant de la vérification.</p>
          </div>
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-gold-light">3. Calcul du ratio de couverture</h3>
            <p className="text-sm text-gray-300 mt-2">À partir de ces soldes convertis en USD, AssureCrypto calcule votre ratio de couverture : actifs vérifiés ÷ montant du prêt demandé. Ce ratio détermine votre score de solvabilité et votre éligibilité.</p>
          </div>
        </div>
      </section>

      <section id="limites" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Les limites : un solde est une photo à un instant T</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Il faut être honnête : un solde on-chain est une <strong>photographie à un instant T</strong>. Il peut changer en
          quelques secondes si vous déplacez des fonds. C&apos;est pourquoi AssureCrypto :
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Horodate chaque lecture de solde.</li>
          <li>Exige un <strong>ratio de couverture</strong> confortable pour absorber les variations de valeur.</li>
          <li>Précise que l&apos;attestation est indicative tant que la police définitive n&apos;est pas émise.</li>
        </ul>
        <Callout variant="warn" title="Ce que la preuve ne garantit pas">
          La preuve de solvabilité ne garantit pas le remboursement futur. Elle établit que vous déteniez des actifs à un
          instant donné. C&apos;est pour cela que l&apos;assurance de prêt complète la preuve : elle couvre le risque résiduel de défaut.
        </Callout>
      </section>

      <section id="pourquoi" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Pourquoi les fonds l&apos;exigent</h2>
        <p className="text-gray-300 leading-relaxed">
          Un fonds prêteur doit évaluer le risque avant d&apos;accorder un financement. La preuve de solvabilité par wallet lui
          permet de vérifier, de manière <strong>objective et vérifiable</strong>, que l&apos;emprunteur détient bien les actifs
          déclarés. Combinée à l&apos;assurance de prêt, elle réduit le risque de défaut et rend le financement possible pour
          des profils qui n&apos;auraient pas accès au crédit traditionnel.
        </p>
      </section>

      <section id="score" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Méthode de calcul du score</h2>
        <p className="text-gray-300 leading-relaxed mb-4">Le score de solvabilité (A à E) est calculé à partir du ratio de couverture :</p>
        <div className="glass rounded-xl p-6 mb-4">
          <p className="font-mono text-sm">Ratio de couverture = (Actifs vérifiés en USD) ÷ (Montant du prêt demandé) × 100</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-navy-light">
                <th className="border border-navy-border p-3 text-left">Score</th>
                <th className="border border-navy-border p-3 text-left">Ratio de couverture</th>
                <th className="border border-navy-border p-3 text-left">Interprétation</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-navy-border p-3">A</td><td className="border border-navy-border p-3">≥ 150 %</td><td className="border border-navy-border p-3">Solvabilité très confortable</td></tr>
              <tr><td className="border border-navy-border p-3">B</td><td className="border border-navy-border p-3">120 – 149 %</td><td className="border border-navy-border p-3">Solvabilité confortable</td></tr>
              <tr><td className="border border-navy-border p-3">C</td><td className="border border-navy-border p-3">100 – 119 %</td><td className="border border-navy-border p-3">Couverture suffisante</td></tr>
              <tr><td className="border border-navy-border p-3">D</td><td className="border border-navy-border p-3">70 – 99 %</td><td className="border border-navy-border p-3">Couverture faible</td></tr>
              <tr><td className="border border-navy-border p-3">E</td><td className="border border-navy-border p-3">&lt; 70 %</td><td className="border border-navy-border p-3">Solvabilité insuffisante</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="retenir">
        <Callout variant="success" title="À retenir">
          <ul className="list-disc list-inside space-y-1">
            <li>La preuve de solvabilité par wallet est <strong>vérifiable et sans intermédiaire</strong>.</li>
            <li>Elle combine preuve de contrôle (SIWE) et lecture on-chain.</li>
            <li>Un solde est une photo à un instant T : le ratio de couverture absorbe les variations.</li>
            <li>Le score (A à E) découle du ratio de couverture.</li>
          </ul>
        </Callout>
      </section>
    </div>
  );
}
