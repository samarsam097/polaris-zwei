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
	// --- ADDED CreditCard ICON ---
	import { Save, Download, Menu, X, Palette, FileJson, CreditCard } from 'svelte-lucide';

	// PDF Generation Libraries
	import jsPDF from 'jspdf';
	import html2canvas from 'html2canvas';

	// --- STATE MANAGEMENT ---
	let isMenuOpen = false; // For desktop profile dropdown
	let isMobileMenuOpen = false; // For mobile slide-out menu
	let isSettingsModalOpen = false;
	let isLoginModalOpen = false;
	let isSignUpModalOpen = false;
	let isForgotPasswordModalOpen = false;
	let isDownloading = false; // Used for both PDF and JSON now
	let isSaving = false;

	// --- Get Profile & Credits ---
	$: profile = $page.data.profile; // Access profile data from layout
	$: currentCredits = profile?.credits ?? 0; // Get credits, default to 0

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
		// (This function remains unchanged from your provided code)
		if (isSaving || !isBuilderPage) return; const resumeId = $page.params.id; const { supabase } = $page.data; if (!resumeId || !supabase) return;
		isSaving = true;
		try {
			const currentData = get(resumeData);
			const { error } = await supabase.from('resumes').update({ data: currentData, updated_at: new Date().toISOString() }).eq('id', resumeId);
			if (error) throw error;
		} catch (error: any) { console.error('Error saving:', error); alert(`Could not save: ${error.message}`); }
		finally { setTimeout(() => (isSaving = false), 1000); }
	}

	// --- NEW DOWNLOAD WRAPPER ---
	async function handleDownloadAttempt(downloadType: 'pdf' | 'json') {
		const { supabase, session } = $page.data;

		if (!session?.user?.id) {
			alert('Please log in to download.');
			isLoginModalOpen = true;
			return;
		}

		// 1. Check Credits
		if (currentCredits <= 0) {
			alert('You need credits to download. Please purchase more.');
			const userId = session.user.id;
			const basePaymentLink = 'YOUR_STRIPE_PAYMENT_LINK_URL_HERE'; // <-- REPLACE THIS!
			// Append client_reference_id for the webhook
			const redirectUrl = `${basePaymentLink}?client_reference_id=${userId}`;
			window.location.href = redirectUrl;
			return;
		}

		if (isDownloading) return; // Prevent double clicks
		isDownloading = true;

		// 2. Attempt to Decrement Credits via Edge Function
		try {
			// Get the auth token to pass to the function
			const token = session.access_token;
			const { data, error } = await supabase.functions.invoke('decrement-credits', {
				headers: { Authorization: `Bearer ${token}` } // Pass auth token
			});

			if (error || !data?.success) {
				if (error?.message?.includes('Insufficient credits') || data?.error?.includes('Insufficient credits') || (error as any)?.context?.status === 402) {
					alert('Download failed: Insufficient credits. Please purchase more.');
					const userId = session.user.id;
					const basePaymentLink = 'https://buy.stripe.com/test_14A7sEbTw4kt4429GPgnK00'; // <-- REPLACE THIS!
					const redirectUrl = `${basePaymentLink}?client_reference_id=${userId}`;
					window.location.href = redirectUrl;
				} else {
					throw new Error(error?.message || data?.error || "Failed to update credits. Please try again.");
				}
				isDownloading = false;
				return; // Stop if decrement failed
			}

			// 3. Decrement Succeeded - Proceed with Download
			console.log('Credits decremented successfully.');
			// Manually update local credit count for immediate feedback
            // This relies on the profile object being loaded and reactive
            if ($page.data.profile) {
                // Create a temporary mutable copy if needed, or update store if using one
                 $page.data.profile.credits = Math.max(0, $page.data.profile.credits - 1);
            }


			if (downloadType === 'pdf') {
				await downloadPDFInternal(); // Call actual PDF logic
			} else if (downloadType === 'json') {
				downloadJSONInternal(); // Call actual JSON logic
			}

		} catch (error: any) {
			console.error("Download/Decrement error:", error);
			alert(`Error: ${error.message}`);
			isDownloading = false; // Ensure loading state is reset on error
		}
		// finally block moved inside the specific download functions now
	}

	// --- Internal download functions (original logic moved here) ---
	async function downloadPDFInternal() {
		// (This function remains unchanged from your provided code)
		const element = document.getElementById('resume-preview-paper');
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

	function downloadJSONInternal() {
		// (This function remains unchanged from your provided code)
		try {
			const currentData = get(resumeData); const baseName = currentData?.basicInfo?.name || 'resume';
			const filename = `${baseName.replace(/ /g, '_')}_Resume.json`;
			const jsonString = JSON.stringify(currentData, null, 2); const blob = new Blob([jsonString], { type: 'application/json' });
			const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename;
			document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
		} catch (error: any) { console.error('JSON Download Error:', error); alert(`Could not download JSON: ${error.message}`); }
		finally { isDownloading = false; }
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
				<div class="user-details">
					<div class="username">{($page.data.session.user.user_metadata?.full_name) ? $page.data.session.user.user_metadata.full_name : $page.data.session.user.email}</div>
					{#if profile}
						<div class="credit-display-mobile">
							<CreditCard size={14} /> <span>{currentCredits} Credits</span>
						</div>
					{/if}
				</div>
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
					<button class="nav-action-btn" on:click={() => handleDownloadAttempt('pdf')} disabled={isDownloading}>
						<Download size={16} /><span>{isDownloading ? '...' : 'PDF'}</span>
					</button>
					<button class="nav-action-btn" on:click={() => handleDownloadAttempt('json')} disabled={isDownloading}>
						<FileJson size={16} /><span>{isDownloading ? '...' : 'JSON'}</span>
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
					{#if profile}
						<div class="credit-display-desktop">
							<CreditCard size={16} /> <span>{currentCredits} Credits</span>
						</div>
					{/if}
					<div class="profile-menu">
						<button class="avatar-button avatar-with-name" aria-label="Open profile menu" on:click={() => (isMenuOpen = !isMenuOpen)}>
							<div class="username">{($page.data.session.user.user_metadata?.full_name) ? $page.data.session.user.user_metadata.full_name : $page.data.session.user.email}</div>
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
    .navbar { background-color: var(--background-sidebar); border-bottom: 1px solid var(--border-color); padding: 0 1.5rem; height: 65px; box-sizing: border-box; display: flex; align-items: center; position: sticky; top: 0; z-index: 50; }
    .nav-content { width: 100%; max-width: 100%; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
    .nav-left, .nav-right, .builder-actions, .desktop-nav { display: flex; align-items: center; gap: 1.5rem; }
    .nav-right { margin-left: auto; justify-content: flex-end; }
    .logo { font-size: 1.5rem; text-decoration: none; color: var(--text-headings); font-weight: 500; flex-shrink: 0; }
    .separator { height: 24px; width: 1px; background-color: var(--border-color); }
    .nav-action-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border: 1px solid var(--border-color); background-color: transparent; color: var(--text-secondary); border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .nav-action-btn:hover:not(:disabled) { background-color: var(--background-input); color: var(--text-primary); }
    .nav-action-btn:disabled { opacity: 0.7; cursor: not-allowed; }
    .dropdown-link { text-decoration: none; color: var(--text-secondary); font-size: 0.9rem; transition: color 0.2s; }
    .dropdown-link:hover { color: var(--text-primary); }
    .profile-menu { position: relative; }
    .avatar-button { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0.4rem; }
    .avatar-button .username { order: 0; margin-right: 0.5rem; }
    .avatar-button .avatar { order: 1; }
    .username, .default-avatar { font-family: var(--font-family); align-items: center; gap: 0.75rem; }
    .dropdown-menu { position: absolute; top: 140%; right: 0; background-color: var(--background-sidebar); border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); min-width: 200px; z-index: 60; overflow: hidden; }
    .dropdown-item { display: block; width: 100%; padding: 0.75rem 1rem; background: none; border: none; text-align: left; cursor: pointer; font-size: 0.9rem; color: var(--text-primary); text-decoration: none; }
    .dropdown-item:hover { background-color: var(--background-main); }
    .dropdown-separator { height: 1px; background-color: var(--border-color); margin: 0.5rem 0; }
    .default-avatar { width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center; }
    .user-icon { width: 22px; height: 22px; }
    .username { font-size: 0.9rem; }
    .nav-button { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border: 1px solid var(--border-color); background-color: transparent; color: var(--text-secondary); border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; }
    .nav-button:hover:not(:disabled) { background-color: var(--background-input); color: var(--text-primary); }
    .icon-button { background: none; border: none; cursor: pointer; color: var(--text-secondary); padding: 0.25rem; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
    .icon-button:hover { color: var(--text-primary); background-color: var(--background-input); }
    .hamburger-btn { display: none; background: none; border: none; padding: 0.25rem; margin: 0; cursor: pointer; color: var(--text-primary); z-index: 51; }
    .mobile-menu-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 100; opacity: 0; visibility: hidden; transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out; }
    .mobile-menu-overlay.open { opacity: 1; visibility: visible; }
    .mobile-menu { position: fixed; top: 0; right: 0; width: 80%; max-width: 300px; height: 100%; background-color: var(--background-sidebar); z-index: 101; transform: translateX(100%); transition: transform 0.3s ease-in-out; display: flex; flex-direction: column; }
    .mobile-menu.open { transform: translateX(0); box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1); }
    .mobile-menu-header { display: flex; justify-content: space-between; align-items: center; padding: 0 1.5rem; height: 65px; border-bottom: 1px solid var(--border-color); flex-shrink: 0; }
    .mobile-menu-header .logo { font-size: 1.25rem; }
    .mobile-menu-content { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; overflow-y: auto; }
    .mobile-user-info { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; background-color: var(--background-main); border-radius: 8px; margin-bottom: 1rem; }
    .user-details { display: flex; flex-direction: column; }
	.credit-display-mobile { font-size: 0.8rem; color: var(--text-secondary); display: inline-flex; align-items: center; gap: 0.25rem; margin-top: 0.1rem;}
    .mobile-user-info .username { font-weight: 500; color: var(--text-primary); }
    .mobile-link { display: block; width: 100%; padding: 0.75rem 1rem; background: none; border: none; text-align: left; cursor: pointer; font-size: 1rem; color: var(--text-secondary); text-decoration: none; border-radius: 6px; transition: background-color 0.2s, color 0.2s; }
    .mobile-link:hover { background-color: var(--background-main); color: var(--text-primary); }
    .mobile-link.sign-out { color: var(--accent-destructive); }
    .mobile-link.sign-out:hover { background-color: var(--accent-destructive); color: var(--text-inverted); }
    .mobile-button { width: 100%; padding: 0.75rem 1rem; font-size: 1rem; font-weight: 500; background-color: var(--accent-primary); color: var(--text-inverted); border: none; border-radius: 6px; cursor: pointer; transition: filter 0.2s; }
    .mobile-button:hover { filter: brightness(90%); }
    .tablet-theme-btn { display: none; }

	/* --- ADDED CREDIT DISPLAY STYLES --- */
	.credit-display-desktop {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.85rem;
		color: var(--text-secondary);
		background-color: var(--background-input);
		padding: 0.25rem 0.6rem;
		border-radius: 4px;
		border: 1px solid var(--border-color);
	}

    @media (max-width: 767px) { /* --- Mobile --- */
        .navbar { padding: 0 1rem; }
        .desktop-nav { display: none; }
		.credit-display-desktop { display: none; } /* Hide desktop credits */
        .hamburger-btn { display: flex; align-items: center; justify-content: center; position: relative; }
        .tablet-theme-btn { display: none; }
        .nav-left { gap: 0.75rem; }
        .builder-actions { gap: 0.75rem; }
        .nav-action-btn span { display: none; }
        .nav-action-btn { padding: 0.5rem; }
        .separator { margin: 0 0.25rem; }
    }

    @media (min-width: 768px) and (max-width: 1199px) { /* --- Tablet --- */
		.credit-display-mobile { display: none; } /* Hide mobile credits */
        .tablet-theme-btn { display: inline-flex; }
        .hamburger-btn { display: none; }
        .desktop-nav { display: flex; }
        .nav-action-btn span { display: none; }
        .nav-action-btn { padding: 0.5rem; }
        .builder-actions { gap: 0.75rem; }
    }

    @media (min-width: 1200px) { /* --- Desktop --- */
		.credit-display-mobile { display: none; } /* Hide mobile credits */
        .tablet-theme-btn { display: none; }
        .nav-action-btn span { display: inline; }
        .nav-action-btn { padding: 0.5rem 1rem; }
        .builder-actions { gap: 1.5rem; }
    }
</style>