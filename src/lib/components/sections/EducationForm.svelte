<script lang="ts">
	import { resumeData } from '$lib/resumeStore';
	import type { Education } from '$lib/resumeStore';

	function addEducation() {
		const newEducationEntry: Education = {
			id: crypto.randomUUID(),
			institution: '',
			degree: '',
			location: '',
			startDate: '',
			endDate: ''
		};
		$resumeData.education = [...$resumeData.education, newEducationEntry];
	}

	function deleteEducation(idToDelete: string) {
		$resumeData.education = $resumeData.education.filter((edu) => edu.id !== idToDelete);
	}
</script>

<div class="form-section">
	<h3>Education</h3>

	{#each $resumeData.education as entry (entry.id)}
		<div class="list-entry">
			<input type="text" placeholder="Institution / University" bind:value={entry.institution} />
			<input type="text" placeholder="Degree / Field of Study" bind:value={entry.degree} />
			<input type="text" placeholder="Location" bind:value={entry.location} />
			<div class="date-group">
				<input type="text" placeholder="Start Date" bind:value={entry.startDate}  class="start"/>
				<input type="text" placeholder="End Date" bind:value={entry.endDate} class="end"/>
			</div>
			<button class="delete-btn" on:click={() => deleteEducation(entry.id)}> Delete </button>

		</div>
	{/each}
<button on:click={addEducation} class="add-btn"> + Add Education </button>

</div>

<style>
		.start, .end{

				width:46.8%;
		}
		input{
				height:27px;
		}
		h3{color:darkgrey}
			.list-entry {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
					margin-bottom: 10px;
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
					height:27px;
	}
	/* Styles for .form-section, .list-entry, input, .add-btn, .delete-btn, etc. */
</style>