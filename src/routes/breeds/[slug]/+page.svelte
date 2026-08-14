<script lang="ts">
  import { goto } from '$app/navigation';
  import BreedProfileContent from '$lib/components/breed/BreedProfileContent.svelte';
  import type { PageData } from './$types';
  import { unitSystemStore } from '$lib/stores/appState';

  let { data }: { data: PageData } = $props();
  let unitSystem = $state<'Imperial' | 'Metric'>('Imperial');

  unitSystemStore.subscribe((value) => {
    unitSystem = value;
  });

  const pageTitle = $derived(`${data.breed.name} Dog Breed Profile`);
  const pageDescription = $derived(
    `${data.breed.name} temperament, energy, grooming, apartment friendliness, and care notes. ${data.breed.description}`
  );
</script>

<svelte:head>
  <title>{pageTitle} - What Dog Breed?</title>
  <meta name="description" content={pageDescription} />
  <link rel="canonical" href={`https://whatdogbreed.app/breeds/${data.breed.id}`} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:image" content={data.breed.imageUrl} />
  <meta property="og:url" content={`https://whatdogbreed.app/breeds/${data.breed.id}`} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${data.breed.name} breed profile`,
    description: data.breed.description,
    image: data.breed.imageUrl,
    about: data.breed.name
  })}</` + `script>`}
</svelte:head>

<section class="breed-page">
  <div class="page-intro">
    <span class="eyebrow">Breed profile</span>
    <p class="page-description">
      Full catalog profile for adopters researching {data.breed.name} temperament, size, and everyday
      compatibility.
    </p>
  </div>

  <BreedProfileContent breed={data.breed} {unitSystem} variant="page" />

  <div class="breed-actions">
    <button class="button button-primary" type="button" onclick={() => goto('/scanner')}
      >Scan a photo like this breed</button
    >
    <a class="button button-secondary" href="/encyclopedia">Browse all breeds</a>
    <a class="button button-secondary" href={`/mixer?a=${data.breed.id}`}>Simulate a mix</a>
  </div>
</section>

<style>
  .breed-page {
    width: min(100% - 2rem, 820px);
    margin: 0 auto;
    padding: 3.5rem 0 5rem;
  }

  .page-intro {
    margin-bottom: 1.5rem;
  }

  .breed-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    margin-top: 1.25rem;
  }

  .button {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.55rem 0.85rem;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    font-size: 0.76rem;
    font-weight: 700;
    text-decoration: none;
  }

  .button-primary {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: var(--text-inverse);
  }

  .button-secondary {
    background: transparent;
    border-color: var(--border-strong);
    color: var(--text-main);
  }

  @media (max-width: 560px) {
    .breed-page {
      width: min(100% - 1.25rem, 820px);
      padding-top: 2.25rem;
    }

    .breed-actions {
      flex-direction: column;
    }

    .button {
      width: 100%;
    }
  }
</style>
