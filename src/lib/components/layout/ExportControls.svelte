<script lang="ts">
  // --- IMPORTS ---
  import { onMount, onDestroy } from 'svelte';
  import { resumeData } from '$lib/resumeStore';
  import { get } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import type { SupabaseClient } from '@supabase/supabase-js';
  import jsPDF from 'jspdf';
  import html2canvas from 'html2canvas';
  import Popup from '$lib/components/ui/Popup.svelte';

  // --- PROPS ---
  export let resumeId: string;
  export let supabase: SupabaseClient;

  // --- STATE ---
  let isMenuOpen = false;
  let isDownloading = false;
  let isSaving = false;
  let containerNode: HTMLElement; // A reference to the main container div to detect outside clicks
  let showPopup = false;
  let popupMessage = '';
  let popupType: 'success' | 'error' = 'success';

  // --- HANDLERS ---
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function closeMenu() {
    isMenuOpen = false;
  }

  function triggerPopup(message: string, type: 'success' | 'error', duration = 3000) {
    popupMessage = message;
    popupType = type;
    showPopup = true;
    setTimeout(() => (showPopup = false), duration);
  }

  // This function checks if a click happened outside the component's main element
  function handleClickOutside(event: MouseEvent) {
    if (containerNode && !containerNode.contains(event.target as Node)) {
      closeMenu();
    }
  }

  // --- LIFECYCLE HOOKS ---
  onMount(() => {
    // Listen for clicks on the whole page to close the menu
    document.addEventListener('click', handleClickOutside, true);
  });

  onDestroy(() => {
    // Clean up the event listener to prevent memory leaks
    document.removeEventListener('click', handleClickOutside, true);
  });

  // --- CORE FUNCTIONS (Modified to close menu on action) ---
  async function downloadPDF() {
    if (isDownloading) return;
    isDownloading = true;
    closeMenu(); // Close menu when action starts

    try {
      const element = document.getElementById('resume-preview-paper');
      if (!element) throw new Error('Resume content element not found!');
      const filename = `${get(resumeData).basicInfo.name.replace(/ /g, '_')}_Resume.pdf`;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(filename);
      triggerPopup('Downloaded successfully!', 'success');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      triggerPopup('Download failed.', 'error');
    } finally {
      isDownloading = false;
    }
  }

  async function saveResume() {
    if (isSaving) return;
    isSaving = true;
    closeMenu(); // Close menu when action starts

    try {
      const currentData = get(resumeData);
      const { error } = await supabase
        .from('resumes')
        .update({ data: currentData, updated_at: new Date().toISOString() })
        .eq('id', resumeId);
      if (error) throw error;
      triggerPopup('Saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving resume:', error);
      triggerPopup('Save failed.', 'error');
    } finally {
      isSaving = false;
    }
  }
</script>

<div class="dropdown-container" bind:this={containerNode}>
  <button class="menu-trigger" on:click={toggleMenu} title="Options">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
  </button>

  {#if isMenuOpen}
    <div class="dropdown-menu" transition:fade={{ duration: 150 }}>
      <button class="menu-item" on:click={saveResume} disabled={isSaving}>
        <img src="/icons/save.svg" alt="Save"/>

      </button>
      <button class="menu-item" on:click={downloadPDF} disabled={isDownloading}>
        <img src="/icons/download.svg" alt="Download"/>

      </button>
    </div>
  {/if}

  {#if showPopup}
    <Popup message={popupMessage} type={popupType} />
  {/if}
</div>

<style>
  /* This container holds the trigger and the menu. It's positioned on top of the page,
    relative to the nearest "positioned" ancestor (like a parent with position: relative).
  */
  .dropdown-container {
    position: sticky;
    top: 0rem;
    left: 2rem;
    z-index: 100;
    width: fit-content;
    margin-left: 2rem; /* Push the container all the way to the right */
    margin-right: 2rem; /* Add some space from the right edge */

    /* This clever trick pulls the resume paper up to fill the space left by the sticky element */
    margin-bottom: -60px
  }

  /* The visible ellipsis button */
  .menu-trigger {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #f9fafb; /* Lighter background to stand out on the paper */
    border: 1px solid #d1d5db; /* Softer border */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: background-color 0.2s;
    color: #374151; /* Darker icon color */
  }
  .menu-trigger:hover {
    background-color: #f3f4f6;
  }
  .menu-trigger svg {
    fill: #4b5563;
  }

  /* The menu panel that opens up */
  .dropdown-menu {

    position: absolute;
    top: 0; /* Position it just below the trigger button */
    margin-left:10px;
    left: 100%;
    z-index: 100;
    width: fit-content;
    background-color: white;
    border-radius: 100px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
    padding: 0.5rem;
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
  }

  /* Individual buttons inside the dropdown */
  .menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem;
    border-radius: 0.375rem;
    border: none;
    background-color: transparent;
    cursor: pointer;
    text-align: left;
    font-size: 0.9rem;
    color: #374151;
    transition: background-color 0.2s;
  }
  .menu-item:hover:not(:disabled) {
    background-color: #f3f4f6;
  }
  .menu-item:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .menu-item img {
    width: 20px;
    height: 20px;
    filter: none; /* Icons are their original color now, not inverted */
  }
</style>