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
    <textarea placeholder="Your professional summary..." bind:value={$resumeData.summary} rows="6"></textarea>

    <div class="ai-controls">
        <input type="text" bind:value={keywords} placeholder="Keywords: e.g., leadership, React" />
        <button on:click={generateSummary} disabled={isLoading}>
            {isLoading ? 'Generating...' : '✨ Generate with AI'}
        </button>
    </div>
</div>

<style>
    textarea{

        max-height: 100px;
        width: 100%;

    }
    input{
        height:27px;
    }
    .form-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .ai-controls {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding-top: 1rem;
        border-top: 1px solid #eee;
    }
    input, textarea {
        width: 100%;
        padding: 0px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    button {
        padding: 10px;
        background-color: #673ab7; /* A nice purple for our AI feature */
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    button:disabled {
        background-color: #9e9e9e;
        cursor: not-allowed;
    }
    h3{
			color:darkgrey;
	}
</style>