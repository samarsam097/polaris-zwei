<script lang="ts">
	import { resumeData } from '$lib/resumeStore';

	function addCustomField() {
		const newField = { id: crypto.randomUUID(), label: '', value: '' };
		$resumeData.customFields = [...$resumeData.customFields, newField];
	}

	function deleteCustomField(idToDelete: string) {
		$resumeData.customFields = $resumeData.customFields.filter((field) => field.id !== idToDelete);
	}
</script>

<div class="form-section">
	<h3>Custom Sections</h3>
	{#each $resumeData.customFields as field (field.id)}
		<div class="custom-field-entry">
			<label>Section Title</label>
			<input type="text" placeholder="e.g., 'Objective' or 'Publications'" bind:value={field.label} />

			<label>Content</label>
			<textarea placeholder="Write the content for this section..." bind:value={field.value} rows="5"></textarea>

			<button class="delete-btn" on:click={() => deleteCustomField(field.id)}>Delete Section</button>
		</div>
	{/each}
	<button on:click={addCustomField} class="add-btn">+ Add Custom Section</button>
</div>

<style>
	.form-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.custom-field-entry {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		border: 1px solid #374151; /* Dark border */
		border-radius: 8px;
	}

	/* Use the global styles for consistency */
	label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #9ca3af;
	}

	input,
	textarea {
	display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
					margin-bottom: 10px;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
	}
	textarea{
			resize: none;
	}

	/* Generic Add Button Style */
	.add-btn {
		width: 100%;
		padding: 0.75rem;
		background-color: #4b5563;
		color: #f9fafb;
		border: none;
		border-radius: 6px;
		font-weight: bold;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	.add-btn:hover {
		background-color: #6b7280;
	}

	/* Specific Delete Button Style */
	.delete-btn {
			width: 100%;
		background-color: transparent;
		color: #ef4444; /* Red color for delete action */
		border: 1px solid #ef4444;
		border-radius: 6px;
		padding: 0.5rem 1rem;
		cursor: pointer;
		align-self: flex-end; /* Pushes the button to the right */
		margin-top: 0.5rem;
		transition: background-color 0.2s, color 0.2s;
	}

	.delete-btn:hover {
		background-color: #ef4444;
		color: white;
	}
	h3{
			color:darkgrey;
	}

</style>