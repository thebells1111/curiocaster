<script>
  import { onMount } from "svelte";
  import {
    listSwiper,
    initialPodcast,
    pendingEpisodesWallet,
    pendingEpisodeData,
  } from "$/stores";

  import EpisodesPane from "./EpisodesPane/EpisodesPane.svelte";
  import ShowNotesSwiper from "./ShowNotesSwiper.svelte";
  import PendingEpisodesSwiper from "./PendingEpisodesSwiper.svelte";

  onMount(() => {
    $listSwiper = new Swiper(".list-swiper", {
      direction: "vertical",
      allowTouchMove: true,
      resistanceRatio: 0,
    });

    $listSwiper.on("slideChange", function () {
      let m = $listSwiper;

      let i = m.activeIndex;
      if (i) {
        m.$el[0].style = "z-index:3";
        m.allowTouchMove = true;
      } else {
        m.allowTouchMove = false;
        setTimeout(() => (m.$el[0].style = ""), 250);
        $pendingEpisodesWallet = null;
        $pendingEpisodeData = null;
      }
    });
    if ($initialPodcast) {
      $listSwiper.slideTo(1);
    }
  });
</script>

<div class="swiper list-swiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide" />
    <div class="swiper-slide blurred">
      <div class="pane">
        <div>
          <EpisodesPane />
          <ShowNotesSwiper />
          <PendingEpisodesSwiper />
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .list-swiper {
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
  }

  .pane {
    height: calc(100% - 15px);
    overflow: hidden;
    background-color: transparent;
    background-color: var(--secondary-color);
    border-radius: 8px 8px 0 0;
    box-shadow: 0px 0px 10px -3px rgb(0, 0, 0);
  }

  .pane > div {
    height: 100%;
  }

  .blurred {
    background-color: transparent;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
</style>
