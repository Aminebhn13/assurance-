import Link from "next/link";
import Callout from "@/components/Callout";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="text-center py-14 animate-fade-up">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-gold-light mb-6">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" /> Assurance de prêt crypto
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight max-w-3xl mx-auto">
          L&apos;assurance qui <span className="gold-text">rassure votre prêteur</span>
        </h1>
        <p className="mt-5 text-lg text-gray-300 max-w-2xl mx-auto">
          AssureCrypto prouve votre solvabilité par votre wallet et couvre votre prêt contre le défaut de remboursement.
          Votre fonds prêteur obtient la garantie qu&apos;il exige.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/souscrire" className="btn-gold px-8 py-3 rounded-xl font-semibold">
            Vérifier ma solvabilité
          </Link>
          <Link href="/comment-ca-marche" className="btn-navy px-8 py-3 rounded-xl font-semibold">
            Comment ça marche
          </Link>
        </div>
      </section>

      {/* PARCOURS */}
      <section className="glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Un parcours clair, du client au fonds</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { t: "1 · Le client", d: "Demande un financement à un fonds d'investissement partenaire." },
            { t: "2 · AssureCrypto", d: "Prouve la solvabilité par wallet, délivre une attestation d'assurance de prêt." },
            { t: "3 · Le fonds", d: "Reçoit la garantie. En cas de défaut, l'assurance indemnise selon la police." },
          ].map((s) => (
            <div key={s.t} className="card-hover rounded-xl bg-navy-light border border-navy-border p-6">
              <div className="text-gold-light font-semibold mb-2">{s.t}</div>
              <p className="text-sm text-gray-300">{s.d}</p>
            </div>
          ))}
        </div>
        <Callout variant="info" title="AssureCrypto ne prête pas d'argent">
          AssureCrypto est un <strong>assureur de prêt</strong>. Il ne prête pas, ne finance rien et ne gère pas vos fonds.
          Il couvre le prêteur contre le défaut de remboursement de l&apos;emprunteur.
        </Callout>
      </section>

      {/* SÉCURITÉ WALLET */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gold-light mb-4">Votre wallet, en toute sécurité</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>✅ Connexion via MetaMask ou WalletConnect (protocole Reown).</li>
            <li>✅ Preuve de contrôle par signature d&apos;un message texte lisible (SIWE, EIP-4361).</li>
            <li>✅ Lecture seule des soldes on-chain via RPC. Aucune transaction.</li>
            <li>✅ Aucune approbation de contrat, aucun transfert, aucune autorisation.</li>
          </ul>
        </div>
        <div className="glass rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gold-light mb-4">Chiffres-clés</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            {[
              { v: "[À COMPLÉTER]", l: "Prêts couverts" },
              { v: "[À COMPLÉTER]", l: "Fonds partenaires" },
              { v: "[À COMPLÉTER]", l: "Taux de couverture max" },
              { v: "[À COMPLÉTER]", l: "Délai moyen de traitement" },
            ].map((k) => (
              <div key={k.l} className="rounded-xl bg-navy-light border border-navy-border p-4">
                <div className="text-xl font-bold gold-text">{k.v}</div>
                <div className="text-xs text-gray-400 mt-1">{k.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-10">
        <h2 className="text-3xl font-bold">Prêt à prouver votre solvabilité ?</h2>
        <p className="mt-3 text-gray-300">Connectez votre wallet et obtenez votre attestation en quelques minutes.</p>
        <Link href="/souscrire" className="btn-gold inline-block mt-6 px-8 py-3 rounded-xl font-semibold">
          Vérifier ma solvabilité
        </Link>
      </section>
    </div>
  );
}
