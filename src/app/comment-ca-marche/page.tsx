import TOC from "@/components/TOC";
import Callout from "@/components/Callout";

const TOC_ITEMS = [
  { id: "parcours", label: "Le parcours en 6 étapes" },
  { id: "acteurs", label: "Le rôle de chaque acteur" },
  { id: "defaut", label: "Que se passe-t-il en cas de défaut ?" },
  { id: "duree", label: "Combien de temps ça prend ?" },
  { id: "retenir", label: "À retenir" },
];

export default function CommentCaMarche() {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Comment ça marche</h1>
      <p className="text-gray-400 mb-8">Comprendre le parcours complet, du client au fonds, en toute transparence.</p>

      <TOC items={TOC_ITEMS} />

      <section id="parcours" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-6">Le parcours en 6 étapes</h2>
        <div className="space-y-4">
          {[
            { n: "1", t: "Vous demandez un financement", d: "Vous (particulier ou entreprise) souhaitez obtenir un prêt auprès d'un fonds d'investissement partenaire d'AssureCrypto. Le fonds exige une preuve de solvabilité et une couverture par une assurance de prêt." },
            { n: "2", t: "Vous connectez votre wallet", d: "Sur AssureCrypto, vous connectez votre wallet via MetaMask ou WalletConnect. Vous signez un message texte lisible (SIWE) qui prouve que vous contrôlez bien l'adresse. Aucun fonds ne bouge, aucune autorisation n'est donnée." },
            { n: "3", t: "Vos soldes sont vérifiés", d: "AssureCrypto lit vos soldes on-chain (ETH, USDC, USDT) en lecture seule via RPC. Cette lecture est publique et ne nécessite aucune signature. Elle établit votre solvabilité à un instant T." },
            { n: "4", t: "Vous choisissez une couverture", d: "Selon votre ratio de couverture (actifs vérifiés / montant du prêt), vous choisissez une formule : Essentielle, Standard ou Premium. La prime est calculée en fonction du montant et de la durée." },
            { n: "5", t: "Vous recevez une attestation", d: "Une attestation d'assurance est générée : adresse, message signé, soldes, montant et durée du prêt, formule choisie. Vous la transmettez à votre fonds prêteur." },
            { n: "6", t: "Le fonds valide", d: "Le fonds vérifie l'authenticité de l'attestation (signature SIWE et soldes à la date indiquée), puis accorde le financement couvert par l'assurance." },
          ].map((s) => (
            <div key={s.n} className="flex gap-4 glass rounded-xl p-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold text-navy-dark font-bold flex items-center justify-center">{s.n}</div>
              <div>
                <h3 className="font-semibold text-gold-light">{s.t}</h3>
                <p className="text-sm text-gray-300 mt-1 leading-relaxed">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="acteurs" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-6">Le rôle de chaque acteur</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { t: "Le client (emprunteur)", d: "Particulier ou entreprise. Il souhaite obtenir un financement et prouve sa solvabilité en connectant son wallet. Il paie la prime d'assurance." },
            { t: "Le fonds (prêteur)", d: "Fonds d'investissement partenaire. Il prête l'argent et exige une garantie. Il est le bénéficiaire de l'indemnisation en cas de défaut." },
            { t: "AssureCrypto (assureur)", d: "Il évalue la solvabilité, émet l'attestation d'assurance et gère la relation. Il se rémunère uniquement par la prime d'assurance." },
            { t: "Le porteur de risque", d: "Entité qui porte effectivement le risque d'indemnisation. [À COMPLÉTER : nom du porteur de risque]. Il émet la police définitive." },
          ].map((a) => (
            <div key={a.t} className="card-hover rounded-xl bg-navy-light border border-navy-border p-6">
              <h3 className="font-semibold text-gold-light">{a.t}</h3>
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">{a.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="defaut" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-6">Que se passe-t-il en cas de défaut ?</h2>
        <Callout variant="info" title="Le mécanisme de garantie">
          Si le client ne rembourse pas son prêt (défaut), le fonds prêteur déclare le sinistre auprès d&apos;AssureCrypto.
          L&apos;assurance indemnise le fonds selon les conditions de la police : taux de couverture choisi et franchise applicable.
          La procédure de sinistre est détaillée dans la page dédiée aux fonds partenaires.
        </Callout>
        <p className="text-gray-300 leading-relaxed">
          Il est important de comprendre qu&apos;une assurance de prêt ne transfère pas les fonds du client : elle couvre le
          prêteur. Le client reste tenu de rembourser, mais le prêteur est indemnisé dans la limite de la couverture souscrite.
          En cas de recouvrement ultérieur, l&apos;assureur peut exercer la subrogation dans les droits du prêteur.
        </p>
      </section>

      <section id="duree" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-6">Combien de temps ça prend ?</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li><strong>Connexion et vérification des soldes :</strong> quelques secondes.</li>
          <li><strong>Signature SIWE :</strong> un clic dans votre wallet.</li>
          <li><strong>Génération de l&apos;attestation :</strong> immédiate.</li>
          <li><strong>Émission de la police définitive :</strong> [À COMPLÉTER : délai d'émission par le porteur de risque].</li>
        </ul>
      </section>

      <section id="retenir">
        <Callout variant="success" title="À retenir">
          <ul className="list-disc list-inside space-y-1">
            <li>AssureCrypto ne prête pas et ne finance rien.</li>
            <li>La seule signature demandée est un message texte (SIWE) qui ne donne aucune autorisation.</li>
            <li>Les soldes sont lus en lecture seule, jamais transférés.</li>
            <li>L&apos;assurance protège le prêteur, pas les fonds de l&apos;emprunteur.</li>
          </ul>
        </Callout>
      </section>
    </div>
  );
}
