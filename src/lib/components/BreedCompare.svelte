<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Baby,
    Bone,
    Building2,
    Cat,
    Dog,
    Dumbbell,
    Globe,
    GraduationCap,
    HeartHandshake,
    Scale,
    Scissors,
    Shield,
    Smile,
    Target,
    Thermometer,
    Volume2,
    Zap
  } from '@lucide/svelte';
  import { loadDogBreeds } from '$lib/data/dogBreeds';
  import type { BreedStats } from '$lib/types/scan';
  import { unitSystemStore } from '$lib/stores/appState';
  import { formatHeightRange, formatWeightRange } from '$lib/utils/unitConverter';
  import LightboxButton from '$lib/components/ui/LightboxButton.svelte';
  import CompareMatrixRow from '$lib/components/compare/CompareMatrixRow.svelte';

  let breeds = $state<BreedStats[]>([]);
  let isLoading = $state(true);
  let breed1 = $state<BreedStats | null>(null);
  let breed2 = $state<BreedStats | null>(null);
  let unitSystem = $state<'Imperial' | 'Metric'>('Imperial');

  let {
    initialBreedA,
    initialBreedB
  }: {
    initialBreedA?: BreedStats | null;
    initialBreedB?: BreedStats | null;
  } = $props();

  onMount(async () => {
    breeds = await loadDogBreeds();
    breed1 = initialBreedA ?? breeds[0] ?? null;
    breed2 = initialBreedB ?? breeds[1] ?? breeds[0] ?? null;
    isLoading = false;
  });

  unitSystemStore.subscribe((value) => (unitSystem = value));

  const isMetric = $derived(unitSystem === 'Metric');
  const canCompare = $derived(Boolean(breed1 && breed2));

  const numericRows = $derived.by(() => {
    if (!breed1 || !breed2) return [];
    return [
      {
        label: 'Energy',
        icon: Zap,
        val1: `${breed1.energyLevel} / 5`,
        val2: `${breed2.energyLevel} / 5`,
        pill: 'energy',
        iconClass: 'energy'
      },
      {
        label: 'Strength',
        icon: Dumbbell,
        val1: `${breed1.strength} / 5`,
        val2: `${breed2.strength} / 5`,
        pill: 'strength',
        iconClass: 'strength'
      },
      {
        label: 'Grooming',
        icon: Scissors,
        val1: `${breed1.groomingNeeds} / 5`,
        val2: `${breed2.groomingNeeds} / 5`,
        pill: 'grooming',
        iconClass: 'grooming'
      },
      {
        label: 'Trainability',
        icon: GraduationCap,
        val1: `${breed1.trainability} / 5`,
        val2: `${breed2.trainability} / 5`,
        pill: 'train',
        iconClass: 'train'
      },
      {
        label: 'Barking',
        icon: Volume2,
        val1: `${breed1.barkingLevel} / 5`,
        val2: `${breed2.barkingLevel} / 5`,
        pill: 'bark',
        iconClass: 'bark'
      }
    ];
  });

  const lifestyleRows = $derived.by(() => {
    if (!breed1 || !breed2) return [];
    return [
      {
        label: 'Apartment friendly',
        icon: Building2,
        val1: breed1.apartmentFriendly,
        val2: breed2.apartmentFriendly
      },
      {
        label: 'Good with kids',
        icon: Baby,
        val1: breed1.goodWithKidsCategory,
        val2: breed2.goodWithKidsCategory
      },
      {
        label: 'Good with other dogs',
        icon: Dog,
        val1: breed1.goodWithOtherDogs,
        val2: breed2.goodWithOtherDogs
      },
      { label: 'Cats / small animals', icon: Cat, val1: breed1.catSafe, val2: breed2.catSafe },
      { label: 'Prey drive', icon: Target, val1: breed1.preyDrive, val2: breed2.preyDrive },
      {
        label: 'Weather sensitivity',
        icon: Thermometer,
        val1: breed1.weatherSensitivity,
        val2: breed2.weatherSensitivity
      },
      {
        label: 'Separation anxiety',
        icon: HeartHandshake,
        val1: breed1.separationAnxietyRisk,
        val2: breed2.separationAnxietyRisk
      },
      {
        label: 'Protectiveness',
        icon: Shield,
        val1: breed1.protectiveness,
        val2: breed2.protectiveness
      },
      {
        label: 'Affection style',
        icon: Smile,
        val1: breed1.affectionLevel,
        val2: breed2.affectionLevel
      }
    ];
  });
</script>

<section class="compare-section" aria-labelledby="compare-title">
  <div class="page-intro">
    <span class="eyebrow">Comparison tool</span>
    <h1 id="compare-title" class="page-title">See the difference at a glance.</h1>
    <p class="page-description">
      Compare two breeds across physical ranges, everyday energy, grooming, trainability, and home
      compatibility.
    </p>
  </div>

  {#if isLoading}
    <div class="loading-message" aria-live="polite">Loading breeds…</div>
  {:else if canCompare && breed1 && breed2}
    <div class="matrix-scroll" role="region" aria-label="Breed comparison table">
      <div
        class="matrix-card"
        role="table"
        aria-label={`${breed1.name} compared with ${breed2.name}`}
      >
        <div class="matrix-grid header-row" role="row">
          <div class="matrix-cell label-cell" role="columnheader">Metric</div>
          <div class="matrix-cell selector-cell" role="columnheader">
            <label class="sr-only" for="compare-breed-one">First breed</label>
            <select id="compare-breed-one" bind:value={breed1} class="breed-select-picker">
              {#each breeds as breed}<option value={breed}>{breed.name}</option>{/each}
            </select>
            <div class="header-photo-wrapper">
              <img
                src={breed1.imageUrl}
                alt={breed1.name}
                loading="lazy"
                decoding="async"
              /><LightboxButton
                imageUrl={breed1.imageUrl}
                title={breed1.name}
                position="top-left"
              />
            </div>
          </div>
          <div class="matrix-cell selector-cell" role="columnheader">
            <label class="sr-only" for="compare-breed-two">Second breed</label>
            <select id="compare-breed-two" bind:value={breed2} class="breed-select-picker">
              {#each breeds as breed}<option value={breed}>{breed.name}</option>{/each}
            </select>
            <div class="header-photo-wrapper">
              <img
                src={breed2.imageUrl}
                alt={breed2.name}
                loading="lazy"
                decoding="async"
              /><LightboxButton
                imageUrl={breed2.imageUrl}
                title={breed2.name}
                position="top-left"
              />
            </div>
          </div>
        </div>

        <CompareMatrixRow
          label="Origin country"
          icon={Globe}
          val1={breed1.originCountry}
          val2={breed2.originCountry}
        />
        <CompareMatrixRow label="Breed group" icon={Bone} val1={breed1.group} val2={breed2.group} />
        <CompareMatrixRow
          label={`Male weight (${isMetric ? 'metric' : 'US'})`}
          icon={Scale}
          val1={formatWeightRange(breed1.maleWeightRange, isMetric)}
          val2={formatWeightRange(breed2.maleWeightRange, isMetric)}
        />
        <CompareMatrixRow
          label={`Female weight (${isMetric ? 'metric' : 'US'})`}
          icon={Scale}
          val1={formatWeightRange(breed1.femaleWeightRange, isMetric)}
          val2={formatWeightRange(breed2.femaleWeightRange, isMetric)}
        />
        <CompareMatrixRow
          label={`Male height (${isMetric ? 'metric' : 'US'})`}
          icon={Scale}
          val1={formatHeightRange(breed1.maleHeightRange, isMetric)}
          val2={formatHeightRange(breed2.maleHeightRange, isMetric)}
        />
        <CompareMatrixRow
          label={`Female height (${isMetric ? 'metric' : 'US'})`}
          icon={Scale}
          val1={formatHeightRange(breed1.femaleHeightRange, isMetric)}
          val2={formatHeightRange(breed2.femaleHeightRange, isMetric)}
        />
        <CompareMatrixRow label="Typical lifespan" val1={breed1.lifespan} val2={breed2.lifespan} />

        {#each numericRows as row}<CompareMatrixRow
            label={row.label}
            icon={row.icon}
            val1={row.val1}
            val2={row.val2}
            val1Pill={row.pill}
            val2Pill={row.pill}
            iconClass={row.iconClass}
          />{/each}
        {#each lifestyleRows as row}<CompareMatrixRow
            label={row.label}
            icon={row.icon}
            val1={row.val1}
            val2={row.val2}
          />{/each}
      </div>
    </div>
  {/if}
</section>

<style>
  .compare-section {
    width: min(100% - 2rem, 1120px);
    margin: 0 auto;
    padding: 3.5rem 0 5rem;
  }
  .page-intro {
    max-width: 720px;
    margin-bottom: 2.2rem;
  }
  .loading-message {
    padding: 4rem 1rem;
    border-top: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
    color: var(--text-muted);
    text-align: center;
  }
  .matrix-scroll {
    overflow-x: auto;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    background: var(--bg-card);
    scrollbar-width: thin;
  }
  .matrix-card {
    min-width: 820px;
    color: var(--text-main);
  }
  .matrix-grid {
    display: grid;
    grid-template-columns: 220px minmax(260px, 1fr) minmax(260px, 1fr);
    align-items: center;
  }
  .header-row {
    border-bottom: 1px solid var(--border-highlight);
    background: var(--bg-surface);
  }
  .matrix-cell {
    padding: 1rem 1.15rem;
    font-size: 0.82rem;
  }
  .label-cell {
    color: var(--text-muted);
    font-weight: 700;
  }
  .selector-cell {
    display: grid;
    gap: 0.65rem;
  }
  .breed-select-picker {
    width: 100%;
    min-height: 40px;
    padding: 0.5rem 0.65rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: var(--bg-card);
    color: var(--text-main);
    font-size: 0.78rem;
    font-weight: 700;
  }
  .header-photo-wrapper {
    position: relative;
    height: 132px;
    overflow: hidden;
    border-radius: var(--radius-md);
    background: var(--bg-main);
  }
  .header-photo-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
  @media (max-width: 560px) {
    .compare-section {
      width: min(100% - 1.25rem, 1120px);
      padding-top: 2.25rem;
    }
  }
</style>
