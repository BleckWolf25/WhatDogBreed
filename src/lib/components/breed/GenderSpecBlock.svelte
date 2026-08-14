<script lang="ts">
  import type { BreedStats } from '$lib/types/scan';
  import { formatHeightRange, formatWeightRange } from '$lib/utils/unitConverter';

  let {
    breed,
    unitSystem = 'Imperial'
  }: {
    breed: BreedStats;
    unitSystem?: 'Imperial' | 'Metric';
  } = $props();

  const isMetric = $derived(unitSystem === 'Metric');
</script>

<section class="gender-specs-grid" aria-label="Physical specifications">
  <div class="spec-col">
    <h3>Male specifications <span>({isMetric ? 'metric' : 'US'})</span></h3>
    <div class="spec-row">
      <span>Weight</span><strong>{formatWeightRange(breed.maleWeightRange, isMetric)}</strong>
    </div>
    <div class="spec-row">
      <span>Height</span><strong>{formatHeightRange(breed.maleHeightRange, isMetric)}</strong>
    </div>
  </div>
  <div class="spec-col">
    <h3>Female specifications <span>({isMetric ? 'metric' : 'US'})</span></h3>
    <div class="spec-row">
      <span>Weight</span><strong>{formatWeightRange(breed.femaleWeightRange, isMetric)}</strong>
    </div>
    <div class="spec-row">
      <span>Height</span><strong>{formatHeightRange(breed.femaleHeightRange, isMetric)}</strong>
    </div>
  </div>
</section>

<style>
  .gender-specs-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
    margin-bottom: 1.25rem;
    padding: 1.2rem 0;
    border-top: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
  }

  .spec-col {
    display: grid;
    gap: 0.45rem;
  }

  .spec-col + .spec-col {
    padding-left: 1.25rem;
    border-left: 1px solid var(--border-subtle);
  }

  .spec-col h3 {
    margin-bottom: 0.25rem;
    color: var(--accent-primary);
    font-size: 0.78rem;
    font-weight: 800;
  }

  .spec-col h3 span {
    color: var(--text-subtle);
    font-size: 0.68rem;
    font-weight: 500;
  }

  .spec-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.8rem;
  }

  .spec-row span {
    color: var(--text-muted);
  }
  .spec-row strong {
    color: var(--text-main);
    font-weight: 700;
    text-align: right;
  }

  @media (max-width: 620px) {
    .gender-specs-grid {
      grid-template-columns: 1fr;
    }
    .spec-col + .spec-col {
      padding-left: 0;
      border-left: 0;
      padding-top: 1rem;
      border-top: 1px solid var(--border-subtle);
    }
  }
</style>
