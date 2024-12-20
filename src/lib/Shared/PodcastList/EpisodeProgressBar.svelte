<script>
  import { tweened } from 'svelte/motion';

  import {
    updateEpisodesProgress,
    podcastSearchResults,
    podcastListPane,
    isUpdatingEpisodes,
  } from '$/stores';

  const progress = tweened(0, {
    duration: 10000,
  });

  $: if ($isUpdatingEpisodes) {
    $progress = 1;
    setTimeout(reset, 10000);
  }

  function reset() {
    $isUpdatingEpisodes = false;
    $progress = 0;
  }
</script>

<div class="progress-bar-container">
  {#if $podcastListPane === 'subscriptions'}
    {#if $isUpdatingEpisodes}
      <p class="progress-text">searching for new episodes</p>
      <progress value={$progress} />
    {:else}
      <p class="list-type">Subscriptions</p>
    {/if}
  {:else if $podcastListPane === 'search'}
    <p class="list-type">{$podcastSearchResults.cat}</p>
  {/if}
</div>

<style>
  .progress-bar-container {
    height: 14px;
    width: 100%;
    position: relative;
    border-radius: 7px;
    margin-bottom: 1px;
    padding-right: 0.25em;
  }

  .progress-text {
    font-size: 10px;
    width: 100%;
    color: rgb(170, 170, 170);
    text-align: center;
    margin: 0;
    padding: 0;
    padding-right: 0.25em;
    position: absolute;
    top: 0;
    z-index: 2;
  }

  .list-type {
    font-size: 12px;
    width: 100%;
    font-weight: 700;
    text-align: center;
    margin: 0;
    padding: 0;
    position: absolute;
    bottom: 2px;
  }

  progress {
    border: 0;
    height: 14px;
    border-radius: 7px;
    padding: 0 0.25em;
    display: block;
    width: 100%;
    position: absolute;
    top: 0;
  }
  progress::-webkit-progress-bar {
    border: 0;
    height: 14px;
    border-radius: 7px;
    background: #fff;
  }
  progress::-webkit-progress-value {
    border: 0;
    height: 14px;
    border-radius: 7px;
    background: #333;
  }
  progress::-moz-progress-bar {
    border: 0;
    height: 14px;
    border-radius: 7px;
    background: #fff;
  }
</style>
