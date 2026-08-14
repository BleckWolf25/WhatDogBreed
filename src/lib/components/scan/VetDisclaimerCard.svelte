<script lang="ts">
  import { ShieldAlert } from '@lucide/svelte';
</script>

<aside class="vet-disclaimer" role="note">
  <ShieldAlert size={20} strokeWidth={1.8} aria-hidden="true" />
  <div>
    <strong>Accuracy and medical disclaimer</strong>
    <p>
      Visual breed predictions are educational estimates, not DNA testing or veterinary diagnoses.
      Always consult a licensed veterinarian for health, dietary, or behavioral concerns.
    </p>
  </div>
</aside>

<style>
  .vet-disclaimer {
    display: flex;
    align-items: flex-start;
    gap: 0.7rem;
    margin-top: 1.45rem;
    padding: 0.95rem 0;
    color: var(--warning);
  }

  .vet-disclaimer strong {
    display: block;
    font-size: 0.78rem;
    font-weight: 800;
  }

  .vet-disclaimer p {
    margin-top: 0.25rem;
    font-size: 0.76rem;
    line-height: 1.55;
  }
</style>
