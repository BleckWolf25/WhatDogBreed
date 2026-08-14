<script lang="ts">
  import { Bot, FlaskConical, Sparkles } from '@lucide/svelte';
  import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
  import type { ScanResult } from '$lib/types/scan';

  let {
    analysisSource = 'fallback',
    isDemoSample = false
  }: {
    analysisSource?: ScanResult['analysisSource'];
    isDemoSample?: boolean;
  } = $props();

  const label = $derived(
    analysisSource === 'gemini'
      ? 'AI vision analysis'
      : isDemoSample
        ? 'Demo mode'
        : 'Local estimate (no AI)'
  );

  const variant = $derived(analysisSource === 'gemini' ? 'ai' : 'demo');
</script>

<StatusBadge {variant} {label}>
  {#if analysisSource === 'gemini'}
    <Sparkles size={12} strokeWidth={2} aria-hidden="true" />
  {:else if isDemoSample}
    <FlaskConical size={12} strokeWidth={2} aria-hidden="true" />
  {:else}
    <Bot size={12} strokeWidth={2} aria-hidden="true" />
  {/if}
</StatusBadge>
