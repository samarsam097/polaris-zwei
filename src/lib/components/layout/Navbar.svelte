<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	// Importieren Sie alle Modals, die von der Navbar aus geöffnet werden können
	import SettingsModal from '$lib/components/ui/SettingsModal.svelte';
	import LoginModal from '$lib/components/ui/LoginModal.svelte';
	import SignUpModal from '$lib/components/ui/SignUpModal.svelte';

	let isMenuOpen = false;
	let isSettingsModalOpen = false;
	let isLoginModalOpen = false;
	let isSignUpModalOpen = false;

	// Funktion zum Wechseln vom Login- zum Registrierungs-Modal
	function openSignUpModal() {
		isLoginModalOpen = false;
		isSignUpModalOpen = true;
	}

	// Alle Authentifizierungsfunktionen leben jetzt in der Navbar
	async function loginWithGoogle() {
		const { supabase } = $page.data;
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: `${location.origin}/auth/callback` }
		});
	}

	async function handleEmailSignUp(event: CustomEvent) {
		const { name, email, password } = event.detail;
		const { supabase } = $page.data;
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: { data: { full_name: name } }
		});
		if (error) {
			alert(error.message);
		} else {
			alert('Account created! Please check your email to verify.');
			isSignUpModalOpen = false;
		}
	}

	async function handleEmailSignIn(event: CustomEvent) {
		const { email, password } = event.detail;
		const { supabase } = $page.data;
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			alert(error.message);
		} else {
			isLoginModalOpen = false;
			goto('/dashboard');
		}
	}

	async function signOut() {
		const { supabase } = $page.data;
		await supabase.auth.signOut();
		isMenuOpen = false;
		goto('/');
	}

	function openSettings() {
		isMenuOpen = false;
		isSettingsModalOpen = true;
	}

	async function handleDeleteAccount() {
		const response = await fetch('/api/delete-account', { method: 'POST' });
		if (response.ok) {
			alert('Your account and all data have been deleted.');
			await goto('/', { invalidateAll: true });
		} else {
			alert('Failed to delete account. Please try again.');
		}
		isSettingsModalOpen = false;
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
<SettingsModal
	open={isSettingsModalOpen}
	on:delete={handleDeleteAccount}
	on:close={() => (isSettingsModalOpen = false)}
/>

<nav class="navbar">
	<div class="nav-content">
		<a href="/" class="logo">
			<strong>Folio</strong>.ai
		</a>
		<div class="nav-links">
			{#if $page.data.session}
				<div class="profile-menu">
					<button class="avatar-button" on:click={() => (isMenuOpen = !isMenuOpen)}>
						<div class="avatar default-avatar">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="user-icon">
								<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
								<circle cx="12" cy="7" r="4" />
							</svg>
						</div>
					</button>
					{#if isMenuOpen}
						<div class="dropdown-menu">
							<a href="/dashboard" class="dropdown-item">Dashboard</a>
							<button on:click={openSettings} class="dropdown-item">Settings</button>
							<div class="separator" />
							<button on:click={signOut} class="dropdown-item">Sign Out</button>
						</div>
					{/if}
				</div>
			{:else}
				<a href="/#features" class="dropdown-link">Features</a>
				<a href="/#pricing" class="dropdown-link">Pricing</a>
				<button on:click={() => (isLoginModalOpen = true)} class="nav-button">Sign In</button>
			{/if}
		</div>
	</div>
</nav>

<style>
	.navbar {
		background-color: #111827;
		border-bottom: 1px solid black;
		padding: 1rem 2rem;
		font-family: 'Inter', sans-serif;
		position: sticky;
		top: 0;
		z-index: 50;
	}
	.nav-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.logo {
		font-size: 1.5rem;
		text-decoration: none;
		color: white;
	}
	.nav-links {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}
	.nav-links a {
		text-decoration: none;
		color: #9ca3af;
		transition: color 0.2s;
	}
	.nav-links a:hover {
		color: #ffffff;
	}
	.nav-button {
		background-color: #007bff;
		color: white !important;
		padding: 0.5rem 1rem;
		border-radius: 6px;
	}
	.nav-button:hover {
		background-color: #0056b3;
		color: white;
	}
	.profile-menu {
		position: relative;
	}
	.avatar-button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		border-radius: 50%;
	}
	.default-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 2px solid #4b5563;
		background-color: #374151;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		color: #9ca3af;
	}
	.user-icon {
		width: 24px;
		height: 24px;
	}
	.dropdown-menu {
		position: absolute;
		top: 120%;
		right: 0;
		background-color: white;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		min-width: 150px;
		z-index: 60;
		overflow: hidden;
	}
	.dropdown-item {
		display: block;
		width: 100%;
		padding: 0.75rem 1rem;
		background: none;
		border: none;
		text-align: left;
		cursor: pointer;
		font-size: 1rem;
		font-family: 'DMSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
			sans-serif;
		color: #333;
		text-decoration: none;
		transition: background-color 0.2s;
	}
	.dropdown-item:hover {
		background-color: #f5f5f5;
		color: #333;
	}
	a.dropdown-item:hover {
		color: #333;
	}
	.separator {
		height: 1px;
		background-color: #eee;
		margin: 0.5rem 0;
	}
</style>