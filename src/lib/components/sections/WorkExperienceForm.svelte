<script lang="ts">
    import { resumeData } from '$lib/resumeStore';
    import type { Project } from '$lib/resumeStore';

    let keywords = '';
    let loadingProjectId: string | null = null;

    function addProject() {
        const newProject: Project = {
            id: crypto.randomUUID(),
            name: '',
            link: '',
            summary: ''
        };
        $resumeData.projects = [...$resumeData.projects, newProject];
    }

    function deleteProject(idToDelete: string) {
        $resumeData.projects = $resumeData.projects.filter((p) => p.id !== idToDelete);
    }

    async function generateProjectSummary(projectId: string, projectKeywords: string) {
        if (!projectKeywords) {
            alert('Please enter keywords for this project.');
            return;
        }
        loadingProjectId = projectId;
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keywords: projectKeywords, context: 'projectSummary' })
            });
            if (!response.ok) throw new Error('Request failed');
            const data = await response.json();

            resumeData.update((currentData) => {
                const updatedProjects = currentData.projects.map((project) => {
                    if (project.id === projectId) {
                        return { ...project, summary: data.text };
                    }
                    return project;
                });
                currentData.projects = updatedProjects;
                return currentData;
            });

        } catch (e) {
            console.error(e);
            alert('Failed to generate summary.');
        } finally {
            loadingProjectId = null;
        }
    }
</script>

<div class="form-section">
    <h3>Projects</h3>
    {#each $resumeData.projects as project (project.id)}
        <div class="experience-entry">
            <input class="sawal" type="text" placeholder="Project Name" bind:value={project.name} />
            <input class="sawal" type="text" placeholder="Project Link (optional)" bind:value={project.link} />
            <textarea
                class="wk-textarea"
                placeholder="Project description and achievements..."
                bind:value={project.summary}
                rows="4"
            ></textarea>

            <div class="ai-controls">
                <input
                    class="text-input"
                    type="text"
                    placeholder="Keywords for AI..."
                    on:input={(e) => (keywords = e.currentTarget.value)}
                />
                <button
                    on:click={() => generateProjectSummary(project.id, keywords)}
                    disabled={loadingProjectId === project.id}
                    class="ai-button"
                    title="Generate with AI"
                >
                    {#if loadingProjectId === project.id}
                        <svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
                    {:else}
                        <img src="/icons/ai.svg" alt="Generate with AI" class="ai-icon" />
                    {/if}
                </button>
            </div>
            <button class="delete-btn" on:click={() => deleteProject(project.id)}>Delete</button>
        </div>
    {/each}
    <button on:click={addProject} class="add-btn">+ Add Project</button>
</div>

<style>
    h3 {
        color: var(--text-headings);
    }

    .sawal,
    .wk-textarea,
    .text-input {
        background: var(--background-input);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        font-family: 'DMSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    .sawal:focus,
    .wk-textarea:focus,
    .text-input:focus {
        border-color: var(--border-focus);
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        outline: none;
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

    .sawal {
        padding: 0.75rem;
        border-radius: 6px;
        width: 100%;
    }

    .wk-textarea {
        padding: 0.75rem;
        border-radius: 6px;
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
        padding: 0.75rem;
        border-radius: 6px;
    }

    /* --- NEW STYLES FOR THE ICON BUTTON --- */
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
        padding: 0; /* Remove padding for icon-only button */
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
        /* This CSS filter is a trick to color your black SVG */
        filter: invert(38%) sepia(97%) saturate(1588%) hue-rotate(205deg) brightness(98%) contrast(97%);
    }

    /* --- BUTTON STYLES (copied from WorkExperienceForm) --- */
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
        align-self: flex-end;
        width: auto;
        padding: 0.5rem 1rem;
    }
    .delete-btn:hover {
        background: rgba(220, 38, 38, 0.05);
    }

    .delete-btn,
    .add-btn {
        font-family: 'DMSans', sans-serif;
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

    /* --- SPINNER ANIMATION --- */
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

