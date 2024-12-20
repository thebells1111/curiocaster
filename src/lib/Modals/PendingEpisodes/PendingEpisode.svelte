<script>
  import { pendingEpisodes } from "$/stores";
  import EpisodeCard from "./EpisodeCard.svelte";
  console.log($pendingEpisodes);
</script>

<div>
  {#if $pendingEpisodes}
    {#each $pendingEpisodes as episode}
      <EpisodeCard {episode} />
    {/each}
  {/if}
</div>

<style>
  div {
    width: 100%;
    height: 100%;
    color: var(--primary-text-color);
    background: transparent;
    padding: 8px;
  }
</style>
