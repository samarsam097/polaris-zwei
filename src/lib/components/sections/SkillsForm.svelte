<script lang="ts">
    import { resumeData } from '$lib/resumeStore';
    // 1. Import the dndzone action from the library
    import { dndzone } from 'svelte-dnd-action';

    let newSkill = ''; // This variable will hold the text in the input box

    function addSkill() {
        // We don't add the skill if the input is empty or just whitespace
        if (!newSkill.trim()) return;

        // Update the store by adding the new skill to the existing array
        $resumeData.skills = [...$resumeData.skills, newSkill.trim()];

        // Clear the input box for the next skill
        newSkill = '';
    }

    function deleteSkill(skillToDelete: string) {
        // We use .filter() to create a new array without the skill we want to remove
        $resumeData.skills = $resumeData.skills.filter(skill => skill !== skillToDelete);
    }

    // This allows the user to press 'Enter' to add a skill
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevents the form from submitting
            addSkill();
        }
    }
    
    // This function handles the reordering event from the library
    function handleDndConsider(e: CustomEvent) {
        // Update the store with the new, reordered array of skills
        $resumeData.skills = e.detail.items;
    }
</script>

<div class="form-section">
    <h3>Skills</h3>

    <div
        class="skill-tags"
        use:dndzone={{ items: $resumeData.skills }}
        on:consider={handleDndConsider}
    >
        {#each $resumeData.skills as skill (skill)}
            <div class="skill-tag">
                {skill}
                <button class="delete-tag" on:click={() => deleteSkill(skill)}>×</button>
            </div>
        {/each}
    </div>

    <div class="skill-input-group">
        <input
            class="text-input"
            type="text"
            placeholder="e.g., JavaScript"
            bind:value={newSkill}
            on:keydown={handleKeydown}
        />
        </div>

    <button class="add-btn" on:click={addSkill}>+ Add Skill</button>
</div>

<style>
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

    /* --- THIS IS THE NEW STYLE FOR THE ADD BUTTON --- */
    .add-btn {
        width: 100%;
        padding: 0.75rem;
        background-color: transparent;
        color: var(--accent-secondary); /* Green text color */
        border: 1px solid var(--border-color); /* Dashed border */
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
        margin-top: 1rem;
    }

    .add-btn:hover {
        background-color: rgba(22, 163, 74, 0.05); /* Subtle green background on hover */
        border-color: var(--accent-secondary);
    }
    
    /* Your existing styles for the tags are preserved */
    .skill-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem; /* Added space above the input */
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
        cursor: move;
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