<script lang="ts">
  import { CircleHelp } from '@lucide/svelte';

  let {
    compact = false,
    analysisSource = 'gemini'
  }: {
    compact?: boolean;
    analysisSource?: 'gemini' | 'fallback';
  } = $props();

  let isOpen = $state(false);
  const panelId = `confidence-explainer-${Math.random().toString(36).slice(2, 9)}`;

  function togglePanel() {
    isOpen = !isOpen;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isOpen) {
      isOpen = false;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="confidence-explainer" class:compact>
  <button
    type="button"
    class="explainer-trigger"
    onclick={togglePanel}
    aria-expanded={isOpen}
    aria-controls={panelId}
  >
    <CircleHelp size={compact ? 14 : 15} strokeWidth={1.8} aria-hidden="true" />
    <span>{compact ? 'What does this mean?' : 'How is visual match calculated?'}</span>
  </button>

  {#if isOpen}
    <div id={panelId} class="explainer-panel" role="region" aria-label="Visual match explanation">
      <p>
        <strong>Visual match</strong> is how closely visible features in your photo resemble a known breed
        profile - not a DNA certainty score.
      </p>
      <ul>
        <li><strong>90%+</strong> - strong single-breed resemblance in the photo</li>
        <li><strong>70–89%</strong> - likely mix or partial match</li>
        <li><strong>Below 70%</strong> - uncertain or heavily mixed appearance</li>
      </ul>
      <p>
        Photo quality, angle, grooming, and mixed ancestry all affect the score. This is an
        educational estimate, not a genetic test.
      </p>
      {#if analysisSource === 'fallback'}
        <p class="fallback-note">
          This result used a local demo estimator, not live AI vision - treat the percentage as
          illustrative only.
        </p>
      {/if}
      <a href="/privacy#confidence-scores" class="privacy-link"
        >Read more in our data &amp; privacy guide</a
      >
    </div>
  {/if}
</div>

<style>
  .confidence-explainer {
    position: relative;
  }

  .explainer-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    border: 0;
    background: transparent;
    color: var(--text-subtle);
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;
  }

  .explainer-trigger:hover {
    color: var(--accent-primary);
  }

  .compact .explainer-trigger {
    font-size: 0.64rem;
  }

  .explainer-panel {
    margin-top: 0.65rem;
    padding: 0.85rem 0.95rem;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    background: var(--bg-surface);
    color: var(--text-muted);
    font-size: 0.78rem;
    line-height: 1.55;
  }

  .explainer-panel strong {
    color: var(--text-main);
  }

  .explainer-panel ul {
    margin: 0.55rem 0;
    padding-left: 1.1rem;
    display: grid;
    gap: 0.25rem;
  }

  .fallback-note {
    margin-top: 0.55rem;
    padding-top: 0.55rem;
    border-top: 1px solid var(--border-subtle);
    color: var(--warning);
  }

  .privacy-link {
    display: inline-block;
    margin-top: 0.55rem;
    color: var(--accent-primary);
    font-size: 0.72rem;
    font-weight: 700;
  }

  .privacy-link:hover {
    text-decoration: underline;
  }
</style>
