<script>
  import { player, playerSaveTime, playingEpisode } from "$/stores";
  import Replay10 from "$lib/icons/Replay10.svelte";
  export let size = 30;
  export let style = "";
</script>

<button
  on:click={() => {
    $player.currentTime = Math.max($player.currentTime - 10, 0);
    console.log($player.currentTime);
    $playerSaveTime = 0;
  }}
  aria-label="Rewind"
  {style}
  class:hide={$playingEpisode?.liveStatus === "live"}
>
  <Replay10 {size} />
</button>

<style>
  button {
    border: none;
    padding: 0;
    margin: 0;
    background-color: transparent;
  }

  .hide {
    display: none;
  }
</style>
