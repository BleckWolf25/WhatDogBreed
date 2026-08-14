<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    BookOpen,
    Bookmark,
    Building2,
    CheckCircle,
    Clipboard,
    Copy,
    Download,
    Dumbbell,
    Eye,
    GitCompare,
    GraduationCap,
    Heart,
    Link,
    Scissors,
    Share2,
    Shuffle,
    Sparkles,
    Zap
  } from '@lucide/svelte';
  import type { BreedStats, OwnerGuidance, ScanResult } from '$lib/types/scan';
  import { loadDogBreeds } from '$lib/data/dogBreeds';
  import {
    saveScanToHistory,
    getMyDogProfile,
    setMyDogFromScan,
    linkScanToMyDog
  } from '$lib/services/historyStorage';
  import {
    copySocialCardToClipboard,
    downloadSocialCardImage,
    generateSocialCardDataUrl,
    shareSocialCard
  } from '$lib/services/socialCardGenerator';
  import { buildShareableScanUrl } from '$lib/services/shareUrl';
  import { findSimilarBreeds, resolveBreedsFromScanResult } from '$lib/utils/breedMatcher';
  import { resolveOwnerGuidance } from '$lib/utils/ownerGuidance';
  import {
    selectedCompareBreedStore,
    selectedMixBreedBStore,
    selectedMixBreedStore
  } from '$lib/stores/appState';
  import LightboxButton from '$lib/components/ui/LightboxButton.svelte';
  import LifestyleGrid from '$lib/components/ui/LifestyleGrid.svelte';
  import AncestryBreakdown from '$lib/components/scan/AncestryBreakdown.svelte';
  import GenderBehaviorBlock from '$lib/components/breed/GenderBehaviorBlock.svelte';
  import CareRecommendations from '$lib/components/scan/CareRecommendations.svelte';
  import OwnerGuidancePanel from '$lib/components/scan/OwnerGuidancePanel.svelte';
  import VetDisclaimerCard from '$lib/components/scan/VetDisclaimerCard.svelte';
  import AnalysisSourceBadge from '$lib/components/ui/AnalysisSourceBadge.svelte';
  import ConfidenceExplainer from '$lib/components/scan/ConfidenceExplainer.svelte';
  import ReportResultFeedback from '$lib/components/scan/ReportResultFeedback.svelte';

  let { result, onResetScan }: { result: ScanResult; onResetScan: () => void } = $props();

  let isSaved = $state(false);
  let isShareCopied = $state(false);
  let isLinkCopied = $state(false);
  let isImageCopied = $state(false);
  let isGeneratingCard = $state(false);
  let isSharing = $state(false);
  let isBuildingShareLink = $state(false);
  let shareLinkNote = $state<string | null>(null);
  let matchedBreed = $state<BreedStats | null>(null);
  let secondaryBreed = $state<BreedStats | null>(null);
  let similarBreeds = $state<BreedStats[]>([]);
  let ownerGuidance = $state<OwnerGuidance | null>(null);
  let isOffCatalog = $state(false);
  let showMyDogForm = $state(false);
  let myDogName = $state('');
  let myDogAge = $state('');
  let myDogWeight = $state('');
  let myDogNotes = $state('');
  let myDogSaved = $state(false);
  let existingMyDog = $state(getMyDogProfile());
  let showCardPreviewModal = $state(false);
  let previewCardUrl = $state<string | null>(null);

  const canShareNatively = typeof navigator !== 'undefined' && Boolean(navigator.share);
  const canCopyImage = typeof navigator !== 'undefined' && Boolean(navigator.clipboard?.write);
  const isSharedResult = $derived(result.id.startsWith('shared-'));

  onMount(() => {
    void loadDogBreeds().then((breeds) => {
      const resolved = resolveBreedsFromScanResult(breeds, result);
      matchedBreed = resolved.primary;
      secondaryBreed = resolved.secondary;
      isOffCatalog = !resolved.primary;
      ownerGuidance = resolveOwnerGuidance(result, {
        primary: resolved.primary,
        secondary: resolved.secondary
      });

      if (matchedBreed) {
        similarBreeds = findSimilarBreeds(breeds, matchedBreed);
      } else if (resolved.mixBreeds.length > 0 && resolved.mixBreeds[0]) {
        similarBreeds = findSimilarBreeds(breeds, resolved.mixBreeds[0]);
      }
    });

    void saveScanToHistory(result).then(() => {
      isSaved = true;
    });

    const profile = getMyDogProfile();
    if (profile) {
      myDogName = profile.name;
      myDogAge = profile.age ?? '';
      myDogWeight = profile.weight ?? '';
      myDogNotes = profile.notes ?? '';
    }
  });

  async function handleOpenCardPreview() {
    isGeneratingCard = true;
    try {
      previewCardUrl = await generateSocialCardDataUrl(result, matchedBreed);
      showCardPreviewModal = true;
    } catch (error) {
      console.error('Report card generation error:', error);
    } finally {
      isGeneratingCard = false;
    }
  }

  function handleShareText() {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;

    void (async () => {
      isBuildingShareLink = true;
      try {
        const { url: shareUrl, includesPhoto } = await buildShareableScanUrl(result);
        const modeLabel =
          result.analysisSource === 'gemini'
            ? 'AI vision analysis'
            : result.isDemoSample
              ? 'Demo mode'
              : 'Local estimate (no AI)';

        const photoNote = includesPhoto
          ? 'Includes a compressed photo in the link.'
          : 'Photo not included in link (report text only).';

        const shareText = `What Dog Breed scan result:\nPrimary match: ${result.primaryBreed} (${Math.round(result.confidenceScore * 100)}% visual match)\nAnalysis mode: ${modeLabel}\nGender profile: ${result.detectedGender || 'Unspecified'}\nMix breakdown: ${result.mixBreakdown.map((breed) => `${breed.breed} ${breed.percentage}%`).join(', ')}\nView result: ${shareUrl}\n${photoNote}\nNote: Visual breed estimates are not DNA tests. Consult a licensed veterinarian for health advice.`;

        await navigator.clipboard.writeText(shareText);
        isShareCopied = true;
        shareLinkNote = includesPhoto
          ? 'Link includes photo'
          : 'Link is text-only (photo too large)';
        window.setTimeout(() => {
          isShareCopied = false;
          shareLinkNote = null;
        }, 3500);
      } finally {
        isBuildingShareLink = false;
      }
    })();
  }

  function handleCopyLink() {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;

    void (async () => {
      isBuildingShareLink = true;
      try {
        const { url: shareUrl, includesPhoto } = await buildShareableScanUrl(result);
        await navigator.clipboard.writeText(shareUrl);
        isLinkCopied = true;
        shareLinkNote = includesPhoto
          ? 'Link includes photo'
          : 'Link is text-only (photo too large)';
        window.setTimeout(() => {
          isLinkCopied = false;
          shareLinkNote = null;
        }, 3500);
      } finally {
        isBuildingShareLink = false;
      }
    })();
  }

  async function handleDownloadSocialCard() {
    isGeneratingCard = true;
    try {
      await downloadSocialCardImage(result, matchedBreed);
    } catch (error) {
      console.error('Social card download error:', error);
    } finally {
      isGeneratingCard = false;
    }
  }

  async function handleCopyImage() {
    isGeneratingCard = true;
    try {
      await copySocialCardToClipboard(result, matchedBreed);
      isImageCopied = true;
      window.setTimeout(() => (isImageCopied = false), 2500);
    } catch (error) {
      console.error('Clipboard image copy error:', error);
    } finally {
      isGeneratingCard = false;
    }
  }

  async function handleNativeShare() {
    isSharing = true;
    try {
      const { url: shareUrl } = await buildShareableScanUrl(result);
      await shareSocialCard(result, shareUrl, matchedBreed);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        console.error('Native share error:', error);
      }
    } finally {
      isSharing = false;
    }
  }

  function handleViewBreedProfile() {
    if (!matchedBreed) return;
    void goto(`/breeds/${matchedBreed.id}`);
  }

  function handleSimulateMix() {
    if (matchedBreed) selectedMixBreedStore.set(matchedBreed);
    if (secondaryBreed) selectedMixBreedBStore.set(secondaryBreed);
    const query = [
      matchedBreed ? `a=${encodeURIComponent(matchedBreed.id)}` : null,
      secondaryBreed ? `b=${encodeURIComponent(secondaryBreed.id)}` : null
    ]
      .filter(Boolean)
      .join('&');
    void goto(query ? `/mixer?${query}` : '/mixer');
  }

  function handleCompareBreeds() {
    if (!matchedBreed || !secondaryBreed) return;
    selectedCompareBreedStore.set({ a: matchedBreed, b: secondaryBreed });
    void goto(`/compare?a=${matchedBreed.id}&b=${secondaryBreed.id}`);
  }

  function handleSimilarBreedClick(breed: BreedStats) {
    void goto(`/breeds/${breed.id}`);
  }

  function handleSaveMyDog() {
    setMyDogFromScan(result.id, {
      name: myDogName,
      age: myDogAge,
      weight: myDogWeight,
      notes: myDogNotes
    });
    existingMyDog = getMyDogProfile();
    myDogSaved = true;
    showMyDogForm = false;
    window.setTimeout(() => (myDogSaved = false), 2500);
  }

  function handleLinkScanToMyDog() {
    linkScanToMyDog(result.id);
    existingMyDog = getMyDogProfile();
    myDogSaved = true;
    window.setTimeout(() => (myDogSaved = false), 2500);
  }
</script>

<section class="result-card-section" aria-labelledby="result-title">
  <div class="result-toolbar">
    <div>
      <span class="eyebrow">Visual breed report</span>
      {#if isSharedResult}
        <span class="shared-badge">Opened from share link</span>
      {/if}
      {#if isSaved}<span class="saved-note"
          ><Bookmark size={13} strokeWidth={1.8} /> Saved locally</span
        >{/if}
      {#if myDogSaved}<span class="saved-note"
          ><Heart size={13} strokeWidth={1.8} /> Added to My Dog</span
        >{/if}
    </div>
    <button class="text-action" onclick={onResetScan}>Scan another dog</button>
  </div>

  <div class="result-layout">
    <div class="photo-column">
      <figure class="photo-frame">
        {#if result.imageUrl}
          <img
            src={result.imageUrl}
            alt={result.primaryBreed}
            class="result-img"
            loading="lazy"
            decoding="async"
          />
          <LightboxButton
            imageUrl={result.imageUrl}
            title={result.primaryBreed}
            position="top-left"
          />
        {/if}
        <div class="confidence-overlay-explainer">
          <ConfidenceExplainer compact analysisSource={result.analysisSource ?? 'gemini'} />
        </div>
        <figcaption class="confidence-overlay">
          <strong>{Math.round(result.confidenceScore * 100)}%</strong>
          <span>visual match</span>
        </figcaption>
      </figure>

      <div class="photo-actions">
        <button
          class="button button-primary preview-btn"
          onclick={handleOpenCardPreview}
          disabled={isGeneratingCard}
        >
          <Eye size={16} strokeWidth={1.8} aria-hidden="true" />
          <span>{isGeneratingCard ? 'Generating card…' : 'Preview report card'}</span>
        </button>
        {#if canShareNatively}
          <button class="button button-primary" onclick={handleNativeShare} disabled={isSharing}>
            <Share2 size={16} strokeWidth={1.8} aria-hidden="true" />
            <span>{isSharing ? 'Opening share…' : 'Share result'}</span>
          </button>
        {/if}
        <button
          class="button button-secondary"
          onclick={handleDownloadSocialCard}
          disabled={isGeneratingCard}
        >
          <Download size={16} strokeWidth={1.8} aria-hidden="true" />
          <span>{isGeneratingCard ? 'Preparing card…' : 'Download report card'}</span>
        </button>
        {#if canCopyImage}
          <button
            class="button button-secondary"
            onclick={handleCopyImage}
            disabled={isGeneratingCard}
          >
            <Clipboard size={16} strokeWidth={1.8} aria-hidden="true" />
            <span>{isImageCopied ? 'Image copied' : 'Copy report card'}</span>
          </button>
        {/if}
        <button
          class="button button-secondary"
          onclick={handleShareText}
          disabled={isBuildingShareLink}
        >
          <Copy size={16} strokeWidth={1.8} aria-hidden="true" />
          <span
            >{isShareCopied
              ? 'Summary copied'
              : isBuildingShareLink
                ? 'Building link…'
                : 'Copy summary'}</span
          >
        </button>
        <button
          class="button button-secondary"
          onclick={handleCopyLink}
          disabled={isBuildingShareLink}
        >
          <Link size={16} strokeWidth={1.8} aria-hidden="true" />
          <span
            >{isLinkCopied
              ? 'Link copied'
              : isBuildingShareLink
                ? 'Building link…'
                : 'Copy share link'}</span
          >
        </button>
        {#if shareLinkNote}
          <p class="share-link-note" role="status">{shareLinkNote}</p>
        {/if}
      </div>
    </div>

    <div class="report-column">
      <div class="result-heading">
        <div class="result-heading-top">
          <h1 id="result-title">{result.primaryBreed}</h1>
          <AnalysisSourceBadge
            analysisSource={result.analysisSource ?? 'fallback'}
            isDemoSample={result.isDemoSample ?? false}
          />
        </div>

        {#if matchedBreed}
          <div class="header-trait-pills" aria-label={`${matchedBreed.name} key traits`}>
            <span class="trait-pill energy"
              ><Zap size={13} strokeWidth={1.8} aria-hidden="true" /> Energy
              <strong>{matchedBreed.energyLevel}/5</strong></span
            >
            <span class="trait-pill strength"
              ><Dumbbell size={13} strokeWidth={1.8} aria-hidden="true" /> Strength
              <strong>{matchedBreed.strength}/5</strong></span
            >
            <span class="trait-pill grooming"
              ><Scissors size={13} strokeWidth={1.8} aria-hidden="true" /> Grooming
              <strong>{matchedBreed.groomingNeeds}/5</strong></span
            >
            <span class="trait-pill train"
              ><GraduationCap size={13} strokeWidth={1.8} aria-hidden="true" /> Trainability
              <strong>{matchedBreed.trainability}/5</strong></span
            >
          </div>
        {/if}

        <p class="confidence-summary">
          This photo is a <strong>{Math.round(result.confidenceScore * 100)}% visual match</strong> -
          an appearance-based estimate, not a DNA result.
        </p>
        <ConfidenceExplainer analysisSource={result.analysisSource ?? 'gemini'} />
        {#if result.analysisSource === 'fallback'}
          <p class="fallback-banner" role="note">
            {#if result.isDemoSample}
              This is a <strong>demo sample</strong> result. Built-in photos use pre-generated output,
              not live AI vision.
            {:else}
              <strong>AI vision was unavailable</strong> for this scan. The result below is a local placeholder
              estimate - not based on what your dog actually looks like.
            {/if}
          </p>
        {/if}
        <div class="result-meta">
          <span>{result.isMixed ? 'Mixed-breed profile' : 'Single-breed profile'}</span>
          <span>{result.detectedGender || 'Neutral behavior context'}</span>
          {#if result.aiModelUsed}<span>{result.aiModelUsed}</span>{/if}
        </div>
      </div>

      <section class="report-section explore-section">
        <div class="section-heading">
          <Sparkles size={17} strokeWidth={1.8} aria-hidden="true" />
          <h2>Explore further</h2>
        </div>
        <div class="explore-actions">
          {#if matchedBreed}
            <button class="explore-btn" type="button" onclick={handleViewBreedProfile}>
              <BookOpen size={15} strokeWidth={1.8} aria-hidden="true" />
              <span>View full breed profile</span>
            </button>
          {/if}
          {#if matchedBreed}
            <button class="explore-btn" type="button" onclick={handleSimulateMix}>
              <Shuffle size={15} strokeWidth={1.8} aria-hidden="true" />
              <span>Simulate this mix</span>
            </button>
          {/if}
          {#if matchedBreed && secondaryBreed}
            <button class="explore-btn" type="button" onclick={handleCompareBreeds}>
              <GitCompare size={15} strokeWidth={1.8} aria-hidden="true" />
              <span>Compare top two breeds</span>
            </button>
          {/if}
        </div>

        {#if similarBreeds.length > 0}
          <div class="similar-breeds">
            <h3>{matchedBreed ? 'Similar breeds' : 'Catalog breeds like your scan'}</h3>
            <div class="similar-grid">
              {#each similarBreeds as breed (breed.id)}
                <button
                  class="similar-chip"
                  type="button"
                  onclick={() => handleSimilarBreedClick(breed)}
                >
                  <img src={breed.imageUrl} alt="" loading="lazy" decoding="async" />
                  <span>{breed.name}</span>
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </section>

      <section class="report-section my-dog-section">
        <div class="section-heading">
          <Heart size={17} strokeWidth={1.8} aria-hidden="true" />
          <h2>My Dog</h2>
        </div>
        {#if existingMyDog && !showMyDogForm}
          <p class="my-dog-summary">
            Tracking <strong>{existingMyDog.name}</strong>
            {#if existingMyDog.age}
              · {existingMyDog.age}{/if}
            {#if existingMyDog.weight}
              · {existingMyDog.weight}{/if}
            · {existingMyDog.linkedScanIds.length} scan{existingMyDog.linkedScanIds.length === 1
              ? ''
              : 's'}
          </p>
          <div class="explore-actions">
            <button class="explore-btn" type="button" onclick={() => (showMyDogForm = true)}
              >Edit profile</button
            >
            {#if !existingMyDog.linkedScanIds.includes(result.id)}
              <button class="explore-btn" type="button" onclick={handleLinkScanToMyDog}
                >Link this scan</button
              >
            {/if}
          </div>
        {:else}
          <p class="my-dog-hint">
            Name your dog to track them across multiple photos on this device.
          </p>
          <div class="my-dog-form">
            <label>
              <span>Name</span>
              <input type="text" placeholder="e.g. Max" bind:value={myDogName} />
            </label>
            <label>
              <span>Age</span>
              <input type="text" placeholder="e.g. 3 years" bind:value={myDogAge} />
            </label>
            <label>
              <span>Weight</span>
              <input type="text" placeholder="e.g. 28 lbs" bind:value={myDogWeight} />
            </label>
            <label class="full-width">
              <span>Notes</span>
              <textarea
                placeholder="Rescue from shelter, loves fetch…"
                bind:value={myDogNotes}
                rows="2"></textarea>
            </label>
          </div>
          <button
            class="explore-btn primary"
            type="button"
            onclick={handleSaveMyDog}
            disabled={!myDogName.trim()}
          >
            Save as My Dog
          </button>
        {/if}
      </section>

      <AncestryBreakdown mixBreakdown={result.mixBreakdown} />

      <GenderBehaviorBlock
        summary={result.genderComparisonAdvice}
        maleTraits={result.maleBehavioralTraits}
        femaleTraits={result.femaleBehavioralTraits}
        showTabs={true}
      />

      {#if matchedBreed}
        <section class="report-section">
          <div class="section-heading">
            <Building2 size={17} strokeWidth={1.8} aria-hidden="true" />
            <h2>Living with a {matchedBreed.name}</h2>
          </div>
          <LifestyleGrid breed={matchedBreed} />
        </section>
      {/if}

      <section class="report-section">
        <div class="section-heading">
          <CheckCircle size={17} strokeWidth={1.8} aria-hidden="true" />
          <h2>Visual traits we noticed</h2>
        </div>
        <ul class="traits-list">
          {#each result.visualTraits as trait}
            <li><span class="trait-bullet"></span><span>{trait}</span></li>
          {/each}
        </ul>
      </section>

      {#if ownerGuidance}
        <OwnerGuidancePanel
          guidance={ownerGuidance}
          {isOffCatalog}
          breedLabel={result.primaryBreed}
        />
        <CareRecommendations guidance={ownerGuidance} />
      {/if}
      <VetDisclaimerCard />
      <ReportResultFeedback {result} />
    </div>
  </div>
</section>

{#if showCardPreviewModal && previewCardUrl}
  <div
    class="report-card-modal-backdrop"
    role="dialog"
    aria-modal="true"
    aria-labelledby="preview-modal-title"
  >
    <button
      class="backdrop-click-target"
      type="button"
      onclick={() => (showCardPreviewModal = false)}
      aria-label="Close preview modal"
    ></button>
    <div class="report-card-modal-content" role="document">
      <div class="modal-header">
        <div>
          <span class="eyebrow">Official Graphic Export</span>
          <h2 id="preview-modal-title">{result.primaryBreed} Report Card</h2>
        </div>
        <button
          class="modal-close-btn"
          type="button"
          onclick={() => (showCardPreviewModal = false)}
          aria-label="Close preview modal">✕</button
        >
      </div>
      <div class="modal-body">
        <img
          src={previewCardUrl}
          alt={`${result.primaryBreed} Official Report Card`}
          class="card-preview-img"
        />
      </div>
      <div class="modal-footer">
        <button
          class="button button-primary"
          type="button"
          onclick={handleDownloadSocialCard}
          disabled={isGeneratingCard}
        >
          <Download size={16} strokeWidth={1.8} aria-hidden="true" />
          <span>Download JPEG</span>
        </button>
        {#if canCopyImage}
          <button
            class="button button-secondary"
            type="button"
            onclick={handleCopyImage}
            disabled={isGeneratingCard}
          >
            <Clipboard size={16} strokeWidth={1.8} aria-hidden="true" />
            <span>{isImageCopied ? 'Copied image' : 'Copy to clipboard'}</span>
          </button>
        {/if}
        {#if canShareNatively}
          <button
            class="button button-secondary"
            type="button"
            onclick={handleNativeShare}
            disabled={isSharing}
          >
            <Share2 size={16} strokeWidth={1.8} aria-hidden="true" />
            <span>{isSharing ? 'Sharing…' : 'Share'}</span>
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .result-card-section {
    width: min(100% - 2rem, 1160px);
    margin: 0 auto;
    padding: 3.5rem 0 5rem;
  }

  .result-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.7rem;
  }

  .saved-note {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-left: 0.8rem;
    color: var(--accent-primary);
    font-size: 0.72rem;
    font-weight: 700;
  }

  .shared-badge {
    display: inline-flex;
    margin-left: 0.8rem;
    padding: 0.15rem 0.45rem;
    border: 1px solid var(--border-highlight);
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--accent-primary);
    font-size: 0.68rem;
    font-weight: 700;
  }

  .text-action {
    border: 0;
    border-bottom: 1px solid var(--border-highlight);
    background: transparent;
    color: var(--accent-primary);
    font-size: 0.8rem;
    font-weight: 700;
  }

  .result-layout {
    display: grid;
    grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
    gap: clamp(2rem, 5vw, 4rem);
    align-items: start;
  }

  .photo-frame {
    position: relative;
    height: 430px;
    margin: 0;
    overflow: hidden;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    background: var(--bg-surface);
  }

  .result-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .confidence-overlay {
    position: absolute;
    right: 0.9rem;
    bottom: 0.9rem;
    display: grid;
    gap: 0.12rem;
    min-width: 84px;
    padding: 0.55rem 0.7rem;
    border: 1px solid rgba(255, 255, 255, 0.24);
    border-radius: var(--radius-sm);
    background: rgba(8, 15, 10, 0.82);
    color: #ffffff;
    text-align: center;
  }

  .confidence-overlay strong {
    font-family: var(--font-display);
    font-size: 1.35rem;
    line-height: 1;
  }

  .confidence-overlay span {
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.68);
  }

  .confidence-overlay-explainer {
    position: absolute;
    left: 0.9rem;
    bottom: 0.9rem;
    max-width: calc(100% - 7rem);
  }

  .confidence-overlay-explainer :global(.explainer-trigger) {
    color: rgba(255, 255, 255, 0.72);
  }

  .confidence-overlay-explainer :global(.explainer-trigger:hover) {
    color: #ffffff;
  }

  .confidence-overlay-explainer :global(.explainer-panel) {
    position: absolute;
    left: 0;
    bottom: calc(100% + 0.4rem);
    z-index: 2;
    width: min(280px, calc(100vw - 3rem));
  }

  .photo-actions {
    display: grid;
    gap: 0.55rem;
    margin-top: 0.8rem;
  }

  .share-link-note {
    grid-column: 1 / -1;
    margin: 0;
    font-size: 0.72rem;
    line-height: 1.45;
    color: var(--text-subtle);
  }

  .button {
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    padding: 0.55rem 0.8rem;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    font-size: 0.76rem;
    font-weight: 700;
    transition:
      transform 160ms ease,
      border-color 160ms ease,
      background-color 160ms ease;
  }

  .button:hover:not(:disabled) {
    transform: translateY(-1px);
  }
  .button:disabled {
    cursor: wait;
    opacity: 0.62;
  }
  .button-primary {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: var(--text-inverse);
  }
  .button-primary:hover:not(:disabled) {
    background: var(--accent-strong);
    border-color: var(--accent-strong);
  }
  .button-secondary {
    background: transparent;
    border-color: var(--border-strong);
    color: var(--text-main);
  }
  .button-secondary:hover:not(:disabled) {
    border-color: var(--border-highlight);
    background: var(--accent-soft);
  }

  .report-column {
    min-width: 0;
  }

  .result-heading {
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border-subtle);
  }

  .result-heading-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .header-trait-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.8rem;
  }

  .trait-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.55rem;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    background: var(--bg-surface);
    color: var(--text-muted);
    font-size: 0.72rem;
    font-weight: 600;
  }

  .trait-pill strong {
    color: var(--text-main);
  }
  .trait-pill.energy :global(svg) {
    color: var(--warning);
  }
  .trait-pill.strength :global(svg) {
    color: #c97a5a;
  }
  .trait-pill.grooming :global(svg) {
    color: var(--info);
  }
  .trait-pill.train :global(svg) {
    color: var(--accent-primary);
  }

  .preview-btn {
    width: 100%;
    background: var(--accent-soft);
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }

  .preview-btn:hover:not(:disabled) {
    background: var(--accent-primary);
    color: var(--text-inverse);
  }

  /* Modal Backdrop & Preview Dialog */
  .report-card-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgba(8, 12, 18, 0.86);
    backdrop-filter: blur(8px);
    animation: fadeIn 200ms ease;
  }

  .backdrop-click-target {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  .report-card-modal-content {
    position: relative;
    z-index: 1;
    width: min(100%, 640px);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border-highlight);
    border-radius: var(--radius-lg);
    background: var(--bg-card);
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
    animation: scaleUp 220ms ease;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border-subtle);
    background: var(--bg-surface);
  }

  .modal-header h2 {
    font-size: 1.15rem;
    margin-top: 0.15rem;
  }

  .modal-close-btn {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border: 1px solid var(--border-strong);
    border-radius: 50%;
    background: transparent;
    color: var(--text-muted);
    font-size: 1.1rem;
    cursor: pointer;
    transition:
      background-color 160ms ease,
      color 160ms ease;
  }

  .modal-close-btn:hover {
    background: var(--accent-soft);
    color: var(--text-main);
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem;
    display: flex;
    justify-content: center;
    background: #090d16;
  }

  .card-preview-img {
    width: 100%;
    max-width: 520px;
    height: auto;
    border-radius: var(--radius-md);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
  }

  .modal-footer {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    padding: 1rem 1.25rem;
    border-top: 1px solid var(--border-subtle);
    background: var(--bg-surface);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes scaleUp {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .result-heading h1 {
    margin-top: 0.45rem;
    font-size: clamp(2rem, 4vw, 3.4rem);
    line-height: 1;
  }

  .confidence-summary {
    max-width: 58ch;
    margin-top: 0.8rem;
    font-size: 0.9rem;
    line-height: 1.65;
  }

  .confidence-summary strong {
    color: var(--text-main);
  }

  .fallback-banner {
    margin-top: 0.75rem;
    padding: 0.65rem 0.75rem;
    border: 1px solid color-mix(in srgb, var(--warning) 45%, var(--border-subtle));
    border-radius: var(--radius-sm);
    background: color-mix(in srgb, var(--warning) 8%, transparent);
    color: var(--text-muted);
    font-size: 0.78rem;
    line-height: 1.55;
  }

  .fallback-banner strong {
    color: var(--warning);
  }

  .result-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1rem;
    margin-top: 1rem;
    color: var(--text-subtle);
    font-size: 0.72rem;
  }

  .result-meta span + span::before {
    content: '·';
    margin-right: 1rem;
    color: var(--border-highlight);
  }

  .report-section {
    padding: 1.45rem 0;
    border-bottom: 1px solid var(--border-subtle);
  }

  .section-heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    color: var(--accent-primary);
  }

  .section-heading h2 {
    font-size: 1.05rem;
    font-weight: 800;
  }

  .explore-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .explore-btn {
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: var(--bg-card);
    color: var(--text-main);
    font-size: 0.74rem;
    font-weight: 700;
    transition:
      border-color 160ms ease,
      background-color 160ms ease;
  }

  .explore-btn:hover {
    border-color: var(--border-highlight);
    background: var(--accent-soft);
  }

  .explore-btn.primary {
    margin-top: 0.75rem;
    border-color: var(--accent-primary);
    background: var(--accent-primary);
    color: var(--text-inverse);
  }

  .explore-btn.primary:hover:not(:disabled) {
    background: var(--accent-strong);
    border-color: var(--accent-strong);
  }

  .explore-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .similar-breeds {
    margin-top: 1.1rem;
  }

  .similar-breeds h3 {
    margin-bottom: 0.65rem;
    color: var(--text-muted);
    font-size: 0.78rem;
    font-weight: 700;
  }

  .similar-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .similar-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.35rem 0.55rem 0.35rem 0.35rem;
    border: 1px solid var(--border-subtle);
    border-radius: 999px;
    background: var(--bg-card);
    color: var(--text-main);
    font-size: 0.72rem;
    font-weight: 600;
  }

  .similar-chip img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
  }

  .similar-chip:hover {
    border-color: var(--border-highlight);
    background: var(--accent-soft);
  }

  .my-dog-hint,
  .my-dog-summary {
    margin-bottom: 0.75rem;
    color: var(--text-muted);
    font-size: 0.82rem;
    line-height: 1.55;
  }

  .my-dog-summary strong {
    color: var(--text-main);
  }

  .my-dog-form {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.65rem;
    margin-bottom: 0.25rem;
  }

  .my-dog-form label {
    display: grid;
    gap: 0.3rem;
  }

  .my-dog-form label.full-width {
    grid-column: 1 / -1;
  }

  .my-dog-form label span {
    color: var(--text-subtle);
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .my-dog-form input,
  .my-dog-form textarea {
    min-height: 36px;
    padding: 0.45rem 0.6rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: var(--bg-card);
    color: var(--text-main);
    font-size: 0.8rem;
  }

  .my-dog-form textarea {
    resize: vertical;
    min-height: 56px;
  }

  .traits-list {
    list-style: none;
    display: grid;
    gap: 0.6rem;
  }

  .traits-list li {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    color: var(--text-main);
    font-size: 0.88rem;
  }

  .trait-bullet {
    width: 6px;
    height: 6px;
    margin-top: 0.55rem;
    border-radius: 50%;
    background: var(--accent-primary);
    flex: 0 0 auto;
  }

  @media (max-width: 820px) {
    .result-layout {
      grid-template-columns: 1fr;
    }
    .photo-frame {
      height: min(68vw, 420px);
    }
    .my-dog-form {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 560px) {
    .result-card-section {
      width: min(100% - 1.25rem, 1160px);
      padding-top: 2.25rem;
    }
    .result-toolbar {
      align-items: flex-start;
      flex-direction: column;
    }
    .photo-actions {
      grid-template-columns: 1fr;
    }
  }
</style>
