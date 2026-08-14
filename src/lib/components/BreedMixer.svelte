<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { Camera, Dumbbell, GraduationCap, Plus, Scale, Scissors, Zap } from '@lucide/svelte';
  import { loadDogBreeds, simulateBreedMix } from '$lib/data/dogBreeds';
  import type { BreedStats } from '$lib/types/scan';
  import { unitSystemStore } from '$lib/stores/appState';
  import { formatMixExpectedSize } from '$lib/utils/unitConverter';
  import RatingDots from '$lib/components/ui/RatingDots.svelte';
  import LifestyleGrid from '$lib/components/ui/LifestyleGrid.svelte';
  import GenderBehaviorBlock from '$lib/components/breed/GenderBehaviorBlock.svelte';

  let {
    initialParentA,
    initialParentB,
    onScanPhotoRedirect
  }: {
    initialParentA?: BreedStats;
    initialParentB?: BreedStats;
    onScanPhotoRedirect?: () => void;
  } = $props();

  let breeds = $state<BreedStats[]>([]);
  let isLoading = $state(true);
  let parentA = $state<BreedStats | null>(null);
  let parentB = $state<BreedStats | null>(null);
  let unitSystem = $state<'Imperial' | 'Metric'>('Imperial');

  unitSystemStore.subscribe((value) => {
    unitSystem = value;
  });

  onMount(async () => {
    breeds = await loadDogBreeds();
    parentA = untrack(() => initialParentA) || breeds[0] || null;
    parentB = untrack(() => initialParentB) || breeds[1] || breeds[0] || null;
    isLoading = false;
  });

  $effect(() => {
    if (initialParentA) parentA = initialParentA;
  });

  $effect(() => {
    if (initialParentB) parentB = initialParentB;
  });

  let mixOutcome = $derived.by(() => {
    if (!parentA || !parentB) return null;
    return simulateBreedMix(parentA, parentB);
  });

  const isMetric = $derived(unitSystem === 'Metric');

  const expectedSizeLabel = $derived.by(() => {
    if (!parentA || !parentB) return '';
    return formatMixExpectedSize(parentA, parentB, isMetric);
  });
</script>

<section class="mixer-section" aria-labelledby="mixer-title">
  <div class="page-intro">
    <span class="eyebrow">Simulation tool</span>
    <h1 id="mixer-title" class="page-title">Explore a possible mix.</h1>
    <p class="page-description">
      Combine two catalog breeds to explore a predicted size, energy, temperament, and everyday
      compatibility profile. This is a playful estimate, not a genetic result.
    </p>
  </div>

  {#if isLoading}
    <div class="loading-state" aria-live="polite">Loading the breed library…</div>
  {:else if parentA && parentB && mixOutcome}
    <div class="parents-selection-grid">
      <div class="parent-card">
        <div class="parent-card-heading">
          <span class="eyebrow">Parent A</span><span>{parentA.group}</span>
        </div>
        <label class="sr-only" for="parent-a">Choose parent breed A</label>
        <select id="parent-a" bind:value={parentA} class="breed-select">
          {#each breeds as breed}<option value={breed}>{breed.name}</option>{/each}
        </select>
        <div class="parent-preview">
          <img src={parentA.imageUrl} alt={parentA.name} loading="lazy" decoding="async" />
          <h2>{parentA.name}</h2>
          <p>{parentA.description}</p>
        </div>
      </div>

      <div class="plus-divider" aria-hidden="true"><Plus size={20} strokeWidth={1.8} /></div>

      <div class="parent-card">
        <div class="parent-card-heading">
          <span class="eyebrow">Parent B</span><span>{parentB.group}</span>
        </div>
        <label class="sr-only" for="parent-b">Choose parent breed B</label>
        <select id="parent-b" bind:value={parentB} class="breed-select">
          {#each breeds as breed}<option value={breed}>{breed.name}</option>{/each}
        </select>
        <div class="parent-preview">
          <img src={parentB.imageUrl} alt={parentB.name} loading="lazy" decoding="async" />
          <h2>{parentB.name}</h2>
          <p>{parentB.description}</p>
        </div>
      </div>
    </div>

    <section class="outcome-card" aria-labelledby="outcome-title">
      <div class="outcome-header">
        <span class="eyebrow">Predicted outcome</span>
        <h2 id="outcome-title">{mixOutcome.name}</h2>
        <p>{mixOutcome.description}</p>
      </div>

      <div class="outcome-stats-grid" aria-label="Predicted mix metrics">
        <div class="stat-row energy-stat">
          <span><Zap size={15} aria-hidden="true" /> Energy</span><RatingDots
            value={mixOutcome.energyLevel}
          />
        </div>
        <div class="stat-row strength-stat">
          <span><Dumbbell size={15} aria-hidden="true" /> Strength</span><RatingDots
            value={mixOutcome.strength}
          />
        </div>
        <div class="stat-row grooming-stat">
          <span><Scissors size={15} aria-hidden="true" /> Grooming</span><RatingDots
            value={mixOutcome.groomingNeeds}
          />
        </div>
        <div class="stat-row train-stat">
          <span><GraduationCap size={15} aria-hidden="true" /> Trainability</span><RatingDots
            value={mixOutcome.trainability}
          />
        </div>
        <div class="stat-row">
          <span><Scale size={15} aria-hidden="true" /> Expected size</span><strong
            >{expectedSizeLabel}</strong
          >
        </div>
      </div>

      <section class="outcome-block" aria-labelledby="lifestyle-title">
        <h3 id="lifestyle-title">Everyday compatibility</h3>
        <LifestyleGrid breed={mixOutcome} />
      </section>

      <section class="outcome-block" aria-labelledby="traits-title">
        <h3 id="traits-title">Inherited traits to look for</h3>
        <div class="traits-list">
          {#each mixOutcome.temperament as trait}<span>{trait}</span>{/each}
        </div>
      </section>

      <GenderBehaviorBlock
        summary={mixOutcome.genderBehaviorSummary}
        maleTraits={mixOutcome.maleBehavioralTraits}
        femaleTraits={mixOutcome.femaleBehavioralTraits}
      />

      {#if onScanPhotoRedirect}
        <div class="mixer-scan-banner">
          <div>
            <h3>Have a real photo of this mix?</h3>
            <p>Use the scanner for a visual breed estimate from your dog’s actual features.</p>
          </div>
          <button class="button button-primary" type="button" onclick={onScanPhotoRedirect}
            ><Camera size={16} strokeWidth={1.8} /> Scan a real photo</button
          >
        </div>
      {/if}
    </section>
  {/if}
</section>

<style>
  .mixer-section {
    width: min(100% - 2rem, 1040px);
    margin: 0 auto;
    padding: 3.5rem 0 5rem;
  }
  .page-intro {
    max-width: 720px;
    margin-bottom: 2.2rem;
  }
  .loading-state {
    padding: 4rem 1rem;
    border-top: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
    color: var(--text-muted);
    text-align: center;
  }

  .parents-selection-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 56px minmax(0, 1fr);
    align-items: center;
    gap: 1.1rem;
  }
  .parent-card {
    min-width: 0;
    padding: 1.2rem;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    background: var(--bg-card);
  }
  .parent-card:hover {
    border-color: var(--border-highlight);
  }
  .parent-card-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.75rem;
    color: var(--text-subtle);
    font-size: 0.72rem;
  }
  .breed-select {
    width: 100%;
    min-height: 42px;
    padding: 0.55rem 0.7rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: var(--bg-surface);
    color: var(--text-main);
    font-size: 0.8rem;
    font-weight: 700;
  }
  .parent-preview {
    display: grid;
    grid-template-columns: 84px 1fr;
    gap: 0.75rem;
    align-items: start;
    margin-top: 1rem;
  }
  .parent-preview img {
    width: 84px;
    height: 84px;
    border-radius: var(--radius-md);
    object-fit: cover;
  }
  .parent-preview h2 {
    font-size: 1.1rem;
    line-height: 1.1;
  }
  .parent-preview p {
    grid-column: 1 / -1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    font-size: 0.76rem;
    line-height: 1.5;
  }
  .plus-divider {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border: 1px solid var(--border-highlight);
    border-radius: 50%;
    background: var(--accent-soft);
    color: var(--accent-primary);
  }

  .outcome-card {
    margin-top: 1rem;
    padding: clamp(1.2rem, 3vw, 2rem);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    background: var(--bg-card);
  }
  .outcome-header {
    padding-bottom: 1.3rem;
    border-bottom: 1px solid var(--border-subtle);
  }
  .outcome-header h2 {
    margin-top: 0.45rem;
    font-size: clamp(1.7rem, 4vw, 2.7rem);
    line-height: 1.05;
  }
  .outcome-header p {
    max-width: 72ch;
    margin-top: 0.65rem;
    font-size: 0.86rem;
    line-height: 1.6;
  }
  .outcome-stats-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid var(--border-subtle);
  }
  .stat-row {
    min-width: 0;
    display: grid;
    gap: 0.55rem;
    padding-right: 1rem;
    border-right: 1px solid var(--border-subtle);
    color: var(--text-muted);
    font-size: 0.74rem;
  }
  .stat-row:last-child {
    border-right: 0;
    padding-right: 0;
  }
  .stat-row > span {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
  .energy-stat :global(svg) {
    color: var(--warning);
  }
  .strength-stat :global(svg) {
    color: #c97a5a;
  }
  .grooming-stat :global(svg) {
    color: var(--info);
  }
  .train-stat :global(svg) {
    color: var(--accent-primary);
  }
  .stat-row strong {
    color: var(--text-main);
    font-size: 0.75rem;
    line-height: 1.35;
  }
  .outcome-block {
    padding: 1.35rem 0;
    border-bottom: 1px solid var(--border-subtle);
  }
  .outcome-block h3 {
    margin-bottom: 0.85rem;
    font-size: 1rem;
  }
  .traits-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }
  .traits-list span {
    padding: 0.38rem 0.55rem;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    font-size: 0.75rem;
  }
  .mixer-scan-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1.3rem;
    border-top: 1px solid var(--border-subtle);
  }
  .mixer-scan-banner h3 {
    font-size: 1rem;
  }
  .mixer-scan-banner p {
    margin-top: 0.25rem;
    font-size: 0.78rem;
  }
  .button {
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.55rem 0.8rem;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    font-size: 0.76rem;
    font-weight: 700;
  }
  .button-primary {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: var(--text-inverse);
  }
  .button-primary:hover {
    background: var(--accent-strong);
    border-color: var(--accent-strong);
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  @media (max-width: 760px) {
    .parents-selection-grid {
      grid-template-columns: 1fr;
    }
    .plus-divider {
      margin: 0 auto;
    }
    .outcome-stats-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .stat-row:nth-child(2) {
      border-right: 0;
      padding-right: 0;
    }
  }
  @media (max-width: 520px) {
    .mixer-section {
      width: min(100% - 1.25rem, 1040px);
      padding-top: 2.25rem;
    }
    .outcome-stats-grid {
      grid-template-columns: 1fr;
    }
    .stat-row,
    .stat-row:nth-child(2) {
      padding: 0 0 0.8rem;
      border-right: 0;
      border-bottom: 1px solid var(--border-subtle);
    }
    .stat-row:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }
    .mixer-scan-banner {
      align-items: stretch;
      flex-direction: column;
    }
  }
</style>
