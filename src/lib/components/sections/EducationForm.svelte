<script lang="ts">
    import { resumeData } from '$lib/resumeStore';
    import type { Education } from '$lib/resumeStore';

    function addEducation() {
        const newEducationEntry: Education = {
            id: crypto.randomUUID(),
            institution: '',
            degree: '',
            location: '',
            startDate: '',
            endDate: ''
        };
        $resumeData.education = [...$resumeData.education, newEducationEntry];
    }

    function deleteEducation(idToDelete: string) {
        $resumeData.education = $resumeData.education.filter((edu) => edu.id !== idToDelete);
    }
</script>

<div class="form-section">
    <h3>Education</h3>

    {#each $resumeData.education as entry (entry.id)}
        <div class="list-entry">
            <input type="text" placeholder="Institution / University" bind:value={entry.institution} />
            <input type="text" placeholder="Degree / Field of Study" bind:value={entry.degree} />
            <input type="text" placeholder="Location" bind:value={entry.location} />
            <div class="date-group">
                <input type="text" placeholder="Start Date" bind:value={entry.startDate} />
                <input type="text" placeholder="End Date" bind:value={entry.endDate} />
            </div>
            <button class="delete-btn" on:click={() => deleteEducation(entry.id)}> Delete </button>
        </div>
    {/each}
    <button on:click={addEducation} class="add-btn"> + Add Education </button>
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
        gap: 0.75rem; /* Consistent gap between inputs */
        padding: 1rem; /* Consistent padding inside the box */
        border: 1px solid var(--border-color);
        border-radius: 8px;
    }

    input {
        background: var(--background-input);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        padding: 0.75rem; /* Consistent padding */
        border-radius: 6px;
        outline: none;
        font-family: 'DMSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        width: 100%;
        box-sizing: border-box;
    }

    input:focus {
        border-color: var(--border-focus);
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    }

    .date-group {
        display: flex;
        gap: 0.75rem; /* Consistent gap for date inputs */
    }
    
    .add-btn,
    .delete-btn {
        padding: 0.5rem;
        width: 100%;
        background: transparent;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        cursor: pointer;
        font-family: 'DMSans', sans-serif;
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
        margin-top: 0.5rem; /* Consistent margin */
        align-self: flex-end;
        width: auto;
        padding: 0.5rem 1rem;
    }
    .delete-btn:hover {
        background: rgba(220, 38, 38, 0.05);
    }
</style>