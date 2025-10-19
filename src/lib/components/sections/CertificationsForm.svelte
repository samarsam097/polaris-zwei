<script lang="ts">
    import { resumeData } from '$lib/resumeStore';
    import type { Certification } from '$lib/resumeStore';

    function addCertification() {
        const newCert: Certification = {
            id: crypto.randomUUID(),
            name: '',
            issuer: '',
            date: ''
        };
        $resumeData.certifications = [...$resumeData.certifications, newCert];
    }

    function deleteCertification(idToDelete: string) {
        $resumeData.certifications = $resumeData.certifications.filter((cert) => cert.id !== idToDelete);
    }
</script>

<div class="form-section">
    <h3>Certifications</h3>
    {#each $resumeData.certifications as cert (cert.id)}
        <div class="list-entry">
            <input class="sawal" type="text" placeholder="Certification Name" bind:value={cert.name} />
            <input class="sawal" type="text" placeholder="Issuing Organization" bind:value={cert.issuer} />
            <input class="sawal" type="text" placeholder="Date Issued" bind:value={cert.date} />
            <button class="delete-btn" on:click={() => deleteCertification(cert.id)}>Delete</button>
        </div>
    {/each}
    <button on:click={addCertification} class="add-btn">+ Add Certification</button>
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

    .sawal { /* This class is used for your inputs */
        width: 100%;
        box-sizing: border-box;
        background-color: var(--background-input);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 0.75rem;
        font-size: 1rem;
        font-family: inherit;
        transition: border-color 0.2s, box-shadow 0.2s;
    }

    .sawal:focus {
        outline: none;
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
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
</style>
