<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	// Diese `data` wird vom Server (`+layout.server.ts` & `+layout.ts`) bereitgestellt.
	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	// Dieser Listener hält die Sitzungsinformationen synchron.
	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidateAll();
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<Navbar />

<main>
	<slot />
</main>

<!-- In src/routes/+layout.svelte -->

<style>
	/* --- YOUR NEW LIGHT THEME CONTROL PANEL --- */
	:root {
		/* Background Colors */
		--background-main: #f3f4f6; /* A soft, light gray for the "desk" */
		--background-sidebar: #ffffff; /* Clean white for the sidebars */
		--background-input: #f9fafb; /* Slightly off-white for inputs */

		/* Text Colors */
		--text-headings: #111827; /* Very dark gray for titles */
		--text-primary: #1f2937;  /* Primary text color */
		--text-secondary: #6b7280; /* Lighter gray for secondary text/labels */
		--text-inverted: #ffffff; /* White text for colored buttons */

		/* Accent Colors */
		--accent-primary: #2563eb; /* A strong blue for primary actions */
		--accent-secondary: #16a34a; /* A nice green for download */
		--accent-destructive: #dc2626; /* A clear red for delete */

		/* Border Colors */
		--border-color: #d1d5db; /* Light gray for borders */
		--border-focus: #2563eb;   /* Blue highlight on focus */
	}

	/* --- GLOBAL STYLES --- */
	@font-face {
		font-family: 'DMSans';
		src: url('/fonts/DMSans-Regular.ttf') format('truetype');
		font-weight: normal;
		font-style: normal;
	}

	:global(body) {
		/* Use a variable for the main background */
		background-color: var(--background-main);
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'DMSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
			Arial, sans-serif;
	}
</style>