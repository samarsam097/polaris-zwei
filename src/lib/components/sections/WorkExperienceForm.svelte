<script lang="ts">
	import { resumeData } from '$lib/resumeStore';
	import type { WorkExperience } from '$lib/resumeStore';

	// We can use a single variable for keywords because it's temporary.
	// We'll pass it to the function when the button is clicked.
	let keywords = '';

	// We'll track the ID of the job currently being generated to show a loading state
	let loadingExperienceId: string | null = null;

	function addExperience() {
		const newExperience: WorkExperience = {
			id: crypto.randomUUID(),
			company: '',
			role: '',
			startDate: '',
			endDate: '',
			summary: ''
		};
		$resumeData.workExperience = [...$resumeData.workExperience, newExperience];
	}

	function deleteExperience(idToDelete: string) {
		$resumeData.workExperience = $resumeData.workExperience.filter((exp) => exp.id !== idToDelete);
	}

	// This is our new function for the work experience summary
	async function generateWorkSummary(experienceId: string, experienceKeywords: string) {
		if (!experienceKeywords) {
			alert('Please enter keywords for this job.');
			return;
		}
		loadingExperienceId = experienceId; // Set loading state for this specific job

		try {
			const response = await fetch('/api/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				// Send the keywords AND the correct context
				body: JSON.stringify({ keywords: experienceKeywords, context: 'workExperience' })
			});

			if (!response.ok) throw new Error('Request failed');

			const data = await response.json();

			// Update the specific job summary in the store
			resumeData.update((currentData) => {
				const expIndex = currentData.workExperience.findIndex((exp) => exp.id === experienceId);
				if (expIndex !== -1) {
					currentData.workExperience[expIndex].summary = data.text;
				}
				return currentData;
			});
		} catch (error) {
			console.error(error);
			alert('An error occurred while generating the summary.');
		} finally {
			loadingExperienceId = null; // Clear loading state
		}
	}
</script>

<div class="form-section">
	<h3>Work Experience</h3>

	{#each $resumeData.workExperience as experience, i (experience.id)}
		<div class="experience-entry">
			<input type="text" placeholder="Company" bind:value={experience.company} />
			<input type="text" placeholder="Role / Title" bind:value={experience.role} />
			<textarea
				placeholder="Job summary and achievements..."
				bind:value={experience.summary}
				rows="5"
			></textarea>

			<div class="ai-controls">
				<input
					type="text"
					placeholder="Keywords: e.g., managed team, increased sales by 20%"
					on:input={(e) => (keywords = e.currentTarget.value)}
				/>
				<button
					on:click={() => generateWorkSummary(experience.id, keywords)}
					disabled={loadingExperienceId === experience.id}
				>
					{#if loadingExperienceId === experience.id}
						Generating...
					{:else}
						✨ Generate with AI
					{/if}
				</button>
			</div>

			<button class="delete-btn" on:click={() => deleteExperience(experience.id)}> Delete </button>
		</div>
	{/each}

	<button on:click={addExperience} class="add-btn"> + Add Work Experience </button>
</div>

<style>
		.experience-entry {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
					margin-bottom: 5px;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
	}
		.add-btn, .delete-btn {
		padding: 0 1rem;
		border: none;
				height:20px;
				width: 100%;
		background-color: dimgrey;
		color: white;
		border-radius: 4px;
		cursor: pointer;
	}
	/* ... existing styles ... */
	.ai-controls {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
	.ai-controls input {
		flex-grow: 1;
	}
	.ai-controls button {
		background-color: #673ab7;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		padding: 0 1rem;
	}
	button:disabled {
		background-color: #9e9e9e;
		cursor: not-allowed;
	}
	h3{
			color:darkgrey;
	}
</style>