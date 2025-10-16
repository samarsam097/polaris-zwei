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

<style>
	/* Hier stehen Ihre globalen Stile für Schriftart und Body. */
	@font-face {
		font-family: 'DMSans';
		/* Erwägen Sie, die Schriftart mit Base64 einzubetten, um PDF-Probleme zu beheben */
		src: url('/fonts/DMSans-Regular.ttf') format('truetype');
		font-weight: normal;
		font-style: normal;
	}

	:global(body) {
		background-color: #111827;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'DMSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
			Arial, sans-serif;
	}
</style>