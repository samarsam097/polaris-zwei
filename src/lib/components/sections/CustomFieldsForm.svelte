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
	<h3>Custom Fields</h3>
	{#each $resumeData.customFields as field (field.id)}
		<div class="custom-field-entry">
			<input type="text" placeholder="Label (e.g., LinkedIn)" bind:value={field.label} />
			<input type="text" placeholder="Value (e.g., your URL)" bind:value={field.value} />
			<button class="delete-btn" on:click={() => deleteCustomField(field.id)}>Delete</button>
		</div>
	{/each}
	<button on:click={addCustomField} class="add-btn">+ Add Custom Field</button>
</div>

<style>
		.add-btn{
				margin-bottom: 20px;
		}
	.form-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.custom-field-entry {
		display: grid;
		grid-template-columns: 1fr 2fr auto; /* Nicely aligns the inputs and button */
		gap: 0.5rem;
		align-items: center;
	}
	input {
		width: 100%;
		padding: 8px;
		border-radius: 4px;
	}
	h3{
			color: darkgrey;
	}
	button {
		padding: 0 1rem;
		border: none;
				height:20px;
				width: 100%;
		background-color: dimgrey;
		color: white;
		border-radius: 4px;
		cursor: pointer;
	}

	/* You can reuse .add-btn and .delete-btn styles from other components */
</style>