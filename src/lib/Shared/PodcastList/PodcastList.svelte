<script>
  import Header from "./Header/PodcastListHeader.svelte";
  import PodcastSearch from "./PodcastSearch/PodcastSearch.svelte";

  import SubscriptionList from "./SubscriptionList.svelte";

  import { podcastListPane, mainPodcastList, showMobile } from "$/stores";

  if ($mainPodcastList) {
    $podcastListPane = "subscriptions";
  }
</script>

<div class="podcast-list" class:mobile-background={$showMobile}>
  <div class="head" class:mobile={$showMobile}>
    <Header />
  </div>
  {#if $podcastListPane === "subscriptions"}
    <SubscriptionList />
  {:else}
    <PodcastSearch />
  {/if}
</div>

<style>
  .podcast-list {
    height: 100%;
    overflow: hidden;
    padding: 0;
    display: flex;
    flex-direction: column;
    background-color: var(--primary-color);
    border-radius: 8px;
    z-index: 2;
  }
  .mobile {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
  }

  .mobile-background {
    background-color: var(--background-color);
    border-radius: 0;
    padding-bottom: 2px;
  }
</style>
