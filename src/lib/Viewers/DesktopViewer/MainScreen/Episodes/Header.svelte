<script>
  import {
    selectedPodcast,
    showRecentEpisodes,
    showPending,
    liveEpisodes,
    pendingEpisodes,
    episodesList,
    feedTitle,
  } from "$/stores";

  import EpisodeSorter from "$lib/Shared/EpisodeList/Header/EpisodeSorter.svelte";

  import Mic from "$lib/icons/Mic.svelte";
  export let headerHeight;
</script>

<header bind:clientHeight={headerHeight}>
  {#if $showRecentEpisodes}
    <h2>{$feedTitle || "Recent Episodes"}</h2>
  {:else}
    <h2>{$selectedPodcast?.title || ""}</h2>
    {#if $liveEpisodes?.length > 0 || $pendingEpisodes?.length > 0}
      <div class="on-air">
        <button
          class:live={$liveEpisodes?.length > 0}
          on:click={() => {
            if ($pendingEpisodes?.length > 0) {
              $showPending = true;
            }
          }}
        >
          {#if $liveEpisodes?.length > 0}
            <span><Mic size="24px" />On Air</span>
          {:else if $pendingEpisodes?.length > 0}
            <span class="programs">Scheduled <br /> Programs</span>
          {/if}
        </button>
      </div>
    {/if}
  {/if}
  {#if $episodesList?.length}
    <div class="episode-menu">
      <EpisodeSorter />
    </div>
  {/if}
</header>

<style>
  header {
    position: relative;
    margin-left: 8px;
    margin: 4px 0;
    width: 100%;
    height: 40px;
  }

  h2 {
    margin: 0 12px;
    white-space: pre;
  }

  ::placeholder {
    color: var(--secondary-text-color);
    opacity: 1;
  }

  .on-air {
    position: absolute;
    top: 0;
    right: 64px;
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: var(--primary-text-color);
    background-color: var(--background-color);
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 0%,
      var(--background-color) 15%,
      var(--background-color) 100%
    );

    z-index: 2;
  }

  .on-air button {
    width: 90px;
    height: 32px;
    margin: 4px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: var(--tertiary-text-color);
  }

  button.live {
    color: hsl(0, 100%, 25%);
    outline: none;
    border-color: hsl(0, 100%, 25%);
    box-shadow:
      0 0 9px hsl(0deg 100% 50% / 60%),
      inset 0 0 7px hsl(0deg 100% 50% / 40%),
      0 2px 0 #000;
  }

  button span {
    display: flex;
    align-items: center;
  }

  .episode-menu {
    position: absolute;
    top: 0;
    right: 0;
    width: 110px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-color: var(--background-color);
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 0%,
      var(--background-color) 50%,
      var(--background-color) 100%
    );
  }

  .programs {
    font-size: 0.8em;
    line-height: 1em;
  }
</style>
