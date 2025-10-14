<script lang="ts">
	import { resumeData } from '$lib/resumeStore';
	import type { Certification } from '$lib/resumeStore';

	function addCertification() {
		const newCert: Certification = {
			id: crypto.randomUUID(),
			name: '',
			issuer: '',
			date: ''
		};
		$resumeData.certifications = [...$resumeData.certifications, newCert];
	}

	function deleteCertification(idToDelete: string) {
		$resumeData.certifications = $resumeData.certifications.filter((cert) => cert.id !== idToDelete);
	}
</script>

<div class="form-section">
	<h3>Certifications</h3>
	{#each $resumeData.certifications as cert (cert.id)}
		<div class="list-entry">
			<input type="text" placeholder="Certification Name" bind:value={cert.name} />
			<input type="text" placeholder="Issuing Organization" bind:value={cert.issuer} />
			<input type="text" placeholder="Date Issued" bind:value={cert.date} />
			<button class="delete-btn" on:click={() => deleteCertification(cert.id)}>Delete</button>
		</div>
	{/each}
	<button on:click={addCertification} class="add-btn">+ Add Certification</button>
</div>

<style>
		input{
				height:27px;
		}
		.list-entry{
				display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
				margin-bottom: 10px;
		}
		h3{
				color:darkgrey;
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
				height:27px;
	}
	/* ... styles for .form-section, .list-entry, etc. ... */
</style>