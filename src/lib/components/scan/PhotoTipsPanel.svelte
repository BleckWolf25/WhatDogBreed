<script lang="ts">
  import { ChevronDown, ChevronUp, CircleCheck, CircleX } from '@lucide/svelte';

  let expanded = $state(false);

  const goodTips = [
    'Face the camera with ears and eyes visible',
    'Use natural daylight or soft indoor light',
    'Include the full head and front of the chest',
    'Hold the phone steady at the dog’s eye level'
  ];

  const badTips = [
    'Back turned or face hidden behind fur',
    'Blurry motion shot or extreme zoom',
    'Dark silhouette with no detail',
    'Multiple dogs - scan one dog at a time'
  ];
</script>

<section class="photo-tips" aria-labelledby="photo-tips-title">
  <button
    class="tips-toggle"
    type="button"
    aria-expanded={expanded}
    onclick={() => (expanded = !expanded)}
  >
    <div>
      <span class="eyebrow">Photo tips</span>
      <h2 id="photo-tips-title">Get a scan-worthy photo</h2>
    </div>
    {#if expanded}
      <ChevronUp size={18} strokeWidth={1.8} aria-hidden="true" />
    {:else}
      <ChevronDown size={18} strokeWidth={1.8} aria-hidden="true" />
    {/if}
  </button>

  {#if expanded}
    <div class="tips-grid">
      <article class="tips-card good">
        <h3><CircleCheck size={16} strokeWidth={1.8} aria-hidden="true" /> Do this</h3>
        <ul>
          {#each goodTips as tip}
            <li>{tip}</li>
          {/each}
        </ul>
        <div class="example-strip good-examples" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
      </article>

      <article class="tips-card bad">
        <h3><CircleX size={16} strokeWidth={1.8} aria-hidden="true" /> Avoid this</h3>
        <ul>
          {#each badTips as tip}
            <li>{tip}</li>
          {/each}
        </ul>
        <div class="example-strip bad-examples" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
      </article>
    </div>
    <p class="tips-note">
      Scans reject photos with no dog visible. Fix issues above before uploading to save time.
    </p>
  {/if}
</section>

<style>
  .photo-tips {
    margin-top: 1rem;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    background: var(--bg-surface);
    overflow: hidden;
  }

  .tips-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.85rem 1rem;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
  }

  .tips-toggle h2 {
    margin-top: 0.25rem;
    font-size: 0.95rem;
  }

  .tips-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
    padding: 0 1rem 1rem;
  }

  .tips-card {
    padding: 0.8rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-subtle);
  }

  .tips-card.good {
    background: color-mix(in srgb, var(--accent-primary) 7%, transparent);
  }

  .tips-card.bad {
    background: color-mix(in srgb, var(--danger) 6%, transparent);
  }

  .tips-card h3 {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-bottom: 0.55rem;
    font-size: 0.76rem;
  }

  .tips-card.good h3 {
    color: var(--accent-primary);
  }

  .tips-card.bad h3 {
    color: var(--danger);
  }

  .tips-card ul {
    list-style: none;
    display: grid;
    gap: 0.35rem;
  }

  .tips-card li {
    font-size: 0.74rem;
    line-height: 1.45;
    color: var(--text-muted);
  }

  .example-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.35rem;
    margin-top: 0.65rem;
  }

  .example-strip span {
    height: 34px;
    border-radius: 6px;
    border: 1px solid var(--border-subtle);
  }

  .good-examples span:nth-child(1) {
    background: linear-gradient(135deg, #6f8f73, #a5c4a8);
  }

  .good-examples span:nth-child(2) {
    background: linear-gradient(135deg, #8a7357, #c7b08d);
  }

  .good-examples span:nth-child(3) {
    background: linear-gradient(135deg, #5f6d86, #95a3bc);
  }

  .bad-examples span:nth-child(1) {
    background: linear-gradient(135deg, #111, #333);
    filter: blur(1px);
  }

  .bad-examples span:nth-child(2) {
    background: repeating-linear-gradient(45deg, #444, #444 6px, #666 6px, #666 12px);
  }

  .bad-examples span:nth-child(3) {
    background: radial-gradient(circle at 30% 30%, #777 0 18%, #222 19%);
  }

  .tips-note {
    padding: 0 1rem 1rem;
    font-size: 0.72rem;
    color: var(--text-subtle);
    line-height: 1.5;
  }

  @media (max-width: 640px) {
    .tips-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
