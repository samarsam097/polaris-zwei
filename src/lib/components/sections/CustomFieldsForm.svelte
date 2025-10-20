<script lang="ts">
    import { resumeData } from '$lib/resumeStore';
    import type { CustomField } from '$lib/resumeStore';

    function addCustomField() {
        const newField: CustomField = { id: crypto.randomUUID(), label: '', value: '' };
        $resumeData.customFields = [...$resumeData.customFields, newField];
    }

    function deleteCustomField(idToDelete: string) {
        $resumeData.customFields = $resumeData.customFields.filter((field) => field.id !== idToDelete);
    }
</script>

<div class="form-section">
    <h3>Custom Sections</h3>
    {#each $resumeData.customFields as field (field.id)}
        <div class="list-entry">
            <input type="text" placeholder="Section Title (e.g., 'Objective')" bind:value={field.label} />
            <textarea placeholder="Write the content for this section..." bind:value={field.value} rows="5"></textarea>
            <button class="delete-btn" on:click={() => deleteCustomField(field.id)}>Delete Section</button>
        </div>
    {/each}
    <button on:click={addCustomField} class="add-btn">+ Add Custom Section</button>
</div>

<style>
    /* These styles now match your WorkExperienceForm for consistency */
    h3 {
        color: var(--text-headings);
    }

    .form-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .list-entry {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
    }

    input,
    textarea {
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

    input:focus,
    textarea:focus {
        outline: none;
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    
    textarea {
        resize: vertical;
        min-height: 120px;
    }

    .add-btn,
    .delete-btn {
        padding: 0.5rem;
        width: 100%;
        background: transparent;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        cursor: pointer;
    font-family: var(--font-family);
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: background-color 0.2s;
    }

    .add-btn {
        color: green;
    }
    .add-btn:hover {
        background: rgba(22, 163, 74, 0.05);
    }

    .delete-btn {
        color: red;
        margin-top: 0.5rem;
        align-self: flex-end;
        width: 100%;
        padding: 0.5rem 1rem;
    }
    .delete-btn:hover {
        background: rgba(220, 38, 38, 0.05);
    }
</style>
