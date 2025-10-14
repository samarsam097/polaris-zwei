<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription },
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
	@font-face {
		font-family: 'DMSans';
		src: url('/fonts/DMSans-Regular.ttf') format('truetype');
		font-weight: normal;
		font-style: normal;
	}

	:global(body) {
		background-color: #111827;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'DMSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
			sans-serif;
	}
</style>