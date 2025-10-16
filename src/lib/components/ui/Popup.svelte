<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  export let message = '';
  export let type: 'success' | 'error' = 'success';
  export let duration = 3000; // 3 seconds

  let visible = true;

  onMount(() => {
    const timer = setTimeout(() => {
      visible = false;
    }, duration);

    return () => clearTimeout(timer);
  });
</script>

{#if visible}
  <div
    class="popup"
    class:success={type === 'success'}
    class:error={type === 'error'}
    transition:fly={{ y: -10, duration: 300 }}
  >
    {#if type === 'success'}
      <img src="/icons/save.svg" alt="Success" />
    {:else}
      <img src="/icons/alert-triangle.svg" alt="Error" />
    {/if}
    <p>{message}</p>
  </div>
{/if}

<style>
  .popup {
    position: absolute;
    top: 0;
    left: calc(100% + 1rem); /* Position it to the right of the parent */
    height: 58px; /* Match the height of the trigger button */
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 1.5rem; /* Adjust padding */
    border-radius: 100px; /* Pill shape to match dropdown */
    font-size: 0.9rem;
    font-weight: 500;
    background-color: white;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    white-space: nowrap;
  }

  .popup.success {
    color: #16a34a; /* green-600 */
  }

  .popup.error {
    color: #dc2626; /* red-600 */
  }

  .popup img {
    width: 20px;
    height: 20px;
  }

  .popup.success img {
    filter: invert(48%) sepia(61%) saturate(2083%) hue-rotate(115deg) brightness(95%) contrast(84%);
  }

  .popup.error img {
    filter: invert(26%) sepia(79%) saturate(2478%) hue-rotate(345deg) brightness(89%) contrast(96%);
  }
</style>
