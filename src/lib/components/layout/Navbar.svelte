<script lang="ts">
	// SvelteKit Imports
	import { page } from '$app/stores';
	import { goto } from '$app/navigation'; // <-- Make sure goto is imported
	import { get } from 'svelte/store';

	// Data Store
	import { resumeData } from '$lib/resumeStore';
	import { uiStore, toggleThemeSidebar } from '$lib/uiStore';

	// Modals & Icons
	import SettingsModal from '$lib/components/ui/SettingsModal.svelte';
	import LoginModal from '$lib/components/ui/LoginModal.svelte';
	import SignUpModal from '$lib/components/ui/SignUpModal.svelte';
	import ForgotPasswordModal from '$lib/components/ui/ForgotPasswordModal.svelte';
	import { Save, Download, Menu, X, Palette, FileJson } from 'svelte-lucide';

	// PDF Generation Libraries
	import jsPDF from 'jspdf';
	import html2canvas from 'html2canvas';

	// --- STATE MANAGEMENT ---
	let isMenuOpen = false;
	let isMobileMenuOpen = false;
	let isSettingsModalOpen = false;
	let isLoginModalOpen = false;
	let isSignUpModalOpen = false;
	let isForgotPasswordModalOpen = false;
	let isDownloading = false;
	let isSaving = false;

	// --- SIMULATED PAYMENT STATUS ---
	// TODO: Replace this with actual logic fetching user/resume payment status
	let isPaid = false; // Set to false to test the payment gate

	// --- CONTEXT-AWARE UI LOGIC ---
	$: isBuilderPage = $page.url.pathname.startsWith('/resume/');
	$: logoHref = isBuilderPage ? '/dashboard' : '/';

	// --- MOBILE MENU FUNCTIONS ---
	const toggleMobileMenu = () => isMobileMenuOpen = !isMobileMenuOpen;
	const closeMobileMenu = () => isMobileMenuOpen = false;

	// --- AUTHENTICATION & MODAL FUNCTIONS ---
	function openSignUpModal() {
		closeMobileMenu(); isLoginModalOpen = false; isForgotPasswordModalOpen = false; isSignUpModalOpen = true;
	}
	function openForgotPasswordModal() {
		isLoginModalOpen = false; isSignUpModalOpen = false; isForgotPasswordModalOpen = true;
	}
	async function handlePasswordReset(event: CustomEvent) {
		const { email } = event.detail; const { supabase } = $page.data;
		const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/` });
		if (error) { throw error; }
	}
	async function loginWithGoogle() {
		closeMobileMenu(); const { supabase } = $page.data;
		await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/auth/callback` } });
	}
	async function handleEmailSignUp(event: CustomEvent) {
		const { name, email, password } = event.detail; const { supabase } = $page.data;
		const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
		if (error) { alert(error.message); } else { alert('Account created! Check email.'); isSignUpModalOpen = false; }
	}
	async function handleEmailSignIn(event: CustomEvent) {
		const { email, password } = event.detail; const { supabase } = $page.data;
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) { alert(error.message); } else { isLoginModalOpen = false; closeMobileMenu(); goto('/dashboard'); }
	}
	async function signOut() {
		const { supabase } = $page.data; if (supabase) { await supabase.auth.signOut(); }
		isMenuOpen = false; closeMobileMenu(); await goto('/', { invalidateAll: true });
	}
	function openSettings() { isMenuOpen = false; closeMobileMenu(); isSettingsModalOpen = true; }
	async function handleDeleteAccount() {
		const response = await fetch('/api/delete-account', { method: 'POST' });
		if (response.ok) { alert('Account deleted.'); await goto('/', { invalidateAll: true }); } else { alert('Failed to delete account.'); }
		isSettingsModalOpen = false;
	}

	// --- RESUME ACTION FUNCTIONS ---
	async function saveResume() {
		if (isSaving || !isBuilderPage) return; const resumeId = $page.params.id; const { supabase } = $page.data; if (!resumeId || !supabase) return;
		isSaving = true;
		try {
			const currentData = get(resumeData);
			const { error } = await supabase.from('resumes').update({ data: currentData, updated_at: new Date().toISOString() }).eq('id', resumeId);
			if (error) throw error;
		} catch (error: any) { console.error('Error saving:', error); alert(`Could not save: ${error.message}`); }
		finally { setTimeout(() => (isSaving = false), 1000); }
	}

	async function downloadPDF() {
		// --- PAYMENT CHECK ---
		if (!isPaid) {
			alert('Please upgrade to download.'); // Optional: Inform user
			goto('/#pricing'); // Redirect to pricing section
			return; // Stop the function
		}
		// --- END PAYMENT CHECK ---

		if (isDownloading) return; isDownloading = true; const element = document.getElementById('resume-preview-paper');
		if (!element) { alert('Preview not found!'); isDownloading = false; return; }
		const originalWidth = element.style.width; const originalMaxWidth = element.style.maxWidth;
		element.style.width = '650px'; element.style.maxWidth = '650px';
		try {
			const filename = `${get(resumeData).basicInfo.name.replace(/ /g, '_')}_Resume.pdf`;
			const canvas = await html2canvas(element, { scale: 2, useCORS: true }); const imgData = canvas.toDataURL('image/jpeg', 0.98);
			const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
			pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height); pdf.save(filename);
		} catch (error: any) { console.error('PDF Error:', error); alert(`PDF Error: ${error.message}`); }
		finally { element.style.width = originalWidth; element.style.maxWidth = originalMaxWidth; isDownloading = false; }
	}

	function downloadJSON() {
		// --- PAYMENT CHECK ---
		if (!isPaid) {
			alert('Please upgrade to download.'); // Optional: Inform user
			goto('/#pricing'); // Redirect to pricing section
			return; // Stop the function
		}
		// --- END PAYMENT CHECK ---

		try {
			const currentData = get(resumeData); const baseName = currentData?.basicInfo?.name || 'resume';
			const filename = `${baseName.replace(/ /g, '_')}_Resume.json`;
			const jsonString = JSON.stringify(currentData, null, 2); const blob = new Blob([jsonString], { type: 'application/json' });
			const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename;
			document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
		} catch (error: any) { console.error('JSON Download Error:', error); alert(`Could not download JSON: ${error.message}`); }
	}

</script>

<div class="mobile-menu-overlay" class:open={isMobileMenuOpen} on:click={closeMobileMenu} />
<div class="mobile-menu" class:open={isMobileMenuOpen}>
    <div class="mobile-menu-header">
		<a href={logoHref} class="logo" on:click={closeMobileMenu}><strong>Folio</strong>.ai</a>
		<button on:click={closeMobileMenu} class="icon-button" aria-label="Close menu"><X size={24} /></button>
	</div>
	<div class="mobile-menu-content">
		{#if $page.data.session}
			<div class="mobile-user-info">
				<div class="avatar default-avatar"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="user-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></div>
				<div class="username">{($page.data.session.user.user_metadata?.full_name) ? $page.data.session.user.user_metadata.full_name : $page.data.session.user.email}</div>
			</div>
			<a href="/dashboard" class="mobile-link" on:click={closeMobileMenu}>Dashboard</a>
			<button on:click={openSettings} class="mobile-link">Settings</button>
			<button on:click={signOut} class="mobile-link sign-out">Sign Out</button>
		{:else}
			<a href="/#features" class="mobile-link" on:click={closeMobileMenu}>Features</a>
			<a href="/#pricing" class="mobile-link" on:click={closeMobileMenu}>Pricing</a>
			<button on:click={() => { isLoginModalOpen = true; closeMobileMenu(); }} class="mobile-button">Sign In</button>
		{/if}
	</div>
</div>

<LoginModal open={isLoginModalOpen} on:googleLogin={loginWithGoogle} on:signIn={handleEmailSignIn} on:openSignUp={openSignUpModal} on:forgotPassword={openForgotPasswordModal} on:close={() => (isLoginModalOpen = false)} />
<SignUpModal open={isSignUpModalOpen} on:signUp={handleEmailSignUp} on:close={() => (isSignUpModalOpen = false)} />
<SettingsModal open={isSettingsModalOpen} on:delete={handleDeleteAccount} on:close={() => (isSettingsModalOpen = false)} />
<ForgotPasswordModal open={isForgotPasswordModalOpen} on:sendResetLink={handlePasswordReset} on:close={() => (isForgotPasswordModalOpen = false)} />

<nav class="navbar">
	<div class="nav-content">
		<div class="nav-left">
			<a href={logoHref} class="logo"><strong>Folio</strong>.ai</a>
			{#if isBuilderPage}
				<div class="separator"></div>
				<div class="builder-actions">
					<button class="nav-action-btn" on:click={saveResume} disabled={isSaving}>
						<Save size={16} /><span>{isSaving ? 'Saving...' : 'Save'}</span>
					</button>
					<button class="nav-action-btn" on:click={downloadPDF} disabled={isDownloading}>
						<Download size={16} /><span>{isDownloading ? 'Downloading...' : 'PDF'}</span>
					</button>
					<button class="nav-action-btn" on:click={downloadJSON}>
						<FileJson size={16} /><span>JSON</span>
					</button>
					<button class="nav-action-btn tablet-theme-btn" on:click={toggleThemeSidebar}>
						<Palette size={16} /><span>Themes</span>
					</button>
				</div>
			{/if}
		</div>
		<div class="nav-right">
			<div class="desktop-nav">
				{#if $page.data.session}
					<div class="profile-menu">
						<button class="avatar-button avatar-with-name" aria-label="Open profile menu" on:click={() => (isMenuOpen = !isMenuOpen)}>
							<div class="username">
								{#if $page.data.session?.user}
									{($page.data.session.user.user_metadata?.full_name) ? $page.data.session.user.user_metadata.full_name : $page.data.session.user.email}
								{:else}Account{/if}
							</div>
							<div class="avatar default-avatar"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="user-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></div>
						</button>
						{#if isMenuOpen}
							<div class="dropdown-menu">
								<a href="/dashboard" class="dropdown-item">Dashboard</a>
								<button on:click={openSettings} class="dropdown-item">Settings</button>
								<div class="dropdown-separator" />
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
			<button class="hamburger-btn" on:click={toggleMobileMenu} aria-label="Open menu"><Menu size={24} /></button>
		</div>
	</div>
</nav>

<style>
	/* ... Paste your existing styles here ... */
    .navbar {
        background-color: var(--background-sidebar);
        border-bottom: 1px solid var(--border-color);
        padding: 0 1.5rem; /* Responsive padding */
        height: 65px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 50;
    }
    .nav-content {
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .nav-left,
    .nav-right,
    .builder-actions,
    .desktop-nav {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }
    .nav-right { margin-left: auto; justify-content: flex-end; }
    .logo {
        font-size: 1.5rem;
        text-decoration: none;
        color: var(--text-headings);
        font-weight: 500;
        flex-shrink: 0;
    }
    .separator {
        height: 24px;
        width: 1px;
        background-color: var(--border-color);
    }
    .nav-action-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: 1px solid var(--border-color);
        background-color: transparent;
        color: var(--text-secondary);
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }
    .nav-action-btn:hover:not(:disabled) {
        background-color: var(--background-input);
        color: var(--text-primary);
    }
    .nav-action-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    /* --- Desktop Dropdown Styles --- */
    .nav-links a { text-decoration: none; } /* Added class */
	.dropdown-link { /* Style for non-button links */
		text-decoration: none;
		color: var(--text-secondary);
		font-size: 0.9rem;
		transition: color 0.2s;
	}
	.dropdown-link:hover { color: var(--text-primary); }

    .profile-menu { position: relative; }
    .avatar-button {
        background: none; border: none; cursor: pointer; display: inline-flex;
        align-items: center; gap: 0.5rem; padding: 0.25rem 0.4rem;
    }
    .avatar-button .username { order: 0; margin-right: 0.5rem; }
    .avatar-button .avatar { order: 1; }
    .username, .default-avatar { font-family: var(--font-family); align-items: center; gap: 0.75rem; }
    .dropdown-menu {
        position: absolute; top: 140%; right: 0; background-color: var(--background-sidebar);
        border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        min-width: 200px; z-index: 60; overflow: hidden;
    }
    .dropdown-item {
        display: block; width: 100%; padding: 0.75rem 1rem; background: none; border: none;
        text-align: left; cursor: pointer; font-size: 0.9rem; color: var(--text-primary); text-decoration: none;
    }
    .dropdown-item:hover { background-color: var(--background-main); }
    .dropdown-separator { height: 1px; background-color: var(--border-color); margin: 0.5rem 0; }
    .default-avatar {
        width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center;
    }
    .user-icon { width: 22px; height: 22px; }
    .username { font-size: 0.9rem; }
    .nav-button {
        display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem;
        border: 1px solid var(--border-color); background-color: transparent; color: var(--text-secondary);
        border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-size: 0.9rem;
    }
    .nav-button:hover:not(:disabled) { background-color: var(--background-input); color: var(--text-primary); }

    /* --- Icon Button Base Style --- */
    .icon-button {
        background: none; border: none; cursor: pointer; color: var(--text-secondary);
        padding: 0.25rem; border-radius: 6px; display: flex; align-items: center; justify-content: center;
    }
    .icon-button:hover { color: var(--text-primary); background-color: var(--background-input); }

    /* --- Mobile Menu Styles --- */
    .hamburger-btn {
        display: none; /* Hidden by default */
        background: none; border: none; padding: 0.25rem; margin: 0; cursor: pointer;
        color: var(--text-primary); z-index: 51;
    }
    .mobile-menu-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.5); z-index: 100; opacity: 0; visibility: hidden;
        transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    }
    .mobile-menu-overlay.open { opacity: 1; visibility: visible; }
    .mobile-menu {
        position: fixed; top: 0; right: 0; width: 80%; max-width: 300px; height: 100%;
        background-color: var(--background-sidebar); z-index: 101; transform: translateX(100%);
        transition: transform 0.3s ease-in-out; display: flex; flex-direction: column;
    }
    .mobile-menu.open { transform: translateX(0); box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1); }
    .mobile-menu-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 0 1.5rem; height: 65px; border-bottom: 1px solid var(--border-color); flex-shrink: 0;
    }
    .mobile-menu-header .logo { font-size: 1.25rem; }
    .mobile-menu-content { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; overflow-y: auto; }
    .mobile-user-info { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; background-color: var(--background-main); border-radius: 8px; margin-bottom: 1rem; }
    .mobile-user-info .username { font-weight: 500; color: var(--text-primary); }
    .mobile-link {
        display: block; width: 100%; padding: 0.75rem 1rem; background: none; border: none;
        text-align: left; cursor: pointer; font-size: 1rem; color: var(--text-secondary); text-decoration: none;
        border-radius: 6px; transition: background-color 0.2s, color 0.2s;
    }
    .mobile-link:hover { background-color: var(--background-main); color: var(--text-primary); }
    .mobile-link.sign-out { color: var(--accent-destructive); }
    .mobile-link.sign-out:hover { background-color: var(--accent-destructive); color: var(--text-inverted); }
    .mobile-button {
        width: 100%; padding: 0.75rem 1rem; font-size: 1rem; font-weight: 500; background-color: var(--accent-primary);
        color: var(--text-inverted); border: none; border-radius: 6px; cursor: pointer; transition: filter 0.2s;
    }
    .mobile-button:hover { filter: brightness(90%); }

    /* --- Tablet-only button --- */
    .tablet-theme-btn { display: none; }

    /* --- RESPONSIVE MEDIA QUERIES --- */
    @media (max-width: 767px) { /* --- Mobile --- */
        .navbar { padding: 0 1rem; }
        .desktop-nav { display: none; }
        .hamburger-btn {
            display: flex; align-items: center; justify-content: center;
            position: relative; /* Keep relative positioning */
        }
        .tablet-theme-btn { display: none; }
        .nav-left { gap: 0.75rem; }
        .builder-actions { gap: 0.75rem; }
        .nav-action-btn span { display: none; }
        .nav-action-btn { padding: 0.5rem; }
        .separator { margin: 0 0.25rem; }
    }

    @media (min-width: 768px) and (max-width: 1199px) { /* --- Tablet --- */
        .tablet-theme-btn { display: inline-flex; }
        .hamburger-btn { display: none; }
        .desktop-nav { display: flex; }
        .nav-action-btn span { display: none; }
        .nav-action-btn { padding: 0.5rem; }
        .builder-actions { gap: 0.75rem; }
    }

    @media (min-width: 1200px) { /* --- Desktop --- */
        .tablet-theme-btn { display: none; }
        .nav-action-btn span { display: inline; }
        .nav-action-btn { padding: 0.5rem 1rem; }
        .builder-actions { gap: 1.5rem; }
    }
</style>