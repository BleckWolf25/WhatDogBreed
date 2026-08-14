<script lang="ts">
  import { onMount } from 'svelte';
  import { X } from '@lucide/svelte';
  import type { BreedStats } from '$lib/types/scan';
  import BreedProfileContent from '$lib/components/breed/BreedProfileContent.svelte';

  let {
    breed,
    unitSystem = 'Imperial',
    onClose
  }: { breed: BreedStats; unitSystem?: 'Imperial' | 'Metric'; onClose: () => void } = $props();

  onMount(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = previousOverflow);
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') onClose();
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div
  class="modal-backdrop"
  role="presentation"
  onclick={handleBackdropClick}
  onkeydown={handleKeydown}
>
  <div
    class="modal-card"
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-labelledby="breed-modal-title"
  >
    <button
      class="close-modal-btn"
      type="button"
      onclick={onClose}
      aria-label="Close breed profile"
    >
      <X size={19} strokeWidth={1.8} />
    </button>
    <BreedProfileContent {breed} {unitSystem} variant="modal" />
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: grid;
    place-items: center;
    padding: 1rem;
    background: rgba(6, 12, 8, 0.78);
    backdrop-filter: blur(8px);
  }

  .modal-card {
    position: relative;
    width: min(100%, 720px);
    max-height: min(92vh, 900px);
    overflow-y: auto;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-lg);
    background: var(--bg-surface);
    box-shadow: var(--shadow-popover);
  }

  .close-modal-btn {
    position: absolute;
    top: 0.8rem;
    right: 0.8rem;
    z-index: 2;
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    background: rgba(7, 14, 9, 0.78);
    color: #ffffff;
  }
</style>
