<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import RenameModal from '$lib/components/ui/RenameModal.svelte';

	// 1. Get the data passed down from the root layout
	export let data;
	const { session, supabase } = data;

	type Resume = {
		id: string;
		name: string;
		updated_at: string;
	};

	let resumes: Resume[] = [];
	let isLoading = true;
	let isModalOpen = false;
	let openMenuId: string | null = null;

	// 2. Redirect immediately if the session from the server is missing
	if (!session) {
		goto('/');
	}

	// 3. The onMount function now just fetches resumes for the known user
	onMount(async () => {
		if (session) {
			await loadResumes(session.user.id);
		}
		isLoading = false;
	});

	async function loadResumes(userId: string) {
		const { data, error } = await supabase
			.from('resumes')
			.select('id, name, updated_at')
			.eq('user_id', userId)
			.order('updated_at', { ascending: false });

		if (error) {
			console.error('Error loading resumes:', error);
		} else if (data) {
			resumes = data;
		}
	}

	function handleCreateNew() {
		isModalOpen = true;
	}

	async function handleCreateAndProceed(event: CustomEvent<string>) {
		const newName = event.detail;
		if (!newName) return;

		const { data, error } = await supabase
			.from('resumes')
			.insert({ name: newName, data: {} })
			.select()
			.single();

		if (error) {
			alert('Could not create new resume.');
		} else if (data) {
			isModalOpen = false;
			goto(`/resume/${data.id}`);
		}
	}

	function toggleMenu(resumeId: string) {
		openMenuId = openMenuId === resumeId ? null : resumeId;
	}

	async function deleteResume(resumeId: string, resumeName: string) {
		if (confirm(`Are you sure you want to delete "${resumeName}"? This cannot be undone.`)) {
			const { error } = await supabase.from('resumes').delete().eq('id', resumeId);

			if (error) {
				alert('Failed to delete resume.');
			} else {
				resumes = resumes.filter((r) => r.id !== resumeId);
				openMenuId = null;
			}
		}
	}
</script>

<RenameModal
	open={isModalOpen}
	on:save={handleCreateAndProceed}
	on:close={() => (isModalOpen = false)}
/>

<div class="dashboard-container">
	<header>
		<h1>Your Resumes</h1>
		<button class="create-new-btn" on:click={handleCreateNew}>+ Create New Resume</button>
	</header>

	{#if isLoading}
		<p>Loading...</p>
	{:else if resumes.length > 0}
		<div class="resume-grid">
			{#each resumes as resume}
				<div class="resume-card">
					<a href="/resume/{resume.id}" class="card-content">
						<h2>{resume.name}</h2>
						<p>Last updated: {new Date(resume.updated_at).toLocaleDateString()}</p>
					</a>
					<button class="menu-trigger" on:click={() => toggleMenu(resume.id)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle
								cx="5"
								cy="12"
								r="1"
							/></svg
						>
					</button>
					{#if openMenuId === resume.id}
						<div class="dropdown-menu">
							
							<button on:click={() => deleteResume(resume.id, resume.name)} class="dropdown-item delete">
								Delete
							</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<p>You haven't created any resumes yet. Click the button to get started!</p>
	{/if}
</div>

<style>
	/* REMOVED the :root block, variables from +layout.svelte will be used */

	* {
		font-family: var(--font-family); /* Ensure you have --font-family in layout */
		box-sizing: border-box;
	}

	.dashboard-container {
		max-width: 1000px;
		margin: 2rem auto;
		padding: 1rem;
		background-color: var(--background-sidebar); /* Using layout var */
		color: var(--text-primary); /* Using layout var */
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		gap: 1rem;
	}

	header h1 {
		color: var(--text-headings); /* Using layout var */
		font-size: 1.75rem;
		margin: 0;
		flex-grow: 1;
	}

	.create-new-btn {
		padding: 0.6rem 1rem;
		font-size: 0.9rem;
		background-color: var(--accent-primary); /* Using layout var */
		color: var(--text-inverted); /* Using layout var */
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 500;
		white-space: nowrap;
		transition: background-color 0.2s, filter 0.2s; /* Added filter transition */
	}
	.create-new-btn:hover {
		filter: brightness(90%);
	}

	.resume-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.resume-card {
		position: relative;
		display: flex;
		flex-direction: column;
		border: 1px solid var(--border-color); /* Using layout var */
		border-radius: 8px;
		transition: all 0.2s;
		background-color: var(--background-sidebar);
	}
	.resume-card:hover {
		border-color: var(--accent-primary); /* Using layout var */
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	.card-content {
		padding: 1rem;
		text-decoration: none;
		color: inherit;
		flex-grow: 1;
	}
	.card-content h2 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		font-size: 1.1rem;
		color: var(--text-headings); /* Using layout var */
	}
	.card-content p {
		font-size: 0.85rem;
		color: var(--text-secondary); /* Using layout var */
		margin: 0;
	}

	.menu-trigger {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: none;
		border: none;
		padding: 0.5rem;
		cursor: pointer;
		border-radius: 50%;
		color: var(--text-secondary); /* Using layout var */
		line-height: 0;
	}
	.menu-trigger svg {
		width: 20px;
		height: 20px;
	}
	.menu-trigger:hover {
		background-color: var(--background-main); /* Using layout var */
		color: var(--text-primary); /* Using layout var */
	}

	.dropdown-menu {
		position: absolute;
		top: 2.5rem;
		right: 0.5rem;
		background-color: var(--background-sidebar); /* Using layout var */
		border: 1px solid var(--border-color); /* Using layout var */
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		z-index: 10;
		min-width: 120px;
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
		color: var(--text-primary); /* Using layout var */
		text-decoration: none;
	}
	.dropdown-item:hover {
		background-color: var(--background-main); /* Using layout var */
	}
	.dropdown-item.delete {
		color: var(--accent-destructive); /* Using layout var */
	}
	.dropdown-item.delete:hover {
		background-color: #fee2e2; /* Light red background on hover */
	}

	/* Loading/Empty state */
	.loading-message,
	.empty-message {
		color: var(--text-secondary); /* Using layout var */
		text-align: center;
		padding: 2rem 0;
	}


	/* --- Tablet & Desktop Overrides --- */
	@media (min-width: 640px) { /* sm breakpoint */
		.dashboard-container {
			padding: 2rem;
		}
		header h1 {
			font-size: 2rem;
		}
		.create-new-btn {
			padding: 0.75rem 1.5rem;
			font-size: 1rem;
		}
		.resume-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.5rem;
		}
		.card-content {
			padding: 1.5rem;
		}
		.card-content h2 {
			font-size: 1.25rem;
		}
	}

	@media (min-width: 1024px) { /* lg breakpoint */
		.resume-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

</style>