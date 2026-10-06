import PremiumSimulator from "@/components/PremiumSimulator";
import Callout from "@/components/Callout";

export default function Tarifs() {
  const rows = [
    { plan: "Essentielle", coverage: "50%", franchise: "20%", rate: "3,5 %", use: "Couverture de base" },
    { plan: "Standard", coverage: "70%", franchise: "15%", rate: "4,5 %", use: "Le plus choisi" },
    { plan: "Premium", coverage: "90%", franchise: "10%", rate: "6 %", use: "Couverture maximale" },
  ];
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Tarifs</h1>
      <p className="text-gray-400 mb-8">Grille de primes indicative selon le ratio de couverture et la durée. Simulez votre prime ci-dessous.</p>

      <Callout variant="warn" title="Valeurs indicatives">
        Les taux ci-dessous sont <strong>indicatifs</strong>. La prime définitive dépend de votre score de solvabilité,
        du montant, de la durée et de l&apos;émission de la police par le porteur de risque [À COMPLÉTER : nom du porteur de risque].
      </Callout>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-navy-light">
              <th className="border border-navy-border p-3 text-left">Formule</th>
              <th className="border border-navy-border p-3 text-left">Taux de couverture</th>
              <th className="border border-navy-border p-3 text-left">Franchise</th>
              <th className="border border-navy-border p-3 text-left">Taux annuel</th>
              <th className="border border-navy-border p-3 text-left">Usage</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.plan} className="hover:bg-navy-light/50">
                <td className="border border-navy-border p-3 font-semibold text-gold-light">{r.plan}</td>
                <td className="border border-navy-border p-3">{r.coverage}</td>
                <td className="border border-navy-border p-3">{r.franchise}</td>
                <td className="border border-navy-border p-3">{r.rate}</td>
                <td className="border border-navy-border p-3 text-gray-300">{r.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PremiumSimulator />

      <Callout variant="info" title="Comment la prime est-elle payée ?">
        Le paiement de la prime est effectué par <strong>contact commercial / virement</strong> [À COMPLÉTER : modalités de
        paiement]. Aucun paiement on-chain n&apos;est déclenché depuis ce site.
      </Callout>
    </div>
  );
}
