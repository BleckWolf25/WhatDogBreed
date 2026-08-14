<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import BreedMixer from '$lib/components/BreedMixer.svelte';
  import type { BreedStats } from '$lib/types/scan';
  import { loadDogBreeds } from '$lib/data/dogBreeds';
  import { findBreedByName } from '$lib/utils/breedMatcher';
  import { selectedMixBreedStore, selectedMixBreedBStore } from '$lib/stores/appState';

  let selectedMixBreedA = $state<BreedStats | null>(null);
  let selectedMixBreedB = $state<BreedStats | null>(null);

  onMount(async () => {
    const breeds = await loadDogBreeds();
    const paramA = page.url.searchParams.get('a');
    const paramB = page.url.searchParams.get('b');

    if (paramA) {
      selectedMixBreedA = breeds.find((b) => b.id === paramA) ?? findBreedByName(breeds, paramA);
    } else {
      selectedMixBreedA = get(selectedMixBreedStore);
      selectedMixBreedStore.set(null);
    }

    if (paramB) {
      selectedMixBreedB = breeds.find((b) => b.id === paramB) ?? findBreedByName(breeds, paramB);
    } else {
      selectedMixBreedB = get(selectedMixBreedBStore);
      selectedMixBreedBStore.set(null);
    }
  });

  function handleScanPhotoRedirect() {
    void goto('/scanner');
  }
</script>

<svelte:head>
  <title>Breed Mixer - What Dog Breed?</title>
  <meta
    name="description"
    content="Explore a predicted mix of two dog breeds and compare everyday traits."
  />
</svelte:head>

<BreedMixer
  initialParentA={selectedMixBreedA || undefined}
  initialParentB={selectedMixBreedB || undefined}
  onScanPhotoRedirect={handleScanPhotoRedirect}
/>
