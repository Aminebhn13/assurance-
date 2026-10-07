import { Link } from 'react-router-dom';
import { useHref } from '../lib/i18n';

export default function NotFound() {
  const href = useHref();
  return (
    <div className="py-20 text-center">
      <p className="h-display text-8xl text-brand-500">404</p>
      <p className="mt-4 text-stone-500">Hors-jeu : cette page n’existe pas.</p>
      <Link to={href('/')} className="btn-primary mt-6">Accueil</Link>
    </div>
  );
}
