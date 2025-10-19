<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let activeView: string;
	const dispatch = createEventDispatcher();
</script>

<div class="mobile-nav">
	<button class:active={activeView === 'forms'} on:click={() => dispatch('setView', 'forms')}>
		<span>Content</span>
	</button>
	<button class:active={activeView === 'preview'} on:click={() => dispatch('setView', 'preview')}>
		<span>Preview</span>
	</button>
	<button class:active={activeView === 'themes'} on:click={() => dispatch('setView', 'themes')}>
		<span>Themes</span>
	</button>
</div>

<style>
	.mobile-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-around;
		background-color: var(--background-sidebar, #111827);
		border-top: 1px solid var(--border-color, #374151);
		z-index: 100;
		padding-bottom: env(safe-area-inset-bottom); /* For iPhone notches */
	}

	button {
		flex-grow: 1;
		background: none;
		border: none;
		color: var(--text-secondary, #9ca3af);
		padding: 0.75rem 0;
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
		border-top: 3px solid transparent;
		transition: all 0.2s ease;
	}

	button.active {
		color: var(--text-headings, #f9fafb);
		border-top-color: var(--accent-primary, #3b82f6);
	}

	/* This media query hides the mobile nav on larger screens */
	@media (min-width: 1024px) {
		.mobile-nav {
			display: none;
		}
	}
</style>
