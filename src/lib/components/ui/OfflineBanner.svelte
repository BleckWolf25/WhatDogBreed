<script lang="ts">
  import { WifiOff } from '@lucide/svelte';
  import { onMount } from 'svelte';

  let isOffline = $state(false);

  onMount(() => {
    isOffline = !navigator.onLine;

    const goOffline = () => (isOffline = true);
    const goOnline = () => (isOffline = false);

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);

    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  });
</script>

{#if isOffline}
  <div class="offline-banner" role="status" aria-live="polite">
    <WifiOff size={16} strokeWidth={1.8} aria-hidden="true" />
    <span
      >You’re offline. Breed scans need a connection, but cached pages like the catalog may still
      work.</span
    >
  </div>
{/if}

<style>
  .offline-banner {
    display: flex;
    align-items: flex-start;
    gap: 0.55rem;
    padding: 0.65rem 1rem;
    border-bottom: 1px solid color-mix(in srgb, var(--warning) 40%, var(--border-subtle));
    background: color-mix(in srgb, var(--warning) 10%, var(--bg-surface));
    color: var(--text-main);
    font-size: 0.78rem;
    line-height: 1.45;
  }
</style>
