<script>
  import PlayPause from "$lib/Shared/Player/PlayPauseButton.svelte";
  import FastForward from "$lib/Shared/Player/FastFowardButton.svelte";
  import Rewind from "$lib/Shared/Player/RewindButton.svelte";
  import AudioProgressBar from "../Player/AudioProgressBar.svelte";
  import PlayerDuration from "$lib/Shared/Player/PlayerDuration.svelte";
  import PlayerTime from "$lib/Shared/Player/PlayerTime.svelte";
  import ClosedCaption from "$lib/icons/ClosedCaption.svelte";
  import ClosedCaptionDisabled from "$lib/icons/ClosedCaptionDisabled.svelte";
  import PlaybackRate from "../Player/PlaybackRate.svelte";
  import convertTime from "$functions/convertTime.js";

  import {
    playingPodcast,
    playingEpisode,
    showCC,
    initialEpisode,
    srcStartTime,
    srcStopTime,
  } from "$/stores";

  let clipTimeText;

  $: if ($initialEpisode && $srcStartTime && $srcStopTime) {
    clipTimeText =
      $initialEpisode && $srcStartTime && $srcStopTime
        ? `Clip Length: ${splitTime(convertTime($srcStopTime - $srcStartTime))}`
        : "";
  }

  function splitTime(time) {
    let times = time.split(":");
    if (times[0] > 0) {
      return `${times[0]} hrs, ${times[1]} mins, ${times[2]} secs`;
    } else if (times[1] > 0) {
      return `${times[1]} mins, ${times[2]} secs`;
    }
    return `${times[2]} secs`;
  }
</script>

<div />

<div class="grid-container">
  <div class="top">
    <button on:click={() => ($showCC = !$showCC)} class="icon-button">
      {#if $showCC}
        <ClosedCaption size="32" />
      {:else}
        <ClosedCaptionDisabled size="32" />
      {/if}
    </button>
    <PlaybackRate />
  </div>
  <div class="title">{$playingPodcast?.title || "CurioCaster"}</div>
  <div class="controls">
    <Rewind size={"48px"} />
    <PlayPause size={"60px"} />
    <FastForward size={"48px"} />
  </div>
  <div class="subtitle">
    <div>
      {$playingEpisode?.title || "The Best Podcast Player in Texas"}
    </div>
    <div class="clip-text">{clipTimeText || ""}</div>
  </div>

  <div class="bottom">
    <div class="progress-bar">
      <AudioProgressBar
        trackerColor="#555"
        elapsedColor="#fff"
        handleColor="#fff"
      />
    </div>
    <div class="timers">
      <PlayerTime />
      <PlayerDuration />
    </div>
  </div>
</div>

<style>
  .grid-container {
    border-radius: 8px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.33);
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    gap: 0px 0px;
    grid-template-areas:
      "top"
      "title"
      "controls"
      "subtitle"
      "bottom";
  }

  .top {
    grid-area: top;
    margin-top: 6px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .title {
    grid-area: title;
    color: white;
    text-align: center;
    font-size: 1.6em;
    filter: drop-shadow(0px 2px 3px #000);
    font-weight: 700;
  }

  .controls {
    grid-area: controls;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 83%;
    filter: drop-shadow(0px 2px 3px #000);
    margin: 0 auto;
  }

  .subtitle {
    grid-area: subtitle;
    color: white;
    text-align: center;
    font-size: 1.3em;
    filter: drop-shadow(0px 2px 3px #000);
  }

  .clip-text {
    font-size: 0.8em;
  }

  .bottom {
    grid-area: bottom;
    margin: 0 8px;
    position: relative;
  }

  .progress-bar {
    position: relative;
    z-index: 2;
    bottom: -12px;
  }

  .timers {
    color: white;
    font-size: 0.75em;
    margin: 0 4px;
    display: flex;
    justify-content: space-between;
    position: relative;
    bottom: 6px;
  }

  .icon-button,
  .icon-button:active {
    background-color: transparent;
    border: none;
    padding: 0;
    width: 42px;
    margin: 0;
    color: white;
    transform: scale(1);
    transition-duration: 0.2s;
  }

  .icon-button:hover {
    transform: scale(1.2);
    transition-duration: 0.2s;
  }
</style>
