<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import Scanner from '$lib/components/Scanner.svelte';
  import ScanResultCard from '$lib/components/ScanResultCard.svelte';
  import type { ScanResult } from '$lib/types/scan';
  import { activeScanResultStore } from '$lib/stores/appState';
  import { parseShareParamFromUrl } from '$lib/services/shareUrl';

  let activeScanResult = $state<ScanResult | null>(null);

  activeScanResultStore.subscribe((val) => {
    activeScanResult = val;
  });

  onMount(() => {
    if (!activeScanResult) {
      const shared = parseShareParamFromUrl(page.url.searchParams);
      if (shared) {
        activeScanResultStore.set(shared);
      }
    }
  });

  function handleScanComplete(result: ScanResult) {
    activeScanResultStore.set(result);
  }

  function handleResetScan() {
    activeScanResultStore.set(null);
  }
</script>

<svelte:head>
  <title>Scan Photo - What Dog Breed?</title>
  <meta
    name="description"
    content="Upload a dog photo for an estimated visual breed mix, recognizable traits, and practical care context."
  />
</svelte:head>

{#if activeScanResult}
  <ScanResultCard result={activeScanResult} onResetScan={handleResetScan} />
{:else}
  <Scanner onScanComplete={handleScanComplete} />
{/if}
