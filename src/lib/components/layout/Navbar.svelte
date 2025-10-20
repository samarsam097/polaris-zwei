<script lang="ts">
	// SvelteKit Imports
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';

	// Data Store
	import { resumeData } from '$lib/resumeStore';
	import { uiStore, toggleThemeSidebar } from '$lib/uiStore';

	// Modals & Icons
	import SettingsModal from '$lib/components/ui/SettingsModal.svelte';
	import LoginModal from '$lib/components/ui/LoginModal.svelte';
	import SignUpModal from '$lib/components/ui/SignUpModal.svelte';
	import ForgotPasswordModal from '$lib/components/ui/ForgotPasswordModal.svelte';
	// --- ADDED FileJson ICON ---
	import { Save, Download, Menu, X, Palette, FileJson } from 'svelte-lucide'; // <-- IMPORTED

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
	// Optional: Add a separate loading state if JSON download takes time (unlikely)
	// let isDownloadingJSON = false;

	// --- CONTEXT-AWARE UI LOGIC ---
	$: isBuilderPage = $page.url.pathname.startsWith('/resume/');
	$: logoHref = isBuilderPage ? '/dashboard' : '/';

	// --- MOBILE MENU FUNCTIONS ---
	const toggleMobileMenu = () => (isMobileMenuOpen = !isMobileMenuOpen);
	const closeMobileMenu = () => (isMobileMenuOpen = false);

	// --- AUTHENTICATION & MODAL FUNCTIONS ---
	function openSignUpModal() {
		closeMobileMenu();
		isLoginModalOpen = false;
		isForgotPasswordModalOpen = false;
		isSignUpModalOpen = true;
	}

	function openForgotPasswordModal() {
		isLoginModalOpen = false;
		isSignUpModalOpen = false;
		isForgotPasswordModalOpen = true;
	}

	async function handlePasswordReset(event: CustomEvent) {
		const { email } = event.detail;
		const { supabase } = $page.data;
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${location.origin}/`
		});
		if (error) { throw error; }
	}

	async function loginWithGoogle() {
		closeMobileMenu();
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
			email, password, options: { data: { full_name: name } }
		});
		if (error) { alert(error.message); }
		else { alert('Account created! Check email.'); isSignUpModalOpen = false; }
	}
	async function handleEmailSignIn(event: CustomEvent) {
		const { email, password } = event.detail;
		const { supabase } = $page.data;
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) { alert(error.message); }
		else { isLoginModalOpen = false; closeMobileMenu(); goto('/dashboard'); }
	}
	async function signOut() {
		const { supabase } = $page.data;
		if (supabase) { await supabase.auth.signOut(); }
		isMenuOpen = false; closeMobileMenu();
		await goto('/', { invalidateAll: true });
	}
	function openSettings() {
		isMenuOpen = false; closeMobileMenu(); isSettingsModalOpen = true;
	}
	async function handleDeleteAccount() {
		const response = await fetch('/api/delete-account', { method: 'POST' });
		if (response.ok) { alert('Account deleted.'); await goto('/', { invalidateAll: true }); }
		else { alert('Failed to delete account.'); }
		isSettingsModalOpen = false;
	}

	// --- RESUME ACTION FUNCTIONS ---
	async function saveResume() {
		if (isSaving || !isBuilderPage) return;
		const resumeId = $page.params.id;
		const { supabase } = $page.data;
		if (!resumeId || !supabase) return;
		isSaving = true;
		try {
			const currentData = get(resumeData);
			const { error } = await supabase
				.from('resumes')
				.update({ data: currentData, updated_at: new Date().toISOString() })
				.eq('id', resumeId);
			if (error) throw error;
		} catch (error: any) { console.error('Error saving:', error); alert(`Could not save: ${error.message}`); }
		finally { setTimeout(() => (isSaving = false), 1000); }
	}

	async function downloadPDF() {
		if (isDownloading) return;
		isDownloading = true;
		const element = document.getElementById('resume-preview-paper');
		if (!element) { alert('Preview not found!'); isDownloading = false; return; }
		const originalWidth = element.style.width;
		const originalMaxWidth = element.style.maxWidth;
		element.style.width = '650px'; element.style.maxWidth = '650px';
		try {
			const filename = `${get(resumeData).basicInfo.name.replace(/ /g, '_')}_Resume.pdf`;
			const canvas = await html2canvas(element, { scale: 2, useCORS: true });
			const imgData = canvas.toDataURL('image/jpeg', 0.98);
			const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
			pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
			pdf.save(filename);
			// Consider using a toast notification instead of alert
			// alert('Downloaded successfully!');
		} catch (error: any) { console.error('PDF Error:', error); alert(`PDF Error: ${error.message}`); }
		finally { element.style.width = originalWidth; element.style.maxWidth = originalMaxWidth; isDownloading = false; }
	}

	// --- FUNCTION TO DOWNLOAD JSON ---
	function downloadJSON() {
		try {
			const currentData = get(resumeData);
			// Ensure basicInfo and name exist before creating filename
			const baseName = currentData?.basicInfo?.name || 'resume';
			const filename = `${baseName.replace(/ /g, '_')}_Resume.json`;

			const jsonString = JSON.stringify(currentData, null, 2); // Pretty print JSON
			const blob = new Blob([jsonString], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = filename;
			document.body.appendChild(link); // Required for Firefox
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (error: any) {
			console.error('JSON Download Error:', error);
			alert(`Could not download JSON: ${error.message}`);
		}
	}
	// --- END NEW FUNCTION ---

</script>

<div class="mobile-menu-overlay" class:open={isMobileMenuOpen} on:click={closeMobileMenu} />
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
						<button
							class="avatar-button avatar-with-name"
							aria-label="Open profile menu"
							on:click={() => (isMenuOpen = !isMenuOpen)}
						>
							<div class="username">
								{#if $page.data.session?.user}
									{($page.data.session.user.user_metadata &&
									$page.data.session.user.user_metadata.full_name)
										? $page.data.session.user.user_metadata.full_name
										: $page.data.session.user.email}
								{:else}
									Account
								{/if}
							</div>
							<div class="avatar default-avatar">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="user-icon"
								>
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
									<circle cx="12" cy="7" r="4" />
								</svg>
							</div>
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
    .nav-links a {
        text-decoration: none;
    }
    .profile-menu {
        position: relative;
    
    }
    .avatar-button {
        background: none;
        border: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.4rem;
    }
    /* Ensure username is left of avatar and both align horizontally */
    .avatar-button .username { order: 0; margin-right: 0.5rem; }
    .avatar-button .avatar { order: 1; }
    .username,
    .default-avatar {
        font-family: var(--font-family);
        align-items: center;
        gap: 0.75rem;
    }
    .dropdown-menu {
        position: absolute;
        top: 140%;
        right: 0;
        background-color: var(--background-sidebar);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        min-width: 200px;
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
        font-size: 0.9rem;
        color: var(--text-primary);
        text-decoration: none;
    }
    .dropdown-item:hover {
        background-color: var(--background-main);
    }
    .dropdown-separator {
        height: 1px;
        background-color: var(--border-color);
        margin: 0.5rem 0;
    }
    .default-avatar {
        width: 44px; /* increased size */
        height: 44px; /* increased size */
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
    .user-icon {
        width: 22px; /* slightly larger icon */
        height: 22px;
    }
    .username {
        font-size: 0.9rem;
    }
    .nav-button {
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
        font-size: 0.9rem;
    }
    .nav-button:hover:not(:disabled) {
        background-color: var(--background-input);
        color: var(--text-primary);
    }

    /* --- Icon Button Base Style --- */
    .icon-button {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-secondary);
        padding: 0.25rem;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .icon-button:hover {
        color: var(--text-primary);
        background-color: var(--background-input);
    }

    /* --- Mobile Menu Styles --- */
    .hamburger-btn {
        display: none; /* Hidden by default */
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-primary);
    }
    /* ... (rest of mobile menu styles) ... */

    /* --- Tablet-only button --- */
    .tablet-theme-btn {
        display: none; /* Hidden by default */
    }

    /* --- RESPONSIVE MEDIA QUERIES --- */

    /* --- Mobile (Default to 767px) --- */
    @media (max-width: 767px) {
        .navbar {
            padding: 0 1rem;
        }
        .desktop-nav {
            display: none;
        }
        .hamburger-btn {
            display: block;
        }
        .tablet-theme-btn {
            display: none; /* Hide themes button */
        }
        .nav-left {
            gap: 0.75rem;
        }
        .builder-actions {
            gap: 0.75rem;
        }
        /* Hide text for all action buttons on mobile */
        .nav-action-btn span {
            display: none;
        }
        .nav-action-btn {
            padding: 0.5rem;
        }
        .separator {
            margin: 0 0.25rem;
        }
    }

    /* --- Tablet (768px - 1199px) --- */
    @media (min-width: 768px) and (max-width: 1199px) {
        .tablet-theme-btn {
            display: inline-flex; /* Show on tablet */
        }
        .hamburger-btn {
            display: none;
        }
        .desktop-nav {
            display: flex;
        }

        /* Hide text on all action buttons for tablet */
        .nav-action-btn span {
            display: none;
        }
        .nav-action-btn {
            padding: 0.5rem; /* Make icon buttons smaller */
        }
        .builder-actions {
            gap: 0.75rem; /* Reduce gap for icon buttons */
        }
    }

    /* --- Desktop (1200px+) --- */
    @media (min-width: 1200px) {
        .tablet-theme-btn {
            display: none; /* Hide on desktop */
        }
        /* This ensures all action button text is visible on desktop */
        .nav-action-btn span {
            display: inline;
        }
        /* Resets padding for desktop */
        .nav-action-btn {
            padding: 0.5rem 1rem;
        }
        .builder-actions {
            gap: 1.5rem; /* Reset gap for desktop */
        }
    }
</style>