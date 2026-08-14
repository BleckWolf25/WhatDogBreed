<script lang="ts">
  import { tick } from 'svelte';
  import { onDestroy, onMount } from 'svelte';
  import { AlertCircle, Camera, Check, LoaderCircle, RefreshCw, Upload } from '@lucide/svelte';
  import {
    compressAndEncodeImage,
    dataUrlToBlob,
    resolvePersistableImageUrl
  } from '$lib/services/imageProcessor';
  import type { ScanResult } from '$lib/types/scan';
  import GenderProfileSelector from '$lib/components/scan/GenderProfileSelector.svelte';
  import ScanAnimationLaser from '$lib/components/scan/ScanAnimationLaser.svelte';
  import PhotoGuidanceOverlay from '$lib/components/scan/PhotoGuidanceOverlay.svelte';
  import PhotoTipsPanel from '$lib/components/scan/PhotoTipsPanel.svelte';
  import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
  import {
    analyzePhotoQuality,
    getPhotoQualityMessage,
    type PhotoQualityResult
  } from '$lib/services/photoQualityCheck';

  let { onScanComplete }: { onScanComplete: (result: ScanResult) => void } = $props();

  let isDragging = $state(false);
  let isCameraActive = $state(false);
  let isLoading = $state(false);
  let imagePreviewUrl = $state<string | null>(null);
  let errorMessage = $state<string | null>(null);
  let selectedGenderProfile = $state<'Auto' | 'Male' | 'Female'>('Auto');
  let isSamplePhoto = $state(false);
  let sampleSourceUrl = $state<string | null>(null);
  let photoQuality = $state<PhotoQualityResult | null>(null);
  let isCheckingQuality = $state(false);
  let isOffline = $state(false);
  let activeDisplayDogUrl = $state('/images/goldenRetriever.jpg');

  let videoElement = $state<HTMLVideoElement | null>(null);
  let mediaStream = $state<MediaStream | null>(null);
  let fileInputRef = $state<HTMLInputElement | null>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const SAMPLE_DOGS = [
    { name: 'Golden Retriever', shortName: 'Golden', url: '/images/goldenRetriever.jpg' },
    { name: 'German Shepherd', shortName: 'Shepherd', url: '/images/germanShepherd.jpg' },
    { name: 'Labrador Retriever', shortName: 'Labrador', url: '/images/labradorRetriever.jpg' },
    { name: 'Siberian Husky', shortName: 'Husky', url: '/images/siberianHusky.jpg' }
  ];

  onDestroy(() => {
    stopCameraStream();
  });

  onMount(() => {
    isOffline = !navigator.onLine;

    const goOffline = () => (isOffline = true);
    const goOnline = () => (isOffline = false);

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);

    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  });

  async function evaluatePhotoQuality(imageUrl: string) {
    isCheckingQuality = true;
    try {
      photoQuality = await analyzePhotoQuality(imageUrl);
    } catch {
      photoQuality = null;
    } finally {
      isCheckingQuality = false;
    }
  }

  function stopCameraStream() {
    mediaStream?.getTracks().forEach((track) => track.stop());
    mediaStream = null;
    isCameraActive = false;
  }

  async function startCamera() {
    errorMessage = null;
    if (!navigator.mediaDevices?.getUserMedia) {
      errorMessage = 'This browser does not support live camera access. Choose a photo instead.';
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      mediaStream = stream;
      isCameraActive = true;
      await tick();
      if (videoElement) {
        videoElement.srcObject = stream;
        await videoElement.play().catch(() => undefined);
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      errorMessage =
        'Camera access was blocked. Check browser permissions or choose a photo file instead.';
      stopCameraStream();
    }
  }

  function captureCameraPhoto() {
    if (!videoElement) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 480;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    isSamplePhoto = false;
    sampleSourceUrl = null;
    imagePreviewUrl = canvas.toDataURL('image/jpeg', 0.85);
    stopCameraStream();
    void evaluatePhotoQuality(imagePreviewUrl);
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  async function handleFileDrop(event: DragEvent) {
    event.preventDefault();
    isDragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) await processSelectedFile(file);
  }

  async function handleFileInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) await processSelectedFile(file);
  }

  function isSupportedImageFile(file: File): boolean {
    if (!file) return false;
    const mime = file.type ? file.type.toLowerCase().trim() : '';
    if (mime.startsWith('image/')) return true;
    const name = file.name ? file.name.toLowerCase() : '';
    return /\.(jpg|jpeg|png|webp|heic|heif|avif|bmp|tiff)$/i.test(name);
  }

  async function processSelectedFile(file: File) {
    errorMessage = null;
    isSamplePhoto = false;
    sampleSourceUrl = null;

    if (!isSupportedImageFile(file)) {
      errorMessage = 'Choose a JPEG, PNG, WebP, or HEIC image file.';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      errorMessage = 'That image is larger than 5 MB. Choose a smaller photo and try again.';
      return;
    }

    try {
      imagePreviewUrl = await compressAndEncodeImage(file);
      await evaluatePhotoQuality(imagePreviewUrl);
    } catch (error) {
      console.error('Image processing failed:', error);
      errorMessage = 'We could not process that photo. Try another image file.';
    }
  }

  async function loadSampleDog(url: string) {
    errorMessage = null;
    isSamplePhoto = true;
    sampleSourceUrl = url;
    activeDisplayDogUrl = url;
    photoQuality = null;

    try {
      imagePreviewUrl = await resolvePersistableImageUrl(url);
      await evaluatePhotoQuality(imagePreviewUrl);
    } catch (error) {
      console.error('Sample photo load failed:', error);
      errorMessage = 'That sample photo could not be loaded. Try uploading your own photo instead.';
      isSamplePhoto = false;
      sampleSourceUrl = null;
      imagePreviewUrl = null;
    }
  }

  function handleReset() {
    imagePreviewUrl = null;
    errorMessage = null;
    isSamplePhoto = false;
    sampleSourceUrl = null;
    photoQuality = null;
    stopCameraStream();
    if (fileInputRef) fileInputRef.value = '';
  }

  async function handleScanSubmit() {
    if (!imagePreviewUrl || isLoading) return;

    if (!navigator.onLine) {
      errorMessage = 'You are offline. Connect to the internet to run a breed scan.';
      return;
    }

    isLoading = true;
    errorMessage = null;

    try {
      const genderParam = selectedGenderProfile !== 'Auto' ? selectedGenderProfile : undefined;
      const persistableImageUrl = await resolvePersistableImageUrl(imagePreviewUrl);
      const blob = await dataUrlToBlob(persistableImageUrl);
      const formData = new FormData();
      formData.append('image', blob, 'scan.jpg');
      if (genderParam) formData.append('gender', genderParam);
      if (isSamplePhoto && sampleSourceUrl) {
        formData.append('sampleSource', sampleSourceUrl);
      }

      const response = await fetch('/api/scan', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || 'The scan could not be completed.');
      }

      const resultData: ScanResult = await response.json();
      isLoading = false;
      void import('@vercel/analytics').then(({ track }) => track('scan_complete'));
      onScanComplete({ ...resultData, imageUrl: persistableImageUrl });
    } catch (error) {
      console.error('Scan submission error:', error);
      isLoading = false;
      void import('@vercel/analytics').then(({ track }) =>
        track('scan_failed', {
          status: error instanceof Error && error.message.includes('Too many') ? '429' : 'error'
        })
      );
      errorMessage =
        error instanceof Error
          ? error.message
          : 'The scan could not be completed. Please try again.';
    }
  }
</script>

<section class="scanner-section" aria-labelledby="scanner-title">
  <div class="scanner-intro-row">
    <div class="scanner-intro">
      <span class="eyebrow">Photo identification</span>
      <h1 id="scanner-title">Find out what makes your dog unique.</h1>
      <p>
        Upload a clear photo for an estimated breed mix and practical care context. Start with a
        face-forward image in good light for the most useful result.
      </p>
    </div>

    <ul class="trust-facts" aria-label="What the scan provides">
      <li><span>Breed mix estimate</span><strong>From one photo</strong></li>
      <li><span>Trait context</span><strong>Easy to understand</strong></li>
      <li><span>Saved locally</span><strong>On your device</strong></li>
    </ul>
  </div>

  {#if errorMessage}
    <div class="error-banner" role="alert" aria-live="assertive">
      <AlertCircle size={18} strokeWidth={1.8} aria-hidden="true" />
      <span>{errorMessage}</span>
    </div>
  {/if}

  {#if isLoading && imagePreviewUrl}
    <div class="scanner-state-surface" aria-busy="true">
      <ScanAnimationLaser {imagePreviewUrl} />
    </div>
  {:else if isCameraActive}
    <div class="camera-container surface">
      <div class="camera-heading">
        <div>
          <span class="eyebrow">Live camera</span>
          <h2>Frame your dog clearly</h2>
        </div>
        <span class="camera-status"><span class="status-dot"></span> Camera ready</span>
      </div>
      <div class="video-wrapper">
        <video
          bind:this={videoElement}
          autoplay
          playsinline
          muted
          class="video-feed"
          aria-label="Live camera preview"
        ></video>
        <PhotoGuidanceOverlay />
      </div>
      <div class="camera-controls">
        <button class="button button-primary" onclick={captureCameraPhoto}>
          <Camera size={17} strokeWidth={1.8} aria-hidden="true" />
          <span>Capture photo</span>
        </button>
        <button class="button button-secondary" onclick={stopCameraStream}>Cancel</button>
      </div>
    </div>
  {:else if imagePreviewUrl}
    <div class="preview-surface surface">
      <div class="preview-copy">
        <span class="eyebrow">Photo ready</span>
        <h2>Review before you scan</h2>
        <p>This visual estimate is based on the features visible in your photo, not a DNA test.</p>
        {#if isSamplePhoto}
          <p class="sample-notice">
            <StatusBadge variant="demo" label="Demo photo" />
            Sample photos use demo mode - results are pre-generated, not live AI vision.
          </p>
        {/if}
      </div>
      <div class="preview-layout">
        <div class="preview-image-wrap">
          <img
            src={imagePreviewUrl}
            alt="Selected dog preview"
            class="preview-img"
            loading="lazy"
            decoding="async"
          />
          <PhotoGuidanceOverlay compact />
        </div>
        <div class="preview-side">
          {#if isCheckingQuality}
            <p class="quality-checking" aria-live="polite">Checking photo quality…</p>
          {:else if photoQuality && photoQuality.warnings.length > 0}
            <div class="quality-warnings" role="status">
              {#each photoQuality.warnings as warning}
                <p>{getPhotoQualityMessage(warning)}</p>
              {/each}
            </div>
          {:else if photoQuality?.ok}
            <p class="quality-ok" role="status">Photo quality looks good for scanning.</p>
          {/if}
          <div class="preview-actions">
            {#if isOffline}
              <p class="offline-scan-note" role="status">
                You’re offline. Reconnect to run a breed scan - cached breed pages may still work.
              </p>
            {/if}
            <button
              class="button button-primary"
              onclick={handleScanSubmit}
              disabled={isLoading || isOffline}
            >
              {#if isLoading}<LoaderCircle
                  class="button-spinner"
                  size={17}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />{:else}<Check size={17} strokeWidth={1.8} aria-hidden="true" />{/if}
              <span>Scan this photo</span>
            </button>
            <button class="button button-secondary" onclick={handleReset}>
              <RefreshCw size={16} strokeWidth={1.8} aria-hidden="true" />
              <span>Choose another photo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="scanner-workspace surface">
      <div class="photo-panel">
        <div class="photo-panel-image">
          <img src={activeDisplayDogUrl} alt="" loading="lazy" decoding="async" />
          <div class="photo-caption">
            <strong>Start with a clear view</strong>
            <span>Face, ears, coat, and body shape help build context.</span>
          </div>
        </div>
        <div class="photo-strip" aria-label="Sample photo previews">
          {#each SAMPLE_DOGS as sample}
            <button
              type="button"
              class="photo-strip-thumb"
              class:active={activeDisplayDogUrl === sample.url}
              onclick={() => (activeDisplayDogUrl = sample.url)}
              title={`Preview ${sample.name}`}
              aria-label={`Preview ${sample.name}`}
            >
              <img src={sample.url} alt={sample.name} loading="lazy" decoding="async" />
            </button>
          {/each}
        </div>
      </div>

      <div class="upload-panel">
        <div class="panel-heading">
          <div>
            <span class="eyebrow">Your next step</span>
            <h2>Add a dog photo</h2>
          </div>
          <span class="panel-kicker">Optional context</span>
        </div>
        <p class="panel-description">
          A well-lit photo with your dog facing the camera works best. You can also use a sample
          below to explore the experience.
        </p>

        <PhotoTipsPanel />

        <div
          class="upload-drop-panel {isDragging ? 'dragging' : ''}"
          ondragover={handleDragOver}
          ondragleave={handleDragLeave}
          ondrop={handleFileDrop}
          role="group"
          aria-label="Drop a dog photo here"
        >
          <input
            id="dog-photo-input"
            class="hidden-file-input"
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.webp,.heic,.heif,.avif"
            bind:this={fileInputRef}
            onchange={handleFileInputChange}
          />
          <div class="upload-icon" aria-hidden="true"><Upload size={21} strokeWidth={1.8} /></div>
          <h3>Choose a photo</h3>
          <p>JPEG, PNG, or WebP · up to 5 MB · or drag and drop here</p>
          <div class="upload-actions">
            <button class="button button-primary" onclick={() => fileInputRef?.click()}>
              <Upload size={16} strokeWidth={1.8} aria-hidden="true" />
              <span>Choose a photo</span>
            </button>
            <button class="button button-secondary" onclick={startCamera}>
              <Camera size={16} strokeWidth={1.8} aria-hidden="true" />
              <span>Use camera</span>
            </button>
          </div>
        </div>
        <p class="privacy-note">
          <span aria-hidden="true">⌑</span>
          Photos stay on this device until you scan.
          <a href="/privacy">What happens when you scan?</a>
        </p>

        <GenderProfileSelector bind:selectedGenderProfile />

        <div class="sample-row">
          <div class="sample-row-heading">
            <span>Try a sample</span><span>Explore the experience</span>
          </div>
          <div class="sample-buttons">
            {#each SAMPLE_DOGS as sample}
              <button class="sample-button" onclick={() => loadSampleDog(sample.url)}>
                <img src={sample.url} alt="" loading="lazy" decoding="async" />
                <span>{sample.shortName}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}
</section>

<style>
  .scanner-section {
    width: min(100% - 2rem, var(--content-max));
    margin: 0 auto;
    padding: 3.5rem 0 5rem;
  }

  .scanner-intro-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 0.72fr);
    align-items: end;
    gap: 3rem;
    margin-bottom: 2.3rem;
  }

  .scanner-intro {
    max-width: 650px;
  }

  .scanner-intro h1 {
    max-width: 620px;
    margin-top: 0.65rem;
    font-size: clamp(2.5rem, 5vw, 4.25rem);
    font-weight: 800;
    line-height: 0.98;
  }

  .scanner-intro p {
    max-width: 680px;
    margin-top: 1.1rem;
    font-size: 1rem;
    line-height: 1.7;
  }

  .trust-facts {
    list-style: none;
    border-top: 1px solid var(--border-strong);
  }

  .trust-facts li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.7rem 0;
    border-bottom: 1px solid var(--border-strong);
    font-size: 0.78rem;
  }

  .trust-facts span {
    color: var(--text-muted);
  }

  .trust-facts strong {
    color: var(--text-main);
    font-size: 0.75rem;
    font-weight: 700;
    text-align: right;
  }

  .error-banner {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    margin-bottom: 1rem;
    padding: 0.8rem 0.95rem;
    border: 1px solid color-mix(in srgb, var(--danger) 55%, transparent);
    border-radius: var(--radius-md);
    background: color-mix(in srgb, var(--danger) 9%, var(--bg-card));
    color: var(--danger);
    font-size: 0.84rem;
  }

  .surface {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
  }

  .scanner-workspace {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
    min-height: 560px;
    overflow: hidden;
    align-items: stretch;
  }

  .photo-panel {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 1.15rem;
    border-right: 1px solid var(--border-subtle);
    height: 100%;
    min-height: 0;
  }

  .photo-panel-image {
    position: relative;
    flex: 1 1 0%;
    min-height: 380px;
    height: 100%;
    overflow: hidden;
    border-radius: var(--radius-md);
    background: var(--bg-surface);
  }

  .photo-panel-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .photo-panel-image::after {
    position: absolute;
    inset: 45% 0 0;
    background: linear-gradient(transparent, rgba(7, 14, 9, 0.85));
    content: '';
    pointer-events: none;
  }

  .photo-caption {
    position: absolute;
    z-index: 1;
    right: 1rem;
    bottom: 0.95rem;
    left: 1rem;
    display: grid;
    gap: 0.25rem;
    color: #ffffff;
  }

  .photo-caption strong {
    font-family: var(--font-display);
    font-size: 1.25rem;
  }

  .photo-caption span {
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.75rem;
  }

  .photo-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    margin-top: 0;
    flex-shrink: 0;
  }

  .photo-strip-thumb {
    display: block;
    padding: 0;
    border: 2px solid transparent;
    border-radius: var(--radius-sm);
    background: transparent;
    cursor: pointer;
    overflow: hidden;
    transition:
      border-color 160ms ease,
      transform 160ms ease;
  }

  .photo-strip-thumb:hover,
  .photo-strip-thumb.active {
    border-color: var(--accent-primary);
    transform: translateY(-1px);
  }

  .photo-strip-thumb img {
    width: 100%;
    height: 52px;
    border-radius: calc(var(--radius-sm) - 2px);
    object-fit: cover;
    opacity: 0.84;
    transition: opacity 160ms ease;
  }

  .photo-strip-thumb:hover img,
  .photo-strip-thumb.active img {
    opacity: 1;
  }

  .upload-panel {
    padding: 2rem 1.8rem 1.4rem;
  }

  .panel-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .panel-heading h2,
  .camera-heading h2,
  .preview-copy h2 {
    margin-top: 0.45rem;
    font-size: 1.55rem;
    line-height: 1.1;
  }

  .panel-kicker {
    color: var(--text-subtle);
    font-size: 0.72rem;
  }

  .panel-description {
    margin-top: 0.65rem;
    font-size: 0.82rem;
    line-height: 1.6;
  }

  .upload-drop-panel {
    margin-top: 1.3rem;
    padding: 1.3rem;
    border: 1px dashed var(--border-strong);
    border-radius: var(--radius-md);
    text-align: center;
    transition:
      border-color 160ms ease,
      background-color 160ms ease;
  }

  .upload-drop-panel.dragging {
    border-color: var(--accent-primary);
    background: var(--accent-soft);
  }

  .hidden-file-input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    clip-path: inset(50%);
  }

  .upload-icon {
    width: 40px;
    height: 40px;
    margin: 0 auto 0.75rem;
    display: grid;
    place-items: center;
    border: 1px solid var(--border-strong);
    border-radius: 10px;
    color: var(--accent-primary);
    background: var(--accent-soft);
  }

  .upload-drop-panel h3 {
    font-size: 1rem;
  }

  .upload-drop-panel p {
    margin-top: 0.3rem;
    font-size: 0.72rem;
  }

  .upload-actions,
  .preview-actions,
  .camera-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
    flex-wrap: wrap;
  }

  .upload-actions {
    margin-top: 1rem;
  }

  .button {
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    padding: 0.55rem 0.85rem;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    font-size: 0.77rem;
    font-weight: 700;
    transition:
      transform 160ms ease,
      border-color 160ms ease,
      background-color 160ms ease;
  }

  .button:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  .button:active:not(:disabled) {
    transform: translateY(0);
  }

  .button:disabled {
    cursor: wait;
    opacity: 0.65;
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

  .privacy-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    flex-wrap: wrap;
    margin-top: 0.7rem;
    font-size: 0.7rem;
    color: var(--text-subtle);
  }

  .privacy-note a {
    color: var(--accent-primary);
    font-weight: 700;
  }

  .privacy-note a:hover {
    text-decoration: underline;
  }

  .sample-notice {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    flex-wrap: wrap;
    margin-top: 0.65rem;
    color: var(--warning);
    font-size: 0.76rem;
    line-height: 1.45;
  }

  .sample-row {
    margin-top: 1.35rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-subtle);
  }

  .sample-row-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.7rem;
    color: var(--text-main);
    font-size: 0.78rem;
    font-weight: 700;
  }

  .sample-row-heading span:last-child {
    color: var(--text-subtle);
    font-size: 0.68rem;
    font-weight: 500;
  }

  .sample-buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
  }

  .sample-button {
    min-width: 0;
    display: grid;
    justify-items: center;
    gap: 0.3rem;
    padding: 0.15rem;
    border: 0;
    background: transparent;
    color: var(--text-muted);
    font-size: 0.68rem;
    font-weight: 600;
  }

  .sample-button:hover {
    color: var(--text-main);
  }

  .sample-button img {
    width: 42px;
    height: 42px;
    border: 2px solid transparent;
    border-radius: 50%;
    object-fit: cover;
    transition:
      border-color 160ms ease,
      transform 160ms ease;
  }

  .sample-button:hover img {
    border-color: var(--accent-primary);
    transform: scale(1.04);
  }

  .scanner-state-surface,
  .preview-surface,
  .camera-container {
    padding: 2rem;
  }

  .preview-surface {
    display: grid;
    gap: 1.3rem;
  }

  .preview-copy p {
    margin-top: 0.45rem;
    font-size: 0.86rem;
  }

  .preview-layout {
    display: grid;
    grid-template-columns: minmax(220px, 0.72fr) 1fr;
    align-items: center;
    gap: 1.5rem;
  }

  .preview-img {
    width: 100%;
    height: 300px;
    border-radius: var(--radius-md);
    object-fit: cover;
  }

  .preview-actions {
    justify-content: flex-start;
  }

  .camera-container {
    display: grid;
    gap: 1rem;
  }

  .camera-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .camera-status {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--text-muted);
    font-size: 0.75rem;
  }

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent-primary);
  }

  .video-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-md);
  }

  .preview-image-wrap {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-md);
  }

  .preview-side {
    display: grid;
    gap: 0.85rem;
    align-content: start;
  }

  .quality-checking,
  .quality-ok {
    font-size: 0.78rem;
    line-height: 1.5;
  }

  .quality-ok {
    color: var(--accent-primary);
    font-weight: 700;
  }

  .offline-scan-note {
    padding: 0.65rem 0.75rem;
    border: 1px solid color-mix(in srgb, var(--warning) 45%, var(--border-subtle));
    border-radius: var(--radius-sm);
    background: color-mix(in srgb, var(--warning) 8%, transparent);
    color: var(--text-main);
    font-size: 0.78rem;
    line-height: 1.5;
  }

  .quality-warnings {
    display: grid;
    gap: 0.45rem;
    padding: 0.75rem;
    border: 1px solid color-mix(in srgb, var(--warning) 45%, var(--border-subtle));
    border-radius: var(--radius-sm);
    background: color-mix(in srgb, var(--warning) 8%, transparent);
  }

  .quality-warnings p {
    font-size: 0.76rem;
    line-height: 1.45;
    color: var(--text-muted);
  }

  .video-feed {
    width: 100%;
    height: min(62vh, 520px);
    min-height: 280px;
    border-radius: var(--radius-md);
    background: #050907;
    object-fit: cover;
  }

  :global(.button-spinner) {
    animation: spin 900ms linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 820px) {
    .scanner-intro-row,
    .scanner-workspace {
      grid-template-columns: 1fr;
    }

    .scanner-intro-row {
      gap: 1.5rem;
    }

    .photo-panel {
      height: auto;
      border-right: 0;
      border-bottom: 1px solid var(--border-subtle);
    }

    .photo-panel-image {
      flex: none;
      height: min(60vw, 380px);
      min-height: 220px;
    }

    .upload-panel {
      padding: 1.4rem;
    }
  }

  @media (max-width: 560px) {
    .scanner-section {
      width: min(100% - 1.25rem, var(--content-max));
      padding-top: 2.25rem;
    }

    .scanner-intro h1 {
      font-size: clamp(2.35rem, 13vw, 3.6rem);
    }

    .trust-facts li {
      align-items: flex-start;
      flex-direction: column;
      gap: 0.15rem;
    }

    .trust-facts strong {
      text-align: left;
    }

    .scanner-state-surface,
    .preview-surface,
    .camera-container {
      padding: 1rem;
    }

    .preview-layout {
      grid-template-columns: 1fr;
    }

    .preview-actions,
    .preview-actions .button,
    .camera-controls,
    .camera-controls .button,
    .upload-actions,
    .upload-actions .button {
      width: 100%;
    }

    .sample-buttons {
      grid-template-columns: repeat(2, 1fr);
    }

    .photo-strip {
      grid-template-columns: repeat(2, 1fr);
    }

    .sample-row-heading span:last-child {
      display: none;
    }
  }
</style>
