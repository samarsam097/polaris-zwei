import Stripe from 'https://esm.sh/stripe@14.12.0?target=deno'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

// Initialize Stripe (uses STRIPE_SECRET_KEY from secrets)
const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(), // Deno requirement
})

// Initialize Supabase Admin Client (uses Service Role Key for secure updates)
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Use Service Role Key!
)

// Define constants
const ADD_CREDITS_RPC = 'add_user_credits'
const CREDITS_TO_ADD = 100 // Amount to add per purchase

serve(async (req) => {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const signature = req.headers.get('Stripe-Signature')
  const body = await req.text()
  let event: Stripe.Event;

  // Verify webhook signature (uses STRIPE_WEBHOOK_SECRET from secrets)
  try {
    console.log('Webhook Received: Verifying signature...');
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
    console.log(`Webhook Verified. Event type: ${event.type}`);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return new Response(`Webhook signature error: ${err.message}`, { status: 400 })
  }

  // Handle successful payment event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // IMPORTANT: Get the Supabase User ID passed via client_reference_id
    const userId = session.client_reference_id;

    console.log(`Checkout session completed. client_reference_id: ${userId}`);

    if (!userId) {
      console.error('Webhook Error: Missing client_reference_id (User ID) in checkout session.');
      // Return 400 - tell Stripe something is wrong with the data received
      return new Response('Webhook Error: Missing client_reference_id', { status: 400 })
    }

    console.log(`Attempting to add ${CREDITS_TO_ADD} credits for user: ${userId}`);

    // Add credits using the database function
    try {
      const { error: rpcError } = await supabaseAdmin.rpc(ADD_CREDITS_RPC, {
        user_id_param: userId,
        credits_to_add: CREDITS_TO_ADD
      });

      if (rpcError) {
         console.error('RPC function call failed:', rpcError);
         throw rpcError; // Throw error to be caught below
      } else {
         console.log(`RPC call successful for user ${userId}. Credits should be added.`);
      }

    } catch (dbError) {
      console.error('Error during RPC call:', dbError);
      // Return 500 - tell Stripe there was a server-side problem
      return new Response(`Webhook handler database error: ${dbError.message}`, { status: 500 });
    }
  } else {
    console.log(`Skipping unhandled event type: ${event.type}`);
  }

  // Acknowledge receipt of the event to Stripe
  console.log('Webhook processing finished successfully.');
  return new Response(JSON.stringify({ received: true }), {
     headers: { ...corsHeaders, 'Content-Type': 'application/json' },
     status: 200 // IMPORTANT: Return 200 OK to Stripe
  })
})