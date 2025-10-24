<script lang="ts">
    import { resumeData } from '$lib/resumeStore';
    import { dndzone } from 'svelte-dnd-action';

    let newSkill = '';

    function addSkill() {
        if (!newSkill.trim()) return;

        const newSkillObj = {
            id: crypto.randomUUID(),
            name: newSkill.trim()
        };

        // Use a function update to ensure reactivity
        resumeData.update(currentData => {
            currentData.skills = [...currentData.skills, newSkillObj];
            return currentData;
        });

        newSkill = '';
    }

    function deleteSkill(skillIdToDelete: string) {
        resumeData.update(currentData => {
            currentData.skills = currentData.skills.filter(skill => skill.id !== skillIdToDelete);
            return currentData;
        });
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addSkill();
        }
    }
    
    function handleDndConsider(e: CustomEvent) {
        // Update store with reordered items
        resumeData.update(currentData => {
            currentData.skills = e.detail.items;
            return currentData;
        });
    }
</script>

<div class="form-section">
    <h3>Skills</h3>

    <div
        class="skill-tags"
        use:dndzone={{ items: $resumeData.skills }}
        on:consider={handleDndConsider}
    >
        <!-- Key by skill.id and display skill.name -->
        {#each $resumeData.skills as skill (skill.id)}
            <div class="skill-tag">
                {skill.name}
                <button class="delete-tag" on:click={() => deleteSkill(skill.id)}>×</button>
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

    <!-- Make sure this button uses the .add-btn style -->
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
    
    /* Using global style for .add-btn, but let's override for the skill-specific style */
    .add-btn {
        font-family: var(--font-family);
        width: 100%;
        padding: 0.75rem;
        background-color: transparent;
        color: var(--accent-secondary); 
        border: 1px solid var(--border-color); 
        border-radius: 6px;
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

