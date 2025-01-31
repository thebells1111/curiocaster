<script>
  import { longpress } from "$functions/longpress.js";
  import Boostagram from "$lib/Modals/Wallet/Boostagram/BoostagramModal.svelte";
  import BoostStatus from "$lib/Modals/Wallet/Boostagram/BoostStatus.svelte";
  export let episode;
  export let valueBlock;

  import {
    swiper,
    showBoost,
    showMobile,
    modalSwiper,
    modalSwiperType,
    pendingEpisodesWallet,
    pendingEpisodeData,
  } from "$/stores";

  function displayShowSupport() {
    $pendingEpisodesWallet = valueBlock;
    $pendingEpisodeData = episode;
    console.log(episode);
    if ($showMobile) {
      $modalSwiperType = "boostagram";
      $modalSwiper.slideTo(1);
    } else {
      $showBoost = true;
    }
  }

  function enableSwiper() {
    activeButton = false;
    if ($swiper) {
      $swiper.allowSlideNext = true;
      $swiper.allowSlidePrev = true;
    }
  }

  let activeButton = false;
</script>

{#if $showBoost}
  <Boostagram />
{/if}
<BoostStatus />
<div class="boost-container">
  <button
    class:active={activeButton}
    class="primary"
    on:touchstart|preventDefault={() => (activeButton = true)}
    on:touchend={enableSwiper}
    use:longpress={[10000, $swiper]}
    on:shortpress={displayShowSupport}
  >
    <div>Boost</div>
  </button>
</div>

<style>
  .boost-container {
    display: flex;
    align-items: flex-end;
    align-self: end;
    padding: 8px;
  }

  button {
    position: relative;
    margin: 0;
    height: 36px;
    width: 98px;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  button.active,
  button:active {
    top: 1px;
  }

  button > div {
    margin: 0;
    text-align: center;
    width: 100%;
  }

  .hide {
    display: none;
  }
</style>
