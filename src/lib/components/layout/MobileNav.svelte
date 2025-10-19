<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	// Icons from svelte-lucide add a professional touch.
	import { FileText, Eye, Palette } from 'svelte-lucide';

	// This prop receives the currently active view from the parent page.
	export let activeView: 'forms' | 'preview' | 'right';

	const dispatch = createEventDispatcher();

	// When a button is clicked, this function sends a 'viewchange' event
	// back to the parent page to tell it which view to show.
	function setView(view: 'forms' | 'preview' | 'right') {
		dispatch('viewchange', view);
	}
</script>

<nav class="mobile-nav">
	<button
		class="nav-button"
		class:active={activeView === 'forms'}
		on:click={() => setView('forms')}
		aria-label="Content"
	>
		<FileText size={24} />
		<span>Content</span>
	</button>
	<button
		class="nav-button"
		class:active={activeView === 'preview'}
		on:click={() => setView('preview')}
		aria-label="Preview"
	>
		<Eye size={24} />
		<span>Preview</span>
	</button>
	<button
		class="nav-button"
		class:active={activeView === 'right'}
		on:click={() => setView('right')}
		aria-label="Themes"
	>
		<Palette size={24} />
		<span>Themes</span>
	</button>
</nav>

<style>
	.mobile-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 60px;
		background-color: var(--background-sidebar);
		border-top: 1px solid var(--border-color);
		display: flex;
		justify-content: space-around;
		align-items: center;
		z-index: 100;
	}

	.nav-button {
		background: none;
		border: none;
		color: var(--text-secondary);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		font-size: 0.75rem;
		padding: 0.5rem;
		border-radius: 6px;
		width: 80px;
		font-family: inherit;
		cursor: pointer;
		transition: color 0.2s;
	}

	.nav-button.active {
		color: var(--accent-primary);
	}

	/* This media query hides the mobile navigation on tablet screens and larger */
	@media (min-width: 768px) {
		.mobile-nav {
			display: none;
		}
	}
</style>

