<svelte:head>
  <title>Data &amp; Privacy - What Dog Breed?</title>
  <meta
    name="description"
    content="Learn what data leaves your device when you scan a dog photo, how Google Gemini processes images, what demo mode means, and how visual match scores are calculated."
  />
</svelte:head>

<section class="app-page privacy-page" aria-labelledby="privacy-title">
  <div class="page-intro">
    <span class="eyebrow">Trust &amp; transparency</span>
    <h1 id="privacy-title" class="page-title">Data &amp; privacy.</h1>
    <p class="page-description">
      What Dog Breed? is a visual estimate tool - not a DNA test. This page explains exactly what
      happens to your photos, who processes them, and how to interpret results.
    </p>
  </div>

  <div class="privacy-sections">
    <article class="privacy-block surface" id="before-you-scan">
      <h2>Before you scan</h2>
      <ul>
        <li>
          Photos you choose or capture stay on your device until you tap <strong
            >Scan this photo</strong
          >.
        </li>
        <li>We do not require an account, email, or sign-in.</li>
        <li>
          Scan history (thumbnails and report metadata) is saved locally in your browser - you can
          export or delete it anytime from the History page.
        </li>
      </ul>
    </article>

    <article class="privacy-block surface" id="when-you-scan">
      <h2>When you scan</h2>
      <p>
        Starting a scan sends your compressed photo to our server at <code>/api/scan</code>. From
        there:
      </p>
      <ul>
        <li>
          <strong>AI analysis (default)</strong> - When configured, the image is sent to
          <strong>Google Gemini</strong> (model: gemini-3.6-flash) for multimodal vision analysis. Google
          processes the image according to their API terms.
        </li>
        <li>
          <strong>We do not store your photo on our servers.</strong> The image is used for the analysis
          request and then discarded. Server logs record timing and success/failure - not image content.
        </li>
        <li>
          The full-resolution photo returned in your report stays in your browser (IndexedDB). It is
          not uploaded again unless you scan again.
        </li>
      </ul>
    </article>

    <article class="privacy-block surface" id="retention">
      <h2>How long data is kept</h2>
      <ul>
        <li>
          <strong>On our servers:</strong> Scan images are not retained after analysis. Anonymous operational
          logs (duration, model used, success/failure) may be kept briefly for debugging.
        </li>
        <li>
          <strong>On your device:</strong> History entries persist until you delete them or clear browser
          storage. Up to 100 recent scans are kept in local storage.
        </li>
        <li>
          <strong>Feedback reports:</strong> If you report a wrong result, we log the scan ID, breeds,
          and your note - never the photo itself.
        </li>
      </ul>
    </article>

    <article class="privacy-block surface" id="third-parties">
      <h2>Who processes your data</h2>
      <ul>
        <li>
          <strong>Google Gemini</strong> - Vision analysis when AI mode is active. See
          <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer"
            >Google Gemini API terms</a
          >.
        </li>
        <li><strong>Vercel</strong> - Hosts the application and API endpoints.</li>
      </ul>
      <p>No advertising trackers or third-party analytics pixels are used in the scan flow.</p>
    </article>

    <article class="privacy-block surface" id="fallback-mode">
      <h2>Demo mode vs AI analysis</h2>
      <p>Not every scan uses live AI vision. You may see one of these labels on your result:</p>
      <dl class="mode-definitions">
        <div>
          <dt>AI vision analysis</dt>
          <dd>
            Your photo was analyzed by Google Gemini. Results reflect visible features compared
            against our breed library.
          </dd>
        </div>
        <div>
          <dt>Demo mode</dt>
          <dd>
            You scanned a built-in sample photo. Results are pre-generated for demonstration - not
            real vision analysis.
          </dd>
        </div>
        <div>
          <dt>Local estimate (no AI)</dt>
          <dd>
            AI was unavailable (no API key configured, or the service failed). A local placeholder
            estimator produces illustrative results - they are <strong>not</strong> based on what the
            dog actually looks like. Treat these as demo output only.
          </dd>
        </div>
      </dl>
      <p>
        We always label which mode was used. Demo and local-estimate results should never be
        presented as real AI vision output.
      </p>
    </article>

    <article class="privacy-block surface" id="confidence-scores">
      <h2>What “visual match” means</h2>
      <p>
        The percentage shown on your report is a <strong>visual similarity estimate</strong> - how
        closely visible features in your photo resemble a known breed profile. It is <em>not</em> a DNA
        certainty score, pedigree proof, or veterinary diagnosis.
      </p>
      <ul>
        <li><strong>90%+</strong> - Strong resemblance to a single breed in the photo</li>
        <li><strong>70–89%</strong> - Likely mix or partial match</li>
        <li><strong>Below 70%</strong> - Uncertain or heavily mixed appearance</li>
      </ul>
      <p>
        Photo quality, angle, grooming, lighting, and mixed ancestry all affect the score. In demo
        or local-estimate mode, the percentage is illustrative and should not be relied upon.
      </p>
    </article>

    <article class="privacy-block surface" id="sharing-links">
      <h2>Share links</h2>
      <p>
        When you copy or share a scan link, the URL encodes the report text in a compact format.
        When possible, a
        <strong>compressed JPEG thumbnail</strong> of your dog is also embedded so recipients can see
        the photo in the shared report.
      </p>
      <ul>
        <li>
          Share links do not upload photos to our servers - the thumbnail travels in the URL itself.
        </li>
        <li>
          Anyone with the link can view the embedded thumbnail and breed estimate. Do not share if
          you are uncomfortable with that.
        </li>
        <li>
          If the photo is too large for a safe URL length, the link falls back to text-only (you
          will see a note when copying).
        </li>
        <li>
          Detailed owner guidance is rebuilt on the recipient’s device from breed catalog data when
          available.
        </li>
      </ul>
    </article>

    <article class="privacy-block surface" id="your-controls">
      <h2>Your controls</h2>
      <ul>
        <li>
          Delete individual scans or clear all history from the <a href="/history">History</a> page.
        </li>
        <li>Export your scan metadata as JSON from History.</li>
        <li>
          Report incorrect results directly from any scan report - no photo is included in feedback.
        </li>
        <li>Clear browser storage to remove all locally saved photos and history.</li>
      </ul>
    </article>
  </div>
</section>

<style>
  .privacy-page {
    padding-bottom: 4rem;
  }

  .privacy-sections {
    display: grid;
    gap: 1rem;
  }

  .privacy-block {
    padding: 1.35rem 1.5rem;
  }

  .privacy-block h2 {
    font-size: 1.15rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
  }

  .privacy-block p,
  .privacy-block li {
    color: var(--text-muted);
    font-size: 0.88rem;
    line-height: 1.65;
  }

  .privacy-block p + ul,
  .privacy-block ul + p {
    margin-top: 0.65rem;
  }

  .privacy-block ul {
    padding-left: 1.2rem;
    display: grid;
    gap: 0.35rem;
  }

  .privacy-block strong {
    color: var(--text-main);
  }

  .privacy-block a {
    color: var(--accent-primary);
    font-weight: 600;
  }

  .privacy-block a:hover {
    text-decoration: underline;
  }

  .privacy-block code {
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    background: var(--accent-soft);
    font-size: 0.82em;
  }

  .mode-definitions {
    display: grid;
    gap: 0.85rem;
    margin-top: 0.75rem;
  }

  .mode-definitions dt {
    color: var(--text-main);
    font-size: 0.82rem;
    font-weight: 800;
  }

  .mode-definitions dd {
    margin-top: 0.2rem;
    color: var(--text-muted);
    font-size: 0.84rem;
    line-height: 1.55;
  }
</style>
