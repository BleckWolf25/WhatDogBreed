<script lang="ts">
  import { Camera, GitCompare, History, Search, ShieldCheck, Sparkles, Dog } from '@lucide/svelte';
  import { BREED_CATALOG_COUNT } from '$lib/data/dogBreeds';

  const STEPS = [
    {
      title: 'Upload a clear photo',
      body: 'Use your camera or gallery. We analyze visible traits - coat, ears, build - not DNA.'
    },
    {
      title: 'Get a visual breed estimate',
      body: 'See a mix breakdown, temperament context, care guidance, and adoption decision support.'
    },
    {
      title: 'Explore further',
      body: 'Open breed profiles, compare candidates, simulate mixes, and save scans to History.'
    }
  ];

  const TRUST = [
    'Not a DNA test - appearance-based estimates only',
    'Photos stay on your device until you scan',
    'Rescue-friendly guidance for mystery mutts',
    'Works offline for cached breed profiles'
  ];
</script>

<svelte:head>
  <title>What Dog Breed? - Understand the dog in front of you</title>
  <meta
    name="description"
    content="Upload a dog photo for a visual breed mix estimate, temperament context, and adoption-friendly guidance. Free PWA for rescue owners and curious dog lovers."
  />
  <link rel="canonical" href="https://whatdogbreed.app/" />
</svelte:head>

<section class="landing">
  <div class="hero">
    <span class="eyebrow">Free visual breed explorer</span>
    <h1>Understand the dog in front of you.</h1>
    <p class="hero-copy">
      What Dog Breed turns a single photo into a practical breed mix estimate, everyday care
      context, and tools to compare, simulate mixes, and track your dog over time - built for rescue
      owners and curious adopters.
    </p>
    <div class="hero-actions">
      <a class="button button-primary" href="/scanner"
        ><Camera size={16} strokeWidth={1.8} /> Scan a dog photo</a
      >
      <a class="button button-secondary" href="/encyclopedia"
        ><Search size={16} strokeWidth={1.8} /> Browse breed catalog</a
      >
    </div>
  </div>

  <section class="landing-block" aria-labelledby="how-title">
    <h2 id="how-title">How it works</h2>
    <ol class="steps">
      {#each STEPS as step, index}
        <li>
          <span class="step-num">{index + 1}</span>
          <div>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        </li>
      {/each}
    </ol>
  </section>

  <section class="landing-block grid-block" aria-labelledby="tools-title">
    <h2 id="tools-title">More than a one-time scan</h2>
    <div class="tool-grid">
      <a href="/history" class="tool-card"
        ><History size={18} strokeWidth={1.8} /><strong>History</strong><span
          >Revisit past scans saved on this device</span
        ></a
      >
      <a href="/encyclopedia" class="tool-card"
        ><Search size={18} strokeWidth={1.8} /><strong>Breed catalog</strong><span
          >{BREED_CATALOG_COUNT} profiles including all German FCI breeds</span
        ></a
      >
      <a href="/compare" class="tool-card"
        ><GitCompare size={18} strokeWidth={1.8} /><strong>Compare</strong><span
          >Side-by-side lifestyle compatibility</span
        ></a
      >
      <a href="/mixer" class="tool-card"
        ><Dog size={18} strokeWidth={1.8} /><strong>Mixer</strong><span
          >Explore possible parent combinations</span
        ></a
      >
    </div>
  </section>

  <section class="landing-block" aria-labelledby="trust-title">
    <h2 id="trust-title">Built for real-world adoption decisions</h2>
    <ul class="trust-list">
      {#each TRUST as item}
        <li><ShieldCheck size={16} strokeWidth={1.8} aria-hidden="true" /><span>{item}</span></li>
      {/each}
    </ul>
    <p class="help-link">
      Questions? Read the <a href="/help">FAQ &amp; help guide</a>,
      <a href="/privacy">privacy policy</a>, or <a href="/terms">terms of service</a>.
    </p>
  </section>

  <section class="cta-banner">
    <Sparkles size={18} strokeWidth={1.8} aria-hidden="true" />
    <div>
      <strong>Ready to guess your mutt?</strong>
      <p>Try a sample dog in the scanner or upload your own photo.</p>
    </div>
    <a class="button button-primary" href="/scanner">Start scanning</a>
  </section>
</section>

<style>
  .landing {
    width: min(100% - 2rem, var(--content-max));
    margin: 0 auto;
    padding: 3.5rem 0 5rem;
    display: grid;
    gap: 3rem;
  }

  .hero h1 {
    margin-top: 0.65rem;
    font-size: clamp(2.4rem, 6vw, 4.5rem);
    line-height: 0.98;
    max-width: 12ch;
  }

  .hero-copy {
    max-width: 62ch;
    margin-top: 1rem;
    font-size: 1.02rem;
    line-height: 1.7;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 1.4rem;
  }

  .button {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.6rem 0.9rem;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
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

  .landing-block h2 {
    font-size: clamp(1.4rem, 3vw, 2rem);
    margin-bottom: 1rem;
  }

  .steps {
    list-style: none;
    display: grid;
    gap: 1rem;
  }

  .steps li {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.85rem;
    padding: 1rem;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    background: var(--bg-card);
  }

  .step-num {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--accent-soft);
    color: var(--accent-primary);
    font-size: 0.8rem;
    font-weight: 800;
  }

  .steps h3 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .steps p {
    font-size: 0.84rem;
    line-height: 1.55;
  }

  .tool-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .tool-card {
    display: grid;
    gap: 0.35rem;
    padding: 1rem;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    background: var(--bg-card);
    color: inherit;
    text-decoration: none;
  }

  .tool-card:hover {
    border-color: var(--border-highlight);
  }

  .tool-card strong {
    color: var(--text-main);
    font-size: 0.92rem;
  }

  .tool-card span {
    font-size: 0.78rem;
    line-height: 1.45;
  }

  .trust-list {
    list-style: none;
    display: grid;
    gap: 0.55rem;
  }

  .trust-list li {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    color: var(--text-muted);
    font-size: 0.86rem;
  }

  .trust-list :global(svg) {
    color: var(--accent-primary);
    margin-top: 0.1rem;
    flex: 0 0 auto;
  }

  .help-link {
    margin-top: 1rem;
    font-size: 0.82rem;
  }

  .help-link a {
    color: var(--accent-primary);
    font-weight: 700;
  }

  .cta-banner {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    padding: 1.2rem 1.25rem;
    border: 1px solid var(--border-highlight);
    border-radius: var(--radius-lg);
    background: var(--accent-soft);
  }

  .cta-banner strong {
    display: block;
    font-size: 1rem;
  }

  .cta-banner p {
    margin-top: 0.2rem;
    font-size: 0.82rem;
  }

  @media (max-width: 720px) {
    .landing {
      width: min(100% - 1.25rem, var(--content-max));
      padding-top: 2.25rem;
    }

    .tool-grid {
      grid-template-columns: 1fr;
    }

    .cta-banner {
      flex-direction: column;
      align-items: stretch;
    }

    .cta-banner .button {
      width: 100%;
      justify-content: center;
    }
  }
</style>
