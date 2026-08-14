<script lang="ts">
  import { Dumbbell, GraduationCap, Info, Scissors, Zap } from '@lucide/svelte';
  import type { BreedStats } from '$lib/types/scan';
  import LightboxButton from '$lib/components/ui/LightboxButton.svelte';

  let {
    breed,
    onSelectModal: _onSelectModal,
    onSelectForMix
  }: {
    breed: BreedStats;
    onSelectModal?: (breed: BreedStats) => void;
    onSelectForMix?: (breed: BreedStats) => void;
  } = $props();
</script>

<article class="breed-card">
  <div class="breed-image-container">
    <img
      src={breed.imageUrl}
      alt={breed.name}
      class="breed-card-img"
      loading="lazy"
      decoding="async"
    />
    <LightboxButton imageUrl={breed.imageUrl} title={breed.name} position="top-left" />
  </div>

  <div class="breed-card-body">
    <div class="breed-meta"><span>{breed.originCountry}</span><span>{breed.group}</span></div>
    <h2 class="breed-name">{breed.name}</h2>
    <p class="breed-desc">{breed.description}</p>

    <div class="stats-preview-grid" aria-label={`${breed.name} quick metrics`}>
      <span class="energy-stat"
        ><Zap size={13} strokeWidth={1.8} aria-hidden="true" /> Energy
        <strong>{breed.energyLevel}/5</strong></span
      >
      <span class="strength-stat"
        ><Dumbbell size={13} strokeWidth={1.8} aria-hidden="true" /> Strength
        <strong>{breed.strength}/5</strong></span
      >
      <span class="grooming-stat"
        ><Scissors size={13} strokeWidth={1.8} aria-hidden="true" /> Grooming
        <strong>{breed.groomingNeeds}/5</strong></span
      >
      <span class="train-stat"
        ><GraduationCap size={13} strokeWidth={1.8} aria-hidden="true" /> Trainability
        <strong>{breed.trainability}/5</strong></span
      >
    </div>

    <div class="card-actions">
      <a class="details-btn" href="/breeds/{breed.id}">
        <Info size={15} strokeWidth={1.8} aria-hidden="true" />
        <span>Full profile</span>
      </a>
      {#if onSelectForMix}
        <button class="mix-btn" type="button" onclick={() => onSelectForMix?.(breed)}>Mix</button>
      {/if}
    </div>
  </div>
</article>

<style>
  .breed-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    background: var(--bg-card);
    transition:
      border-color 160ms ease,
      background-color 160ms ease;
  }

  .breed-card:hover {
    border-color: var(--border-highlight);
    background: var(--bg-card-hover);
  }

  .breed-image-container {
    position: relative;
    height: 206px;
    overflow: hidden;
    background: var(--bg-surface);
  }

  .breed-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 240ms ease;
  }

  .breed-card:hover .breed-card-img {
    transform: scale(1.025);
  }

  .breed-card-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 1rem;
  }

  .breed-meta {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    color: var(--text-subtle);
    font-size: 0.67rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .breed-meta span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .breed-meta span:last-child {
    color: var(--accent-secondary);
    text-align: right;
  }

  .breed-name {
    margin-top: 0.55rem;
    font-size: 1.3rem;
    font-weight: 800;
    line-height: 1.15;
  }

  .breed-desc {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    margin-top: 0.5rem;
    font-size: 0.82rem;
    line-height: 1.55;
  }

  .stats-preview-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 0.7rem;
    margin-top: auto;
    padding: 1rem 0 0.9rem;
    color: var(--text-muted);
    font-size: 0.69rem;
    font-weight: 600;
  }

  .stats-preview-grid span {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  .energy-stat :global(svg) {
    color: var(--warning);
  }
  .strength-stat :global(svg) {
    color: #c97a5a;
  }
  .grooming-stat :global(svg) {
    color: var(--info);
  }
  .train-stat :global(svg) {
    color: var(--accent-primary);
  }
  .stats-preview-grid strong {
    color: var(--text-main);
  }

  .card-actions {
    display: flex;
    gap: 0.5rem;
  }

  .details-btn,
  .mix-btn {
    min-height: 38px;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 700;
    transition:
      background-color 160ms ease,
      border-color 160ms ease,
      color 160ms ease;
  }

  .details-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    border: 1px solid var(--accent-primary);
    background: var(--accent-soft);
    color: var(--accent-primary);
  }

  .details-btn:hover {
    background: var(--accent-primary);
    color: var(--text-inverse);
  }

  .mix-btn {
    padding: 0.5rem 0.8rem;
    border: 1px solid var(--border-strong);
    background: transparent;
    color: var(--text-muted);
  }

  .mix-btn:hover {
    border-color: var(--border-highlight);
    color: var(--text-main);
    background: var(--accent-soft);
  }
</style>
