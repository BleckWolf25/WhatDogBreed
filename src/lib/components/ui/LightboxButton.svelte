<script lang="ts">
  /**
   * @file LightboxButton.svelte
   *
   * @summary Standardized click-to-zoom button overlay for dog photographs.
   * @author BleckWolf25
   */

  import { Maximize2 } from '@lucide/svelte';
  import { openPhotoLightbox } from '$lib/utils/lightbox';

  let {
    imageUrl,
    title,
    label = 'View Photo',
    position = 'top-left'
  }: {
    imageUrl: string;
    title: string;
    label?: string;
    position?: 'top-left' | 'top-right' | 'relative';
  } = $props();
</script>

<button
  class="view-photo-btn pos-{position}"
  onclick={(e) => openPhotoLightbox(imageUrl, title, e)}
  title={`View full-screen photo of ${title}`}
>
  <Maximize2 size={15} />
  <span>{label}</span>
</button>

<style>
  .view-photo-btn {
    background: rgba(12, 17, 14, 0.92);
    color: #ffffff;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    border: 1px solid rgba(153, 247, 171, 0.3);
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    z-index: 5;
  }

  .view-photo-btn:hover {
    background: rgba(12, 17, 14, 0.98);
    border-color: var(--color-light-green);
  }

  :global(body.light-theme) .view-photo-btn {
    background: rgba(255, 255, 255, 0.95);
    color: #0b120d;
    border-color: rgba(21, 128, 61, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  :global(body.light-theme) .view-photo-btn:hover {
    background: #ffffff;
    border-color: #15803d;
  }

  .pos-top-left {
    position: absolute;
    top: 1rem;
    left: 1rem;
  }

  .pos-top-right {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .pos-relative {
    position: relative;
  }
</style>
