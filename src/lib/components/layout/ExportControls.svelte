<script lang="ts">
	import { resumeData } from '$lib/resumeStore';
	import { onMount } from 'svelte'; // 1. Import onMount

	// 2. We will load the library into this variable, but only on the client
	let html2pdf: any;

	// 3. onMount runs ONLY in the browser
	onMount(async () => {
		// We dynamically import the library here. The server never reaches this code.
		const module = await import('html2pdf.js');
		html2pdf = module.default; // .default is often needed for libraries like this
	});

	function downloadPDF() {
		// 4. Add a guard clause. If the library hasn't loaded yet, do nothing.
		if (!html2pdf) {
			console.error('PDF generation library is not loaded yet.');
			return;
		}

		const element = document.getElementById('resume-preview-paper');
		if (!element) {
			console.error('Resume preview element not found!');
			return;
		}

		const filename = `${$resumeData.basicInfo.name.replace(/ /g, '_')}_Resume.pdf`;
		const options = {
			margin: 0.5,
			filename: filename,
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
		};

		// The rest of the function is the same
		html2pdf().from(element).set(options).save();
	}
</script>

<div class="export-controls">
	<button on:click={downloadPDF} class="download">Download as PDF</button>
</div>

<style>
		button{
				width: 100%;
				height: 50px;
				padding: 0 1rem;
		border: none;
		background-color: grey;
		color: white;
		border-radius: 4px;
		cursor: pointer;

		}
	/* ... */
</style>