<script lang="ts">
    import { resumeData } from '$lib/resumeStore';
    import type { WorkExperience } from '$lib/resumeStore';

    let keywords = '';
    let loadingExperienceId: string | null = null;

    function addExperience() {
        const newExperience: WorkExperience = {
            id: crypto.randomUUID(),
            company: '',
            role: '',
            startDate: '',
            endDate: '',
            summary: ''
        };
        $resumeData.workExperience = [...$resumeData.workExperience, newExperience];
    }

    function deleteExperience(idToDelete: string) {
        $resumeData.workExperience = $resumeData.workExperience.filter((exp) => exp.id !== idToDelete);
    }

    async function generateWorkSummary(experienceId: string, experienceKeywords: string) {
        if (!experienceKeywords) {
            alert('Please enter keywords for this job.');
            return;
        }
        loadingExperienceId = experienceId;

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keywords: experienceKeywords, context: 'workExperience' })
            });

            if (!response.ok) throw new Error('Request failed');

            const data = await response.json();

            resumeData.update((currentData) => {
                const expIndex = currentData.workExperience.findIndex((exp) => exp.id === experienceId);
                if (expIndex !== -1) {
                    currentData.workExperience[expIndex].summary = data.text;
                }
                return currentData;
            });
        } catch (error) {
            console.error(error);
            alert('An error occurred while generating the summary.');
        } finally {
            loadingExperienceId = null;
        }
    }
</script>

<div class="form-section">
    <h3>Work Experience</h3>

    {#each $resumeData.workExperience as experience, i (experience.id)}
        <div class="experience-entry">
            <input class ="sawal" type="text" placeholder="Company" bind:value={experience.company} />
            <input class ="sawal" type="text" placeholder="Role / Title" bind:value={experience.role} />
            <textarea class="wk-textarea"
                placeholder="Job summary and achievements..."
                bind:value={experience.summary}
                rows="5"
            ></textarea>

            <div class="ai-controls">
                <input
                    class="text-input"
                    type="text"
                    placeholder="Keywords: e.g., managed team, increased sales by 20%"
                    on:input={(e) => (keywords = e.currentTarget.value)}
                />
                <button 
                    class="ai-button"
                    on:click={() => generateWorkSummary(experience.id, keywords)}
                    disabled={loadingExperienceId === experience.id}
                    title="Generate with AI"
                >
                    {#if loadingExperienceId === experience.id}
                        <svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
                    {:else}
                        <img src="/icons/ai.svg" alt="Generate with AI" class="ai-icon" />
                    {/if}
                </button>
            </div>

            <button class="delete-btn" on:click={() => deleteExperience(experience.id)}> Delete </button>
        </div>
    {/each}

    <button on:click={addExperience} class="add-btn"> + Add Work Experience </button>
</div>

<style>
    h3 {
        color: var(--text-headings);
    }

    .form-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .experience-entry {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
    }

    .sawal,
    .wk-textarea,
    .text-input {
        width: 100%;
        box-sizing: border-box;
        background-color: var(--background-input);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 0.75rem;
        font-size: 1rem;
    font-family: var(--font-family);
        transition: border-color 0.2s, box-shadow 0.2s;
    }

    .sawal:focus,
    .wk-textarea:focus,
    .text-input:focus {
        outline: none;
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    
    .wk-textarea {
        resize: vertical;
        min-height: 120px;
    }

    .ai-controls {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
    }
    
    .text-input {
        flex-grow: 1;
    }

    .ai-button {
        width: 40px;
        height: 40px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        color: var(--accent-primary);
        border: 1px solid var(--accent-primary);
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .ai-button:hover:not(:disabled) {
        background: rgba(37, 99, 235, 0.05);
    }

    .ai-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .ai-icon {
        width: 20px;
        height: 20px;
        filter: invert(38%) sepia(97%) saturate(1588%) hue-rotate(205deg) brightness(98%) contrast(97%);
    }

     .add-btn {
        color: var(--accent-secondary);
        border: 1px solid var(--border-color);
        background: transparent;
    }
    .add-btn:hover {
        background-color: rgba(22, 163, 74, 0.05);
        border-color: var(--accent-secondary);
    }

    .delete-btn {
        color: var(--accent-destructive);
        border: 1px solid var(--border-color);
        background: transparent;
        align-self: flex-end; /* Pushes button to the right */
        width: auto;
        padding: 0.5rem 1rem;
    }
    .delete-btn:hover {
        background: rgba(220, 38, 38, 0.05);
    }

    .delete-btn,
    .add-btn {
    font-family: var(--font-family);
        padding: 0.5rem;
        width: 100%;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
    
    textarea,
    .text-input,
    .ai-button,
    .sawal {
        box-sizing: border-box;
    }
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
