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
		<button on:click={handleCreateNew}>+ Create New Resume</button>
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
							<a href="/resume/{resume.id}" class="dropdown-item">Open</a>
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
	.dashboard-container {
		max-width: 1000px;
		margin: 2rem auto;
		padding: 2rem;
		background-color: #ffffff;
		color: #111827;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
	}

	.resume-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.resume-card {
		position: relative;
		display: flex;
		flex-direction: column;
		border: 1px solid #ddd;
		border-radius: 8px;
		transition: all 0.2s;
	}
	.resume-card:hover {
		border-color: #007bff;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}
	.card-content {
		padding: 1.5rem;
		text-decoration: none;
		color: inherit;
		flex-grow: 1;
	}
	.card-content h2 {
		margin-top: 0;
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
		color: #555;
	}
	.menu-trigger:hover {
		background-color: #f0f0f0;
	}

	.dropdown-menu {
		position: absolute;
		top: 2.5rem;
		right: 0.5rem;
		background-color: white;
		border: 1px solid #ddd;
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
		font-size: 1rem;
		color: #333;
		text-decoration: none;
	}
	.dropdown-item:hover {
		background-color: #f5f5f5;
	}
	.dropdown-item.delete {
		color: #dc3545;
	}
</style>