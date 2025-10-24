// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or 'http://localhost:5173' for dev
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
