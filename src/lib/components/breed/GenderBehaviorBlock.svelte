<script lang="ts">
  import { Compass, Shield, UserCheck } from '@lucide/svelte';

  let {
    summary,
    maleTraits,
    femaleTraits,
    showTabs = false
  }: {
    summary: string;
    maleTraits: string[];
    femaleTraits: string[];
    showTabs?: boolean;
  } = $props();

  let activeTab = $state<'All' | 'Male' | 'Female'>('All');
</script>

<section class="behavior-box" aria-labelledby="behavior-title">
  <div class="behavior-header">
    <div class="section-heading">
      <UserCheck size={17} strokeWidth={1.8} aria-hidden="true" />
      <h2 id="behavior-title">Behavior context</h2>
    </div>
    {#if showTabs}
      <div class="gender-tabs" role="tablist" aria-label="Behavior profile">
        {#each ['All', 'Male', 'Female'] as tab}
          <button
            class:active={activeTab === tab}
            class="tab-button"
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onclick={() => (activeTab = tab as 'All' | 'Male' | 'Female')}
          >
            {tab === 'All' ? 'Both' : tab}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <p class="summary-text">{summary}</p>

  <div class="traits-dual-grid" role="tabpanel">
    {#if !showTabs || activeTab === 'All' || activeTab === 'Male'}
      <div class="trait-col">
        <div class="col-head">
          <Shield size={15} strokeWidth={1.8} aria-hidden="true" />
          <h3>Male tendencies</h3>
        </div>
        <ul>
          {#each maleTraits as trait}<li>{trait}</li>{/each}
        </ul>
      </div>
    {/if}

    {#if !showTabs || activeTab === 'All' || activeTab === 'Female'}
      <div class="trait-col">
        <div class="col-head">
          <Compass size={15} strokeWidth={1.8} aria-hidden="true" />
          <h3>Female tendencies</h3>
        </div>
        <ul>
          {#each femaleTraits as trait}<li>{trait}</li>{/each}
        </ul>
      </div>
    {/if}
  </div>
</section>

<style>
  .behavior-box {
    padding: 1.45rem 0;
    border-bottom: 1px solid var(--border-subtle);
  }

  .behavior-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .section-heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--accent-primary);
  }

  .section-heading h2 {
    font-size: 1.05rem;
    font-weight: 800;
  }

  .gender-tabs {
    display: inline-flex;
    gap: 0.2rem;
    padding: 3px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: var(--bg-surface);
  }

  .tab-button {
    min-height: 30px;
    padding: 0.28rem 0.62rem;
    border: 0;
    border-radius: 5px;
    background: transparent;
    color: var(--text-muted);
    font-size: 0.7rem;
    font-weight: 700;
  }

  .tab-button:hover,
  .tab-button.active {
    background: var(--accent-primary);
    color: var(--text-inverse);
  }

  .summary-text {
    margin-top: 0.75rem;
    font-size: 0.84rem;
    line-height: 1.55;
  }

  .traits-dual-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .col-head {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.45rem;
    color: var(--accent-secondary);
  }

  .col-head h3 {
    font-size: 0.78rem;
    font-weight: 800;
  }

  .trait-col ul {
    padding-left: 1rem;
    color: var(--text-main);
    font-size: 0.8rem;
    line-height: 1.55;
  }

  @media (max-width: 620px) {
    .traits-dual-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style>
