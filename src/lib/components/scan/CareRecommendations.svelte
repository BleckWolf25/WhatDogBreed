<script lang="ts">
  import { Activity, AlertTriangle, Brain, HeartPulse, Scissors, Utensils } from '@lucide/svelte';
  import type { CarePlan, OwnerGuidance } from '$lib/types/scan';

  let {
    guidance
  }: {
    guidance: OwnerGuidance;
  } = $props();

  const sections: { key: keyof CarePlan; label: string; icon: typeof Activity }[] = [
    { key: 'exercise', label: 'Exercise', icon: Activity },
    { key: 'grooming', label: 'Grooming', icon: Scissors },
    { key: 'diet', label: 'Diet', icon: Utensils },
    { key: 'mentalEnrichment', label: 'Mental enrichment', icon: Brain }
  ];
</script>

<section class="care-section" aria-labelledby="care-title">
  <div class="section-heading">
    <HeartPulse size={17} strokeWidth={1.8} aria-hidden="true" />
    <h2 id="care-title">Daily care plan</h2>
  </div>

  <div class="care-grid">
    {#each sections as { key, label, icon: Icon }}
      <article class="care-card">
        <h3><Icon size={15} strokeWidth={1.8} aria-hidden="true" /> {label}</h3>
        <p>{guidance.carePlan[key]}</p>
      </article>
    {/each}
  </div>

  <div class="red-flags">
    <h3>
      <AlertTriangle size={15} strokeWidth={1.8} aria-hidden="true" /> Red flags - contact your vet
    </h3>
    <ul>
      {#each guidance.carePlan.redFlags as flag}
        <li>{flag}</li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .care-section {
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

  .care-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .care-card {
    padding: 0.85rem;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    background: var(--bg-card);
  }

  .care-card h3 {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-bottom: 0.45rem;
    font-size: 0.78rem;
    font-weight: 800;
    color: var(--text-main);
  }

  .care-card p {
    font-size: 0.82rem;
    line-height: 1.6;
    color: var(--text-muted);
  }

  .red-flags {
    margin-top: 1rem;
    padding: 0.85rem;
    border: 1px solid color-mix(in srgb, var(--warning) 35%, var(--border-subtle));
    border-radius: var(--radius-md);
    background: color-mix(in srgb, var(--warning) 6%, transparent);
  }

  .red-flags h3 {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-bottom: 0.5rem;
    font-size: 0.78rem;
    font-weight: 800;
    color: var(--warning);
  }

  .red-flags ul {
    list-style: none;
    display: grid;
    gap: 0.35rem;
  }

  .red-flags li {
    padding-left: 0.85rem;
    position: relative;
    font-size: 0.8rem;
    line-height: 1.5;
    color: var(--text-muted);
  }

  .red-flags li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.55rem;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--warning);
  }

  @media (max-width: 640px) {
    .care-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
