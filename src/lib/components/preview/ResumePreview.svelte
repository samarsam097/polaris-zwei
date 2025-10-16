<script lang="ts">
	import { resumeData } from '$lib/resumeStore';
	import { uiStore } from '$lib/uiStore';

	// --- LOGIC FOR VISUAL PAGE BREAKS ---
	let contentContainer: HTMLElement; // Reference to the content div
	let contentHeight = 0;
	const pageHeight = 920; // The min-height of your A4 page in pixels

	// Calculate how many page break lines are needed
	$: numPageBreaks = Math.floor(contentHeight / pageHeight);
</script>

<div
	id="resume-preview-paper"
	class="resume-paper"
	class:theme-classic={$uiStore.selectedTheme === 'classic'}
	class:theme-modern={$uiStore.selectedTheme === 'modern'}
	class:theme-elegant={$uiStore.selectedTheme === 'elegant'}
>
	<!-- This new wrapper is crucial for accurately measuring the content's height -->
	<div class="content-wrapper" bind:this={contentContainer} bind:clientHeight={contentHeight}>
		{#if $resumeData.basicInfo}
			<header class="resume-header">
				{#if $resumeData.basicInfo.photo}
					<div class="photo-container">
						<img
							src={$resumeData.basicInfo.photo}
							alt="Profile"
							class="profile-photo"
							class:circle={$resumeData.basicInfo.photoShape === 'circle'}
							class:square={$resumeData.basicInfo.photoShape === 'square'}
						/>
					</div>
				{/if}

				<div class="header-text">
					<h1>{$resumeData.basicInfo.name}</h1>
					<div class="contact-info">
						{#if $resumeData.basicInfo.email}
							<span>{$resumeData.basicInfo.email}</span>
						{/if}
						{#if $resumeData.basicInfo.phone}
							<span>• {$resumeData.basicInfo.phone}</span>
						{/if}
						{#if $resumeData.basicInfo.address}
							<span>• {$resumeData.basicInfo.address}</span>
						{/if}
						{#if $resumeData.basicInfo.website}
							<span>• {$resumeData.basicInfo.website}</span>
						{/if}
						<!-- Moved custom fields into the header where they belong -->
						{#if $resumeData.customFields}
							{#each $resumeData.customFields as field}
								{#if field.label && field.value}
									<span>• {field.label}: {field.value}</span>
								{/if}
							{/each}
						{/if}
					</div>
				</div>
			</header>
		{/if}

		{#if $resumeData.summary}
			<section class="resume-section">
				<h2>Summary</h2>
				<p>{$resumeData.summary}</p>
			</section>
		{/if}

		{#if $resumeData.workExperience?.length > 0}
			<section class="resume-section">
				<h2>Work Experience</h2>
				{#each $resumeData.workExperience as experience}
					<div class="entry">
						<h4>{experience.role}</h4>
						<p><strong>{experience.company}</strong></p>
						<ul class="summary-list">
							{#if experience.summary}
								{#each experience.summary.split('•').slice(1) as data}
									<li>{data.trim()}</li>
								{/each}
							{/if}
						</ul>
					</div>
				{/each}
			</section>
		{/if}

		{#if $resumeData.skills?.length > 0}
			<section class="resume-section">
				<h2>Skills</h2>
				<div class="skill-pills">
					{#each $resumeData.skills as skill}
						<span class="skill-pill">{skill}</span>
					{/each}
				</div>
			</section>
		{/if}

		{#if $resumeData.education?.length > 0}
			<section class="resume-section">
				<h2>Education</h2>
				{#each $resumeData.education as entry}
					<div class="entry">
						<h4>{entry.degree}</h4>
						<p><strong>{entry.institution}</strong>, {entry.location}</p>
						<p class="dates">{entry.startDate} - {entry.endDate}</p>
					</div>
				{/each}
			</section>
		{/if}

		{#if $resumeData.projects?.length > 0}
			<section class="resume-section">
				<h2>Projects</h2>
				{#each $resumeData.projects as project}
					<div class="entry">
						<h4>{project.name}</h4>
						{#if project.link}
							<p class="project-link">{project.link}</p>
						{/if}

						{#if project.summary && project.summary.includes('•')}
							<ul class="summary-list">
								{#each project.summary.split('•') as point}
									{#if point.trim() !== ''}
										<li>{point.trim()}</li>
									{/if}
								{/each}
							</ul>
						{:else}
							<p>{project.summary}</p>
						{/if}
					</div>
				{/each}
			</section>
		{/if}

		{#if $resumeData.certifications?.length > 0}
			<section class="resume-section">
				<h2>Certifications</h2>
				{#each $resumeData.certifications as cert}
					<div class="entry">
						<p><strong>{cert.name}</strong> - {cert.issuer}, {cert.date}</p>
					</div>
				{/each}
			</section>
		{/if}

		{#if $resumeData.languages?.length > 0}
			<section class="resume-section">
				<h2>Languages</h2>
				<div class="skill-pills">
					{#each $resumeData.languages as language}
						<span class="skill-pill">{language}</span>
					{/each}
				</div>
			</section>
		{/if}
	</div>

	<!-- This loop renders the visual page breaks, but they are ignored by the PDF generator -->
	{#if numPageBreaks > 0}
		{#each Array(numPageBreaks) as _, i}
			<div
				class="page-break"
				style="top: {(i + 1) * pageHeight}px;"
				data-html2canvas-ignore="true"
			/>
		{/each}
	{/if}
</div>

<style>
	.resume-paper {

		background: white;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		margin: 2rem auto;
		padding: 2rem;
		overflow-wrap: break-word;
		transition: all 0.3s ease;
		width: 650px;
		min-height: 920px;
		position: relative;
	}

	/* --- PAGE BREAK LINE (VISUAL ONLY) --- */
	.page-break {
		position: absolute;
		left: 0;
		right: 0;
		border-top: 2px dashed #cccccc;
		pointer-events: none; /* Makes the line unclickable */
	}

	/* --- ALL YOUR OTHER STYLES ARE PRESERVED --- */
	h1,
	h2,
	h4,
	p {
		margin: 4px 0;
	}

	.resume-section {
		margin-top: 1.5rem;
	}

	.entry {
		margin-top: 1rem;
	}

	.resume-header {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		text-align: left;
		margin-bottom: 1.5rem;
	}

	.header-text {
		flex-grow: 1;
	}

	.contact-info {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		gap: 0.5rem;
		font-size: 0.9rem;
	}

	.profile-photo {
		width: 100px;
		height: 100px;
		object-fit: cover;
	}

	.profile-photo.circle {
		border-radius: 50%;
	}

	.profile-photo.square {
		border-radius: 4px;
	}

	.theme-classic {
		font-family: Arial, sans-serif;
		color: #000000;
	}
	.theme-classic h1 {
		font-size: 24pt;
		font-weight: bold;
	}
	.theme-classic h2 {
		font-size: 14pt;
		font-weight: bold;
		border-bottom: 1px solid #000000;
		padding-bottom: 4px;
		margin-top: 1rem;
	}
	.theme-classic .skill-pill {
		background-color: transparent;
		border: 1px solid #333;
		padding: 0.2rem 0.6rem;
		font-size: 10pt;
	}

	.theme-modern {
		font-family: 'Inter', sans-serif;
	}
	.theme-modern h1 {
		font-size: 2.2rem;
		color: #0055a5;
		text-align: left;
	}
	.theme-modern h2 {
		color: #0055a5;
		border-bottom: none;
		border-left: 4px solid #0055a5;
		padding-left: 8px;
	}

	.theme-elegant {
		font-family: 'Georgia', serif;
	}
	.theme-elegant h1 {
		font-weight: normal;
		font-style: italic;
		text-align: left;
		color: #4a4a4a;
	}
	.theme-elegant h2 {
		font-variant: small-caps;
		letter-spacing: 1px;
		color: #555;
		border-bottom: 1px solid #ccc;
	}
	.skill-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
	.skill-pill {
		background-color: #f1f1f1;
		padding: 0.3rem 0.8rem;
		border-radius: 16px;
		font-size: 0.9rem;
	}
	.theme-modern .skill-pill {
		background-color: #e7f0f7;
		color: #0055a5;
		font-weight: 500;
	}
	.summary-list {
		padding-left: 1.2rem;
		margin-top: 0.5rem;
		margin-bottom: 0;
	}
	.dates {
		color: #555;
		font-size: 0.9rem;
	}
	.project-link {
		font-style: italic;
		color: #555;
	}
	.resume-section {
	margin-top: 1.5rem;
	/* page-break-inside: avoid; <--- DELETE THIS LINE */
}

/* ADD this rule to prevent headings from being left alone at the bottom of a page */


/* ADD this rule to prevent a single job or project from being split in half */
.entry {
	margin-top: 1rem;

}
</style>