<script lang="ts">
  import { Eye } from '@lucide/svelte';
  import type { BreedMixItem } from '$lib/types/scan';

  let { mixBreakdown }: { mixBreakdown: BreedMixItem[] } = $props();
</script>

<section class="report-section" aria-labelledby="ancestry-title">
  <div class="section-heading">
    <Eye size={17} strokeWidth={1.8} aria-hidden="true" />
    <h2 id="ancestry-title">Estimated breed mix</h2>
  </div>
  <div class="breakdown-list">
    {#each mixBreakdown as item}
      <div class="breakdown-item">
        <div class="breakdown-info">
          <span>{item.breed}</span>
          <strong>{item.percentage}%</strong>
        </div>
        <div class="progress-bar-bg">
          <div
            class="progress-bar-fill"
            style={`width: ${item.percentage}%`}
            role="progressbar"
            aria-label={`${item.breed} estimated contribution`}
            aria-valuenow={item.percentage}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  .report-section {
    padding: 1.45rem 0;
    border-bottom: 1px solid var(--border-subtle);
  }

  .section-heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    color: var(--accent-primary);
  }

  .section-heading h2 {
    font-size: 1.05rem;
    font-weight: 800;
  }

  .breakdown-list {
    display: grid;
    gap: 1rem;
  }

  .breakdown-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.38rem;
    color: var(--text-main);
    font-size: 0.85rem;
  }

  .breakdown-info strong {
    color: var(--accent-primary);
    font-size: 0.8rem;
  }

  .progress-bar-bg {
    height: 7px;
    overflow: hidden;
    border-radius: 999px;
    background: color-mix(in srgb, var(--text-main) 10%, transparent);
  }

  .progress-bar-fill {
    height: 100%;
    border-radius: inherit;
    background: var(--accent-primary);
    transition: width 420ms ease-out;
  }
</style>
