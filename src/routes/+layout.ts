// src/routes/+layout.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createBrowserClient, isBrowser, parse } from '@supabase/ssr';
import type { LayoutLoad } from './$types'; // Import LayoutLoad type

// Use LayoutLoad type for better type checking
export const load: LayoutLoad = async ({ fetch, data, depends }) => {
    depends('supabase:auth');

    const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
            fetch
        },
        cookies: {
            get(key) {
                if (!isBrowser()) {
                    // Use the session passed from the server during SSR
                    return JSON.stringify(data.session);
                }
                const cookie = parse(document.cookie);
                return cookie[key];
            },
            // Set and remove are primarily for client-side updates if needed
            set(key, value, options) {
                if (isBrowser()) {
                    document.cookie = `${key}=${value}; path=${options.path}; max-age=${options.maxAge}; same-site=${options.sameSite}; secure`;
                }
            },
            remove(key, options) {
                if (isBrowser()) {
                    document.cookie = `${key}=; path=${options.path}; max-age=0;`;
                }
            }
        }
    });

    // Get the session from the data passed from the server load function
    const { session, profile } = data; // <-- Get profile from server data

    // No need to call getSession() again on the client initially,
    // use the one passed from the server. The onAuthStateChange listener
    // in +layout.svelte handles subsequent updates.

    // Return the supabase client, the session, AND the profile data
    return { supabase, session, profile }; // <-- Add profile here
};