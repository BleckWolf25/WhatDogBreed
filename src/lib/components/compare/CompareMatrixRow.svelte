<script lang="ts">
  import RatingDots from '$lib/components/ui/RatingDots.svelte';

  /* eslint-disable @typescript-eslint/no-explicit-any */
  let {
    label,
    icon: Icon,
    val1,
    val2,
    val1Pill,
    val2Pill,
    rating1,
    rating2,
    iconClass
  }: {
    label: string;
    icon?: any;
    val1?: string | number;
    val2?: string | number;
    val1Pill?: string;
    val2Pill?: string;
    rating1?: number;
    rating2?: number;
    iconClass?: string;
  } = $props();
</script>

<div class="matrix-grid data-row" role="row">
  <div class="matrix-cell label-cell" role="rowheader">
    {#if Icon}<Icon
        size={15}
        strokeWidth={1.8}
        class={`icon ${iconClass || ''}`}
        aria-hidden="true"
      />{/if}
    <span>{label}</span>
  </div>
  <div class="matrix-cell val-cell" role="cell">
    {#if rating1 !== undefined}
      <RatingDots value={rating1} />
    {:else if val1Pill}
      <span class="matrix-pill">{val1Pill}</span>
    {:else}
      <span class="val-text">{val1 ?? '—'}</span>
    {/if}
  </div>
  <div class="matrix-cell val-cell" role="cell">
    {#if rating2 !== undefined}
      <RatingDots value={rating2} />
    {:else if val2Pill}
      <span class="matrix-pill">{val2Pill}</span>
    {:else}
      <span class="val-text">{val2 ?? '—'}</span>
    {/if}
  </div>
</div>

<style>
  .data-row {
    border-bottom: 1px solid var(--border-subtle);
    background: var(--bg-card);
    transition: background-color 160ms ease;
  }

  .data-row:hover {
    background: var(--bg-card-hover);
  }

  .matrix-grid {
    display: grid;
    grid-template-columns: 220px 1fr 1fr;
    align-items: center;
  }

  .matrix-cell {
    padding: 0.85rem 1.15rem;
    min-width: 0;
  }

  .label-cell {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    color: var(--text-muted);
    font-size: 0.78rem;
    font-weight: 700;
  }

  .label-cell :global(.icon) {
    flex-shrink: 0;
  }

  :global(.icon.energy) {
    color: var(--warning);
  }
  :global(.icon.strength) {
    color: #c97a5a;
  }
  :global(.icon.grooming) {
    color: var(--info);
  }
  :global(.icon.train) {
    color: var(--accent-primary);
  }
  :global(.icon.bark) {
    color: #d693b1;
  }

  .val-cell {
    font-size: 0.84rem;
    font-weight: 600;
    color: var(--text-main);
  }

  .val-text {
    word-break: break-word;
  }

  .matrix-pill {
    display: inline-flex;
    padding: 0.18rem 0.5rem;
    border-radius: var(--radius-sm);
    background: var(--accent-soft);
    color: var(--accent-primary);
    font-size: 0.73rem;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    .matrix-grid {
      grid-template-columns: 160px 1fr 1fr;
    }

    .matrix-cell {
      padding: 0.75rem 0.85rem;
    }

    .label-cell {
      font-size: 0.74rem;
    }

    .val-cell {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 560px) {
    .matrix-grid {
      grid-template-columns: 110px 1fr 1fr;
    }

    .matrix-cell {
      padding: 0.6rem 0.45rem;
    }

    .label-cell {
      font-size: 0.71rem;
      gap: 0.3rem;
      line-height: 1.25;
    }

    .val-cell {
      font-size: 0.74rem;
    }

    .matrix-pill {
      font-size: 0.68rem;
      padding: 0.15rem 0.35rem;
    }
  }
</style>
