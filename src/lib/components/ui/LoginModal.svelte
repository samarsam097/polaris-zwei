<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment';

	export let open = false;
	let email = '';
	let password = '';

	const dispatch = browser ? createEventDispatcher() : () => {};

	function handleGoogleLogin() {
		dispatch('googleLogin');
	}

	function handleEmailSignIn() {
		if (email && password) {
			dispatch('signIn', { email, password });
		} else {
			alert('Please enter both email and password.');
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
			<h2>Sign In</h2>
			<div class="signup-link">
				<span>Don't have an account?</span>
				<button on:click={() => dispatch('openSignUp')}>Sign Up</button>
			</div>
			<button class="close-btn" on:click={() => dispatch('close')}>×</button>
		</header>
		<div class="modal-body">
			<div class="email-form">
				<input type="email" placeholder="Email address" bind:value={email} />
				<input type="password" placeholder="Password" bind:value={password} />

				<!-- --- NEW FORGOT PASSWORD LINK --- -->
				<div class="form-actions">
					<button class="forgot-password-btn" on:click={() => dispatch('forgotPassword')}>
						Forgot Password?
					</button>
				</div>
				<!-- --- END NEW LINK --- -->

				<button on:click={handleEmailSignIn} class="action-btn">Sign In</button>
			</div>
			<div class="separator">OR</div>
			<button on:click={handleGoogleLogin} class="google-btn">
				<img src="/google-logo.svg" alt="Google G Logo" />
				<span>Sign in with Google</span>
			</button>
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
	.signup-link {
		font-size: 0.9rem;
		color: #555;
		margin-top: 0.25rem;
	}
	.signup-link button {
		background: none;
		border: none;
		color: #007bff;
		cursor: pointer;
		font-weight: bold;
		padding: 0;
		font-size: 0.9rem;
		text-decoration: underline;
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
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.email-form {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
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

	/* --- NEW STYLES --- */
	.form-actions {
		display: flex;
		justify-content: flex-end; /* Aligns the button to the right */
		margin-bottom: 0.5rem;
	}

	.forgot-password-btn {
		background: none;
		border: none;
		padding: 0;
		color: #007bff;
		font-size: 0.85rem;
		cursor: pointer;
		text-decoration: underline;
	}
	/* --- END NEW STYLES --- */

	.separator {
		width: 100%;
		display: flex;
		align-items: center;
		text-align: center;
		color: #aaa;
		margin: 1.5rem 0;
		font-size: 0.8rem;
	}
	.separator::before,
	.separator::after {
		content: '';
		flex: 1;
		border-bottom: 1px solid #ddd;
	}
	.separator:not(:empty)::before {
		margin-right: 0.5em;
	}
	.separator:not(:empty)::after {
		margin-left: 0.5em;
	}

	.google-btn {
		background-color: #ffffff;
		color: #3f3f46;
		border: 1px solid #d4d4d8;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 500;
		font-family: var(--font-family);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 10px 24px;
		font-size: 14px;
		width: auto;
	}
	.google-btn img {
		width: 18px;
		height: 18px;
	}
</style>