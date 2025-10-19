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
			<input class="sawal" type="text" placeholder="Certification Name" bind:value={cert.name} />
			<input class="sawal" type="text" placeholder="Issuing Organization" bind:value={cert.issuer} />
			<input class="sawal" type="text" placeholder="Date Issued" bind:value={cert.date} />
			<button class="delete-btn" on:click={() => deleteCertification(cert.id)}>Delete</button>
		</div>
	{/each}
	<button on:click={addCertification} class="add-btn">+ Add Certification</button>
</div>

<style>
			.sawal{
		outline:none;
		margin-bottom: 0.5rem;
		padding: 0.5rem;
		border-radius: 8px;
		border: 1px solid #263241;
		background: #0b1220;
		color: #fff;
		width: 100%;
		box-sizing: border-box;
		font-family: 'DMSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
	}
	
    .form-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .sawal:focus{
		border-color: #4f9cff;
		box-shadow: 0 0 0 4px rgba(79,156,255,0.08);}
		
 
     .sawal, .delete-btn {
        box-sizing: border-box;
    }
    h3{
			color:darkgrey;
	}
	.delete-btn,.add-btn{
		padding:0.5rem;
		width:100%;
		background: transparent;
        
        border: 1px solid rgba(79,156,255,0.18);
        border-radius: 8px;
        cursor: pointer;
        font-family: 'DMSans', sans-serif;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
	}
	.delete-btn{
		color: red;
		margin-top: 1rem;
	}
	.add-btn{
		color: green;
	}
</style>