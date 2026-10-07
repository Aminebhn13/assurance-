-- À exécuter une fois dans l'éditeur SQL Supabase (extensions pg_cron + pg_net activées).
-- Remplace <PROJECT_REF> et <SERVICE_ROLE_KEY>.

-- Matchs du jour + scores en direct : toutes les 10 minutes.
select cron.schedule('vp-sync-today', '*/10 * * * *', $$
  select net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/sync-matches',
    headers := jsonb_build_object('Authorization', 'Bearer <SERVICE_ROLE_KEY>', 'Content-Type', 'application/json'),
    body := '{}'::jsonb
  );
$$);

-- Matchs des 3 jours suivants : une fois par nuit (pronostics publiés à l'avance).
select cron.schedule('vp-sync-ahead', '15 3 * * *', $$
  select net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/sync-matches',
    headers := jsonb_build_object('Authorization', 'Bearer <SERVICE_ROLE_KEY>', 'Content-Type', 'application/json'),
    body := jsonb_build_object('date', to_char(now() + (d || ' day')::interval, 'YYYY-MM-DD'))
  ) from generate_series(1, 3) as d;
$$);
