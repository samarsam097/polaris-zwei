<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	export let open = false;
	const dispatch = createEventDispatcher();

	function handleDelete() {
		// Use a simple browser confirm dialog for safety
		if (confirm('Are you sure you want to permanently delete your account and all data? This action cannot be undone.')) {
			dispatch('delete');
		}
	}
</script>

{#if open}
	<div class="modal-backdrop" on:click={() => dispatch('close')} transition:fly={{ duration: 200, y: 5 }} />

	<div class="modal-content" transition:fly={{ duration: 300, y: 20 }}>
		<header class="modal-header">
			<h2>Account Settings</h2>
			<button class="close-btn" on:click={() => dispatch('close')}>×</button>
		</header>

		<div class="modal-body">
			<div class="danger-zone">
				<h4>Danger Zone</h4>
				<p>Permanently delete your account and all of your resumes. This action cannot be reversed.</p>

				<button class="delete-account-btn" on:click={handleDelete}>
					Delete My Account
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		z-index: 90;
	}
	.modal-content {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		border-radius: 12px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		z-index: 100;
		width: 90%;
		max-width: 500px;
		overflow: hidden;
	}
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid #eee;
	}
	.modal-header h2 {
		margin: 0;
		font-size: 1.25rem;
	}
	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #999;
	}
	.modal-body {
		padding: 1.5rem;
	}
	.danger-zone {
		border: 1px solid #f87171;
		background: #fef2f2;
		border-radius: 8px;
		padding: 1rem;
		color: #b91c1c;
		text-align: center;
	}
	.danger-zone h4 {
		margin: 0 0 0.5rem 0;
	}
	.delete-account-btn {
		width: 100%;
		margin-top: 1rem;
		background-color: #ef4444;
		color: white;
		border: none;
		padding: 0.75rem;
		border-radius: 6px;
		font-weight: bold;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	.delete-account-btn:hover {
		background-color: #dc2626;
	}
</style>