# Vatos Prono

Plateforme de pronostics football : matchs du jour, scores en direct, probabilités 1N2,
score prédit, tip du jour, pronostics VIP (abonnement Stripe), bilan public automatique,
suivi de bankroll, panneau admin. FR / EN, thème clair / sombre, mobile.

**Stack** : React + Vite + Tailwind (front) · Supabase (auth, base Postgres, Edge Functions) ·
API-Football (données) · Stripe (abonnements).

## 1. Tester tout de suite (mode démo)

```bash
npm install
npm run dev        # http://localhost:5173
```

Sans configuration, le site tourne en **mode démo** : matchs générés localement,
connexion avec n'importe quel email, bouton « Simuler VIP » dans *Mon espace*.

## 2. Passer en production

### Supabase
1. Crée un projet sur supabase.com.
2. *SQL Editor* → exécute `supabase/migrations/001_init.sql`.
3. Copie l'URL et la clé `anon` dans `.env.local` (voir `.env.example`).
4. Inscris-toi sur le site, puis passe-toi admin :
   `update profiles set role = 'admin' where email = 'ton@email.fr';`

### API-Football (données des matchs)
Crée une clé sur dashboard.api-football.com (offre gratuite = 100 requêtes/jour,
prends une offre payante pour le direct toutes les 10 min).

### Stripe (abonnements VIP)
1. Crée 3 prix récurrents : mensuel 12,99 €, trimestriel 29,99 €, annuel 99 €.
2. Active le *Customer portal* (Paramètres → Billing).
3. Webhook vers `https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`
   avec les événements `checkout.session.completed` et `customer.subscription.*`.

### Déployer les fonctions
```bash
npx supabase login
npx supabase link --project-ref <PROJECT_REF>
npx supabase secrets set \
  API_FOOTBALL_KEY=... \
  STRIPE_SECRET_KEY=sk_live_... STRIPE_WEBHOOK_SECRET=whsec_... \
  STRIPE_PRICE_MONTHLY=price_... STRIPE_PRICE_QUARTERLY=price_... STRIPE_PRICE_YEARLY=price_... \
  SITE_URL=https://ton-domaine.com
npx supabase functions deploy sync-matches
npx supabase functions deploy create-checkout
npx supabase functions deploy stripe-webhook --no-verify-jwt
```
Optionnel : `LEAGUES=61,39,140,...` (ids API-Football) pour choisir les championnats.

### Synchro automatique
Active `pg_cron` et `pg_net` (Database → Extensions), puis exécute `supabase/cron.sql`
(remplace les deux valeurs). Tu peux aussi lancer la synchro à la main depuis `/admin`.

### Héberger le front
`npm run build` → dossier `dist/` à déployer sur Vercel, Netlify ou Cloudflare Pages
(règle de réécriture SPA : toutes les routes → `index.html`). Mets les variables
`VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans l'hébergeur.

## Fonctionnement

- **Modèle** (`src/lib/model.ts`) : buts attendus de chaque équipe (forces attaque/défense
  domicile/extérieur tirées du classement), puis loi de Poisson → probabilité de chaque score
  → 1N2, BTTS, +/-2,5, score le plus probable, tip et cote juste. Le même fichier est copié
  dans les Edge Functions par `npm run copy-model` (à relancer après modification).
- **VIP** : la sécurité est côté base (RLS). Un pronostic VIP n'est renvoyé qu'aux VIP/admins
  tant que le match n'est pas terminé ; ensuite il apparaît dans le bilan public.
- **Bilan honnête** : un pronostic n'est jamais modifié après sa publication.
- **Admin** (`/fr/admin`) : synchro, choix du choc du jour, passage VIP d'un match,
  édition des analyses, attribution manuelle du VIP à un membre.

## Pages
`/fr` matchs · `/fr/match/:id` fiche · `/fr/vip` offres · `/fr/bilan` · `/fr/concept` ·
`/fr/faq` · `/fr/connexion` · `/fr/inscription` · `/fr/compte` · `/fr/admin` (et `/en/...`).

## Jeu responsable
Le site affiche l'interdiction aux mineurs et le numéro d'aide (Joueurs Info Service).
Selon ton pays, la promotion de paris sportifs peut être réglementée (en France : ANJ) —
vérifie les règles avant de lancer la partie payante.
