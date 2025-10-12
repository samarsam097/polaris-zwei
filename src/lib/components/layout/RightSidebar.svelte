<script lang="ts">
	// We import our new UI store.
	import { uiStore } from '$lib/uiStore';

	// This function updates the store with the name of the theme that was clicked.
	function selectTheme(themeName: string) {
		uiStore.update((current) => {
			current.selectedTheme = themeName;
			return current;
		});
	}
</script>

<div class="theme-selector">
	<div class="theme-buttons">
		<button on:click={() => selectTheme('classic')}>Classic</button>
		<button on:click={() => selectTheme('modern')}>Modern</button>
		<button on:click={() => selectTheme('elegant')}>Elegant</button>
	</div>
</div>

<style>
	.theme-selector {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.theme-buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}
	button {
		padding: 10px;
		border: 1px solid #ccc;
		background-color: #f9f9f9;
		cursor: pointer;
		border-radius: 4px;
		text-align: center;
		transition: background-color 0.2s;
	}
	button:hover {
		background-color: #e0e0e0;
	}
</style>