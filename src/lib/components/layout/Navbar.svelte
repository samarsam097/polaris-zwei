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
					<!-- Make avatar and username a single clickable control so both toggle the same menu -->
					<button class="avatar-button avatar-with-name" aria-label="Open profile menu" on:click={() => (isMenuOpen = !isMenuOpen)}>
						<div class="avatar default-avatar">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="user-icon">
								<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
								<circle cx="12" cy="7" r="4" />
							</svg>
						</div>
						<div class="username">
							{#if $page.data.session?.user}
								{($page.data.session.user.user_metadata && $page.data.session.user.user_metadata.full_name) ? $page.data.session.user.user_metadata.full_name : $page.data.session.user.email}
							{:else}
								Account
							{/if}
						</div>
					</button>
					{#if isMenuOpen}
						<div class="dropdown-menu">
							<a href="/dashboard" class="dropdown-item">Dashboard</a>
							<button on:click={openSettings} class="dropdown-item">Settings</button>
							<div class="separator" ></div>
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

<!-- In src/lib/components/layout/Navbar.svelte -->

<style>
	.navbar {
		/* Use variables for a light theme */
		background-color: var(--background-sidebar);
		border-bottom: 1px solid var(--border-color);
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
		/* Use variable for dark text */
		color: var(--text-headings);
	}
	.nav-links {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}
	/* This is for the "Features" and "Pricing" links */
	.dropdown-link, .nav-links a {
		text-decoration: none;
		color: var(--text-secondary);
		transition: color 0.2s;
	}
	.dropdown-link:hover, .nav-links a:hover {
		color: var(--accent-primary);
	}
	.nav-button {
		background-color: var(--accent-primary);
		color: var(--text-inverted);
		border: none;
		cursor: pointer;
		font-family: 'Inter', sans-serif;
		font-size: 1rem;
		padding: 0.5rem 1rem;
		border-radius: 6px;
	}
	.nav-button:hover {
		filter: brightness(90%);
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
	.avatar-with-name {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		transition: background-color 0.15s;
	}
	.avatar-with-name:hover {
		background-color: var(--background-main);
	}
	.default-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 2px solid var(--border-color);
		background-color: var(--background-main);
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		color: var(--text-secondary);
	}
	.user-icon {
		width: 24px;
		height: 24px;
	}
	.username {
		color: var(--text-primary);
		font-family: 'DMSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
			sans-serif;
		font-size: 0.95rem;
		font-weight: 500;
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
		max-width: 10rem;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.dropdown-menu {
		position: absolute;
		top: 120%;
		right: 0;
		background-color: var(--background-sidebar);
		border: 1px solid var(--border-color);
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
		color: var(--text-primary);
		text-decoration: none;
		transition: background-color 0.2s;
	}
	.dropdown-item:hover {
		background-color: var(--background-main);
		color: var(--text-primary);
	}
	.separator {
		height: 1px;
		background-color: var(--border-color);
		margin: 0.5rem 0;
	}
</style>