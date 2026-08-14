<script lang="ts">
  import {
    Baby,
    Building2,
    Cat,
    Dog,
    HeartHandshake,
    Shield,
    Smile,
    Target,
    Thermometer
  } from '@lucide/svelte';
  import type { BreedStats } from '$lib/types/scan';

  let { breed }: { breed: BreedStats } = $props();

  const columnCount = 4;

  const items = $derived([
    { icon: Building2, label: 'Apartment friendly', value: breed.apartmentFriendly },
    { icon: Baby, label: 'Good with kids', value: breed.goodWithKidsCategory },
    { icon: Dog, label: 'Other dogs', value: breed.goodWithOtherDogs },
    { icon: Cat, label: 'Cats / small animals', value: breed.catSafe },
    { icon: Target, label: 'Prey drive', value: breed.preyDrive },
    { icon: Thermometer, label: 'Weather sensitivity', value: breed.weatherSensitivity },
    { icon: HeartHandshake, label: 'Separation anxiety', value: breed.separationAnxietyRisk },
    { icon: Shield, label: 'Protectiveness', value: breed.protectiveness },
    { icon: Smile, label: 'Affection style', value: breed.affectionLevel }
  ]);

  const emptyCellCount = $derived((columnCount - (items.length % columnCount)) % columnCount);
</script>

<div class="lifestyle-grid">
  {#each items as item (item.label)}
    <div class="lifestyle-item">
      <div class="lifestyle-header">
        <item.icon size={14} strokeWidth={1.8} class="lifestyle-icon" aria-hidden="true" />
        <span>{item.label}</span>
      </div>
      <strong>{item.value}</strong>
    </div>
  {/each}
  {#each Array(emptyCellCount) as _, index (index)}
    <div class="lifestyle-item lifestyle-item--empty" aria-hidden="true"></div>
  {/each}
</div>

<style>
  .lifestyle-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0;
    border-top: 1px solid var(--border-subtle);
    border-left: 1px solid var(--border-subtle);
  }

  .lifestyle-item {
    min-width: 0;
    padding: 0.85rem 0.8rem;
    border-right: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
  }

  .lifestyle-header {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--text-muted);
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  :global(.lifestyle-icon) {
    color: var(--accent-primary);
    flex: 0 0 auto;
  }

  .lifestyle-item strong {
    display: block;
    margin-top: 0.35rem;
    color: var(--text-main);
    font-size: 0.78rem;
    line-height: 1.35;
  }

  .lifestyle-item--empty {
    padding: 0;
  }

  @media (max-width: 600px) {
    .lifestyle-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 420px) {
    .lifestyle-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
