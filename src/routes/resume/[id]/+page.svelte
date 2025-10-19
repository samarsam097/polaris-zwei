<script lang="ts">
	// --- IMPORTS ---
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { resumeData, initialData } from '$lib/resumeStore';

	// --- 1. GET DATA FROM THE SERVER ---
	export let data;
	const { session, supabase } = data;

	// --- RESPONSIVE STATE ---
	let mobileView: 'forms' | 'preview' | 'right' = 'forms'; // Default to content view on mobile

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
	import MobileNav from '$lib/components/layout/MobileNav.svelte'; // Import the new mobile nav

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
		} catch (error) {
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
</script>

{#if !isLoading}
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

			<aside class="right-sidebar" class:visible={mobileView === 'right'}>
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
    .mobile-nav-wrapper {
        display: block; /* Show it on mobile by default */
        position: fixed; /* Stick it to the bottom */
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 40; 
    }
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: calc(100vh - 65px);
		font-size: 1.5rem;
		color: var(--text-secondary);
	}

	.builder-container {
		/* This container holds the layout and the mobile nav */
		height: calc(100vh - 65px);
		display: flex;
		flex-direction: column;
	}

	/* --- MOBILE FIRST (DEFAULT) --- */
	.builder-layout {
		flex-grow: 1; /* Make the layout fill the space above the nav */
		overflow-y: auto; /* Allow the active column to scroll */
		padding-bottom: 60px; /* Add space so content isn't hidden by the mobile nav */
	}

	/* By default, all columns are hidden on mobile */
	.left-sidebar-forms,
	.resume-preview,
	.right-sidebar {
		display: none;
	}

	/* The .visible class (toggled by the tab bar) makes a column appear */
	.visible {
		display: block;
	}

	/* Add back the styling for the columns when they are visible on mobile */
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

	/* --- TABLET LAYOUT (768px and wider) --- */
	@media (min-width: 768px) {
		.mobile-nav-wrapper {
            display: none; /* <-- THIS IS THE FIX */
        }
		.builder-layout {
			display: grid;
			grid-template-columns: 400px 1fr; /* Two columns */
			height: 100%;
			overflow: hidden;
			padding-bottom: 0; /* Remove mobile-nav padding */
		}

		/* Show the first two columns, hide the third */
		.left-sidebar-forms,
		.resume-preview {
			display: block;
			overflow-y: auto;
			height: 100%;
		}
		.right-sidebar {
			display: none;
		}

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
		.builder-layout {
			grid-template-columns: 400px 1fr 350px; /* Three columns */
		}
		.right-sidebar {
			display: block; /* Show the right sidebar */
			overflow-y: auto;
			border-left: 1px solid var(--border-color);
			background-color: var(--background-sidebar);
			padding: 1.5rem;
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