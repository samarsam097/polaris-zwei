<script lang="ts">
	import { resumeData } from '$lib/resumeStore';
	import type { Project } from '$lib/resumeStore';

	let keywords = '';
	let loadingProjectId: string | null = null;

	function addProject() {
		const newProject: Project = {
			id: crypto.randomUUID(),
			name: '',
			link: '',
			summary: ''
		};
		$resumeData.projects = [...$resumeData.projects, newProject];
	}

	function deleteProject(idToDelete: string) {
		$resumeData.projects = $resumeData.projects.filter((p) => p.id !== idToDelete);
	}

	async function generateProjectSummary(projectId: string, projectKeywords: string) {
		if (!projectKeywords) return;
		loadingProjectId = projectId;
		try {
			const response = await fetch('/api/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ keywords: projectKeywords, context: 'projectSummary' })
			});
			if (!response.ok) throw new Error('Request failed');
			const data = await response.json();

			// --- THIS IS THE CORRECTED PART ---
			// We create a new array to ensure Svelte's reactivity is triggered.
			resumeData.update((currentData) => {
				const updatedProjects = currentData.projects.map((project) => {
					if (project.id === projectId) {
						// Return a new object for the updated project
						return { ...project, summary: data.text };
					}
					// Return the original object for all other projects
					return project;
				});

				// Assign the new array to the store
				currentData.projects = updatedProjects;
				return currentData;
			});
			// --- END OF CORRECTION ---

		} catch (e) {
			console.error(e);
			alert('Failed to generate summary.');
		} finally {
			loadingProjectId = null;
		}
	}
</script>

<div class="form-section">
	<h3>Projects</h3>
	{#each $resumeData.projects as project (project.id)}
		<div class="list-entry">
			<input type="text" placeholder="Project Name" bind:value={project.name} />
			<input type="text" placeholder="Project Link (optional)" bind:value={project.link} />
			<textarea
				placeholder="Project description and achievements..."
				bind:value={project.summary}
				rows="4"
			></textarea>

			<div class="ai-controls">
				<input
					type="text"
					placeholder="Keywords for AI..."
					on:input={(e) => (keywords = e.currentTarget.value)}
				/>
				<button
					on:click={() => generateProjectSummary(project.id, keywords)}
					disabled={loadingProjectId === project.id}
				>
					{#if loadingProjectId === project.id}Generating...{:else}✨ Generate{/if}
				</button>
			</div>
			<button class="delete-btn" on:click={() => deleteProject(project.id)}>Delete</button>
		</div>
	{/each}
	<button on:click={addProject} class="add-btn">+ Add Project</button>
</div>

<style>
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
	.form-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.list-entry {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
	}
	textarea {
  width: 100%;
  box-sizing: border-box; /* includes padding + border in width */
  resize: none; /* prevents manual resizing */
}
	.ai-controls {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
	.ai-controls input {
		flex-grow: 1;
	}
	.delete-btn, .add-btn {
		/* Add your button styles here */
	}
	h3{
			color: darkgrey;
	}
</style>