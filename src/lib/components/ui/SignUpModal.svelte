<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment'; // 1. Import the browser check

	export let open = false;
	let name = '';
	let email = '';
	let password = '';

	// 2. Only create the dispatcher if we are in the browser.
	const dispatch = browser ? createEventDispatcher() : () => {};

	function handleSignUp() {
		if (name && email && password) {
			dispatch('signUp', { name, email, password });
		} else {
			alert('Please fill in all fields.');
		}
	}
</script>

{#if open}
	<div
  class="modal-backdrop"
  on:click={() => dispatch('close')}
  role="button"
  tabindex="0"
/>
	<div class="modal-content" transition:fly={{ duration: 300, y: 20 }}>
		<header class="modal-header">
			<h2>Create Your Account</h2>
			<button class="close-btn" on:click={() => dispatch('close')}>×</button>
		</header>
		<div class="modal-body">
			<div class="form">
				<input type="text" placeholder="Full Name" bind:value={name} />
				<input type="email" placeholder="Email address" bind:value={email} />
				<input type="password" placeholder="Password (at least 6 characters)" bind:value={password} />
				<button on:click={handleSignUp} class="action-btn">Create Account</button>
			</div>
		</div>
	</div>
{/if}

<style>
	*{
		font-family: var( --font-family);
	}
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(4px);
		z-index: 110;
	}
	.modal-content {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		border-radius: 12px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		z-index: 120;
		width: 90%;
		max-width: 400px;
		color: #111;
		overflow: hidden; /* Ensures content respects border-radius */
	}

	/* --- HEADER ALIGNMENT FIX --- */
	.modal-header {
		position: relative; /* Anchor for the close button */
		padding: 1.5rem;
		text-align: center;
		border-bottom: 1px solid #eee;
	}
	.modal-header h2 {
		margin: 0;
		font-size: 1.5rem;
	}
	.close-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: none;
		border: none;
		font-size: 1.75rem;
		cursor: pointer;
		color: #aaa;
	}

	/* --- BODY AND FORM STYLES --- */
	.modal-body {
		padding: 1.5rem;
	}
	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	input {
		width: 100%;
		padding: 0.75rem;
		font-size: 1rem;
		border-radius: 6px;
		border: 1px solid #ccc;
		box-sizing: border-box; /* Ensures padding doesn't break layout */
	}
	.action-btn {
		padding: 0.75rem;
		border-radius: 6px;
		border: none;
		font-weight: bold;
		cursor: pointer;
		background-color: #007bff;
		color: white;
		font-size: 1rem;
		margin-top: 0.5rem;
	}
</style>