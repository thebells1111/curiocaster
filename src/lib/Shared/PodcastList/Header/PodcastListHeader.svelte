<script>
  import Reload from "./Reload.svelte";
  import Filter from "./Filter.svelte";
  import { podcastListPane, podcastSearchResults, showMobile } from "$/stores";
</script>

<div class="container" class:mobile={$showMobile}>
  <div class="top-bar">
    <Reload />
    {#if $podcastListPane === "subscriptions"}
      <div class="title cabinet">Podcasts</div>
    {:else if $podcastListPane === "search"}
      <div class="title">Results for: {$podcastSearchResults.cat}</div>
    {/if}
    <Filter />
  </div>
</div>

<style>
  .container {
    background-color: var(--secondary-accent-color-dark);
    background: linear-gradient(
      var(--secondary-accent-color-light),
      var(--secondary-accent-color-dark)
    );
    position: relative;
  }

  .top-bar {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    margin: 0;
    padding: 0;
    color: var(--primary-text-color);
  }
  .cabinet {
    font-family: "Ruthie", cursive;
    font-size: 1.6em;
  }

  img {
    position: absolute;
    width: 108px;
    bottom: -10px;
    left: calc(50% - 54px);
  }
</style>
