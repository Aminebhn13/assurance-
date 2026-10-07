// Webhook Stripe : active / prolonge / coupe le statut VIP selon l'abonnement.
// À déployer avec --no-verify-jwt (Stripe n'envoie pas de JWT Supabase).
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.117.2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

async function applySubscription(sub: Stripe.Subscription) {
  const active = ['active', 'trialing', 'past_due'].includes(sub.status);
  // Selon la version d'API, la fin de période est sur l'abonnement ou sur ses items.
  const end = (sub as unknown as { current_period_end?: number }).current_period_end
    ?? (sub.items.data[0] as unknown as { current_period_end?: number })?.current_period_end;
  const customer = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
  await db.from('profiles')
    .update({ is_vip: active, vip_until: active && end ? new Date(end * 1000).toISOString() : null })
    .eq('stripe_customer_id', customer);
}

Deno.serve(async (req) => {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig!, SECRET, undefined, Stripe.createSubtleCryptoProvider());
  } catch {
    return new Response('bad signature', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object as Stripe.Checkout.Session;
      if (s.subscription) await applySubscription(await stripe.subscriptions.retrieve(String(s.subscription)));
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await applySubscription(event.data.object as Stripe.Subscription);
      break;
  }
  return new Response('ok');
});
