<script lang="ts">
	import { resumeData } from '$lib/resumeStore';

	let newSkill = ''; // This variable will hold the text in the input box

	function addSkill() {
		// We don't add the skill if the input is empty or just whitespace
		if (!newSkill.trim()) return;

		// Update the store by adding the new skill to the existing array
		$resumeData.skills = [...$resumeData.skills, newSkill.trim()];

		// Clear the input box for the next skill
		newSkill = '';
	}

	function deleteSkill(skillToDelete: string) {
		// We use .filter() to create a new array without the skill we want to remove
		$resumeData.skills = $resumeData.skills.filter(skill => skill !== skillToDelete);
	}

	// This allows the user to press 'Enter' to add a skill
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault(); // Prevents the form from submitting
			addSkill();
		}
	}
</script>

<div class="form-section">
	<h3>Skills</h3>
	<div class="skill-input-group">
		<input
			type="text"
			placeholder="e.g., JavaScript"
			bind:value={newSkill}
			on:keydown={handleKeydown}
		/>
		<button on:click={addSkill}>Add</button>
	</div>

	<div class="skill-tags">
		{#each $resumeData.skills as skill (skill)}
			<div class="skill-tag">
				{skill}
				<button class="delete-tag" on:click={() => deleteSkill(skill)}>×</button>
			</div>
		{/each}
	</div>
</div>

<style>
	.skill-input-group {
		display: flex;
		gap: 0.5rem;
	}
	input {
		flex-grow: 1; /* Allows the input to take up available space */
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	button {
		padding: 0 1rem;
		border: none;
		background-color: #007bff;
		color: white;
		border-radius: 4px;
		cursor: pointer;
	}
	.skill-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1rem;
	}
	.skill-tag {
		background-color: #e9ecef;
		padding: 0.3rem 0.6rem;
		border-radius: 12px;
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.delete-tag {
		background: #6c757d;
		color: white;
		border: none;
		border-radius: 50%;
		width: 18px;
		height: 18px;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 1;
		padding: 0;
	}
	h3{
			color:darkgrey;
	}
</style>