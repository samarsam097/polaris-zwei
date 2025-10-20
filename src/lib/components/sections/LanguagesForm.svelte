<script lang="ts">
    import { resumeData } from '$lib/resumeStore';
    // No need to import dndzone for this component unless you want reordering

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

<div class="form-section">
    <h3>Languages</h3>

    <div class="skill-tags">
        {#each $resumeData.languages as language (language)}
            <div class="skill-tag">
                {language}
                <button class="delete-tag" on:click={() => deleteLanguage(language)}>×</button>
            </div>
        {/each}
    </div>

    <div class="skill-input-group">
        <input
            class="text-input"
            type="text"
            placeholder="e.g., English"
            bind:value={newLanguage}
            on:keydown={handleKeydown}
        />
    </div>

    <button on:click={addLanguage} class="add-btn">+ Add Language</button>
</div>

<style>
    /* These styles are copied directly from your SkillsForm to ensure they match */
    h3 {
        color: var(--text-headings);
    }

    .skill-input-group {
        display: flex;
        gap: 0.5rem;
    }

    .text-input {
        flex-grow: 1;
        background: var(--background-input);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        padding: 0.75rem;
        border-radius: 6px;
        font-size: 1rem;
    }

    .text-input:focus {
        outline: none;
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .add-btn {
        width: 100%;
        padding: 0.75rem;
        background-color: transparent;
        color: var(--accent-secondary); /* Green text color */
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-family: var(--font-family);
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
        margin-top: 1rem;
    }

    .add-btn:hover {
        background-color: rgba(22, 163, 74, 0.05);
        border-color: var(--accent-secondary);
    }

    .skill-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .skill-tag {
        background-color: var(--background-main);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        padding: 0.3rem 0.6rem;
        border-radius: 12px;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }

    .delete-tag {
        background: var(--text-secondary);
        color: var(--background-sidebar);
        border: none;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 1;
        padding: 0;
        font-weight: bold;
    }
</style>