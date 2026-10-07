import { Link } from 'react-router-dom';
import { useHref, useLang } from '../lib/i18n';

const STEPS = {
  fr: [
    ['Les données', 'Chaque nuit, on récupère le calendrier, les résultats et les statistiques offensives et défensives de chaque équipe, à domicile et à l’extérieur.'],
    ['Le modèle', 'On estime les buts attendus de chaque équipe, puis un modèle de Poisson calcule la probabilité de chaque score possible, de 0-0 à 8-8.'],
    ['Les marchés', 'De cette grille de scores, on déduit le 1N2, les deux équipes marquent, plus/moins de 2,5 buts et le score le plus probable.'],
    ['Le tip', 'On retient le marché le plus solide et on affiche sa cote juste. Si ton bookmaker propose mieux, c’est un value bet.'],
    ['Le bilan', 'Après le coup de sifflet final, chaque tip est marqué gagné ou perdu automatiquement. Rien n’est effacé.'],
  ],
  en: [
    ['The data', 'Every night we pull fixtures, results and each team’s attacking and defensive stats, home and away.'],
    ['The model', 'We estimate each side’s expected goals, then a Poisson model computes the probability of every scoreline from 0-0 to 8-8.'],
    ['The markets', 'From that score grid we derive 1X2, both teams to score, over/under 2.5 and the most likely score.'],
    ['The tip', 'We keep the strongest market and show its fair odds. If your bookmaker offers more, that’s a value bet.'],
    ['The record', 'After the final whistle each tip is marked won or lost automatically. Nothing gets deleted.'],
  ],
};

export default function Concept() {
  const lang = useLang();
  const href = useHref();
  const fr = lang === 'fr';
  return (
    <div className="mx-auto max-w-3xl">
      <p className="kicker">{fr ? 'Comment ça marche' : 'How it works'}</p>
      <h1 className="h-display mt-3 text-5xl">{fr ? 'Des chiffres, pas des intuitions.' : 'Numbers, not hunches.'}</h1>
      <ol className="mt-10 space-y-4">
        {STEPS[lang].map(([title, body], i) => (
          <li key={title} className="card flex gap-5 p-5">
            <span className="h-display text-4xl text-brand-500">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-1 text-stone-600 dark:text-stone-300">{body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="card mt-8 border-brand-500/50 p-5 text-sm">
        <b>{fr ? 'Jeu responsable.' : 'Play responsibly.'}</b>{' '}
        {fr ? 'Une probabilité de 70 % veut dire que ça rate 3 fois sur 10. Ne mise jamais plus que ce que tu peux perdre.' : 'A 70% probability means it fails 3 times out of 10. Never stake more than you can afford to lose.'}
      </div>
      <Link to={href('/')} className="btn-primary mt-8">{fr ? 'Voir les matchs' : 'See matches'}</Link>
    </div>
  );
}
