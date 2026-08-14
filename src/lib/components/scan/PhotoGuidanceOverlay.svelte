<script lang="ts">
  let { compact = false }: { compact?: boolean } = $props();
</script>

<div class="overlay" class:compact aria-hidden="true">
  <div class="frame">
    <div class="corner top-left"></div>
    <div class="corner top-right"></div>
    <div class="corner bottom-left"></div>
    <div class="corner bottom-right"></div>
    <div class="head-guide"></div>
  </div>
  {#if !compact}
    <p class="hint">Center your dog’s face and chest inside the frame</p>
  {/if}
</div>

<style>
  .overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    pointer-events: none;
    z-index: 2;
  }

  .frame {
    position: relative;
    width: min(72%, 280px);
    aspect-ratio: 4 / 5;
  }

  .head-guide {
    position: absolute;
    inset: 8%;
    border: 2px dashed rgba(255, 255, 255, 0.72);
    border-radius: 42% 42% 36% 36%;
    box-shadow: 0 0 0 9999px rgba(5, 10, 7, 0.28);
  }

  .corner {
    position: absolute;
    width: 22px;
    height: 22px;
    border-color: #a5efb2;
    border-style: solid;
  }

  .top-left {
    top: 0;
    left: 0;
    border-width: 3px 0 0 3px;
  }

  .top-right {
    top: 0;
    right: 0;
    border-width: 3px 3px 0 0;
  }

  .bottom-left {
    bottom: 0;
    left: 0;
    border-width: 0 0 3px 3px;
  }

  .bottom-right {
    bottom: 0;
    right: 0;
    border-width: 0 3px 3px 0;
  }

  .hint {
    position: absolute;
    bottom: 0.85rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.35rem 0.65rem;
    border-radius: 999px;
    background: rgba(8, 15, 10, 0.78);
    color: rgba(255, 255, 255, 0.88);
    font-size: 0.68rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .compact .frame {
    width: min(62%, 220px);
  }

  .compact .hint {
    display: none;
  }
</style>
