<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LoginModal from '$lib/components/ui/LoginModal.svelte';
	import SignUpModal from '$lib/components/ui/SignUpModal.svelte'; // Import the new modal

	export let data;
	const { supabase } = data;

	let isLoginModalOpen = false;
	let isSignUpModalOpen = false; // State for the new modal

	onMount(() => {
		// 3. Check if there is an active session from the server data.
		if ($page.data.session) {
			// If a user is logged in, sign them out.
			signOut();
		}
	});

	async function signOut() {
		await supabase.auth.signOut();
		// We don't need to redirect, the page will just update to the logged-out state.
	}

	// This function closes the login modal and opens the sign-up modal
	function openSignUpModal() {
		isLoginModalOpen = false;
		isSignUpModalOpen = true;
	}

	async function loginWithGoogle() {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: `${location.origin}/auth/callback` }
		});
	}

	// This function handles the new sign-up logic
async function handleEmailSignUp(event: CustomEvent) {
	const { name, email, password } = event.detail;

	// 1. Capture the 'data' object from the response
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				full_name: name
			}
		}
	});

	if (error) {
		alert(error.message);
	} else if (data.session) {
		// 2. If the response includes a session, the user is logged in.
		// Close the modal and redirect to the dashboard.
		isSignUpModalOpen = false;
		goto('/dashboard');
	} else {
		// Fallback for any other case (e.g., if you re-enable email confirmation)
		alert('Account created successfully!');
		isSignUpModalOpen = false;
	}
}

	async function handleEmailSignIn(event: CustomEvent) {
		const { email, password } = event.detail;
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			alert(error.message);
		} else {
			isLoginModalOpen = false;
			// The global listener in +layout.svelte will detect the new session and redirect
			goto('/dashboard');
		}
	}
</script>

<LoginModal
	open={isLoginModalOpen}
	on:googleLogin={loginWithGoogle}
	on:signIn={handleEmailSignIn}
	on:openSignUp={openSignUpModal}
	on:close={() => (isLoginModalOpen = false)}
/>

<SignUpModal
	open={isSignUpModalOpen}
	on:signUp={handleEmailSignUp}
	on:close={() => (isSignUpModalOpen = false)}
/>

<svelte:head>
	<style>
		body { overflow: hidden; }
	</style>
</svelte:head>

<div class="homepage">
	<div class="background-image" />
	<div class="content">
		<h1>Craft Your Future</h1>
		<p>Build a professional, ATS-friendly resume in minutes. Create, customize, and download with ease.</p>
		<button on:click={() => (isLoginModalOpen = true)} class="sign-in-btn"> Sign In </button>
	</div>
</div>

<style>
	* {
		margin: 0;
		box-sizing: border-box;
		font-family: 'DMSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
			sans-serif;
	}

	.homepage {
		position: relative;
		height: 100vh;
		width: 100%;
		overflow: hidden;
		background-color: #000;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.background-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		background-image: url('/goodname.svg');
		background-size: cover;
		background-position: center;
		opacity: 0.3; /* Reduced opacity for a more subtle background */
		animation: fadeIn 2s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 0.3;
		}
	}

	.content {
		position: relative;
		z-index: 1;
		width: 90%;
		max-width: 600px;
		padding: 3rem;
		text-align: center;
		color: white;

		background: rgba(10, 10, 10, 0.1);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-radius: 16px; /* Larger radius for a softer look */
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	h1 {
		font-size: 3.5rem;
		font-weight: 500; /* Medium weight for modern feel */
		margin-bottom: 1rem;
		letter-spacing: -1.5px; /* Tighter letter spacing */
	}

	p {
		font-size: 1.125rem; /* Slightly larger body text */
		color: rgba(255, 255, 255, 0.8); /* Softer white for text */
		line-height: 1.6;
		max-width: 450px;
		margin: 0 auto;
	}

	.google-btn {
		margin-top: 2.5rem;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		background-color: #ffffff;
		color: #111;
		border: 1px solid #ddd;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.2s ease;
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	}

	.google-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
	}
	.sign-in-btn {
		margin-top: 2.5rem;
		padding: 1rem 2.5rem;
		font-size: 1.1rem;
		background-color: #ffffff;
		color: #111;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.2s ease;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	}
	.sign-in-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
	}
</style>