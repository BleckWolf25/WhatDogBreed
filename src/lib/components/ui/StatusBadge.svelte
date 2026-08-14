<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    label,
    variant = 'default',
    children
  }: {
    label?: string;
    variant?:
      'origin' | 'group' | 'pure' | 'mixed' | 'model' | 'gender' | 'ai' | 'demo' | 'default';
    children?: Snippet;
  } = $props();
</script>

<span class="status-badge variant-{variant}">
  {#if children}{@render children()}{/if}
  {#if label}<span>{label}</span>{/if}
</span>

<style>
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.22rem 0.48rem;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-muted);
    font-size: 0.7rem;
    font-weight: 700;
    line-height: 1.2;
  }

  .variant-origin,
  .variant-group,
  .variant-pure,
  .variant-mixed {
    color: var(--accent-primary);
    border-color: color-mix(in srgb, var(--accent-primary) 45%, var(--border-subtle));
  }
  .variant-model {
    color: var(--text-subtle);
  }
  .variant-gender {
    color: var(--text-main);
  }
  .variant-ai {
    color: var(--accent-primary);
    border-color: color-mix(in srgb, var(--accent-primary) 45%, var(--border-subtle));
    background: var(--accent-soft);
  }
  .variant-demo {
    color: var(--warning);
    border-color: color-mix(in srgb, var(--warning) 45%, var(--border-subtle));
    background: color-mix(in srgb, var(--warning) 8%, transparent);
  }
</style>
