import TOC from "@/components/TOC";
import Callout from "@/components/Callout";

const TOC_ITEMS = [
  { id: "siwe", label: "Ce que la signature SIWE fait et ne fait pas" },
  { id: "lire", label: "Comment lire ce que votre wallet vous demande de signer" },
  { id: "dangereux", label: "Les signatures dangereuses à toujours refuser" },
  { id: "revoquer", label: "Comment révoquer des autorisations" },
  { id: "hardware", label: "Bonnes pratiques hardware wallet" },
  { id: "retenir", label: "À retenir" },
];

export default function SecuriteWallet() {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Sécurité wallet</h1>
      <p className="text-gray-400 mb-8">Comprendre ce qu&apos;une signature fait (et ne fait pas) pour protéger vos fonds.</p>

      <TOC items={TOC_ITEMS} />

      <section id="siwe" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Ce que la signature SIWE fait et ne fait pas</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="glass rounded-xl p-6 border-emerald-500/30">
            <h3 className="font-semibold text-emerald-400 mb-2">✅ Ce que SIWE fait</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
              <li>Prouve que vous contrôlez l&apos;adresse.</li>
              <li>Authentifie votre identité auprès d&apos;un site.</li>
              <li>Est gratuit et ne déplace aucun fonds.</li>
              <li>Est un message texte lisible, vérifiable.</li>
            </ul>
          </div>
          <div className="glass rounded-xl p-6 border-red-500/30">
            <h3 className="font-semibold text-red-400 mb-2">❌ Ce que SIWE ne fait pas</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
              <li>Ne donne aucune autorisation de transfert.</li>
              <li>Ne permet pas à un contrat de dépenser vos tokens.</li>
              <li>Ne déclenche aucune transaction.</li>
              <li>Ne déplace aucun actif.</li>
            </ul>
          </div>
        </div>
        <Callout variant="success" title="La déclaration SIWE d'AssureCrypto">
          « Je certifie être le détenteur de cette adresse pour l&apos;évaluation de solvabilité AssureCrypto. Cette signature
          n&apos;autorise aucun transfert. » — Un message aussi clair est <strong>sans risque</strong>.
        </Callout>
      </section>

      <section id="lire" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Comment lire ce que votre wallet vous demande de signer</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Avant de signer <strong>quoi que ce soit</strong>, lisez attentivement le message. Posez-vous ces questions :
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Est-ce un <strong>texte lisible</strong> en clair, ou un bloc de données illisible ?</li>
          <li>Demande-t-on une <strong>approbation</strong>, un <strong>transfert</strong> ou une <strong>autorisation</strong> ?</li>
          <li>Le domaine affiché correspond-il au site que vous visitez ?</li>
          <li>Le message mentionne-t-il un <strong>montant</strong>, une <strong>adresse de destination</strong> ou un <strong>contrat</strong> ?</li>
        </ul>
        <Callout variant="danger" title="Règle d'or">
          Si vous ne comprenez pas ce que vous signez, <strong>ne signez pas</strong>. Un message légitime est toujours
          lisible et explicite.
        </Callout>
      </section>

      <section id="dangereux" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Les signatures dangereuses à toujours refuser</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Certaines demandes de signature sont <strong>dangereuses</strong> et doivent être systématiquement refusées :
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-navy-light">
                <th className="border border-navy-border p-3 text-left">Type de demande</th>
                <th className="border border-navy-border p-3 text-left">Risque</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-navy-border p-3"><code>approve</code> / <code>increaseAllowance</code></td><td className="border border-navy-border p-3">Autorise un contrat à dépenser vos tokens</td></tr>
              <tr><td className="border border-navy-border p-3"><code>setApprovalForAll</code></td><td className="border border-navy-border p-3">Autorise un contrat à gérer tous vos NFTs</td></tr>
              <tr><td className="border border-navy-border p-3"><code>permit</code> / <code>Permit2</code></td><td className="border border-navy-border p-3">Approbation déguisée par signature</td></tr>
              <tr><td className="border border-navy-border p-3"><code>transfer</code> / <code>transferFrom</code></td><td className="border border-navy-border p-3">Déplace directement vos fonds</td></tr>
              <tr><td className="border border-navy-border p-3"><code>eth_sendTransaction</code></td><td className="border border-navy-border p-3">Envoie une transaction (frais + transfert)</td></tr>
              <tr><td className="border border-navy-border p-3"><code>eth_signTypedData</code> (EIP-712)</td><td className="border border-navy-border p-3">Peut cacher des approbations structurées</td></tr>
            </tbody>
          </table>
        </div>
        <Callout variant="danger" title="AssureCrypto ne demande jamais ces signatures">
          AssureCrypto ne vous demandera <strong>jamais</strong> d&apos;approuver un contrat, de transférer des fonds ni de signer
          une transaction. Si un site prétendant être AssureCrypto le fait, c&apos;est une <strong>arnaque</strong>.
        </Callout>
      </section>

      <section id="revoquer" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Comment révoquer des autorisations</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Si vous avez déjà approuvé un contrat (par exemple sur un DEX), vous pouvez <strong>révoquer</strong> cette
          autorisation. L&apos;outil de référence est <a href="https://revoke.cash" target="_blank" rel="noopener noreferrer" className="text-gold-light underline">revoke.cash</a>.
          Il permet de lister et révoquer toutes les approbations de vos tokens. C&apos;est une bonne pratique de sécurité.
        </p>
        <Callout variant="info" title="Bon réflexe">
          Révoguez régulièrement les autorisations inutilisées. Moins vous laissez d&apos;approbations actives, moins vous
          exposez vos fonds.
        </Callout>
      </section>

      <section id="hardware" className="mb-12">
        <h2 className="text-2xl font-bold gold-text mb-4">Bonnes pratiques hardware wallet</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Utilisez un <strong>hardware wallet</strong> (Ledger, Trezor) pour vos actifs importants : la clé privée ne quitte jamais l&apos;appareil.</li>
          <li>Vérifiez chaque signature <strong>sur l&apos;écran de l&apos;appareil</strong>, pas seulement dans le navigateur.</li>
          <li>Ne partagez <strong>jamais</strong> votre phrase de récupération (seed phrase).</li>
          <li>Méfiez-vous des <strong>fausses applications</strong> et des sites clones.</li>
          <li>Gardez votre firmware à jour.</li>
        </ul>
      </section>

      <section id="retenir">
        <Callout variant="success" title="À retenir">
          <ul className="list-disc list-inside space-y-1">
            <li>SIWE est un message texte sans risque qui prouve le contrôle de l&apos;adresse.</li>
            <li>Refusez toujours <code>approve</code>, <code>permit</code>, <code>setApprovalForAll</code> et toute demande de transfert.</li>
            <li>Révoquez vos autorisations via revoke.cash.</li>
            <li>Un hardware wallet protège vos clés privées.</li>
          </ul>
        </Callout>
      </section>
    </div>
  );
}
