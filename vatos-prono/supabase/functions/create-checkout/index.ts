// Crée une session Stripe Checkout (abonnement VIP) ou un lien vers le portail client.
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
import { cors, json } from '../_shared/cors.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const SITE = Deno.env.get('SITE_URL') ?? 'http://localhost:5173';
const PRICES: Record<string, string | undefined> = {
  monthly: Deno.env.get('STRIPE_PRICE_MONTHLY'),
  quarterly: Deno.env.get('STRIPE_PRICE_QUARTERLY'),
  yearly: Deno.env.get('STRIPE_PRICE_YEARLY'),
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '');
    const { data: { user } } = await db.auth.getUser(token);
    if (!user) return json({ error: 'unauthorized' }, 401);

    const { plan } = await req.json();
    const { data: profile } = await db.from('profiles').select('*').eq('id', user.id).single();

    let customer = profile?.stripe_customer_id as string | null;
    if (!customer) {
      const c = await stripe.customers.create({ email: user.email, metadata: { user_id: user.id } });
      customer = c.id;
      await db.from('profiles').update({ stripe_customer_id: customer }).eq('id', user.id);
    }

    if (plan === 'portal') {
      const s = await stripe.billingPortal.sessions.create({ customer, return_url: `${SITE}/fr/compte` });
      return json({ url: s.url });
    }

    const price = PRICES[plan];
    if (!price) return json({ error: 'unknown plan' }, 400);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer,
      line_items: [{ price, quantity: 1 }],
      client_reference_id: user.id,
      subscription_data: { metadata: { user_id: user.id } },
      allow_promotion_codes: true,
      success_url: `${SITE}/fr/vip?success=1`,
      cancel_url: `${SITE}/fr/vip`,
    });
    return json({ url: session.url });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
