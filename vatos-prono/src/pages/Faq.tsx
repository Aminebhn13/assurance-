import { useLang } from '../lib/i18n';

const QA = {
  fr: [
    ['Vatos Prono est-il gratuit ?', 'Oui : les matchs du jour, les scores en direct, le choc du jour et une partie des pronostics sont gratuits. L’abonnement VIP débloque tous les pronostics et analyses.'],
    ['Comment sont calculés les pronostics ?', 'Avec un modèle statistique basé sur les buts attendus de chaque équipe et une loi de Poisson. Tout est détaillé dans « Comment ça marche ».'],
    ['Les pronostics sont-ils garantis ?', 'Non. Ce sont des probabilités. Aucun pronostic n’est sûr à 100 %, et personne de sérieux ne te dira le contraire.'],
    ['Comment résilier mon abonnement ?', 'Depuis « Mon espace », bouton « Gérer mon abonnement ». La résiliation prend effet à la fin de la période payée.'],
    ['À quoi sert le suivi de bankroll ?', 'À noter tes paris, tes mises et tes résultats pour voir ton vrai bilan dans le temps.'],
    ['Quels championnats sont couverts ?', 'Les grands championnats européens, la Botola Pro et de nombreuses autres ligues ajoutées chaque saison.'],
  ],
  en: [
    ['Is Vatos Prono free?', 'Yes: daily fixtures, live scores, match of the day and part of the predictions are free. VIP unlocks every prediction and analysis.'],
    ['How are predictions computed?', 'With a statistical model based on each team’s expected goals and a Poisson distribution. See “How it works”.'],
    ['Are predictions guaranteed?', 'No. They are probabilities. No prediction is 100% sure.'],
    ['How do I cancel?', 'From “My space”, “Manage subscription”. Cancellation applies at the end of the paid period.'],
    ['What is bankroll tracking for?', 'Logging your bets, stakes and results to see your real record over time.'],
    ['Which leagues are covered?', 'Europe’s top leagues, Botola Pro and many more added each season.'],
  ],
};

export default function Faq() {
  const lang = useLang();
  return (
    <div className="mx-auto max-w-3xl">
      <p className="kicker">FAQ</p>
      <h1 className="h-display mt-3 text-5xl">{lang === 'fr' ? 'Questions fréquentes' : 'Frequently asked'}</h1>
      <div className="mt-8 space-y-3">
        {QA[lang].map(([q, a]) => (
          <details key={q} className="card group p-5 open:border-brand-500/60">
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
              {q}<span className="text-brand-500 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-stone-600 dark:text-stone-300">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
