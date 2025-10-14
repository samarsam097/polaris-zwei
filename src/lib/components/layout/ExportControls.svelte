<script lang="ts">
	import { resumeData } from '$lib/resumeStore';
	import { get } from 'svelte/store';
	// We no longer import supabase from the old file
	import { onMount } from 'svelte';

	// 1. Receive resumeId AND the supabase client from the parent page
	export let resumeId: string;
	export let supabase: any; // The Supabase client is now passed in as a prop

	let html2pdf: any;
	let isDownloading = false;
	let isSaving = false;

	onMount(async () => {
		try {
			const module = await import('html2pdf.js');
			html2pdf = module.default;
		} catch (error) {
			console.error('Failed to load html2pdf.js library', error);
		}
	});

	async function downloadPDF() {
		if (isDownloading || !html2pdf) return;
		isDownloading = true;
		try {
			const element = document.getElementById('resume-preview-paper');
			if (!element) throw new Error('Preview element not found!');
			const filename = `${get(resumeData).basicInfo.name.replace(/ /g, '_')}_Resume.pdf`;
			const options = {
				margin: [0.25, 0.1],
				filename: filename,
				image: { type: 'jpeg', quality: 0.98 },
				html2canvas: { scale: 2, useCORS: true },
				jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
			};
			await html2pdf().from(element).set(options).save();
		} catch (error) {
			console.error('Failed to generate PDF:', error);
			alert('Sorry, an error occurred while generating the PDF.');
		} finally {
			isDownloading = false;
		}
	}

	// This function saves the current resume state to Supabase
	async function saveResume() {
		if (isSaving || !resumeId) return;

		isSaving = true;
		try {
			const currentData = get(resumeData); // Get a snapshot of the resume data

			// 2. This will now use the supabase client passed in as a prop
			const { error } = await supabase
				.from('resumes')
				.update({ data: currentData, updated_at: new Date().toISOString() })
				.eq('id', resumeId);

			if (error) throw error;

			alert('Resume saved successfully!');
		} catch (error) {
			console.error('Error saving resume:', error);
			alert('Could not save the resume. Please try again.');
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="export-controls">
	<button class="save-btn" on:click={saveResume} disabled={isSaving}>
		{isSaving ? 'Saving...' : 'Save Resume'}
	</button>
	<button class="download-btn" on:click={downloadPDF} disabled={isDownloading}>
		{isDownloading ? 'Generating...' : 'Download as PDF'}
	</button>
</div>

<style>
	.export-controls {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	button {
		width: 100%;
		padding: 12px;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: bold;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	.save-btn {
		background-color: #007bff; /* Blue */
		color: white;
	}
	.download-btn {
		background-color: #4caf50; /* Green */
		color: white;
	}
	button:disabled {
		background-color: #9ca3af;
		cursor: not-allowed;
	}
	button:hover:not(:disabled) {
		filter: brightness(90%);
	}
</style>