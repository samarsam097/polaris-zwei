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

	// --- NEW FUNCTION TO DELETE THE PHOTO ---
	function deletePhoto() {
		// Set the photo string back to empty
		$resumeData.basicInfo.photo = '';

		// Optional: Clear the file input visually
		const fileInput = document.getElementById('photo') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	}
</script>

<div class="form-section">
	<h3>Basic Info</h3>
    <label for="photo">Profile Photo</label>
	<input type="file" id="photo" accept="image/png, image/jpeg" on:change={handlePhotoUpload} />

	{#if $resumeData.basicInfo.photo}
		<div class="shape-selector">
			<label>Photo Shape:</label>
			<label>
				<input type="radio" value="circle" bind:group={$resumeData.basicInfo.photoShape} />
				Circle
			</label>
			<label>
				<input type="radio" value="square" bind:group={$resumeData.basicInfo.photoShape} />
				Square
			</label>
		</div>
		<button class="delete-photo-btn" on:click={deletePhoto}>Delete Photo</button>
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
	<input type="text" id="address" placeholder="e.g., City, Country" bind:value={$resumeData.basicInfo.address} />

	<label for="website">Website / Portfolio</label>
	<input type="url" id="website" bind:value={$resumeData.basicInfo.website} />

</div>

<style>
    input{
        width: 100%;
    }
	.form-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
      width: 100%;
	}
	label {
		font-weight: bold;
		margin-top: 0.5rem;
	}
	input {
		width: 100%;
		padding: 8px;
		border-radius: 4px;
	}
	.ats-warning {
		font-size: 0.8rem;
		color: #ffcc00;
		margin-top: 0.25rem;
		background-color: rgba(255, 204, 0, 0.1);
		padding: 0.5rem;
		border-radius: 4px;
	}

	/* --- NEW: STYLE FOR THE DELETE BUTTON --- */
	.delete-photo-btn {
		background-color: #f44336; /* Red for a delete action */
		color: white;
		border: none;
		padding: 8px;
		border-radius: 4px;
		cursor: pointer;
		margin-top: 0.5rem;
	}
  h3,label{
      color:darkgrey;
  }
  .shape-selector {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 0.5rem;
	}
	.shape-selector label {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-weight: normal; /* Override the default bold label */
	}

</style>