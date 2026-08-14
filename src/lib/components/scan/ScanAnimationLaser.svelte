<script lang="ts">
  import { LoaderCircle, ShieldAlert } from '@lucide/svelte';

  let { imagePreviewUrl }: { imagePreviewUrl: string } = $props();
</script>

<div class="loading-container" aria-live="polite">
  <div class="loading-preview">
    <img
      src={imagePreviewUrl}
      alt="Selected dog being analyzed"
      class="scanning-img"
      loading="lazy"
      decoding="async"
    />
    <div class="loading-overlay">
      <LoaderCircle class="loading-spinner" size={22} strokeWidth={1.8} aria-hidden="true" />
    </div>
  </div>
  <div class="loading-status">
    <div class="loading-title-row">
      <div>
        <span class="eyebrow">Photo analysis</span>
        <h2>Analyzing your photo…</h2>
      </div>
    </div>
    <p class="scan-step-msg">We're comparing visible features with the breed library.</p>
    <p class="scan-confidence-note">
      Confidence reflects visual similarity to known breeds - not DNA certainty.
    </p>
    <p class="scan-disclaimer-note">
      <ShieldAlert size={14} strokeWidth={1.8} aria-hidden="true" />
      <span>This is an estimate from appearance, not a DNA test.</span>
    </p>
  </div>
</div>

<style>
  .loading-container {
    width: min(100%, 720px);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 180px 1fr;
    align-items: center;
    gap: 1.5rem;
  }

  .loading-preview {
    position: relative;
    height: 180px;
    overflow: hidden;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--bg-surface);
  }

  .scanning-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.86);
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: rgba(8, 15, 10, 0.4);
    color: var(--accent-primary);
  }

  :global(.loading-spinner) {
    animation: spin 900ms linear infinite;
  }

  .loading-title-row h2 {
    margin-top: 0.45rem;
    font-size: 1.55rem;
    line-height: 1.1;
  }

  .scan-step-msg {
    margin-top: 0.7rem;
    font-size: 0.88rem;
  }

  .scan-confidence-note {
    margin-top: 0.45rem;
    font-size: 0.75rem;
    color: var(--text-subtle);
  }

  .scan-disclaimer-note {
    display: flex;
    align-items: flex-start;
    gap: 0.4rem;
    margin-top: 1rem;
    font-size: 0.75rem;
    line-height: 1.45;
    color: var(--text-subtle);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 560px) {
    .loading-container {
      grid-template-columns: 1fr;
    }

    .loading-preview {
      width: min(100%, 220px);
      height: 220px;
      margin: 0 auto;
    }
  }
</style>
