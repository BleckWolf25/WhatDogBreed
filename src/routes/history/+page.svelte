<script lang="ts">
  import { goto } from '$app/navigation';
  import ScanHistory from '$lib/components/ScanHistory.svelte';
  import type { ScanResult } from '$lib/types/scan';
  import { activeScanResultStore } from '$lib/stores/appState';
  import { getScanImage } from '$lib/services/scanImageStorage';

  type HistoryEntry = Omit<ScanResult, 'imageUrl'>;

  async function handleReopenScan(scan: HistoryEntry) {
    const imageUrl = (await getScanImage(scan.id)) ?? scan.thumbnailUrl;
    activeScanResultStore.set({ ...scan, imageUrl });
    await goto('/scanner');
  }

  function handleStartScan() {
    activeScanResultStore.set(null);
    void goto('/scanner');
  }
</script>

<svelte:head>
  <title>Scan History - What Dog Breed?</title>
  <meta
    name="description"
    content="Review past dog breed scan results saved locally on your device."
  />
</svelte:head>

<ScanHistory onReopenScan={handleReopenScan} onStartScan={handleStartScan} />
