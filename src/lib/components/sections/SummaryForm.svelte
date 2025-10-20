<script lang="ts">
    import { resumeData } from '$lib/resumeStore';

    let keywords = '';
    let isLoading = false; // To disable the button while waiting.

    async function generateSummary() {
        if (!keywords) {
            alert('Please enter some keywords first.');
            return;
        }
        isLoading = true;

        try {
            // Call OUR OWN API endpoint, not OpenAI's directly.
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keywords: keywords, context: 'profileSummary'})
            });

            if (!response.ok) {
                throw new Error('The request to the server failed.');
            }

            const data = await response.json();

            // Update the store with the text we got back from our server.
            $resumeData.summary = data.text;

        } catch (error) {
            console.error(error);
            alert('An error occurred while generating the summary.');
        } finally {
            isLoading = false; // Re-enable the button no matter what.
        }
    }
</script>

<div class="form-section">
    <h3>Profile / Summary</h3>
    <textarea class="summary-textarea" placeholder="Your professional summary..." bind:value={$resumeData.summary} rows="6"></textarea>


    <div class="ai-controls">
        <input class="text-input" type="text" bind:value={keywords} placeholder="Keywords: e.g., leadership, React" />
        <button class="ai-button" on:click={generateSummary} disabled={isLoading}>
            
            {#if isLoading}
                <svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
            {:else}
                <!-- This is the new part: an <img> tag pointing to your SVG file -->
                <img src="/icons/ai.svg" alt="Generate with AI" class="ai-icon" />
            {/if}

        </button>
    </div>
</div>

<style>
	/* All your structural styles are preserved */
	.form-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.summary-textarea {
		max-height: 300px;
		width: 100%;
		resize: vertical;
		min-height: 120px;
	}
	.ai-controls {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color); /* Use variable */
	}

	/* --- UPDATED STYLES USING CSS VARIABLES --- */

	/* The h3 will inherit the correct color from the global styles, so we can remove its specific rule */

	.summary-textarea,
	.text-input {
		background: var(--background-input);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
		padding: 0.75rem;
		border-radius: 8px;
	font-family: var(--font-family);
			
		font-size: 1rem;
		box-sizing: border-box;
	}

	.text-input:focus,
	.summary-textarea:focus {
		outline: none;
		border-color: var(--border-focus);
	}

	.ai-button {
		background: transparent;
		color: var(--accent-primary);
		border: 1px solid var(--accent-primary);
		border-radius: 8px;
		cursor: pointer;
		font-family: var(--font-family);
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
	}

	.ai-button:hover:not(:disabled) {
		background: rgba(59, 130, 246, 0.05); /* A very subtle blue tint on hover */
	}

	.ai-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Responsive layout for AI controls */
	@media (min-width: 640px) {
		.ai-controls {
			flex-direction: row;
			align-items: center;
			gap: 0.75rem;
		}
		.text-input {
			flex: 1 1 auto;
		}
		.ai-button {
			flex: 0 0 auto;
		}
	}
    .ai-icon {
        width: 20px;
        height: 20px;
        /* This CSS filter is a trick to make a black SVG use a specific color */
        filter: invert(38%) sepia(97%) saturate(1588%) hue-rotate(205deg) brightness(98%) contrast(97%);
    }
    
    /* Your existing spinner animation styles */
    .spinner {
        animation: rotate 2s linear infinite;
        width: 20px;
        height: 20px;
    }
    .path {
        stroke: var(--accent-primary);
        stroke-linecap: round;
        animation: dash 1.5s ease-in-out infinite;
    }
    @keyframes rotate { 100% { transform: rotate(360deg); } }
    @keyframes dash {
        0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
        50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
        100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
    }
</style>