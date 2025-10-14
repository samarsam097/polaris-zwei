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
		<div class="left-sidebar-footer">
			<!-- 3. Pass the resumeId AND supabase client down to the footer -->
			<ExportControls {resumeId} {supabase} />
		</div>
		<main class="resume-preview">
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
<style>
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: calc(100vh - 65px); /* Adjust 65px to your navbar height */
		font-size: 1.5rem;
		color: #555;
	}

	.builder-layout {
		display: grid;
		grid-template-areas:
			'forms preview right'
			'footer preview right';
		grid-template-columns: 400px 1fr 300px;
		grid-template-rows: 1fr auto;
		height: calc(100vh - 65px);
		overflow: hidden;
	}
	.left-sidebar-forms {
		grid-area: forms;
		overflow-y: auto;
		background-color: #111827;
		padding: 1.5rem;
	}
	.left-sidebar-footer {
		grid-area: footer;
		background-color: #111827;
		border-top: 1px solid #374151;
	}
	.resume-preview {
		grid-area: preview;
		overflow-y: auto;
		background-color: #e5e7eb;
		padding: 2rem;
	}
	.right-sidebar {
		grid-area: right;
		overflow-y: auto;
		background-color: #111827;
		padding: 1.5rem;
	}
</style>