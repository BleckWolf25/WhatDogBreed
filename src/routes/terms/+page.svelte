<svelte:head>
  <title>Terms of Service - What Dog Breed?</title>
  <meta
    name="description"
    content="Terms of service and acceptable use for What Dog Breed - a free visual dog breed estimate PWA, not a DNA test or veterinary service."
  />
  <link rel="canonical" href="https://whatdogbreed.app/terms" />
</svelte:head>

<section class="app-page terms-page" aria-labelledby="terms-title">
  <div class="page-intro">
    <span class="eyebrow">Legal</span>
    <h1 id="terms-title" class="page-title">Terms of Service.</h1>
    <p class="page-description">
      By using What Dog Breed?, you agree to these terms. If you do not agree, please do not use the
      app. Last updated: August 2026.
    </p>
  </div>

  <div class="terms-sections">
    <article class="terms-block surface">
      <h2>What this service is</h2>
      <p>
        What Dog Breed? is a free progressive web application that provides <strong
          >visual, appearance-based breed estimates</strong
        >
        from dog photos. It is an educational and entertainment tool for curious owners and adopters -
        not a DNA test, pedigree registry, or veterinary service.
      </p>
    </article>

    <article class="terms-block surface">
      <h2>Acceptable use</h2>
      <p>
        You agree to use the app only for lawful, personal, non-commercial purposes. You must not:
      </p>
      <ul>
        <li>Upload images that do not contain a dog (or attempt to bypass canine validation).</li>
        <li>Upload illegal, abusive, or non-consensual content.</li>
        <li>Automate or scrape the scan API beyond normal personal use (rate limits apply).</li>
        <li>
          Reverse-engineer, resell, or misrepresent scan results as DNA or veterinary diagnoses.
        </li>
        <li>Attempt to disrupt the service or circumvent security or rate limits.</li>
      </ul>
    </article>

    <article class="terms-block surface">
      <h2>No professional advice</h2>
      <p>
        All breed mix estimates, temperament notes, care guidance, health watchlists, and cost
        ranges are
        <strong>general educational information</strong>. They are not a substitute for advice from
        a licensed veterinarian, trainer, behaviorist, or breeder. Always consult qualified
        professionals for health, diet, behavior, and adoption decisions.
      </p>
    </article>

    <article class="terms-block surface">
      <h2>Accuracy and AI limitations</h2>
      <p>
        Results depend on photo quality, angle, grooming, age, and mixed ancestry. When AI vision is
        unavailable, the app may show <strong>demo</strong> or <strong>local placeholder</strong> results
        - always labeled on the report. We do not guarantee accuracy of any visual match percentage or
        breed label.
      </p>
      <p>
        See <a href="/privacy#fallback-mode">demo vs AI analysis</a> and
        <a href="/privacy#confidence-scores">how confidence scores work</a> for details.
      </p>
    </article>

    <article class="terms-block surface">
      <h2>Your content and sharing</h2>
      <ul>
        <li>
          You retain ownership of photos you upload. You grant us a limited, temporary license to
          process your photo solely to perform a scan request.
        </li>
        <li>
          We do not permanently store scan photos on our servers. See the <a href="/privacy"
            >privacy policy</a
          >.
        </li>
        <li>
          When you copy or share a link, a <strong>compressed thumbnail</strong> of your dog may be embedded
          in the URL so friends can see the photo in the shared report. Anyone with the link can view
          that thumbnail and report text. Do not share links if you are uncomfortable with that.
        </li>
      </ul>
    </article>

    <article class="terms-block surface">
      <h2>Feedback and reports</h2>
      <p>
        If you submit “wrong result” feedback, you provide scan metadata and your correction - not
        the photo. We may use aggregated feedback to improve prompts and breed data. Feedback is
        rate-limited to prevent abuse.
      </p>
    </article>

    <article class="terms-block surface">
      <h2>Availability and changes</h2>
      <p>
        The app is provided “as is” without warranties. We may modify features, breed catalog
        content, rate limits, or these terms at any time. Continued use after changes constitutes
        acceptance of updated terms.
      </p>
      <p>
        Scans require an internet connection. Offline access is limited to previously cached pages
        (such as breed profiles).
      </p>
    </article>

    <article class="terms-block surface">
      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, What Dog Breed? and its operators are not liable for
        any decisions, damages, or losses arising from reliance on visual breed estimates, including
        adoption choices, training, medical, or financial outcomes.
      </p>
    </article>

    <article class="terms-block surface">
      <h2>Contact &amp; related policies</h2>
      <p>
        For data handling, see our <a href="/privacy">privacy policy</a>. For how the app works, see
        <a href="/help">Help &amp; FAQ</a>.
      </p>
    </article>
  </div>
</section>

<style>
  .terms-page {
    padding-bottom: 4rem;
  }

  .terms-sections {
    display: grid;
    gap: 1rem;
  }

  .terms-block {
    padding: 1.35rem 1.5rem;
  }

  .terms-block h2 {
    font-size: 1.15rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
  }

  .terms-block p,
  .terms-block li {
    color: var(--text-muted);
    font-size: 0.88rem;
    line-height: 1.65;
  }

  .terms-block p + p,
  .terms-block p + ul {
    margin-top: 0.65rem;
  }

  .terms-block ul {
    padding-left: 1.2rem;
    display: grid;
    gap: 0.35rem;
  }

  .terms-block strong {
    color: var(--text-main);
  }

  .terms-block a {
    color: var(--accent-primary);
    font-weight: 600;
  }

  .terms-block a:hover {
    text-decoration: underline;
  }
</style>
