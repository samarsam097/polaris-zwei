<script lang="ts">
	// --- IMPORTS ---
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { resumeData, initialData } from '$lib/resumeStore';
	import { uiStore, toggleThemeSidebar } from '$lib/uiStore'; // <-- UPDATED

	// --- 1. GET DATA FROM THE SERVER ---
	export let data;
	const { session, supabase } = data;

	// --- RESPONSIVE STATE ---
	let mobileView: 'forms' | 'preview' | 'right' = 'forms';

	// --- COMPONENT IMPORTS ---
	import BasicInfoForm from '$lib/components/sections/BasicInfoForm.svelte';
	import SummaryForm from '$lib/components/sections/SummaryForm.svelte';
	import WorkExperienceForm from '$lib/components/sections/WorkExperienceForm.svelte';
	import SkillsForm from '$lib/components/sections/SkillsForm.svelte';
	import EducationForm from '$lib/components/sections/EducationForm.svelte';
	import ProjectsForm from '$lib/components/sections/ProjectsForm.svelte';
	import CertificationsForm from '$lib/components/sections/CertificationsForm.svelte';
	import LanguagesForm from '$lib/components/sections/LanguagesForm.svelte';
	import CustomFieldsForm from '$lib/components/sections/CustomFieldsForm.svelte';
	import RightSidebar from '$lib/components/layout/RightSidebar.svelte';
	import ResumePreview from '$lib/components/preview/ResumePreview.svelte';
	import MobileNav from '$lib/components/layout/MobileNav.svelte';

	let isLoading = true;
	let resumeId = '';

	if (!session) {
		goto('/');
	}

	onMount(async () => {
		try {
			resumeId = get(page).params.id;
			const { data, error } = await supabase
				.from('resumes')
				.select('data')
				.eq('id', resumeId)
				.single();

			if (error) throw error;

			const loadedResumeData = data?.data || {};
			const completeResumeData = { ...initialData, ...loadedResumeData };

			resumeData.set(completeResumeData);
		} catch (error)
		{
			console.error('Error loading resume:', error);
			alert('Could not load this resume. Returning to dashboard.');
			goto('/dashboard');
		} finally {
			isLoading = false;
		}
	});

	function handleViewChange(event: CustomEvent) {
		mobileView = event.detail;
	}

	// NEW: Closes sidebar if user clicks overlay
	function handleOverlayClick() {
		if ($uiStore.isThemeSidebarOpen) {
			toggleThemeSidebar();
		}
	}
</script>

{#if !isLoading}
	<div
		class="sidebar-overlay"
		class:active={$uiStore.isThemeSidebarOpen}
		on:click={handleOverlayClick}
		role="button"
		tabindex="-1"
		aria-label="Close theme sidebar"
	/>

	<div class="builder-container">
		<div class="builder-layout">
			<aside class="left-sidebar-forms" class:visible={mobileView === 'forms'}>
				<BasicInfoForm />
				<SummaryForm />
				<WorkExperienceForm />
				<SkillsForm />
				<EducationForm />
				<ProjectsForm />
				<CertificationsForm />
				<LanguagesForm />
				<CustomFieldsForm />
			</aside>

			<main class="resume-preview" class:visible={mobileView === 'preview'}>
				<ResumePreview />
			</main>

			<aside
				class="right-sidebar"
				class:visible={mobileView === 'right'}
				class:tablet-visible={$uiStore.isThemeSidebarOpen}
			>
				<RightSidebar />
			</aside>
		</div>

		<div class="mobile-nav-wrapper">
			<MobileNav activeView={mobileView} on:viewchange={handleViewChange} />
		</div>
	</div>
{:else}
	<div class="loading-container"><p>Loading Resume...</p></div>
{/if}

<style>
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: calc(100vh - 65px);
		font-size: 1.5rem;
		color: var(--text-secondary);
	}

	.builder-container {
		height: calc(100vh - 65px);
		display: flex;
		flex-direction: column;
	}

	/* --- MOBILE FIRST (DEFAULT) --- */
	.builder-layout {
		flex-grow: 1;
		overflow-y: auto;
		padding-bottom: 60px;
	}

	.left-sidebar-forms,
	.resume-preview,
	.right-sidebar {
		display: none; /* All hidden by default on mobile */
	}

	.visible {
		display: block; /* .visible (from MobileNav) shows one at a time */
	}

	.left-sidebar-forms.visible {
		background-color: var(--background-sidebar);
		padding: 1.5rem;
	}
	.resume-preview.visible {
		background-color: var(--background-main);
		padding: 1rem;
	}
	.right-sidebar.visible {
		background-color: var(--background-sidebar);
		padding: 1.5rem;
	}

	/* This is the wrapper for the MobileNav component */
	.mobile-nav-wrapper {
		display: block; /* Show it on mobile by default */
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 40;
	}

	/* --- NEW: Sidebar Overlay (for tablet) --- */
	.sidebar-overlay {
		display: none;
		position: fixed;
		top: 65px; /* Below navbar */
		left: 0;
		width: 100%;
		height: calc(100% - 65px);
		background: rgba(0, 0, 0, 0.4);
		z-index: 70;
	}
	.sidebar-overlay.active {
		display: block;
	}

	/* --- TABLET LAYOUT (768px and wider) --- */
	@media (min-width: 768px) {
		.mobile-nav-wrapper {
			display: none; /* Hide the bottom tab bar */
		}

		.builder-layout {
			display: grid;
			grid-template-columns: 400px 1fr;
			height: 100%;
			overflow: hidden;
			padding-bottom: 0;
		}

		/* Show the first two columns */
		.left-sidebar-forms,
		.resume-preview {
			display: block;
			overflow-y: auto;
			height: 100%;
		}

		/* --- NEW TABLET STYLES for Right Sidebar --- */
		.right-sidebar {
			display: block; /* Make it a block so we can animate it */
			position: fixed;
			top: 65px; /* Below navbar */
			right: 0;
			width: 350px;
			height: calc(100vh - 65px);
			background-color: var(--background-sidebar);
			border-left: 1px solid var(--border-color);
			padding: 1.5rem;
			overflow-y: auto;
			z-index: 80;
			box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
			transform: translateX(100%); /* Hidden by default */
			transition: transform 0.3s ease-in-out;
		}
		/* This class (from uiStore) slides it into view */
		.right-sidebar.tablet-visible {
			transform: translateX(0);
		}
		/* --- END NEW TABLET STYLES --- */

		/* Re-apply desktop styles */
		.left-sidebar-forms {
			background-color: var(--background-sidebar);
			padding: 1.5rem;
			border-right: 1px solid var(--border-color);
		}
		.resume-preview {
			background-color: var(--background-main);
			padding: 2rem;
			position: relative;
		}
	}

	/* --- DESKTOP LAYOUT (1200px and wider) --- */
	@media (min-width: 1200px) {
		.sidebar-overlay {
			display: none; /* Hide overlay on desktop */
		}

		.builder-layout {
			grid-template-columns: 400px 1fr 350px; /* Three columns */
		}

		/* --- REVERT sidebar to static position on desktop --- */
		.right-sidebar {
			position: static;
			width: auto;
			height: 100%;
			box-shadow: none;
			transform: none; /* Unset the transform */
			z-index: 1;
			display: block; /* Make sure it's visible */
		}
	}

	/* Your global form styles remain unchanged */
	:global(.form-section) {
		margin-bottom: 2rem;
	}
	:global(.form-section h3) {
		color: var(--text-headings);
		font-size: 1.25rem;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border-color);
	}
	:global(.left-sidebar-forms label) {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
		margin-bottom: 0.25rem;
		display: block;
	}
	:global(.left-sidebar-forms input),
	:global(.left-sidebar-forms textarea) {
		width: 100%;
		box-sizing: border-box; /* Add this for better padding control */
		background-color: var(--background-input);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		padding: 0.75rem;
		font-size: 1rem;
		transition: border-color 0.2s;
	}
	:global(.left-sidebar-forms input:focus),
	:global(.left-sidebar-forms textarea:focus) {
		outline: none;
		border-color: var(--border-focus);
	}
	:global(.ats-warning) {
		font-size: 0.8rem;
		color: #92400e;
		background-color: #fef3c7;
		padding: 0.5rem;
		border-radius: 4px;
	}
	:global(.add-btn) {
		width: 100%;
		padding: 0.75rem;
		background-color: var(--accent-primary);
		color: var(--text-inverted);
		border: none;
		border-radius: 6px;
		font-weight: bold;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	:global(.add-btn:hover) {
		filter: brightness(90%);
	}
	:global(.delete-btn),
	:global(.delete-photo-btn) {
		background-color: transparent;
		color: var(--accent-destructive);
		border: 1px solid var(--accent-destructive);
		border-radius: 6px;
		padding: 0.5rem 1rem;
		cursor: pointer;
		transition: background-color 0.2s, color 0.2s;
	}
	:global(.delete-btn:hover),
	:global(.delete-photo-btn:hover) {
		background-color: var(--accent-destructive);
		color: var(--text-inverted);
	}
</style>