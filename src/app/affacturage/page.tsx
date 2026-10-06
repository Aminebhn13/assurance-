import TOC from "@/components/TOC";
import Callout from "@/components/Callout";

const TOC_ITEMS = [
  { id: "definition", label: "Définition de l'affacturage" },
  { id: "types", label: "Avec/sans recours, notifié/confidentiel" },
  { id: "reverse", label: "Reverse factoring" },
  { id: "tokenise", label: "Affacturage de créances tokenisées / RWA" },
  { id: "assurance", label: "Le rôle de l'assurance-crédit dans l'affacturage" },
  { id: "exemple", label: "Exemple chiffré pas à pas" },
  { id: "glossaire", label: "Mini-glossaire" },
  { id: "retenir", label: "À retenir" },
];

export default function Affacturage() {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Affacturage</h1>
      <p className="text-gray-400 mb-8">Le guide complet de l'affacturage, expliqué simplement, et son lien avec l'assurance-crédit.</p>

      <TOC items={TOC_ITEMS} />

      <section id="definition" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Définition de l&apos;affacturage</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          L&apos;<strong>affacturage</strong> (du terme anglais <em>factoring</em>) est une opération par laquelle une entreprise
          (le <strong>cédant</strong>) cède ses créances commerciales à un organisme spécialisé (le <strong>factor</strong>).
          En échange, le factor verse immédiatement une partie du montant des créances (l&apos;<strong>avance</strong>), puis
          encaisse les règlements des clients (les <strong>débiteurs</strong>) à leur échéance.
        </p>
        <p className="text-gray-300 leading-relaxed mb-4">
          Concrètement, une entreprise qui a facturé un client à 30, 60 ou 90 jours n&apos;a pas besoin d&apos;attendre le paiement :
          elle cède sa facture au factor, qui lui avance immédiatement 70 à 85 % de son montant. L&apos;entreprise obtient ainsi
          de la trésorerie immédiate au lieu d&apos;attendre l&apos;échéance.
        </p>
        <Callout variant="info" title="À ne pas confondre">
          L&apos;affacturage n&apos;est <strong>pas un prêt</strong> : c&apos;est une <strong>cession de créances</strong>. Le factor n&apos;avance
          pas de l&apos;argent à rembourser, il rachète vos factures. C&apos;est une différence fondamentale.
        </Callout>
      </section>

      <section id="types" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Avec/sans recours, notifié/confidentiel</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="glass rounded-xl p-6">
            <h3 className="font-semibold text-gold-light mb-2">Affacturage avec recours</h3>
            <p className="text-sm text-gray-300 leading-relaxed">Si le débiteur ne paie pas, le factor se retourne contre le cédant, qui doit rembourser l&apos;avance. Le risque de non-paiement reste chez le cédant. C&apos;est la forme la plus courante et la moins chère.</p>
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="font-semibold text-gold-light mb-2">Affacturage sans recours</h3>
            <p className="text-sm text-gray-300 leading-relaxed">Le factor assume le risque de non-paiement du débiteur. Le cédant est déchargé de ce risque. C&apos;est plus cher, mais plus protecteur. L&apos;assurance-crédit y joue souvent un rôle clé.</p>
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="font-semibold text-gold-light mb-2">Affacturage notifié</h3>
            <p className="text-sm text-gray-300 leading-relaxed">Le débiteur est informé de la cession et doit payer directement le factor. C&apos;est la forme la plus transparente et la plus sécurisée.</p>
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="font-semibold text-gold-light mb-2">Affacturage confidentiel</h3>
            <p className="text-sm text-gray-300 leading-relaxed">Le débiteur n&apos;est pas informé ; il continue de payer le cédant, qui reverse au factor. Moins sécurisé, souvent réservé aux clients fiables.</p>
          </div>
        </div>
      </section>

      <section id="reverse" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Reverse factoring (affacturage inversé)</h2>
        <p className="text-gray-300 leading-relaxed">
          Dans le <strong>reverse factoring</strong>, l&apos;initiative ne vient pas du fournisseur mais de l&apos;<strong>acheteur</strong>
          (le débiteur). L&apos;acheteur, souvent une grande entreprise, met en place un programme par lequel le factor paie ses
          fournisseurs plus tôt. L&apos;acheteur bénéficie de délais de paiement allongés, et les fournisseurs sont payés rapidement.
          C&apos;est un outil de financement de la chaîne d&apos;approvisionnement (<em>supply chain finance</em>).
        </p>
      </section>

      <section id="tokenise" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Affacturage de créances tokenisées / RWA</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Avec la finance décentralisée, les <strong>créances tokenisées</strong> (ou <em>real-world assets</em>, RWA) sont
          représentées par des tokens sur une blockchain. Une facture peut être « tokenisée », c&apos;est-à-dire convertie en un
          actif numérique traçable et vérifiable.
        </p>
        <p className="text-gray-300 leading-relaxed">
          L&apos;assurance-crédit joue alors un rôle encore plus important : elle permet de rassurer les investisseurs qui
          achètent ces créances tokenisées, en garantissant le paiement des débiteurs sous-jacents. AssureCrypto s&apos;inscrit
          dans cette logique en couvrant le risque de défaut sur des créances adossées à des actifs réels.
        </p>
      </section>

      <section id="assurance" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Le rôle de l&apos;assurance-crédit dans l&apos;affacturage</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          L&apos;assurance-crédit est le <strong>cœur de l&apos;affacturage sans recours</strong>. Elle garantit au factor qu&apos;il sera
          indemnisé si le débiteur ne paie pas. Sans elle, le factor refuserait de porter le risque de non-paiement.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Pour AssureCrypto, le parallèle est direct : dans un prêt crypto, le « débiteur » est l&apos;emprunteur, le « factor »
          est le fonds prêteur, et l&apos;assurance garantit le remboursement. Le mécanisme de couverture du risque est le même.
        </p>
      </section>

      <section id="exemple" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Exemple chiffré pas à pas</h2>
        <div className="glass rounded-xl p-6 space-y-3 text-sm text-gray-300">
          <p><strong>1.</strong> Une entreprise facture un client pour 100 000 USD, payable à 90 jours.</p>
          <p><strong>2.</strong> Elle cède cette créance à un factor avec un taux d&apos;avance de 80 %.</p>
          <p><strong>3.</strong> Le factor verse immédiatement 80 000 USD à l&apos;entreprise.</p>
          <p><strong>4.</strong> Le factor prélève des frais d&apos;affacturage de 2 % sur l&apos;avance, soit 1 600 USD.</p>
          <p><strong>5.</strong> À l&apos;échéance, le débiteur paie 100 000 USD au factor.</p>
          <p><strong>6.</strong> Le factor reverse le solde restant (100 000 − 80 000 − 1 600 = 18 400 USD) à l&apos;entreprise.</p>
          <p><strong>7.</strong> Coût total pour l&apos;entreprise : 1 600 USD pour obtenir 80 000 USD immédiatement.</p>
        </div>
        <Callout variant="info" title="Et si le débiteur ne paie pas ?">
          En affacturage <strong>sans recours</strong>, l&apos;assurance-crédit indemnise le factor. En affacturage <strong>avec recours</strong>,
          le cédant doit rembourser l&apos;avance. C&apos;est exactement la logique d&apos;une assurance de prêt : elle protège celui qui avance les fonds.
        </Callout>
      </section>

      <section id="glossaire" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Mini-glossaire</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {[
            { t: "Cédant", d: "L'entreprise qui cède ses créances." },
            { t: "Factor", d: "L'organisme qui rachète les créances et avance les fonds." },
            { t: "Débiteur", d: "Le client de l'entreprise, qui doit payer la facture." },
            { t: "Avance", d: "Le montant versé immédiatement au cédant (70 à 85 % de la créance)." },
            { t: "Créance", d: "La somme due par le débiteur." },
            { t: "Recours", d: "La possibilité pour le factor de se retourner contre le cédant." },
          ].map((g) => (
            <div key={g.t} className="glass rounded-lg p-4">
              <div className="font-semibold text-gold-light">{g.t}</div>
              <p className="text-gray-300 mt-1">{g.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="retenir">
        <Callout variant="success" title="À retenir">
          <ul className="list-disc list-inside space-y-1">
            <li>L&apos;affacturage est une <strong>cession de créances</strong>, pas un prêt.</li>
            <li>Il existe avec/sans recours et notifié/confidentiel.</li>
            <li>L&apos;assurance-crédit est indispensable à l&apos;affacturage sans recours.</li>
            <li>Les créances tokenisées (RWA) ouvrent de nouvelles possibilités.</li>
          </ul>
        </Callout>
      </section>
    </div>
  );
}
