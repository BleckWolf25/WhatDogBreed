<script lang="ts">
  import { CheckCircle, MessageSquareWarning } from '@lucide/svelte';
  import type { ScanResult } from '$lib/types/scan';

  let { result }: { result: ScanResult } = $props();

  let expectedBreed = $state('');
  let note = $state('');
  let isSubmitting = $state(false);
  let isSubmitted = $state(false);
  let errorMessage = $state<string | null>(null);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (isSubmitting || isSubmitted) return;

    const trimmedExpected = expectedBreed.trim();
    if (!trimmedExpected) {
      errorMessage = 'Tell us what breed you expected.';
      return;
    }

    isSubmitting = true;
    errorMessage = null;

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scanId: result.id,
          reportedBreed: result.primaryBreed,
          expectedBreed: trimmedExpected,
          note: note.trim() || undefined,
          analysisSource: result.analysisSource,
          confidenceScore: result.confidenceScore
        })
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || 'Could not send feedback.');
      }

      isSubmitted = true;
    } catch (error) {
      errorMessage =
        error instanceof Error ? error.message : 'Could not send feedback. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<aside class="feedback-card" aria-labelledby="feedback-title">
  <div class="feedback-header">
    <MessageSquareWarning size={18} strokeWidth={1.8} aria-hidden="true" />
    <div>
      <strong id="feedback-title">Think this result is wrong?</strong>
      <p>
        Help us improve by telling us what breed you expected. No photo is sent - only the scan
        metadata below.
      </p>
    </div>
  </div>

  {#if isSubmitted}
    <p class="feedback-success" role="status">
      <CheckCircle size={16} strokeWidth={1.8} aria-hidden="true" />
      <span>Thanks - your feedback was recorded.</span>
    </p>
  {:else}
    <form class="feedback-form" onsubmit={handleSubmit}>
      <label class="field-label" for="expected-breed">What breed did you expect?</label>
      <input
        id="expected-breed"
        class="field-input"
        type="text"
        bind:value={expectedBreed}
        placeholder="e.g. Border Collie mix"
        maxlength="120"
        required
      />

      <label class="field-label" for="feedback-note">Optional note</label>
      <textarea
        id="feedback-note"
        class="field-textarea"
        bind:value={note}
        placeholder="Anything else that would help (lighting, age, known parent breeds…)"
        maxlength="500"
        rows="2"></textarea>

      {#if errorMessage}
        <p class="feedback-error" role="alert">{errorMessage}</p>
      {/if}

      <button class="submit-btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Report wrong result'}
      </button>
    </form>
  {/if}
</aside>

<style>
  .feedback-card {
    margin-top: 1.45rem;
    padding: 1rem 0;
    border-top: 1px solid var(--border-subtle);
  }

  .feedback-header {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    color: var(--text-muted);
  }

  .feedback-header strong {
    display: block;
    color: var(--text-main);
    font-size: 0.82rem;
    font-weight: 800;
  }

  .feedback-header p {
    margin-top: 0.25rem;
    font-size: 0.76rem;
    line-height: 1.55;
  }

  .feedback-form {
    display: grid;
    gap: 0.45rem;
    margin-top: 0.85rem;
    max-width: 420px;
  }

  .field-label {
    color: var(--text-subtle);
    font-size: 0.7rem;
    font-weight: 700;
  }

  .field-input,
  .field-textarea {
    width: 100%;
    padding: 0.55rem 0.65rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: var(--bg-surface);
    color: var(--text-main);
    font: inherit;
    font-size: 0.8rem;
  }

  .field-input:focus,
  .field-textarea:focus {
    outline: 2px solid color-mix(in srgb, var(--accent-primary) 45%, transparent);
    outline-offset: 1px;
    border-color: var(--accent-primary);
  }

  .field-textarea {
    resize: vertical;
    min-height: 64px;
  }

  .feedback-error {
    color: var(--danger);
    font-size: 0.74rem;
  }

  .submit-btn {
    justify-self: start;
    min-height: 36px;
    margin-top: 0.25rem;
    padding: 0.45rem 0.75rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-main);
    font-size: 0.74rem;
    font-weight: 700;
  }

  .submit-btn:hover:not(:disabled) {
    border-color: var(--border-highlight);
    background: var(--accent-soft);
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  .feedback-success {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.85rem;
    color: var(--accent-primary);
    font-size: 0.78rem;
    font-weight: 700;
  }
</style>
