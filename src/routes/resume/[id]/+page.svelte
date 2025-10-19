<script lang="ts">
	// --- IMPORTS ---
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { resumeData, initialData } from '$lib/resumeStore';

	// --- 1. GET DATA FROM THE SERVER ---
	// This receives the `session` and `supabase` client from your root layout
	export let data;
	const { session, supabase } = data;
	

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
	import ExportControls from '$lib/components/layout/ExportControls.svelte';

	let isLoading = true;
	let resumeId = '';

	// --- 2. REDIRECT IF NOT LOGGED IN ---
	// This check is now instant because the session data comes from the server
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

			// This merge guarantees the store always has a valid structure
			const loadedResumeData = data?.data || {};
			const completeResumeData = { ...initialData, ...loadedResumeData };

			resumeData.set(completeResumeData);
		} catch (error) {
			console.error('Error loading resume:', error);
			alert('Could not load this resume. Returning to dashboard.');
			goto('/dashboard');
		} finally {
			// This guarantees the loading screen is always hidden
			isLoading = false;
		}
	});
</script>

{#if !isLoading}
	<div class="builder-layout">
		<div class="left-sidebar-forms">
			<BasicInfoForm />
			<SummaryForm />
			<WorkExperienceForm />
			<SkillsForm />
			<EducationForm />
			<ProjectsForm />
			<CertificationsForm />
			<LanguagesForm />
			<CustomFieldsForm />
		</div>

		<main class="resume-preview">
			<ExportControls {resumeId} {supabase} />
			<ResumePreview />
		</main>
		<aside class="right-sidebar">

			<RightSidebar />
		</aside>
	</div>
{:else}
	<div class="loading-container"><p>Loading Resume...</p></div>
{/if}

<!-- All your styles are preserved exactly as you provided them -->
<!-- In src/routes/resume/[id]/+page.svelte -->

<!-- In src/routes/resume/[id]/+page.svelte -->

<style>
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: calc(100vh - 65px);
		font-size: 1.5rem;
		color: var(--text-secondary);
	}

	.builder-layout {
		display: grid;
		grid-template-areas:
			'forms preview right'
			'footer preview right';
		grid-template-columns: 400px 1fr 350px;
		grid-template-rows: 1fr auto;
		height: calc(100vh - 65px);
		overflow: hidden;
	}

	/* --- COLUMN STYLES USING CSS VARIABLES --- */
	.left-sidebar-forms,
	.right-sidebar {
		grid-area: forms;
		overflow-y: auto;
		background-color: var(--background-sidebar); /* White background */
		padding: 1.5rem;
		border-right: 1px solid var(--border-color); /* Subtle separator */
	}
	.right-sidebar {
		grid-area: right;
		border-right: none;
		border-left: 1px solid var(--border-color);
	}
	.left-sidebar-footer {
		grid-area: footer;
		background-color: var(--background-sidebar);
		border-top: 1px solid var(--border-color);
	}
	.resume-preview {
		grid-area: preview;
		overflow-y: auto;
		background-color: var(--background-main); /* Light gray "desk" */
		padding: 2rem;
		position: relative;
	}

	/* --- GLOBAL FORM STYLING FOR LIGHT THEME --- */
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
		color: #92400e; /* Dark amber text */
		background-color: #fef3c7; /* Light amber background */
		padding: 0.5rem;
		border-radius: 4px;
	}

	/* --- GLOBAL BUTTON STYLES FOR LIGHT THEME --- */
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