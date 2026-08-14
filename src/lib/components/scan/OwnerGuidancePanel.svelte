<script lang="ts">
  import {
    Baby,
    DollarSign,
    GraduationCap,
    HeartHandshake,
    HelpCircle,
    Scale,
    Stethoscope
  } from '@lucide/svelte';
  import type { OwnerGuidance } from '$lib/types/scan';
  import { unitSystemStore } from '$lib/stores/appState';
  import { BREED_CATALOG_COUNT } from '$lib/data/dogBreeds';
  import { formatMeasurementText } from '$lib/utils/unitConverter';

  let {
    guidance,
    isOffCatalog = false,
    breedLabel
  }: {
    guidance: OwnerGuidance;
    isOffCatalog?: boolean;
    breedLabel: string;
  } = $props();

  let unitSystem = $state<'Imperial' | 'Metric'>('Imperial');

  unitSystemStore.subscribe((value) => {
    unitSystem = value;
  });

  const formattedAdultSize = $derived(
    formatMeasurementText(
      guidance.estimatedAdultSize ??
        'Ask your vet to estimate adult size from current age, weight, and body frame.',
      unitSystem === 'Metric'
    )
  );
</script>

<section class="guidance-section" aria-labelledby="guidance-title">
  <div class="section-heading">
    <HelpCircle size={17} strokeWidth={1.8} aria-hidden="true" />
    <h2 id="guidance-title">Should I adopt this dog?</h2>
  </div>

  {#if isOffCatalog}
    <p class="off-catalog-note" role="note">
      <strong>{breedLabel}</strong> isn’t in our {BREED_CATALOG_COUNT}-breed catalog - the guidance
      below is tailored to this scan and general rescue best practices.
    </p>
  {/if}

  <p class="adopt-summary">{guidance.adoptabilitySummary}</p>

  <div class="guidance-grid">
    <article class="guidance-card">
      <h3><Stethoscope size={15} strokeWidth={1.8} aria-hidden="true" /> Health watchlist</h3>
      <p class="card-note">Educational only - not a diagnosis. Discuss with your vet.</p>
      <ul>
        {#each guidance.healthWatchlist as item}
          <li>{item}</li>
        {/each}
      </ul>
    </article>

    <article class="guidance-card">
      <h3><Scale size={15} strokeWidth={1.8} aria-hidden="true" /> Expected adult size</h3>
      <p>{formattedAdultSize}</p>
    </article>

    <article class="guidance-card">
      <h3><Baby size={15} strokeWidth={1.8} aria-hidden="true" /> Puppy vs adult</h3>
      <dl>
        <div>
          <dt>Puppy</dt>
          <dd>{guidance.lifeStageNotes.puppy}</dd>
        </div>
        <div>
          <dt>Adult</dt>
          <dd>{guidance.lifeStageNotes.adult}</dd>
        </div>
      </dl>
    </article>

    <article class="guidance-card">
      <h3><GraduationCap size={15} strokeWidth={1.8} aria-hidden="true" /> Training tips</h3>
      <ul>
        {#each guidance.trainingTips as tip}
          <li>{tip}</li>
        {/each}
      </ul>
    </article>

    <article class="guidance-card">
      <h3><DollarSign size={15} strokeWidth={1.8} aria-hidden="true" /> Cost of ownership</h3>
      <dl class="cost-list">
        <div>
          <dt>Monthly</dt>
          <dd>{guidance.ownershipCosts.monthlyEstimate}</dd>
        </div>
        <div>
          <dt>Initial setup</dt>
          <dd>{guidance.ownershipCosts.initialSetup}</dd>
        </div>
      </dl>
      <p class="cost-note">{guidance.ownershipCosts.notes}</p>
    </article>

    <article class="guidance-card full-width">
      <h3>
        <HeartHandshake size={15} strokeWidth={1.8} aria-hidden="true" /> Just adopted from a shelter?
      </h3>
      <p>{guidance.adoptionContext}</p>
    </article>
  </div>
</section>

<style>
  .guidance-section {
    padding: 1.45rem 0;
    border-bottom: 1px solid var(--border-subtle);
  }

  .section-heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.85rem;
    color: var(--accent-primary);
  }

  .section-heading h2 {
    font-size: 1.05rem;
    font-weight: 800;
  }

  .off-catalog-note {
    margin-bottom: 0.75rem;
    padding: 0.65rem 0.75rem;
    border: 1px solid var(--border-highlight);
    border-radius: var(--radius-sm);
    background: var(--accent-soft);
    font-size: 0.8rem;
    line-height: 1.55;
    color: var(--text-muted);
  }

  .off-catalog-note strong {
    color: var(--text-main);
  }

  .adopt-summary {
    max-width: 68ch;
    margin-bottom: 1.1rem;
    font-size: 0.9rem;
    line-height: 1.65;
    color: var(--text-main);
  }

  .guidance-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .guidance-card {
    padding: 0.9rem;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    background: var(--bg-card);
  }

  .guidance-card.full-width {
    grid-column: 1 / -1;
  }

  .guidance-card h3 {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-bottom: 0.5rem;
    font-size: 0.78rem;
    font-weight: 800;
    color: var(--text-main);
  }

  .card-note {
    margin-bottom: 0.45rem;
    font-size: 0.68rem;
    color: var(--text-subtle);
  }

  .guidance-card p,
  .guidance-card dd {
    font-size: 0.82rem;
    line-height: 1.6;
    color: var(--text-muted);
  }

  .guidance-card ul {
    list-style: none;
    display: grid;
    gap: 0.35rem;
  }

  .guidance-card li {
    padding-left: 0.85rem;
    position: relative;
    font-size: 0.8rem;
    line-height: 1.5;
    color: var(--text-muted);
  }

  .guidance-card li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.55rem;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent-primary);
  }

  .guidance-card dl {
    display: grid;
    gap: 0.65rem;
  }

  .guidance-card dt {
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--accent-primary);
  }

  .cost-list {
    margin-bottom: 0.5rem;
  }

  .cost-note {
    font-size: 0.78rem;
    color: var(--text-subtle);
  }

  @media (max-width: 720px) {
    .guidance-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
