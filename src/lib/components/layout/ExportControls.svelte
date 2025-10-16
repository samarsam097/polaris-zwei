<script lang="ts">
	import { resumeData } from '$lib/resumeStore';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

	export let resumeId: string;
	export let supabase: any;

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

// In src/lib/components/layout/ExportControls.svelte

async function downloadPDF() {
	if (isDownloading) return;
	isDownloading = true;

	try {
		// 1. Find the single, continuous content element.
		const element = document.getElementById('resume-preview-paper');
		if (!element) throw new Error('Resume content element not found!');

		const filename = `${get(resumeData).basicInfo.name.replace(/ /g, '_')}_Resume.pdf`;

		// 2. Use html2canvas to take a high-quality screenshot.
		const canvas = await html2canvas(element, {
			scale: 2, // Render at 2x resolution for sharpness
			useCORS: true // Allows loading external images/fonts
		});

		// 3. Get the dimensions of the captured image.
		const imgData = canvas.toDataURL('image/jpeg', 0.98);
		const imgWidth = canvas.width;
		const imgHeight = canvas.height;

		// 4. Create a new PDF with a custom size that matches the image.
		// We convert pixel dimensions to points (1px = 0.75pt).
		const pdf = new jsPDF({
			orientation: 'p', // portrait
			unit: 'pt', // use points
			format: [imgWidth * 0.75, imgHeight * 0.75] // [width, height]
		});

		// 5. Add the screenshot image to the PDF, covering the entire page.
		pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth * 0.75, imgHeight * 0.75);

		// 6. Save the PDF.
		pdf.save(filename);

	} catch (error) {
		console.error('Failed to generate PDF:', error);
		alert('Sorry, an error occurred while generating the PDF.');
	} finally {
		isDownloading = false;
	}
}

	async function saveResume() {
		if (isSaving || !resumeId) return;
		isSaving = true;
		try {
			const currentData = get(resumeData);
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

<!-- All your styles are preserved exactly as you provided them -->
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