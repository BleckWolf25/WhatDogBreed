<script lang="ts">
  import { Shield } from '@lucide/svelte';
</script>

<footer class="site-footer">
  <div class="footer-inner">
    <p class="footer-tagline">
      <Shield size={14} strokeWidth={1.8} aria-hidden="true" />
      <span>Visual breed estimates - not DNA testing or veterinary advice.</span>
    </p>
    <nav class="footer-nav" aria-label="Legal and information">
      <a href="/help">Help &amp; FAQ</a>
      <a href="/privacy">Data &amp; privacy</a>
      <a href="/terms">Terms of service</a>
      <a href="/privacy#confidence-scores">How scores work</a>
      <a href="/privacy#fallback-mode">Demo vs AI analysis</a>
    </nav>
  </div>
</footer>

<style>
  .site-footer {
    border-top: 1px solid var(--border-subtle);
    background: var(--bg-surface);
  }

  .footer-inner {
    width: min(100% - 2rem, var(--content-max));
    margin: 0 auto;
    padding: 1.35rem 0 1.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .footer-tagline {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--text-subtle);
    font-size: 0.72rem;
  }

  .footer-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 1rem;
  }

  .footer-nav a {
    color: var(--text-muted);
    font-size: 0.72rem;
    font-weight: 600;
  }

  .footer-nav a:hover {
    color: var(--accent-primary);
  }

  @media (max-width: 560px) {
    .footer-inner {
      width: min(100% - 1.25rem, var(--content-max));
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
