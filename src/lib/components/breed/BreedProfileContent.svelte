<script lang="ts">
  import { Dumbbell, GraduationCap, Scissors, Volume2, Zap } from '@lucide/svelte';
  import type { BreedStats } from '$lib/types/scan';
  import RatingDots from '$lib/components/ui/RatingDots.svelte';
  import LightboxButton from '$lib/components/ui/LightboxButton.svelte';
  import LifestyleGrid from '$lib/components/ui/LifestyleGrid.svelte';
  import GenderSpecBlock from '$lib/components/breed/GenderSpecBlock.svelte';
  import GenderBehaviorBlock from '$lib/components/breed/GenderBehaviorBlock.svelte';
  import { buildOwnerGuidanceFromCatalog } from '$lib/guidance/buildOwnerGuidance';

  let {
    breed,
    unitSystem = 'Imperial',
    variant = 'page'
  }: {
    breed: BreedStats;
    unitSystem?: 'Imperial' | 'Metric';
    variant?: 'page' | 'modal';
  } = $props();

  const catalogGuidance = $derived(buildOwnerGuidanceFromCatalog(breed));
  const titleId = $derived(variant === 'modal' ? 'breed-modal-title' : 'breed-page-title');
  const descriptionId = $derived(
    variant === 'modal' ? 'breed-modal-description' : 'breed-page-description'
  );
</script>

<div class="profile" class:page={variant === 'page'} class:modal={variant === 'modal'}>
  <div class="profile-hero">
    <img
      src={breed.imageUrl}
      alt={breed.name}
      class="profile-img"
      loading="lazy"
      decoding="async"
    />
    <LightboxButton
      imageUrl={breed.imageUrl}
      title={breed.name}
      label="View photo"
      position="top-left"
    />
    <div class="profile-title-overlay">
      <span>{breed.originCountry} · {breed.group}</span>
      <h1 id={titleId}>{breed.name}</h1>
    </div>
  </div>

  <div class="profile-content">
    <p id={descriptionId} class="profile-description">{breed.description}</p>
    <GenderSpecBlock {breed} {unitSystem} />
    <GenderBehaviorBlock
      summary={breed.genderBehaviorSummary}
      maleTraits={breed.maleBehavioralTraits}
      femaleTraits={breed.femaleBehavioralTraits}
    />

    <section class="profile-section" aria-labelledby="stats-title">
      <h2 id="stats-title">Everyday profile</h2>
      <div class="full-stats-grid">
        <div class="full-stat-row">
          <span><Zap size={15} class="energy" /> Energy</span><RatingDots
            value={breed.energyLevel}
          />
        </div>
        <div class="full-stat-row">
          <span><Dumbbell size={15} class="strength" /> Strength</span><RatingDots
            value={breed.strength}
          />
        </div>
        <div class="full-stat-row">
          <span><Scissors size={15} class="grooming" /> Grooming</span><RatingDots
            value={breed.groomingNeeds}
          />
        </div>
        <div class="full-stat-row">
          <span><GraduationCap size={15} class="train" /> Trainability</span><RatingDots
            value={breed.trainability}
          />
        </div>
        <div class="full-stat-row">
          <span><Volume2 size={15} class="bark" /> Barking</span><RatingDots
            value={breed.barkingLevel}
          />
        </div>
      </div>
    </section>

    <section class="profile-section" aria-labelledby="lifestyle-title">
      <h2 id="lifestyle-title">Living with this breed</h2>
      <LifestyleGrid {breed} />
    </section>

    <section class="profile-section" aria-labelledby="temperament-title">
      <h2 id="temperament-title">Temperament traits</h2>
      <div class="temperament-tags">
        {#each breed.temperament as tag}<span>{tag}</span>{/each}
      </div>
    </section>

    <section class="profile-section" aria-labelledby="health-title">
      <h2 id="health-title">Health watchlist</h2>
      <p class="profile-note">Educational only - discuss with your veterinarian.</p>
      <ul class="guidance-list">
        {#each catalogGuidance.healthWatchlist as item}<li>{item}</li>{/each}
      </ul>
    </section>

    <section class="profile-section" aria-labelledby="life-stage-title">
      <h2 id="life-stage-title">Puppy vs adult</h2>
      <dl class="life-stage-dl">
        <div>
          <dt>Puppy</dt>
          <dd>{catalogGuidance.lifeStageNotes.puppy}</dd>
        </div>
        <div>
          <dt>Adult</dt>
          <dd>{catalogGuidance.lifeStageNotes.adult}</dd>
        </div>
      </dl>
    </section>

    <section class="profile-section" aria-labelledby="training-title">
      <h2 id="training-title">Training tips</h2>
      <ul class="guidance-list">
        {#each catalogGuidance.trainingTips as tip}<li>{tip}</li>{/each}
      </ul>
    </section>

    <section class="profile-section" aria-labelledby="cost-title">
      <h2 id="cost-title">Cost of ownership</h2>
      <dl class="cost-dl">
        <div>
          <dt>Monthly</dt>
          <dd>{catalogGuidance.ownershipCosts.monthlyEstimate}</dd>
        </div>
        <div>
          <dt>Initial setup</dt>
          <dd>{catalogGuidance.ownershipCosts.initialSetup}</dd>
        </div>
      </dl>
      <p class="profile-note">{catalogGuidance.ownershipCosts.notes}</p>
    </section>
  </div>
</div>

<style>
  .profile.page {
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    background: var(--bg-card);
    overflow: hidden;
  }

  .profile-hero {
    position: relative;
    height: clamp(220px, 40vw, 320px);
  }

  .profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .profile-title-overlay {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 1.2rem 1.4rem;
    background: rgba(7, 14, 9, 0.82);
    color: #ffffff;
  }

  .profile-title-overlay span {
    color: var(--accent-primary);
    font-size: 0.72rem;
    font-weight: 700;
  }

  .profile-title-overlay h1 {
    margin-top: 0.2rem;
    color: #ffffff;
    font-size: clamp(1.6rem, 4vw, 2.2rem);
  }

  .profile-content {
    padding: 1.4rem;
  }

  .profile-description {
    font-size: 0.88rem;
    line-height: 1.65;
  }

  .profile-section {
    padding: 1.35rem 0;
    border-bottom: 1px solid var(--border-subtle);
  }

  .profile-section h2 {
    margin-bottom: 0.9rem;
    font-size: 1rem;
  }

  .full-stats-grid {
    display: grid;
    gap: 0.65rem;
  }

  .full-stat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.55rem 0;
    border-bottom: 1px solid var(--border-subtle);
    color: var(--text-main);
    font-size: 0.82rem;
  }

  .full-stat-row > span {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
  }

  :global(.energy) {
    color: var(--warning);
  }
  :global(.strength) {
    color: #c97a5a;
  }
  :global(.grooming) {
    color: var(--info);
  }
  :global(.train) {
    color: var(--accent-primary);
  }
  :global(.bark) {
    color: #d693b1;
  }

  .temperament-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .temperament-tags span {
    padding: 0.35rem 0.55rem;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    font-size: 0.75rem;
  }

  .profile-note {
    margin-bottom: 0.55rem;
    font-size: 0.72rem;
    color: var(--text-subtle);
  }

  .guidance-list {
    list-style: none;
    display: grid;
    gap: 0.4rem;
  }

  .guidance-list li {
    padding-left: 0.85rem;
    position: relative;
    font-size: 0.82rem;
    line-height: 1.55;
    color: var(--text-muted);
  }

  .guidance-list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.55rem;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent-primary);
  }

  .life-stage-dl,
  .cost-dl {
    display: grid;
    gap: 0.75rem;
  }

  .life-stage-dl dt,
  .cost-dl dt {
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    color: var(--accent-primary);
  }

  .life-stage-dl dd,
  .cost-dl dd {
    font-size: 0.82rem;
    line-height: 1.55;
    color: var(--text-muted);
  }

  @media (max-width: 560px) {
    .profile-content {
      padding: 1rem;
    }
  }
</style>
