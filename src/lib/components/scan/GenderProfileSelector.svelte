<script lang="ts">
  let {
    selectedGenderProfile = $bindable<'Auto' | 'Male' | 'Female'>('Auto')
  }: {
    selectedGenderProfile: 'Auto' | 'Male' | 'Female';
  } = $props();
</script>

<div class="gender-selector-box">
  <div class="gender-selector-label">
    <span>Behavior profile</span>
    <small>Optional context</small>
  </div>
  <div class="gender-control" role="radiogroup" aria-label="Behavior profile">
    {#each ['Auto', 'Male', 'Female'] as profile}
      <button
        class:active={selectedGenderProfile === profile}
        class="gender-option"
        type="button"
        role="radio"
        aria-checked={selectedGenderProfile === profile}
        onclick={() => (selectedGenderProfile = profile as 'Auto' | 'Male' | 'Female')}
      >
        {profile}
      </button>
    {/each}
  </div>
  <p>
    Choose a profile for behavior notes tailored to your dog’s sex. Auto keeps the result neutral.
  </p>
</div>

<style>
  .gender-selector-box {
    margin-top: 1.2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-subtle);
  }

  .gender-selector-label {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.55rem;
    color: var(--text-main);
    font-size: 0.78rem;
    font-weight: 700;
  }

  .gender-selector-label small {
    color: var(--text-subtle);
    font-size: 0.68rem;
    font-weight: 500;
  }

  .gender-control {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 3px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    background: var(--bg-surface);
  }

  .gender-option {
    min-height: 36px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--text-muted);
    font-size: 0.73rem;
    font-weight: 700;
    transition:
      background-color 160ms ease,
      color 160ms ease;
  }

  .gender-option:hover,
  .gender-option.active {
    background: var(--accent-primary);
    color: var(--text-inverse);
  }

  .gender-selector-box p {
    margin-top: 0.55rem;
    font-size: 0.69rem;
    line-height: 1.5;
  }
</style>
