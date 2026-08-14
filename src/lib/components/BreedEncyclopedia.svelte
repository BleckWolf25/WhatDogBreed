<script lang="ts">
  import { onMount } from 'svelte';
  import { RotateCcw, Search } from '@lucide/svelte';
  import { loadDogBreeds } from '$lib/data/dogBreeds';
  import type { BreedStats } from '$lib/types/scan';
  import { unitSystemStore } from '$lib/stores/appState';
  import BreedCard from '$lib/components/breed/BreedCard.svelte';
  import BreedDetailModal from '$lib/components/breed/BreedDetailModal.svelte';

  let {
    onSelectForMix,
    initialBreed
  }: { onSelectForMix?: (breed: BreedStats) => void; initialBreed?: BreedStats | null } = $props();

  let allBreeds = $state<BreedStats[]>([]);
  let isLoading = $state(true);
  let searchQuery = $state('');
  let selectedGroup = $state('All');
  let selectedBreedModal = $state<BreedStats | null>(null);
  let unitSystem = $state<'Imperial' | 'Metric'>('Imperial');

  const BREED_GROUPS = [
    'All',
    'Herding',
    'Sporting',
    'Hound',
    'Working',
    'Non-Sporting',
    'Toy',
    'Terrier'
  ];

  onMount(async () => {
    allBreeds = await loadDogBreeds();
    isLoading = false;
    if (initialBreed) {
      selectedBreedModal = initialBreed;
    }
  });

  unitSystemStore.subscribe((value) => {
    unitSystem = value;
  });

  let filteredBreeds = $derived.by(() => {
    const normalized = searchQuery.trim().toLowerCase();
    let breeds = allBreeds;

    if (normalized) {
      breeds = breeds.filter(
        (breed) =>
          breed.name.toLowerCase().includes(normalized) ||
          breed.group.toLowerCase().includes(normalized) ||
          breed.originCountry.toLowerCase().includes(normalized) ||
          breed.temperament.some((trait) => trait.toLowerCase().includes(normalized))
      );
    }

    if (selectedGroup !== 'All') {
      breeds = breeds.filter((breed) => breed.group === selectedGroup);
    }

    return breeds;
  });

  function clearFilters() {
    searchQuery = '';
    selectedGroup = 'All';
  }
</script>

<section class="encyclopedia-section" aria-labelledby="catalog-title">
  <div class="page-intro">
    <span class="eyebrow">Breed library</span>
    <div class="title-row">
      <h1 id="catalog-title" class="page-title">Know the breed behind the face.</h1>
      {#if !isLoading}<span class="result-count">{filteredBreeds.length} breeds</span>{/if}
    </div>
    <p class="page-description">
      Browse photos, origins, temperament, and everyday compatibility notes across the catalog. Open
      a profile when you want the full picture.
    </p>
  </div>

  <div class="controls-bar">
    <label class="search-field">
      <Search size={18} strokeWidth={1.8} aria-hidden="true" />
      <span class="sr-only">Search breeds</span>
      <input
        type="search"
        placeholder="Search by name, origin, temperament, or group"
        bind:value={searchQuery}
      />
      {#if searchQuery}
        <button
          class="clear-search"
          type="button"
          onclick={() => (searchQuery = '')}
          aria-label="Clear breed search">×</button
        >
      {/if}
    </label>

    <div class="group-filter-chips" role="group" aria-label="Filter by breed group">
      {#each BREED_GROUPS as group}
        <button
          class:active={selectedGroup === group}
          class="filter-chip"
          type="button"
          onclick={() => (selectedGroup = group)}>{group}</button
        >
      {/each}
    </div>
  </div>

  {#if isLoading}
    <div class="loading-state" aria-live="polite">
      <span class="loading-bar"></span>Loading the breed library…
    </div>
  {:else if filteredBreeds.length === 0}
    <div class="no-results" role="status">
      <span class="eyebrow">No match</span>
      <h2>No breeds match that search.</h2>
      <p>Try a different name, group, origin, or temperament term.</p>
      <button class="reset-filters" type="button" onclick={clearFilters}
        ><RotateCcw size={15} strokeWidth={1.8} /> Clear search and filters</button
      >
    </div>
  {:else}
    <div class="breeds-grid">
      {#each filteredBreeds as breed (breed.id)}
        <BreedCard
          {breed}
          onSelectModal={(selected) => (selectedBreedModal = selected)}
          {onSelectForMix}
        />
      {/each}
    </div>
  {/if}

  {#if selectedBreedModal}
    <BreedDetailModal
      breed={selectedBreedModal}
      {unitSystem}
      onClose={() => (selectedBreedModal = null)}
    />
  {/if}
</section>

<style>
  .encyclopedia-section {
    width: min(100% - 2rem, 1240px);
    margin: 0 auto;
    padding: 3.5rem 0 5rem;
  }

  .page-intro {
    max-width: 760px;
    margin-bottom: 2.2rem;
  }

  .title-row {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1rem;
  }

  .result-count {
    padding-bottom: 0.35rem;
    color: var(--text-subtle);
    font-size: 0.76rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .controls-bar {
    display: grid;
    gap: 0.8rem;
    margin-bottom: 2rem;
  }

  .search-field {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.7rem;
    min-height: 50px;
    padding: 0 0.95rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--bg-card);
    color: var(--text-muted);
  }

  .search-field:focus-within {
    border-color: var(--border-highlight);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  .search-field input {
    min-width: 0;
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--text-main);
    font-size: 0.86rem;
  }

  .search-field input::placeholder {
    color: var(--text-subtle);
  }

  .clear-search {
    width: 28px;
    height: 28px;
    border: 0;
    border-radius: 50%;
    background: var(--bg-elevated);
    color: var(--text-muted);
    font-size: 1.15rem;
    line-height: 1;
  }

  .group-filter-chips {
    display: flex;
    align-items: center;
    gap: 1.05rem;
    overflow-x: auto;
    padding-bottom: 0.35rem;
    border-bottom: 1px solid var(--border-subtle);
    scrollbar-width: none;
  }

  .group-filter-chips::-webkit-scrollbar {
    display: none;
  }

  .filter-chip {
    position: relative;
    flex: 0 0 auto;
    padding: 0.55rem 0 0.7rem;
    border: 0;
    background: transparent;
    color: var(--text-muted);
    font-size: 0.76rem;
    font-weight: 700;
  }

  .filter-chip::after {
    position: absolute;
    right: 0;
    bottom: -0.35rem;
    left: 0;
    height: 2px;
    background: var(--accent-primary);
    content: '';
    transform: scaleX(0);
    transition: transform 160ms ease;
  }

  .filter-chip:hover,
  .filter-chip.active {
    color: var(--text-main);
  }
  .filter-chip.active::after {
    transform: scaleX(1);
  }

  .loading-state {
    display: grid;
    justify-items: center;
    gap: 0.8rem;
    padding: 4rem 1rem;
    color: var(--text-muted);
    font-size: 0.85rem;
  }

  .loading-bar {
    width: 180px;
    height: 4px;
    overflow: hidden;
    border-radius: 999px;
    background: var(--bg-elevated);
  }

  .loading-bar::after {
    display: block;
    width: 40%;
    height: 100%;
    background: var(--accent-primary);
    content: '';
    animation: loading 1s ease-in-out infinite;
  }

  .no-results {
    padding: 4rem 1rem;
    border-top: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
    text-align: center;
  }

  .no-results h2 {
    margin-top: 0.45rem;
    font-size: 1.6rem;
  }
  .no-results p {
    margin-top: 0.4rem;
    font-size: 0.85rem;
  }

  .reset-filters {
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 1.2rem;
    padding: 0.55rem 0.8rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-main);
    font-size: 0.76rem;
    font-weight: 700;
  }

  .reset-filters:hover {
    border-color: var(--border-highlight);
    background: var(--accent-soft);
  }

  .breeds-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(285px, 1fr));
    gap: 1rem;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @keyframes loading {
    0% {
      transform: translateX(-110%);
    }
    100% {
      transform: translateX(320%);
    }
  }

  @media (max-width: 560px) {
    .encyclopedia-section {
      width: min(100% - 1.25rem, 1240px);
      padding-top: 2.25rem;
    }
    .title-row {
      align-items: flex-start;
      flex-direction: column;
      gap: 0.4rem;
    }
    .result-count {
      padding-bottom: 0;
    }
    .breeds-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
