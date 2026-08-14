<script lang="ts">
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let {
    label,
    icon: Icon,
    val1,
    val2,
    val1Pill,
    val2Pill,
    iconClass
  }: {
    label: string;
    icon?: any;
    val1?: string | number;
    val2?: string | number;
    val1Pill?: string;
    val2Pill?: string;
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
    {#if val1Pill}
      <span class="matrix-pill">{val1Pill}</span>
    {:else}
      <span class="val-text">{val1 ?? '—'}</span>
    {/if}
  </div>
  <div class="matrix-cell val-cell" role="cell">
    {#if val2Pill}
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
    grid-template-columns: minmax(140px, 1.8fr) 1fr 1fr;
    align-items: center;
  }

  .matrix-cell {
    padding: 0.8rem 1rem;
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

  @media (max-width: 640px) {
    .matrix-cell {
      padding: 0.65rem 0.55rem;
    }

    .label-cell {
      font-size: 0.71rem;
    }

    .val-cell {
      font-size: 0.76rem;
    }
  }
</style>
