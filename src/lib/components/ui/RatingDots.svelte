<script lang="ts">
  let { value, max = 5 }: { value: number; max?: number } = $props();
</script>

<div class="rating-dots" role="img" aria-label={`Rating ${value} out of ${max}`}>
  {#each Array(max) as _, index}
    <span class:filled={index < value} class="dot" aria-hidden="true"></span>
  {/each}
  <span class="rating-text">{value}/{max}</span>
</div>

<style>
  .rating-dots {
    display: inline-flex;
    align-items: center;
    gap: 0.28rem;
    white-space: nowrap;
    flex-wrap: nowrap;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--text-main) 16%, transparent);
    flex-shrink: 0;
  }

  .dot.filled {
    background: var(--accent-primary);
  }

  .rating-text {
    margin-left: 0.25rem;
    color: var(--text-muted);
    font-size: 0.72rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .rating-dots {
      gap: 0.18rem;
    }

    .dot {
      width: 6.5px;
      height: 6.5px;
    }

    .rating-text {
      margin-left: 0.18rem;
      font-size: 0.68rem;
    }
  }
</style>
