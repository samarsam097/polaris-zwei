<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment';

	export let open = false;
	let email = '';
	let message = '';
	let isLoading = false;

	const dispatch = browser ? createEventDispatcher() : () => {};

	async function handlePasswordReset() {
		if (!email) {
			alert('Please enter your email address.');
			return;
		}

		isLoading = true;
		message = '';

		// Dispatch the event and wait for the parent to handle it
		try {
			// This tells the Navbar to run the Supabase logic
			await dispatch('sendResetLink', { email });
			message = 'Success! If an account exists, a reset link has been sent to your email.';
		} catch (error: any) {
			message = `Error: ${error.message}`;
		} finally {
			isLoading = false;
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
			<h2>Reset Password</h2>
			<button class="close-btn" on:click={() => dispatch('close')}>×</button>
		</header>
		<div class="modal-body">
			<div class="email-form">
				<p class="instructions">
					Enter your email address and we will send you a link to reset your password.
				</p>
				<input type="email" placeholder="Email address" bind:value={email} />

				{#if message}
					<p class="message">{message}</p>
				{/if}

				<button on:click={handlePasswordReset} class="action-btn" disabled={isLoading}>
					{isLoading ? 'Sending...' : 'Send Reset Link'}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Most styles are copied from LoginModal for consistency */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(4px);
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
		max-width: 400px;
		color: #111;
	}

	.modal-header {
		position: relative;
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

	.modal-body {
		padding: 1.5rem;
	}

	.email-form {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.instructions {
		font-size: 0.9rem;
		color: #555;
		margin-top: 0;
		margin-bottom: 0.5rem;
		text-align: center;
		line-height: 1.5;
	}

	.email-form input {
		width: 100%;
		padding: 0.75rem;
		font-size: 1rem;
		border-radius: 6px;
		border: 1px solid #ccc;
		box-sizing: border-box;
	}
	.action-btn {
		width: 100%;
		padding: 0.75rem;
		border-radius: 6px;
		border: none;
		font-weight: bold;
		cursor: pointer;
		background-color: #007bff;
		color: white;
		font-size: 1rem;
		margin-top: 0.25rem;
	}
	.action-btn:disabled {
		background-color: #aaa;
		cursor: not-allowed;
	}

	.message {
		font-size: 0.9rem;
		color: var(--text-primary);
		padding: 0.75rem;
		background-color: #f3f4f6;
		border-radius: 6px;
		text-align: center;
	}
</style>