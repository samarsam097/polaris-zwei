<script lang="ts">
	import { resumeData } from '$lib/resumeStore';

	let newLanguage = '';

	function addLanguage() {
		if (!newLanguage.trim()) return;
		$resumeData.languages = [...$resumeData.languages, newLanguage.trim()];
		newLanguage = '';
	}

	function deleteLanguage(langToDelete: string) {
		$resumeData.languages = $resumeData.languages.filter(lang => lang !== langToDelete);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addLanguage();
		}
	}
</script>
<h3>Languages</h3>
<div class="form-section">

	<div class="skill-input-group">
		<input
			type="text"
			placeholder="e.g., English"
			bind:value={newLanguage}
			on:keydown={handleKeydown}
		/>
		<button on:click={addLanguage}>Add</button>
	</div>
	<div class="skill-tags">

		{#each $resumeData.languages as language (language)}
			<div class="skill-tag">


					{language}
									<button class="delete-tag" on:click={() => deleteLanguage(language)}>×</button>
			</div>
		{/each}

	</div>
</div>

<style>
		button{
				height:27px;
		}
		.form-section{
				display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.5rem;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
				margin-bottom: 10px;
		}
		h3{
				color:darkgrey;
		}
		.skill-tag{
				color: darkgrey;
								display: flex;
				justify-content: space-between;
		}
		.skill-input-group{
				display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;


				margin-bottom: 5px;
		}
		input{
				height:27px;
		}
	/* ... styles for .skill-input-group, .skill-tags, etc. ... */
</style>