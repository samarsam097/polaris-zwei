<script lang="ts">
	import { resumeData } from '$lib/resumeStore';
	import { get } from 'svelte/store';
	import type { SupabaseClient } from '@supabase/supabase-js';

	// 1. Import the libraries directly
	import jsPDF from 'jspdf';
	import html2canvas from 'html2canvas';

	export let resumeId: string;
	export let supabase: SupabaseClient;

	let isDownloading = false;
	let isSaving = false;

	async function downloadPDF() {
		if (isDownloading) return;
		isDownloading = true;

		try {
			// 2. Find the single, continuous content element.
			const element = document.getElementById('resume-preview-paper');
			if (!element) throw new Error('Resume content element not found!');

			const filename = `${get(resumeData).basicInfo.name.replace(/ /g, '_')}_Resume.pdf`;

			// 3. Use html2canvas to take a high-quality "screenshot".
			const canvas = await html2canvas(element, {
				scale: 2, // Take screenshot at 2x resolution for sharpness
				useCORS: true
			});

			const imgData = canvas.toDataURL('image/jpeg', 0.98);

			// 4. Create a new PDF with a custom size that perfectly matches the screenshot.
			// We use 'px' as the unit for a direct 1:1 mapping.
			const pdf = new jsPDF({
				orientation: 'portrait',
				unit: 'px',
				format: [canvas.width, canvas.height] // format: [width, height]
			});

			// 5. Add the screenshot to the PDF, covering the entire page.
			pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);

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

<div class="action-bar">
	<button class="icon-btn" on:click={saveResume} disabled={isSaving} title="Save Resume">
		<img src="/icons/save.svg" alt="Save" />
	</button>
	<button class="icon-btn" on:click={downloadPDF} disabled={isDownloading} title="Download as PDF">
		<img src="/icons/download.svg" alt="Download" />
	</button>
</div>

<style>
  .action-bar {
    width: fit-content;
			align-self: center;
			position: sticky; /* The magic property */
  top: 0;           /* Sticks to the top of the viewport when you scroll past it */
  z-index: 100;
    /* --- STYLING (remains the same) --- */
    display: flex;
    gap: 0.5rem;
    background-color: #2d3748;
    padding: 0.5rem;
    border-radius: 9999px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    border: 1px solid #4a5568;
  }

  .icon-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    background-color: transparent;
  }

  .icon-btn img {
    width: 20px;
    height: 20px;
    filter: invert(1); /* Makes the black SVG icons white */
  }

  .icon-btn:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .icon-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>