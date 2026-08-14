<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from '$app/state';
  import BreedCompare from '$lib/components/BreedCompare.svelte';
  import type { BreedStats } from '$lib/types/scan';
  import { loadDogBreeds } from '$lib/data/dogBreeds';
  import { findBreedByName } from '$lib/utils/breedMatcher';
  import { selectedCompareBreedStore } from '$lib/stores/appState';

  let initialBreedA = $state<BreedStats | null>(null);
  let initialBreedB = $state<BreedStats | null>(null);

  onMount(async () => {
    const breeds = await loadDogBreeds();
    const paramA = page.url.searchParams.get('a');
    const paramB = page.url.searchParams.get('b');

    if (paramA) {
      initialBreedA = breeds.find((b) => b.id === paramA) ?? findBreedByName(breeds, paramA);
    }
    if (paramB) {
      initialBreedB = breeds.find((b) => b.id === paramB) ?? findBreedByName(breeds, paramB);
    }

    if (!paramA || !paramB) {
      const fromStore = get(selectedCompareBreedStore);
      if (!paramA && fromStore.a) initialBreedA = fromStore.a;
      if (!paramB && fromStore.b) initialBreedB = fromStore.b;
      selectedCompareBreedStore.set({ a: null, b: null });
    }
  });
</script>

<svelte:head>
  <title>Compare Breeds - What Dog Breed?</title>
  <meta
    name="description"
    content="Side-by-side comparison of dog breeds across energy, grooming, trainability, and lifestyle compatibility."
  />
</svelte:head>

<BreedCompare {initialBreedA} {initialBreedB} />
