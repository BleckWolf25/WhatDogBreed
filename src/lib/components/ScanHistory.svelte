<script lang="ts">
  import { onMount } from 'svelte';
  import dayjs from 'dayjs';
  import { Calendar, Download, Heart, History, Trash2, UserCheck } from '@lucide/svelte';
  import {
    clearAllScanHistory,
    clearMyDogProfile,
    exportHistoryAsJson,
    getMyDogProfile,
    getSavedScanHistory,
    removeScanFromHistory,
    saveMyDogProfile
  } from '$lib/services/historyStorage';
  import type { DogProfile, ScanResult } from '$lib/types/scan';
  import AnalysisSourceBadge from '$lib/components/ui/AnalysisSourceBadge.svelte';

  type HistoryEntry = Omit<ScanResult, 'imageUrl'>;

  let {
    onReopenScan,
    onStartScan
  }: { onReopenScan: (scan: HistoryEntry) => void; onStartScan: () => void } = $props();
  let historyItems = $state<HistoryEntry[]>([]);
  let myDogProfile = $state<DogProfile | null>(null);
  let editMyDog = $state(false);
  let editName = $state('');
  let editAge = $state('');
  let editWeight = $state('');
  let editNotes = $state('');

  onMount(() => {
    historyItems = getSavedScanHistory();
    const profile = getMyDogProfile();
    myDogProfile = profile;
    if (profile) {
      editName = profile.name;
      editAge = profile.age ?? '';
      editWeight = profile.weight ?? '';
      editNotes = profile.notes ?? '';
    }
  });

  const myDogScans = $derived(
    myDogProfile ? historyItems.filter((item) => myDogProfile!.linkedScanIds.includes(item.id)) : []
  );

  function handleDeleteScan(scanId: string) {
    void removeScanFromHistory(scanId).then(() => (historyItems = getSavedScanHistory()));
  }

  function handleClearAll() {
    if (!confirm('Are you sure you want to clear all scan history?')) return;
    void clearAllScanHistory().then(() => {
      historyItems = [];
      clearMyDogProfile();
      myDogProfile = null;
    });
  }

  function handleSaveMyDogEdits() {
    if (!myDogProfile || !editName.trim()) return;
    const updated: DogProfile = {
      ...myDogProfile,
      name: editName.trim(),
      age: editAge.trim() || undefined,
      weight: editWeight.trim() || undefined,
      notes: editNotes.trim() || undefined,
      updatedAt: new Date().toISOString()
    };
    saveMyDogProfile(updated);
    myDogProfile = updated;
    editMyDog = false;
  }

  function handleRemoveMyDog() {
    if (!confirm('Remove My Dog profile? Scans stay in history.')) return;
    clearMyDogProfile();
    myDogProfile = null;
    editMyDog = false;
  }
</script>

<section class="history-section" aria-labelledby="history-title">
  <div class="history-header">
    <div class="page-intro">
      <span class="eyebrow">Saved locally</span>
      <h1 id="history-title" class="page-title">Your scan history.</h1>
      <p class="page-description">
        Revisit reports saved on this device. Nothing appears here until you analyze a photo.
      </p>
    </div>

    {#if historyItems.length > 0}
      <div class="history-actions-bar">
        <button class="secondary-action" type="button" onclick={exportHistoryAsJson}
          ><Download size={15} strokeWidth={1.8} /> Export JSON</button
        >
        <button class="danger-action" type="button" onclick={handleClearAll}
          ><Trash2 size={15} strokeWidth={1.8} /> Clear all</button
        >
      </div>
    {/if}
  </div>

  {#if myDogProfile}
    <section class="my-dog-panel" aria-labelledby="my-dog-title">
      <div class="my-dog-header">
        <div>
          <span class="eyebrow">My Dog</span>
          <h2 id="my-dog-title">{myDogProfile.name}</h2>
          <p class="my-dog-meta">
            {#if myDogProfile.age}{myDogProfile.age}{/if}
            {#if myDogProfile.weight}{#if myDogProfile.age}
                ·
              {/if}{myDogProfile.weight}{/if}
            · {myDogScans.length} linked scan{myDogScans.length === 1 ? '' : 's'}
          </p>
        </div>
        <div class="my-dog-actions">
          <button class="secondary-action" type="button" onclick={() => (editMyDog = !editMyDog)}
            >Edit</button
          >
          <button class="danger-action" type="button" onclick={handleRemoveMyDog}>Remove</button>
        </div>
      </div>
      {#if myDogProfile.notes && !editMyDog}
        <p class="my-dog-notes">{myDogProfile.notes}</p>
      {/if}
      {#if editMyDog}
        <div class="my-dog-edit-form">
          <label><span>Name</span><input type="text" bind:value={editName} /></label>
          <label><span>Age</span><input type="text" bind:value={editAge} /></label>
          <label><span>Weight</span><input type="text" bind:value={editWeight} /></label>
          <label class="full"
            ><span>Notes</span><textarea bind:value={editNotes} rows="2"></textarea></label
          >
          <button class="start-scan-btn" type="button" onclick={handleSaveMyDogEdits}
            >Save changes</button
          >
        </div>
      {/if}
    </section>
  {/if}

  {#if historyItems.length === 0}
    <div class="empty-history" role="status">
      <div class="empty-icon" aria-hidden="true"><History size={26} strokeWidth={1.8} /></div>
      <span class="eyebrow">Nothing saved yet</span>
      <h2>Start with a dog photo.</h2>
      <p>Your analyzed photos will appear here for offline re-inspection.</p>
      <button class="start-scan-btn" type="button" onclick={onStartScan}>Scan your first dog</button
      >
    </div>
  {:else}
    <div class="history-grid">
      {#each historyItems as item (item.id)}
        <article
          class="history-card"
          class:is-my-dog={myDogProfile?.linkedScanIds.includes(item.id)}
        >
          <button class="history-open-btn" type="button" onclick={() => onReopenScan(item)}>
            <div class="history-thumb-wrapper">
              {#if item.thumbnailUrl}<img
                  src={item.thumbnailUrl}
                  alt={item.primaryBreed}
                  class="history-thumb"
                  loading="lazy"
                  decoding="async"
                />{:else}<div class="missing-thumb">No preview</div>{/if}
            </div>
            <div class="history-body">
              <div class="history-meta">
                <span>{dayjs(item.timestamp).format('MMM D, YYYY')}</span><strong
                  >{Math.round(item.confidenceScore * 100)}% visual match</strong
                >
              </div>
              <h2>{item.primaryBreed}</h2>
              {#if myDogProfile?.linkedScanIds.includes(item.id)}
                <span class="my-dog-badge"
                  ><Heart size={12} strokeWidth={1.8} /> {myDogProfile.name}</span
                >
              {/if}
              <div class="mix-preview">
                {#each item.mixBreakdown.slice(0, 2) as mix}<span
                    >{mix.breed} {mix.percentage}%</span
                  >{/each}
              </div>
              <span class="view-report">View full report →</span>
            </div>
          </button>
          <div class="history-card-footer">
            {#if item.analysisSource}
              <AnalysisSourceBadge
                analysisSource={item.analysisSource}
                isDemoSample={item.isDemoSample ?? false}
              />
            {:else if item.detectedGender && item.detectedGender !== 'Unspecified'}
              <span><UserCheck size={13} strokeWidth={1.8} /> {item.detectedGender} context</span>
            {:else}
              <span><Calendar size={13} strokeWidth={1.8} /> Saved locally</span>
            {/if}
            <button
              class="delete-item-btn"
              type="button"
              onclick={() => handleDeleteScan(item.id)}
              aria-label={`Delete ${item.primaryBreed} scan`}
              title="Delete scan"><Trash2 size={15} strokeWidth={1.8} /></button
            >
          </div>
        </article>
      {/each}
    </div>
  {/if}
</section>

<style>
  .history-section {
    width: min(100% - 2rem, 1120px);
    margin: 0 auto;
    padding: 3.5rem 0 5rem;
  }
  .history-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  .page-intro {
    max-width: 640px;
  }
  .history-actions-bar {
    display: flex;
    gap: 0.5rem;
    padding-bottom: 0.35rem;
  }
  .secondary-action,
  .danger-action {
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.7rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-muted);
    font-size: 0.74rem;
    font-weight: 700;
  }
  .secondary-action:hover {
    border-color: var(--border-highlight);
    color: var(--text-main);
    background: var(--accent-soft);
  }
  .danger-action {
    border-color: color-mix(in srgb, var(--danger) 50%, var(--border-subtle));
    color: var(--danger);
  }
  .danger-action:hover {
    background: color-mix(in srgb, var(--danger) 9%, transparent);
  }
  .empty-history {
    display: grid;
    justify-items: center;
    padding: 4.5rem 1rem;
    border-top: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
    text-align: center;
  }
  .empty-icon {
    width: 54px;
    height: 54px;
    display: grid;
    place-items: center;
    margin-bottom: 1rem;
    border: 1px solid var(--border-strong);
    border-radius: 50%;
    color: var(--accent-primary);
    background: var(--accent-soft);
  }
  .empty-history h2 {
    margin-top: 0.45rem;
    font-size: 1.7rem;
  }
  .empty-history p {
    margin-top: 0.45rem;
    font-size: 0.86rem;
  }
  .start-scan-btn {
    min-height: 40px;
    margin-top: 1.2rem;
    padding: 0.55rem 0.85rem;
    border: 1px solid var(--accent-primary);
    border-radius: var(--radius-sm);
    background: var(--accent-primary);
    color: var(--text-inverse);
    font-size: 0.76rem;
    font-weight: 800;
  }
  .start-scan-btn:hover {
    background: var(--accent-strong);
    border-color: var(--accent-strong);
  }
  .history-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }
  .history-card {
    overflow: hidden;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    background: var(--bg-card);
  }
  .history-card:hover {
    border-color: var(--border-highlight);
  }
  .history-open-btn {
    width: 100%;
    display: block;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
  }
  .history-thumb-wrapper {
    height: 190px;
    background: var(--bg-surface);
  }
  .history-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .missing-thumb {
    height: 100%;
    display: grid;
    place-items: center;
    color: var(--text-subtle);
    font-size: 0.76rem;
  }
  .history-body {
    padding: 1rem;
  }
  .history-meta {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    color: var(--text-subtle);
    font-size: 0.7rem;
  }
  .history-meta strong {
    color: var(--accent-primary);
    font-weight: 700;
    text-align: right;
  }
  .history-body h2 {
    margin-top: 0.5rem;
    font-size: 1.25rem;
  }
  .mix-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.65rem;
  }
  .mix-preview span {
    color: var(--text-muted);
    font-size: 0.73rem;
  }
  .mix-preview span + span::before {
    content: '·';
    margin-right: 0.35rem;
    color: var(--border-highlight);
  }
  .view-report {
    display: inline-block;
    margin-top: 1rem;
    color: var(--accent-primary);
    font-size: 0.76rem;
    font-weight: 700;
  }
  .history-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--border-subtle);
    color: var(--text-subtle);
    font-size: 0.7rem;
  }
  .history-card-footer span {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
  .delete-item-btn {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--danger);
  }
  .delete-item-btn:hover {
    border-color: color-mix(in srgb, var(--danger) 50%, transparent);
    background: color-mix(in srgb, var(--danger) 9%, transparent);
  }
  .delete-item-btn:hover {
    border-color: color-mix(in srgb, var(--danger) 50%, transparent);
    background: color-mix(in srgb, var(--danger) 9%, transparent);
  }
  .my-dog-panel {
    margin-bottom: 2rem;
    padding: 1.25rem;
    border: 1px solid var(--border-highlight);
    border-radius: var(--radius-lg);
    background: var(--accent-soft);
  }
  .my-dog-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }
  .my-dog-header h2 {
    margin-top: 0.35rem;
    font-size: 1.5rem;
  }
  .my-dog-meta,
  .my-dog-notes {
    margin-top: 0.4rem;
    color: var(--text-muted);
    font-size: 0.82rem;
    line-height: 1.55;
  }
  .my-dog-actions {
    display: flex;
    gap: 0.45rem;
  }
  .my-dog-edit-form {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.65rem;
    margin-top: 1rem;
  }
  .my-dog-edit-form label {
    display: grid;
    gap: 0.25rem;
  }
  .my-dog-edit-form label.full {
    grid-column: 1 / -1;
  }
  .my-dog-edit-form label span {
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--text-subtle);
    text-transform: uppercase;
  }
  .my-dog-edit-form input,
  .my-dog-edit-form textarea {
    padding: 0.45rem 0.6rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: var(--bg-card);
    color: var(--text-main);
    font-size: 0.8rem;
  }
  .history-card.is-my-dog {
    border-color: var(--border-highlight);
  }
  .my-dog-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    margin-top: 0.35rem;
    color: var(--accent-primary);
    font-size: 0.7rem;
    font-weight: 700;
  }
  @media (max-width: 680px) {
    .history-section {
      width: min(100% - 1.25rem, 1120px);
      padding-top: 2.25rem;
    }
    .history-header {
      align-items: flex-start;
      flex-direction: column;
      gap: 1rem;
    }
    .my-dog-edit-form {
      grid-template-columns: 1fr;
    }
    .my-dog-header {
      flex-direction: column;
    }
  }
</style>
