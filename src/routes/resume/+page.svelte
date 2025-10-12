<script lang="ts">
	// This script block is where we import the components that make up our page.
	// Think of it like gathering your building blocks before you start assembling.

	// We import the form for the user's basic details from its file path.
	import BasicInfoForm from '$lib/components/sections/BasicInfoForm.svelte';
	 import SummaryForm from '$lib/components/sections/SummaryForm.svelte';

	import WorkExperienceForm from '$lib/components/sections/WorkExperienceForm.svelte';
	import RightSidebar from '$lib/components/layout/RightSidebar.svelte';

	// We import the component that will display the live preview of the resume.
	import ResumePreview from '$lib/components/preview/ResumePreview.svelte';
	import ExportControls from '$lib/components/layout/ExportControls.svelte';
	import SkillsForm from '$lib/components/sections/SkillsForm.svelte';
import EducationForm from '$lib/components/sections/EducationForm.svelte';
import ProjectsForm from '$lib/components/sections/ProjectsForm.svelte';
import CertificationsForm from '$lib/components/sections/CertificationsForm.svelte';
	import LanguagesForm from '$lib/components/sections/LanguagesForm.svelte';
	import CustomFieldsForm from '$lib/components/sections/CustomFieldsForm.svelte';
</script>


<div class="builder-layout">
	<aside class="left-sidebar">
		<div class="form-container">
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
		<ExportControls />

		</aside>


	<main class="resume-preview">
		<ResumePreview />
	</main>

	<aside class="right-sidebar">
		<h2>Themes</h2>
		<RightSidebar />
		</aside>

</div>

<style>

	/* This CSS is scoped only to this component, so these styles won't leak out and affect other pages. */

	/* We use CSS Grid to create our flexible three-column layout. */
	.builder-layout {
		display: grid;

		/* This is the core of the layout. It defines three columns:
		   - The first is fixed at 400 pixels wide.
		   - The second ('1fr') takes up 1 fraction of the remaining flexible space.
		   - The third is fixed at 300 pixels wide. */
		grid-template-columns: 400px 1fr 300px;
			overflow: hidden;

		/* This makes our layout take up the full height of the browser window. */
		height: 100vh;

		/* This adds a small, consistent space between our columns. */
		gap: 0rem;

		/* A bit of padding around the entire layout. */
		padding: 0rem;

		/* A light, neutral background color for the page. */
		background-color: grey;
	}

	/* These are some simple, shared styles for all three columns to make them look like distinct panels. */
	.left-sidebar,
	.right-sidebar {
			overflow-y: auto;
		background-color: black;
		border-radius: 0px;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

	}
  .resume-preview{
    display: flex;
		background-color: white;
		border-radius: 0px;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    overflow-y: auto;
			background-color: #e0e2e5; /* Change this from white to a neutral gray */
	padding: 2rem; /* Add padding to give space around the paper */
	overflow-y: auto;
}

	/* If the resume content becomes longer than the screen,
	   this allows the middle preview panel to scroll independently. */
	.resume-preview {
		overflow-y: auto;
	}
	h2{
			color:darkgrey;
	}
	.left-sidebar{

			overflow-x:clip;
			display: flex;
			padding:0;
		flex-direction: column;
	}
	.form-container{

		overflow-y: auto;
			width:99%;
			overflow-x: hidden;
	}

</style>
