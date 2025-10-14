// src/routes/+layout.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createBrowserClient, isBrowser, parse } from '@supabase/ssr';

export const load = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: {
			fetch
		},
		cookies: {
			// This function tells Supabase how to read a cookie from the browser.
			get(key) {
				if (!isBrowser()) {
					return JSON.stringify(data.session);
				}

				const cookie = parse(document.cookie);
				return cookie[key];
			},
            // The library expects these functions to exist, even though the server-side
            // hook does most of the heavy lifting.
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

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { supabase, session };
};