<script lang="ts">
  import { BREED_CATALOG_COUNT } from '$lib/data/dogBreeds';

  const FAQ = [
    {
      q: 'How accurate is this?',
      a: 'Results are visual estimates based on what your dog looks like in one photo. They are useful for exploring possibilities, not for proving ancestry. Confidence scores reflect how well the photo matches known breed traits - not genetic certainty.'
    },
    {
      q: 'Is this a DNA test?',
      a: 'No. What Dog Breed does not analyze saliva, blood, or genetic material. Only a laboratory DNA test can confirm breed ancestry.'
    },
    {
      q: 'Why did my result change between photos?',
      a: 'Different angles, lighting, age, grooming, and posture can shift visual signals. Mixed-breed dogs can also look different season to season. Treat each scan as one perspective, not a final label.'
    },
    {
      q: 'Can it identify breeds outside the catalog?',
      a: `Yes. AI vision can suggest breeds beyond our ${BREED_CATALOG_COUNT}-profile catalog. Catalog matches unlock richer lifestyle pages; off-catalog breeds still get tailored guidance on the scan report.`
    },
    {
      q: 'Where are my photos stored?',
      a: 'Until you scan, photos stay in your browser. After scanning, full images are saved locally on your device (IndexedDB) if you keep history. See the privacy page for details.'
    },
    {
      q: 'Does it work offline?',
      a: 'Breed catalog pages you have visited may work offline after caching. New scans always require an internet connection - the scan button is disabled while offline.'
    },
    {
      q: 'What happens when I share a scan link?',
      a: 'Share links include the report text and, when possible, a compressed photo thumbnail embedded in the URL so friends can see your dog. Anyone with the link can view that thumbnail. Full-resolution photos are not stored on our servers. See the privacy policy for details.'
    },
    {
      q: 'How many scans are saved in History?',
      a: 'Up to 100 recent scans are kept on this device. Older entries are removed automatically when you exceed that limit.'
    }
  ];
</script>

<svelte:head>
  <title>Help &amp; FAQ - What Dog Breed?</title>
  <meta
    name="description"
    content="Answers about visual breed scan accuracy, DNA testing, photo privacy, offline use, and how confidence scores work."
  />
  <link rel="canonical" href="https://whatdogbreed.app/help" />
</svelte:head>

<section class="help-page">
  <div class="page-intro">
    <span class="eyebrow">Help center</span>
    <h1 class="page-title">Common questions</h1>
    <p class="page-description">
      Quick answers for adopters, shelter volunteers, and curious owners. For legal and data
      details, see
      <a href="/privacy">privacy &amp; data</a> or our <a href="/terms">terms of service</a>.
    </p>
  </div>

  <div class="faq-list">
    {#each FAQ as item}
      <details class="faq-item">
        <summary>{item.q}</summary>
        <p>{item.a}</p>
      </details>
    {/each}
  </div>

  <section class="help-links" aria-labelledby="more-help">
    <h2 id="more-help">More resources</h2>
    <ul>
      <li><a href="/privacy#confidence-scores">How confidence scores work</a></li>
      <li><a href="/privacy#fallback-mode">Demo mode vs live AI vision</a></li>
      <li><a href="/privacy#sharing-links">Share links &amp; embedded photos</a></li>
      <li><a href="/terms">Terms of service</a></li>
      <li><a href="/scanner">Scan a dog photo</a></li>
      <li><a href="/encyclopedia">Browse breed profiles</a></li>
    </ul>
  </section>
</section>

<style>
  .help-page {
    width: min(100% - 2rem, 760px);
    margin: 0 auto;
    padding: 3.5rem 0 5rem;
  }

  .page-description a {
    color: var(--accent-primary);
    font-weight: 700;
  }

  .faq-list {
    display: grid;
    gap: 0.65rem;
    margin-bottom: 2rem;
  }

  .faq-item {
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    background: var(--bg-card);
    padding: 0.85rem 1rem;
  }

  .faq-item summary {
    cursor: pointer;
    font-weight: 700;
    color: var(--text-main);
  }

  .faq-item p {
    margin-top: 0.65rem;
    font-size: 0.86rem;
    line-height: 1.65;
  }

  .help-links ul {
    list-style: none;
    display: grid;
    gap: 0.45rem;
  }

  .help-links a {
    color: var(--accent-primary);
    font-size: 0.84rem;
    font-weight: 700;
  }

  @media (max-width: 560px) {
    .help-page {
      width: min(100% - 1.25rem, 760px);
      padding-top: 2.25rem;
    }
  }
</style>
