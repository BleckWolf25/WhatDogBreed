<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import BreedEncyclopedia from '$lib/components/BreedEncyclopedia.svelte';
  import type { BreedStats } from '$lib/types/scan';
  import { loadDogBreeds } from '$lib/data/dogBreeds';
  import { findBreedByName } from '$lib/utils/breedMatcher';
  import { selectedMixBreedStore, selectedEncyclopediaBreedStore } from '$lib/stores/appState';

  let initialBreed = $state<BreedStats | null>(null);

  onMount(async () => {
    const breedParam = page.url.searchParams.get('breed');
    if (breedParam) {
      const breeds = await loadDogBreeds();
      initialBreed = breeds.find((b) => b.id === breedParam) ?? findBreedByName(breeds, breedParam);
    } else {
      const fromStore = get(selectedEncyclopediaBreedStore);
      if (fromStore) {
        initialBreed = fromStore;
        selectedEncyclopediaBreedStore.set(null);
      }
    }
  });

  function handleSelectForMix(breed: BreedStats) {
    selectedMixBreedStore.set(breed);
    void goto('/mixer');
  }
</script>

<svelte:head>
  <title>Breed Catalog - What Dog Breed?</title>
  <meta
    name="description"
    content="Browse our breed library with deep profiles, health watchlists, and adoption decision support. Includes every FCI German breed standard plus international favorites."
  />
</svelte:head>

<BreedEncyclopedia {initialBreed} onSelectForMix={handleSelectForMix} />
