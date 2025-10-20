<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let open = false;
	export let currentName = '';

	let newName = '';
	const dispatch = createEventDispatcher();

	// When the modal opens, pre-fill the input with the current name
	$: if (open) {
		newName = currentName;
	}

	function handleSave() {
		// Send the new name back to the parent component
		dispatch('save', newName);
	}

	function handleClose() {
		dispatch('close');
	}
</script>

{#if open}
	<div class="modal-backdrop" on:click={handleClose} />
	<div class="modal-content" role="dialog" aria-modal="true">
		<h3>Name Your New Resume</h3>
		<input type="text" bind:value={newName} placeholder="e.g., Software Engineer Resume" />
		<div class="modal-actions">
			<button class="cancel-btn" on:click={handleClose}>Cancel</button>
			<button class="save-btn" on:click={handleSave}>Create and Edit</button>
		</div>
	</div>
{/if}

<style>
	*{
		font-family: var( --font-family);
	}
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 90;
	}
	.modal-content {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		padding: 2rem;
		border-radius: 8px;
		z-index: 100;
		width: 90%;
		max-width: 400px;
	}
	h3 {
		margin-top: 0;
	}
	input {
		width: 93%;
		padding: 0.75rem;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 6px;
		margin: 1rem 0;
	}
	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
	}
	button {
		padding: 0.5rem 1rem;
		border-radius: 6px;
		border: 1px solid #ccc;
		cursor: pointer;
	}
	.save-btn {
		background-color: #007bff;
		color: white;
		border-color: #007bff;
	}
</style>