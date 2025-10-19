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
	<h3>Themes</h3>
	<div class="theme-options">
		<!-- Classic Theme Card -->
		<div
			class="theme-card"
			class:active={$uiStore.selectedTheme === 'classic'}
			on:click={() => selectTheme('classic')}
			role="button"
			tabindex="0"
			on:keydown={(e) => e.key === 'Enter' && selectTheme('classic')}
		>
			<img src="/classic.png" alt="Classic resume theme preview" />
			<span>Classic</span>
		</div>

		<!-- Modern Theme Card -->
		<div
			class="theme-card"
			class:active={$uiStore.selectedTheme === 'modern'}
			on:click={() => selectTheme('modern')}
			role="button"
			tabindex="0"
			on:keydown={(e) => e.key === 'Enter' && selectTheme('modern')}
		>
			<img src="/modern.png" alt="Modern resume theme preview" />
			<span>Modern</span>
		</div>

		<!-- Elegant Theme Card -->
		<div
			class="theme-card"
			class:active={$uiStore.selectedTheme === 'elegant'}
			on:click={() => selectTheme('elegant')}
			role="button"
			tabindex="0"
			on:keydown={(e) => e.key === 'Enter' && selectTheme('elegant')}
		>
			<img src="/elegant.png" alt="Elegant resume theme preview" />
			<span>Elegant</span>
		</div>
	</div>
</div>

<style>
	.theme-selector h3 {
		color: var(--text-headings);
		margin-bottom: 1rem;
		font-size: 1.25rem;
	}

	.theme-options {
		display: grid;
		grid-template-columns: 1fr; /* This creates the single-column layout */
		gap: 1.5rem;
	}

	.theme-card {
		cursor: pointer;
		border: 2px solid transparent; /* Placeholder for the active border */
		border-radius: 8px;
		overflow: hidden;
		transition: all 0.2s ease-in-out;
		background-color: #374151; /* Dark gray background for the card */
	}

	.theme-card:hover {
		transform: scale(1.03);
		border-color: #6b7280;
	}

	.theme-card img {
		width: 100%;
		display: block;
		aspect-ratio: 210 / 297; /* A4 aspect ratio */
		object-fit: cover;
		object-position: top;
		background-color: #ffffff; /* White background in case image is slow to load */
	}

	.theme-card span {
		display: block;
		text-align: center;
		padding: 0.75rem;
		color: var(--text-inverted);
		font-size: 0.875rem;
		font-weight: 500;
	}

	/* Style for the currently selected theme */
	.theme-card.active {
		border-color: var(--accent-primary); /* Blue border for active theme */
		box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
	}
</style>