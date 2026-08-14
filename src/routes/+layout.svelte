<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import OfflineBanner from '$lib/components/ui/OfflineBanner.svelte';
  import OnboardingTour from '$lib/components/ui/OnboardingTour.svelte';
  import { activeLightboxImageStore, themeStore, type LightboxPayload } from '$lib/stores/appState';
  import {
    registerServiceWorker,
    prefetchOfflineAssets
  } from '$lib/services/registerServiceWorker';
  import { X } from '@lucide/svelte';

  let { children } = $props();
  let isDarkMode = $state(true);
  let lightboxData = $state<LightboxPayload | null>(null);

  activeLightboxImageStore.subscribe((value) => {
    lightboxData = value;
  });

  themeStore.subscribe((theme) => {
    isDarkMode = theme === 'dark';
  });

  onMount(() => {
    registerServiceWorker();
    void prefetchOfflineAssets();
  });

  function handleToggleTheme() {
    themeStore.update((theme) => (theme === 'dark' ? 'light' : 'dark'));
  }

  function closeLightbox() {
    activeLightboxImageStore.set(null);
  }

  function handleGlobalKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && lightboxData) {
      closeLightbox();
    }
  }
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<svelte:head>
  <title>What Dog Breed? - Understand the dog in front of you.</title>
  <meta
    name="description"
    content="Upload a dog photo for an estimated visual breed mix, recognizable traits, and practical care context."
  />
  <meta property="og:title" content="What Dog Breed?" />
  <meta
    property="og:description"
    content="Understand the dog in front of you with a visual breed estimate and practical context."
  />
  <meta property="og:image" content="/WhatDogBreed.png" />
  <meta name="twitter:image" content="/WhatDogBreed.png" />
</svelte:head>

<div class="app-layout">
  <OfflineBanner />
  <Header onToggleTheme={handleToggleTheme} {isDarkMode} />

  <main class="main-content">
    {@render children()}
  </main>

  <Footer />
  <OnboardingTour />

  {#if lightboxData}
    <div class="lightbox-backdrop" role="presentation" onclick={closeLightbox}>
      <div
        class="lightbox-dialog"
        role="dialog"
        tabindex="-1"
        aria-modal="true"
        aria-labelledby="lightbox-title"
      >
        <button class="lightbox-close-btn" onclick={closeLightbox} aria-label="Close photo viewer">
          <X size={22} strokeWidth={1.8} />
        </button>
        <img
          src={lightboxData.url}
          alt={lightboxData.title}
          class="lightbox-img"
          loading="lazy"
          decoding="async"
        />
        <p id="lightbox-title" class="lightbox-caption">{lightboxData.title}</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .app-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    width: 100%;
    min-width: 0;
  }

  .lightbox-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: grid;
    place-items: center;
    padding: 1.5rem;
    background: rgba(5, 10, 7, 0.9);
    backdrop-filter: blur(10px);
    animation: fade-in 160ms ease-out;
  }

  .lightbox-dialog {
    position: relative;
    width: min(100%, 980px);
    display: grid;
    justify-items: center;
    gap: 0.85rem;
  }

  .lightbox-close-btn {
    position: absolute;
    top: -0.75rem;
    right: -0.75rem;
    width: 42px;
    height: 42px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    background: rgba(10, 18, 13, 0.92);
    color: #ffffff;
    display: grid;
    place-items: center;
    z-index: 1;
  }

  .lightbox-img {
    max-height: 78vh;
    width: auto;
    max-width: 100%;
    border: 1px solid rgba(165, 239, 178, 0.28);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-popover);
    object-fit: contain;
  }

  .lightbox-caption {
    color: #ffffff;
    font-size: 0.9rem;
    font-weight: 700;
    text-align: center;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 720px) {
    .lightbox-backdrop {
      padding: 1rem;
    }

    .lightbox-close-btn {
      top: -0.5rem;
      right: -0.25rem;
    }
  }
</style>
