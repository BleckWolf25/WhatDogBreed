<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import {
    Camera,
    ChevronDown,
    Dog,
    Download,
    GitCompare,
    Heart,
    History,
    Moon,
    Ruler,
    Search,
    Sun
  } from '@lucide/svelte';
  import { activeScanResultStore, unitSystemStore } from '$lib/stores/appState';
  import { getMyDogProfile, getSavedScanHistory } from '$lib/services/historyStorage';
  import { getScanImage } from '$lib/services/scanImageStorage';

  let { onToggleTheme, isDarkMode = true } = $props();

  const NAV_ITEMS = [
    { href: '/scanner', label: 'Scan Photo', icon: Camera, clearScan: true, tourId: 'scan' },
    { href: '/history', label: 'History', icon: History, clearScan: false, tourId: 'history' },
    {
      href: '/encyclopedia',
      label: 'Breed Catalog',
      icon: Search,
      clearScan: false,
      tourId: 'catalog'
    },
    {
      href: '/compare',
      label: 'Compare Breeds',
      icon: GitCompare,
      clearScan: false,
      tourId: 'compare'
    },
    { href: '/mixer', label: 'Breed Mixer', icon: Dog, clearScan: false, tourId: 'mixer' }
  ] as const;

  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  }

  let installPromptEvent = $state<BeforeInstallPromptEvent | null>(null);
  let unitSystem = $state<'Imperial' | 'Metric'>('Imperial');
  let myDogName = $state<string | null>(null);

  if (typeof window !== 'undefined') {
    const profile = getMyDogProfile();
    myDogName = profile?.name ?? null;
  }

  unitSystemStore.subscribe((value) => {
    unitSystem = value;
  });

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      installPromptEvent = event as BeforeInstallPromptEvent;
    });
  }

  function isActiveRoute(href: string): boolean {
    return page.url.pathname === href;
  }

  function handleNavClick(clearScan: boolean) {
    if (clearScan) {
      activeScanResultStore.set(null);
    }
  }

  async function handleMyDogClick() {
    const profile = getMyDogProfile();
    if (!profile) return;

    const history = getSavedScanHistory();
    const primaryScan =
      history.find((item) => item.id === profile.primaryScanId) ??
      history.find((item) => profile.linkedScanIds.includes(item.id));
    if (!primaryScan) return;

    const imageUrl = (await getScanImage(primaryScan.id)) ?? primaryScan.thumbnailUrl;
    activeScanResultStore.set({ ...primaryScan, imageUrl });
    await goto('/scanner');
  }

  async function handleInstallClick() {
    if (!installPromptEvent) return;
    await installPromptEvent.prompt();
    await installPromptEvent.userChoice;
    installPromptEvent = null;
  }
</script>

<header class="navbar-header">
  <div class="header-container">
    <a class="brand-logo" href="/" aria-label="What Dog Breed home">
      <span class="logo-badge" aria-hidden="true"><Dog size={22} strokeWidth={1.8} /></span>
      <span class="brand-copy">
        <strong>What Dog Breed</strong>
        <span>Understand the dog in front of you.</span>
      </span>
    </a>

    <nav class="nav-links" aria-label="Primary navigation">
      {#each NAV_ITEMS as item (item.href)}
        {@const Icon = item.icon}
        <a
          class:active={isActiveRoute(item.href)}
          class="nav-item"
          href={item.href}
          data-tour={item.tourId}
          aria-current={isActiveRoute(item.href) ? 'page' : undefined}
          onclick={() => handleNavClick(item.clearScan)}
        >
          <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
          <span>{item.label}</span>
        </a>
      {/each}
    </nav>

    <div class="header-actions" aria-label="Preferences">
      {#if myDogName}
        <a
          class="utility-btn my-dog-btn"
          href="/scanner"
          onclick={(event) => {
            event.preventDefault();
            void handleMyDogClick();
          }}
          title="Open My Dog scan"
        >
          <Heart size={15} strokeWidth={1.8} aria-hidden="true" />
          <span>{myDogName}</span>
        </a>
      {/if}

      <!-- Unit Dropdown -->
      <div class="unit-dropdown-wrap" title="Switch measurement units">
        <Ruler size={14} strokeWidth={1.8} aria-hidden="true" class="unit-dropdown-icon" />
        <select
          class="unit-dropdown-select"
          aria-label="Switch measurement units"
          value={unitSystem}
          onchange={(e) => {
            unitSystemStore.set(
              (e.currentTarget as HTMLSelectElement).value as 'Imperial' | 'Metric'
            );
          }}
        >
          <option value="Imperial">US (lbs)</option>
          <option value="Metric">EU (kg)</option>
        </select>
        <ChevronDown size={12} strokeWidth={2} aria-hidden="true" class="unit-dropdown-chevron" />
      </div>

      <!-- Mobile Unit Dropdown -->
      <div class="mobile-only unit-dropdown-wrap" title="Switch measurement units">
        <Ruler size={14} strokeWidth={1.8} aria-hidden="true" class="unit-dropdown-icon" />
        <select
          class="unit-dropdown-select"
          aria-label="Switch measurement units"
          value={unitSystem}
          onchange={(e) => {
            unitSystemStore.set((e.currentTarget as HTMLSelectElement).value as 'Imperial' | 'Metric');
          }}
        >
          <option value="Imperial">US (lbs)</option>
          <option value="Metric">EU (kg)</option>
        </select>
        <ChevronDown size={12} strokeWidth={2} aria-hidden="true" class="unit-dropdown-chevron" />
      </div>

      {#if installPromptEvent}
        <button
          class="utility-btn install-btn"
          onclick={handleInstallClick}
          title="Install What Dog Breed"
        >
          <Download size={15} strokeWidth={1.8} aria-hidden="true" />
          <span>Install</span>
        </button>
      {/if}

      <button
        class="theme-toggle-btn"
        onclick={onToggleTheme}
        aria-label="Switch theme"
        title="Switch theme"
      >
        {#if isDarkMode}
          <Sun size={17} strokeWidth={1.8} aria-hidden="true" />
        {:else}
          <Moon size={17} strokeWidth={1.8} aria-hidden="true" />
        {/if}
      </button>
    </div>
  </div>
</header>

<style>
  .navbar-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: color-mix(in srgb, var(--bg-main) 94%, transparent);
    border-bottom: 1px solid var(--border-subtle);
    backdrop-filter: blur(16px);
    padding-top: var(--safe-top);
  }

  .header-container {
    width: min(100% - 2rem, 1280px);
    min-height: var(--header-height);
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(190px, 1fr) auto minmax(190px, 1fr);
    align-items: center;
    gap: 1.5rem;
  }

  .brand-logo {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    min-width: 0;
    color: var(--text-main);
    text-decoration: none;
  }

  .logo-badge {
    width: 38px;
    height: 38px;
    border: 1px solid var(--border-highlight);
    border-radius: 10px;
    display: grid;
    place-items: center;
    color: var(--accent-primary);
    background: var(--accent-soft);
    flex: 0 0 auto;
  }

  .brand-copy {
    display: grid;
    gap: 0.08rem;
    min-width: 0;
  }

  .brand-copy strong {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 800;
    line-height: 1.1;
    white-space: nowrap;
  }

  .brand-copy span {
    color: var(--text-subtle);
    font-size: 0.66rem;
    white-space: nowrap;
  }

  .nav-links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
  }

  .nav-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.42rem;
    min-height: 40px;
    padding: 0.5rem 0.7rem;
    color: var(--text-muted);
    font-size: 0.78rem;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
    transition: color 160ms ease;
  }

  .nav-item::after {
    position: absolute;
    right: 0.7rem;
    bottom: 0;
    left: 0.7rem;
    height: 2px;
    background: var(--accent-primary);
    content: '';
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 160ms ease;
  }

  .nav-item:hover,
  .nav-item.active {
    color: var(--text-main);
  }

  .nav-item.active::after {
    transform: scaleX(1);
  }

  .header-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.45rem;
  }

  .desktop-only {
    display: inline-flex;
  }

  .mobile-only {
    display: none;
  }

  .utility-btn,
  .theme-toggle-btn {
    min-height: 36px;
    border: 1px solid var(--border-subtle);
    background: transparent;
    color: var(--text-muted);
    transition:
      border-color 160ms ease,
      color 160ms ease,
      background-color 160ms ease;
  }

  .utility-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.65rem;
    border-radius: var(--radius-sm);
    font-size: 0.72rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .theme-toggle-btn {
    width: 36px;
    border-radius: var(--radius-sm);
    display: grid;
    place-items: center;
    color: var(--accent-primary);
  }

  .utility-btn:hover,
  .theme-toggle-btn:hover {
    border-color: var(--border-highlight);
    background: var(--accent-soft);
    color: var(--text-main);
  }

  /* Unit Dropdown Styling */
  .unit-dropdown-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-height: 36px;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    transition:
      border-color 160ms ease,
      background-color 160ms ease;
  }

  .unit-dropdown-wrap:hover,
  .unit-dropdown-wrap:focus-within {
    border-color: var(--border-highlight);
    background: var(--accent-soft);
    color: var(--text-main);
  }

  :global(.unit-dropdown-icon) {
    position: absolute;
    left: 0.5rem;
    pointer-events: none;
    color: var(--accent-primary);
    flex-shrink: 0;
  }

  :global(.unit-dropdown-chevron) {
    position: absolute;
    right: 0.45rem;
    pointer-events: none;
    color: var(--text-subtle);
    flex-shrink: 0;
  }

  .unit-dropdown-select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background: transparent;
    border: 0;
    color: var(--text-main);
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.4rem 1.45rem 0.4rem 1.65rem;
    cursor: pointer;
    border-radius: var(--radius-sm);
    outline: none;
  }

  .unit-dropdown-select option {
    background: var(--bg-card);
    color: var(--text-main);
    font-size: 0.8rem;
    padding: 0.4rem;
  }

  .my-dog-btn {
    text-decoration: none;
    color: var(--accent-primary);
  }

  @media (max-width: 1040px) {
    .header-container {
      grid-template-columns: auto 1fr auto;
      gap: 0.75rem;
    }

    .nav-links {
      justify-content: flex-start;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .nav-links::-webkit-scrollbar {
      display: none;
    }
  }

  @media (max-width: 720px) {
    .header-container {
      width: min(100% - 1.25rem, 1280px);
      grid-template-columns: 1fr auto;
      padding: 0.65rem 0;
    }

    .brand-copy span {
      display: none;
    }

    .utility-btn.my-dog-btn span,
    .utility-btn.install-btn span {
      display: none;
    }

    .nav-links {
      grid-column: 1 / -1;
      grid-row: 2;
      justify-content: flex-start;
      border-top: 1px solid var(--border-subtle);
      padding-top: 0.35rem;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scroll-snap-type: x proximity;
    }

    .nav-item {
      min-height: 38px;
      padding-inline: 0.6rem;
      font-size: 0.74rem;
      scroll-snap-align: start;
      flex-shrink: 0;
    }

    .nav-item::after {
      right: 0.6rem;
      left: 0.6rem;
    }
  }
</style>
