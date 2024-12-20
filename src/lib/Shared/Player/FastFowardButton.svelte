<script>
  import { player, playingEpisode } from "$/stores";
  import Forward30 from "$lib/icons/Forward30.svelte";
  export let size = 30;
  export let style = "";
</script>

<button
  on:click={() => {
    $player.currentTime = Math.min($player.currentTime + 30, $player.duration);
  }}
  aria-label="Fast Forward"
  {style}
  class:hide={$playingEpisode?.liveStatus === "live"}
>
  <Forward30 {size} />
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
