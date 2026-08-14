<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowRight, X } from '@lucide/svelte';
  import { BREED_CATALOG_COUNT } from '$lib/data/dogBreeds';

  const STORAGE_KEY = 'whatdogbreed_onboarding_v1';

  const STEPS = [
    {
      id: 'scan',
      title: 'Scan a photo',
      body: 'Start here - upload or capture a dog photo for a visual breed estimate and care context.'
    },
    {
      id: 'history',
      title: 'History',
      body: 'Past scans stay on this device. Reopen results, set a My Dog profile, or share links.'
    },
    {
      id: 'catalog',
      title: 'Breed catalog',
      body: `Browse ${BREED_CATALOG_COUNT} reference profiles with temperament, grooming, and lifestyle fit notes.`
    },
    {
      id: 'compare',
      title: 'Compare breeds',
      body: 'Side-by-side stats when you are deciding between two candidates.'
    },
    {
      id: 'mixer',
      title: 'Breed mixer',
      body: 'Simulate what a mix might look like and read blended trait expectations.'
    }
  ] as const;

  let active = $state(false);
  let stepIndex = $state(0);
  let targetRect = $state<DOMRect | null>(null);

  const currentStep = $derived(STEPS[stepIndex] ?? STEPS[0]!);
  const isLastStep = $derived(stepIndex >= STEPS.length - 1);
  const cardTop = $derived(
    targetRect
      ? Math.min(
          targetRect.bottom + 14,
          (typeof window !== 'undefined' ? window.innerHeight : 800) - 220
        )
      : 0
  );
  const cardLeft = $derived(
    targetRect
      ? Math.min(
          Math.max(targetRect.left, 12),
          (typeof window !== 'undefined' ? window.innerWidth : 360) - 312
        )
      : 12
  );

  onMount(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = window.setTimeout(() => {
      active = true;
      updateTargetRect();
    }, 900);

    return () => window.clearTimeout(timer);
  });

  $effect(() => {
    if (!active) return;
    const _idx = stepIndex;
    void _idx;
    queueMicrotask(updateTargetRect);
  });

  function updateTargetRect() {
    const step = STEPS[stepIndex];
    if (!step) return;
    const el = document.querySelector(`[data-tour="${step.id}"]`);
    targetRect = el?.getBoundingClientRect() ?? null;
    el?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }

  function finish() {
    localStorage.setItem(STORAGE_KEY, '1');
    active = false;
    targetRect = null;
  }

  function handleNext() {
    if (isLastStep) {
      finish();
      return;
    }
    stepIndex += 1;
  }

  function handleSkip() {
    finish();
  }

  function handleResize() {
    if (active) updateTargetRect();
  }
</script>

<svelte:window onresize={handleResize} />

{#if active && targetRect && currentStep}
  <div class="tour-root" role="dialog" aria-modal="true" aria-labelledby="tour-title">
    <div class="tour-backdrop" aria-hidden="true"></div>

    <div
      class="tour-highlight"
      style:top="{targetRect.top - 6}px"
      style:left="{targetRect.left - 6}px"
      style:width="{targetRect.width + 12}px"
      style:height="{targetRect.height + 12}px"
    ></div>

    <div class="tour-card" style:top="{cardTop}px" style:left="{cardLeft}px">
      <div class="tour-card-head">
        <span class="tour-step">Step {stepIndex + 1} of {STEPS.length}</span>
        <button type="button" class="tour-close" onclick={handleSkip} aria-label="Skip tour">
          <X size={16} strokeWidth={1.8} />
        </button>
      </div>
      <h2 id="tour-title" class="tour-title">{currentStep.title}</h2>
      <p class="tour-body">{currentStep.body}</p>
      <div class="tour-actions">
        <button type="button" class="tour-skip" onclick={handleSkip}>Skip tour</button>
        <button type="button" class="tour-next" onclick={handleNext}>
          {isLastStep ? 'Got it' : 'Next'}
          {#if !isLastStep}
            <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .tour-root {
    position: fixed;
    inset: 0;
    z-index: 10000;
    pointer-events: none;
  }

  .tour-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(4, 8, 6, 0.55);
    pointer-events: auto;
  }

  .tour-highlight {
    position: fixed;
    border: 2px solid var(--accent-primary);
    border-radius: var(--radius-md);
    box-shadow: 0 0 0 9999px rgba(4, 8, 6, 0.55);
    pointer-events: none;
    z-index: 1;
  }

  .tour-card {
    position: fixed;
    width: min(calc(100vw - 24px), 300px);
    padding: 0.95rem 1rem 1rem;
    border: 1px solid var(--border-highlight);
    border-radius: var(--radius-md);
    background: var(--bg-card);
    box-shadow: var(--shadow-popover);
    pointer-events: auto;
    z-index: 2;
  }

  .tour-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.35rem;
  }

  .tour-step {
    color: var(--text-subtle);
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .tour-close {
    width: 28px;
    height: 28px;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    display: grid;
    place-items: center;
    color: var(--text-muted);
  }

  .tour-title {
    font-size: 1rem;
    font-weight: 800;
    line-height: 1.2;
  }

  .tour-body {
    margin-top: 0.45rem;
    font-size: 0.82rem;
    line-height: 1.55;
    color: var(--text-muted);
  }

  .tour-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 0.85rem;
  }

  .tour-skip,
  .tour-next {
    min-height: 34px;
    border-radius: var(--radius-sm);
    font-size: 0.74rem;
    font-weight: 700;
  }

  .tour-skip {
    padding: 0.45rem 0.55rem;
    border: none;
    background: transparent;
    color: var(--text-subtle);
  }

  .tour-next {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.45rem 0.75rem;
    border: 1px solid var(--accent-primary);
    background: var(--accent-primary);
    color: var(--text-inverse);
  }
</style>
