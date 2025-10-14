<script lang="ts">
	import { uiStore } from '$lib/uiStore';

	function selectTheme(themeName: string) {
		uiStore.update((current) => {
			current.selectedTheme = themeName;
			return current;
		});
	}
</script>

<div class="theme-selector">

	<div class="theme-options">
		<div
			class="theme-card"
			class:active={$uiStore.selectedTheme === 'classic'}
			on:click={() => selectTheme('classic')}
			on:keydown={(e) => e.key === 'Enter' && selectTheme('classic')}
			role="button"
			tabindex="0"
		>
			<img src="/classic.png" alt="Classic resume theme preview" />
			<span>Classic</span>
		</div>

		<div
			class="theme-card"
			class:active={$uiStore.selectedTheme === 'modern'}
			on:click={() => selectTheme('modern')}
			on:keydown={(e) => e.key === 'Enter' && selectTheme('modern')}
			role="button"
			tabindex="0"
		>
			<img src="/modern.png" alt="Modern resume theme preview" />
			<span>Modern</span>
		</div>

		<div
			class="theme-card"
			class:active={$uiStore.selectedTheme === 'elegant'}
			on:click={() => selectTheme('elegant')}
			on:keydown={(e) => e.key === 'Enter' && selectTheme('elegant')}
			role="button"
			tabindex="0"
		>
			<img src="/elegant.png" alt="Elegant resume theme preview" />
			<span>Elegant</span>
		</div>
	</div>
</div>

<style>
	.theme-selector h3 {
		color: #f9fafb;
		margin-bottom: 1rem;
	}
	.theme-options {
		display: grid;
		grid-template-columns: 1fr ;
		gap: 1rem;
	}
	.theme-card {
		cursor: pointer;
		border: 2px solid transparent; /* Placeholder for active border */
		border-radius: 8px;
		overflow: hidden;
		transition: all 0.2s ease-in-out;
		background-color: #374151;
	}
	.theme-card:hover {
		transform: scale(1.05);
		border-color: #6b7280;
	}
	.theme-card img {
		width: 100%;
		display: block;
		aspect-ratio: 1 / 1.414; /* A4 aspect ratio */
		object-fit: cover;
		object-position: top;
	}
	.theme-card span {
		display: block;
		text-align: center;
		padding: 0.5rem;
		color: #d1d5db;
		font-size: 0.875rem;
	}

	/* Style for the currently selected theme */
	.theme-card.active {
		border-color: #3b82f6; /* Blue border for active theme */
		box-shadow: 0 0 10px #3b82f6;
	}
</style>