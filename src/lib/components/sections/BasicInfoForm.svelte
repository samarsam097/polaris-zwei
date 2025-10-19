<script lang="ts">
	import { resumeData } from '$lib/resumeStore';

	function handlePhotoUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				$resumeData.basicInfo.photo = reader.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function deletePhoto() {
		$resumeData.basicInfo.photo = '';
		const fileInput = document.getElementById('photo') as HTMLInputElement;
		if (fileInput) fileInput.value = '';
	}
</script>

<div class="form-section">
	<h3>Basic Info</h3>

	{#if $resumeData.basicInfo}
		<label for="photo">Profile Photo</label>
		<input type="file" id="photo" accept="image/png, image/jpeg" on:change={handlePhotoUpload} />

		{#if $resumeData.basicInfo.photo}
			<div class="photo-options">
				<div class="shape-selector">
					<label class="shape-label">Shape:</label>
					<label><input class = "radio"type="radio" value="circle" bind:group={$resumeData.basicInfo.photoShape} /> Circle</label>
					<label><input class = "radio" type="radio" value="square" bind:group={$resumeData.basicInfo.photoShape} /> Square</label>
				</div>
				<button class="delete-btn" on:click={deletePhoto}>Delete</button>
			</div>
		{/if}

		<p class="ats-warning">
			<strong>Warning:</strong> Photos are not recommended for ATS-friendly resumes.
		</p>

		<label for="name">Full Name</label>
		<input type="text" id="name" bind:value={$resumeData.basicInfo.name} />

		<label for="email">Email</label>
		<input type="email" id="email" bind:value={$resumeData.basicInfo.email} />

		<label for="phone">Phone Number</label>
		<input type="tel" id="phone" bind:value={$resumeData.basicInfo.phone} />

		<label for="address">Address / Location</label>
		<input
			type="text"
			id="address"
			placeholder="e.g., City, Country"
			bind:value={$resumeData.basicInfo.address}
		/>

		<label for="website">Website / Portfolio</label>
		<input type="url" id="website" bind:value={$resumeData.basicInfo.website} />
	{/if}
</div>
<style>
	
	label, .photo-options{
		box-sizing: border-box;
	}
	.form-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		box-sizing: border-box;
	}

	/* --- UPDATED STYLES USING CSS VARIABLES --- */

	h3 {
		/* Inherits the correct color from the global styles */
	}

	label {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-secondary); /* Use variable for secondary text */
		margin-bottom: 0.25rem;
		margin-top: 0.75rem;
	}

	/* General input styles */
	input[type='text'],
	input[type='email'],
	input[type='tel'],
	input[type='url'] {
		width: 100%;
    box-sizing: border-box;
		background: var(--background-input);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
		padding: 0.6rem 0.75rem;
		border-radius: 8px;
		outline: none;
		transition: box-shadow 0.12s, border-color 0.12s;
		font-family: 'DMSans', sans-serif;
		font-size: 0.95rem;
		height: auto; /* Remove fixed height */
	}

	input:focus {
		border-color: var(--border-focus);
		box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
	}

	/* File input styles */
	input[type='file'] {
		color: var(--text-secondary);
		background: transparent;
		border: 1px dashed var(--border-color);
		padding: 0.5rem;
		border-radius: 8px;
	}

	.photo-options {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.shape-selector {
  display: flex;         /* Arrange children ("Shape:", "Circle", "Square") in a row */
  align-items: center;   /* Vertically align everything to the middle */
  gap: 16px;             /* Add space between each item (e.g., between "Shape:" and "Circle") */
}

	.shape-selector label {
  display: flex;         /* Arrange the input and text inside the label in a row */
  align-items: center;   /* Vertically align the radio button with its text */
  gap: 6px;              /* Add a small space between the radio button and its text */
}

	.delete-photo-btn {
		background-color: var(--accent-destructive);
		color: var(--text-inverted);
		border: none;
		padding: 8px 12px;
		border-radius: 8px;
		cursor: pointer;
		font-family: 'DMSans', sans-serif;
	}

	.ats-warning {
		font-size: 0.85rem;
		color: #92400e;
		margin-top: 0.25rem;
		background-color: #fef3c7;
		padding: 0.5rem;
		border-radius: 6px;
	}
	input, .photo-options{
		box-sizing: border-box;
	}
</style>