import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

// Define constants
const DECREMENT_RPC = 'decrement_user_credits'
const CREDITS_TO_DECREMENT = 20 // Amount to subtract per download

// Helper to call DB function
async function handleDecrement(supabaseClient: SupabaseClient, userId: string): Promise<boolean> {
   console.log(`Calling RPC ${DECREMENT_RPC} for user ${userId} to decrement ${CREDITS_TO_DECREMENT}`); // Log before RPC
   const { data, error } = await supabaseClient.rpc(DECREMENT_RPC, {
       user_id_param: userId,
       credits_to_decrement: CREDITS_TO_DECREMENT
   });
   if (error) {
       console.error("Error calling decrement_user_credits RPC:", error);
       throw new Error(`Database error during decrement: ${error.message}`);
   }
   const success = data as boolean;
   console.log(`RPC ${DECREMENT_RPC} returned: ${success}`); // Log RPC result
   if (!success) { console.warn(`Decrement failed for user ${userId} (insufficient credits or user not found).`); }
   return success;
}

// Main function handler
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  console.log('Decrement function invoked. Headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));

  try {
    // Extract Token Manually
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error("Missing or invalid Authorization header.");
        throw new Error("Missing or invalid Authorization header.");
    }
    const token = authHeader.replace('Bearer ', '');
    console.log("Extracted Token:", token ? "Token present" : "Token missing");

    // Create Supabase client WITHOUT global auth headers
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    console.log("Attempting supabaseClient.auth.getUser(token)...");

    // Pass Token Explicitly to getUser
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError) {
        console.error("getUser(token) Error:", userError);
        console.error("getUser(token) Error Details:", JSON.stringify(userError));
        throw userError;
    }
    if (!user) {
        console.error("getUser(token) returned null user, but no error.");
        throw new Error("User not authenticated (getUser returned null).");
    }

    console.log(`Successfully authenticated user via getUser(token): ${user.id}`);

    // --- UNCOMMENTED DECREMENT LOGIC ---
    const success = await handleDecrement(supabaseClient, user.id); // Call the helper function
    if (!success) {
      // Return error if decrement failed
      return new Response(JSON.stringify({ error: "Insufficient credits." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 402, // Payment Required
      });
    }
    console.log(`Successfully decremented credits for user: ${user.id}`);
    // --- END UNCOMMENTED DECREMENT LOGIC ---

    return new Response(JSON.stringify({ success: true, userId: user.id }), { // Return success
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error("Error during decrement function execution:", error.message); // Updated log message
    const status = error.message.toLowerCase().includes("invalid jwt") ? 401 : 400;
    return new Response(JSON.stringify({ error: `Decrement function failed: ${error.message}` }), { // Updated error response
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: status
    });
  }
})