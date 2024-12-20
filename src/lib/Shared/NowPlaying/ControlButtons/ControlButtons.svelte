<script>
  import CC from "./CC.svelte";
  import Share from "./Share.svelte";
  import Wallet from "./Wallet.svelte";
  import More from "./More.svelte";

  import {
    playingEpisode,
    showVideo,
    walletDisabled,
    playingEpisodeTranscript,
    showMobile,
  } from "$/stores";
</script>

<div class="control-bar">
  {#if playingEpisodeTranscript && !$showMobile}
    <CC />
  {:else}
    <p />
  {/if}
  {#if $playingEpisode && $playingEpisode?.enclosureUrl}
    <Share />
  {:else}
    <p />
  {/if}

  {#if !$walletDisabled}
    <Wallet />
  {:else if $showMobile}
    <p />
  {/if}

  {#if !$showMobile}
    <More />
  {/if}
</div>

<style>
  .control-bar {
    width: 400px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 8px 0 4px 0;
    padding: 0 8px;
    position: relative;
  }
  p {
    text-align: center;
    padding: 0;
  }

  .player-time {
    position: relative;
    align-self: flex-end;
  }

  button {
    height: 43px;
    width: 100%;
    max-width: 225px;
    margin: 0 8px;
    color: #fff;
    border-radius: 50px;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 550;
    font-size: 1.2em;
    color: #f0f0f0;
    text-shadow: 0 1px #c0c0c0;
    background: #333;
    border: 1px solid;
    border-color: #cfcfcf #a7a7a7 #8e8f8f;
    border-radius: 50px;
    outline: 0;
    background-image: linear-gradient(to bottom, rgb(68, 68, 68), #000);
    box-shadow:
      inset 0 1px rgb(109, 109, 109),
      0 2px 2px rgba(0, 0, 0, 0.33);
    text-shadow:
      1px 4px 6px rgb(82, 82, 82),
      0 0 0 #000,
      1px 4px 6px rgb(82, 82, 82);
  }
</style>
